import type {
  AttackProfile,
  AttackRequest,
  AttackType,
  Device,
  EventSeverity,
  EventType,
  FailoverTiming,
  HistoryPoint,
  IsolationTiming,
  Metrics,
  SecurityCounts,
  SimEvent,
  SimulationState,
  TrafficClass,
  TrafficFlow,
  ZoneTraffic,
} from "@/models/types";
import {
  DISTRIBUTION_CAPACITY_MBPS,
  HEARTBEAT_TIMEOUT,
  PRIMARY_ATTACK_DEVICE,
  PRIMARY_ATTACK_TARGET,
  SCHEDULED_ATTACK_AT,
  SCHEDULED_FAILURE_AT,
  SIMULATION_DURATION,
  SIM_TICK,
} from "@/models/types";
import { applyPolicy } from "@/security/AccessPolicy";
import { emptyBehavior, pushSample, type DeviceBehavior } from "@/security/BehaviorMonitor";
import { applySecurityToRate, throttleFactorFor } from "@/security/QuarantineEngine";
import { computeTelemetry, nextThreatScore, stateFromScore, statusFromState } from "@/security/ThreatScoring";
import { applyDpq, type ClassLoad } from "@/traffic/PriorityQueue";
import { evaluateCongestion } from "@/traffic/CongestionEngine";
import { distributionCapacityPps } from "@/traffic/BandwidthManager";
import { activateFailover } from "@/resilience/FailoverEngine";
import { failPrimaryLink } from "@/resilience/FailureEngine";
import { beat, checkHeartbeat } from "@/resilience/Heartbeat";
import { SimulationClock, isWholeSimSecond, roundSimTime } from "@/simulation/SimulationClock";
import {
  computeDelay,
  computeHealth,
  computeLoss,
  linkUtilization,
  updateCore,
  updatePodStats,
} from "@/simulation/NetworkEngine";
import { mulberry32, randInt } from "@/simulation/rng";
import {
  attackOfferedRate,
  attackPorts,
  classForFlow,
  destinationFor,
  makeFlow,
  offeredRate,
  packetSizeFor,
  portsFor,
  sampleNormalFlows,
} from "@/simulation/TrafficGenerator";
import {
  DEFAULT_SEED,
  EMPTY_METRICS,
  assertCampusCounts,
  createCore,
  createDevices,
  createLinks,
  createPods,
  createZones,
  emptyCounters,
  emptyDpq,
  emptyFailover,
} from "@/simulation/seedCampus";

let eventSeq = 1;
let flowSeq = 1;

function emptyClass(): ClassLoad {
  return { critical: 0, high: 0, normal: 0, background: 0 };
}

function addClass(target: ClassLoad, cls: TrafficClass, pps: number) {
  target[cls.toLowerCase() as keyof ClassLoad] += pps;
}

function categoryFor(type: EventType): SimEvent["category"] {
  switch (type) {
    case "POLICY_VIOLATION":
    case "PORT_SCAN_DETECTED":
    case "THREAT_SCORE_UPDATED":
    case "SECURITY_STATE_CHANGED":
    case "DEVICE_THROTTLED":
    case "DEVICE_ISOLATED":
    case "DEVICE_BLOCKED":
      return "SECURITY";
    case "TRAFFIC_STARTED":
    case "CONGESTION_STARTED":
    case "CONGESTION_STOPPED":
      return "TRAFFIC";
    case "ATTACK_INJECTED":
      return "ATTACK";
    case "LINK_FAILURE":
    case "HEARTBEAT_TIMEOUT":
    case "FAILOVER_ACTIVATED":
    case "ROUTE_RECALCULATED":
    case "STATE_SYNCHRONIZED":
      return "FAILURE";
    default:
      return "SYSTEM";
  }
}

function severityFor(type: EventType): EventSeverity {
  switch (type) {
    case "DEVICE_BLOCKED":
    case "LINK_FAILURE":
      return "critical";
    case "DEVICE_ISOLATED":
    case "HEARTBEAT_TIMEOUT":
    case "PORT_SCAN_DETECTED":
    case "FAILOVER_ACTIVATED":
    case "ATTACK_INJECTED":
      return "high";
    case "DEVICE_THROTTLED":
    case "POLICY_VIOLATION":
    case "SECURITY_STATE_CHANGED":
    case "CONGESTION_STARTED":
      return "medium";
    default:
      return "info";
  }
}

export function createInitialState(seed = DEFAULT_SEED): SimulationState {
  const zones = createZones();
  const pods = createPods();
  const devices = createDevices(pods);
  const links = createLinks(pods);
  assertCampusCounts(devices, pods);
  for (const zone of zones) {
    zone.deviceCount = devices.filter((d) => d.zone === zone.id).length;
  }
  return {
    running: false,
    currentTime: 0,
    version: 0,
    devices,
    pods,
    zones,
    links,
    core: createCore(),
    trafficFlows: [],
    metrics: { ...EMPTY_METRICS },
    security: { clear: devices.length, alert: 0, throttled: 0, isolated: 0, blocked: 0 },
    dpq: emptyDpq(),
    events: [],
    history: [],
    attacks: [],
    scenario: {
      scheduledAttackFired: false,
      scheduledFailureFired: false,
      trafficEnabled: false,
      congestionEnabled: false,
      completed: false,
    },
    seed,
    isolations: [],
    failover: emptyFailover(),
    counters: emptyCounters(),
  };
}

export class SimulationEngine {
  state: SimulationState;
  private clock = new SimulationClock();
  private rng: () => number;
  private behavior = new Map<string, DeviceBehavior>();
  private listeners = new Set<(state: SimulationState) => void>();
  private lastThreatEmit = new Map<string, number>();
  private pendingFailovers: Array<{ podId: string; failedAt: number; dueAt: number }> = [];

  constructor(seed = DEFAULT_SEED) {
    this.rng = mulberry32(seed);
    this.state = createInitialState(seed);
    this.resetBehavior();
  }

  subscribe(fn: (state: SimulationState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.state = { ...this.state, version: this.state.version + 1 };
    for (const listener of this.listeners) listener(this.state);
  }

  private resetBehavior() {
    this.behavior.clear();
    for (const device of this.state.devices) {
      this.behavior.set(device.id, emptyBehavior());
    }
    this.lastThreatEmit.clear();
    this.pendingFailovers = [];
  }

  private pushEvent(
    type: EventType,
    description: string,
    extra: Partial<SimEvent> = {},
  ) {
    const event: SimEvent = {
      id: `evt-${eventSeq++}`,
      timestamp: Date.now(),
      simulationTime: extra.simulationTime ?? this.state.currentTime,
      eventType: type,
      deviceId: extra.deviceId ?? "",
      zone: extra.zone ?? "",
      podId: extra.podId ?? "",
      severity: extra.severity ?? severityFor(type),
      oldState: extra.oldState ?? "",
      newState: extra.newState ?? "",
      description,
      category: extra.category ?? categoryFor(type),
    };
    this.state.events = [event, ...this.state.events].slice(0, 500);
    if (event.deviceId) {
      const device = this.state.devices.find((d) => d.deviceId === event.deviceId || d.id === event.deviceId);
      if (device) {
        device.lastEvent = description;
        device.lastEventType = type;
      }
    }
    return event;
  }

  start() {
    if (this.state.scenario.completed && this.state.currentTime >= SIMULATION_DURATION) return;
    this.clock.start();
    this.state.running = true;
    const firstStart = !this.state.scenario.trafficEnabled;
    this.state.scenario.trafficEnabled = true;
    if (firstStart && this.state.currentTime === 0) {
      this.pushEvent("SIMULATION_STARTED", "120-second HZCN demonstration started in SIMULATION MODE.");
      this.pushEvent("TRAFFIC_STARTED", "Normal campus traffic generation is active.");
      this.runTrafficTick(0);
    }
    this.emit();
  }

  pause() {
    this.clock.pause();
    this.state.running = false;
    this.pushEvent(
      "SIMULATION_PAUSED",
      `Simulation paused at t=${roundSimTime(this.state.currentTime).toFixed(1)}s.`,
    );
    this.emit();
  }

  resume() {
    this.start();
  }

  reset(seed = this.state.seed) {
    eventSeq = 1;
    flowSeq = 1;
    this.clock.reset();
    this.rng = mulberry32(seed);
    this.state = createInitialState(seed);
    this.resetBehavior();
    this.pushEvent("SIMULATION_RESET", "Campus, Smart Pods, and security state restored to t=0.");
    this.emit();
  }

  startCongestion() {
    this.state.scenario.congestionEnabled = true;
    if (this.state.scenario.trafficEnabled === false) {
      this.start();
    }
    this.pushEvent("CONGESTION_STARTED", "Congestion engine engaged. DPQ will protect CRITICAL/HIGH classes.");
    this.emit();
  }

  stopCongestion() {
    this.state.scenario.congestionEnabled = false;
    this.pushEvent("CONGESTION_STOPPED", "Congestion engine disengaged.");
    this.emit();
  }

  injectAttack(request: AttackRequest, silent = false) {
    if (!this.state.running) this.start();
    const device =
      this.state.devices.find((d) => d.deviceId === request.deviceId || d.deviceName === request.deviceId) ??
      this.state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)!;
    const target =
      this.state.devices.find(
        (d) =>
          d.deviceId === request.targetDeviceId ||
          d.deviceName === request.targetDeviceId ||
          d.deviceName === PRIMARY_ATTACK_TARGET,
      ) ?? this.state.devices.find((d) => d.deviceType === "admin-db")!;

    const profile: AttackProfile = {
      type: request.type,
      deviceId: device.deviceName,
      targetDeviceId: target.deviceName,
      targetZone: request.targetZone ?? target.zone,
      targetService: request.targetService ?? target.role,
      startedAt: this.state.currentTime,
      active: true,
      phase: 0,
    };
    this.state.attacks = [...this.state.attacks.filter((a) => a.deviceId !== profile.deviceId), profile];
    this.state.counters.attacksDetected += 1;
    if (device.attackDetectedAt == null) device.attackDetectedAt = this.state.currentTime;
    this.upsertIsolation(device);
    this.pushEvent(
      "ATTACK_INJECTED",
      `Simulated ${labelAttack(request.type)} injected from ${device.deviceName} toward ${target.deviceName} (${profile.targetService}).`,
      {
        deviceId: device.deviceName,
        zone: device.zone,
        podId: device.connectedPod,
        category: "ATTACK",
        severity: "high",
      },
    );
    if (!silent) this.emit();
  }

  injectPrimaryAttack() {
    this.injectAttack({
      type: "combined",
      deviceId: PRIMARY_ATTACK_DEVICE,
      targetDeviceId: PRIMARY_ATTACK_TARGET,
      targetZone: "administration",
      targetService: "Admin Database",
    });
  }

  simulateLinkFailure(podId = "POD-01", silent = false) {
    const pod = this.state.pods.find((p) => p.podId === podId);
    if (!pod) return;
    const primary = this.state.links.find((l) => l.id === pod.primaryLink);
    if (!primary || primary.failed) return;

    this.state.links = this.state.links.map((l) => (l.id === primary.id ? failPrimaryLink(l) : l));
    const failedAt = this.state.currentTime;
    const sequence = [
      { at: failedAt, label: "PRIMARY LINK FAILURE" },
    ];
    this.state.failover = {
      podId: pod.podId,
      podName: pod.podName,
      phase: "primary-failed",
      primaryFailureAt: failedAt,
      primaryFailureDetectedAt: failedAt,
      failoverStartedAt: null,
      backupActivatedAt: null,
      heartbeatTimeoutMs: HEARTBEAT_TIMEOUT * 1000,
      failoverDurationMs: null,
      sequence,
    };
    this.pushEvent(
      "LINK_FAILURE",
      `${pod.podName} primary uplink failed. Heartbeat path is broken.`,
      { podId: pod.podId, zone: pod.zone, severity: "critical", category: "FAILURE" },
    );
    this.pendingFailovers.push({
      podId: pod.podId,
      failedAt,
      dueAt: roundSimTime(failedAt + HEARTBEAT_TIMEOUT),
    });
    if (!silent) this.emit();
  }

  step(): SimulationState {
    if (!this.state.running || this.state.scenario.completed) return this.state;
    const { time, completed } = this.clock.tick();
    this.state.currentTime = time;
    this.tickAt(time);
    if (completed) {
      this.state.running = false;
      this.state.scenario.completed = true;
      this.pushEvent("SIMULATION_COMPLETED", "120-second demonstration complete. Network remains in SIMULATION MODE.");
    }
    this.emit();
    return this.state;
  }

  /** Advance `seconds` of virtual time (0.1s ticks). */
  stepN(seconds: number) {
    const ticks = Math.round(seconds / SIM_TICK);
    for (let i = 0; i < ticks; i += 1) this.step();
  }

  private tickAt(t: number) {
    this.state.pods = this.state.pods.map((pod) => {
      const primary = this.state.links.find((l) => l.id === pod.primaryLink);
      if (primary && !primary.failed) return beat(pod, t);
      return pod;
    });

    if (!this.state.scenario.scheduledAttackFired && t >= SCHEDULED_ATTACK_AT) {
      this.state.scenario.scheduledAttackFired = true;
      this.injectAttack({
        type: "combined",
        deviceId: PRIMARY_ATTACK_DEVICE,
        targetDeviceId: PRIMARY_ATTACK_TARGET,
        targetZone: "administration",
        targetService: "Admin Database",
      }, true);
    }
    if (!this.state.scenario.scheduledFailureFired && t >= SCHEDULED_FAILURE_AT) {
      this.state.scenario.scheduledFailureFired = true;
      this.simulateLinkFailure("POD-01", true);
    }

    this.processPendingFailovers(t);
    if (isWholeSimSecond(t)) {
      this.runTrafficTick(t);
    }
  }

  private processPendingFailovers(t: number) {
    const due = this.pendingFailovers.filter((p) => t + 1e-9 >= p.dueAt);
    this.pendingFailovers = this.pendingFailovers.filter((p) => t + 1e-9 < p.dueAt);
    for (const pending of due) {
      this.completeFailover(pending.podId, pending.failedAt, t);
    }
  }

  private completeFailover(podId: string, failedAt: number, t: number) {
    const pod = this.state.pods.find((p) => p.podId === podId);
    if (!pod) return;
    const primary = this.state.links.find((l) => l.id === pod.primaryLink);
    if (!primary) return;

    const snapshot = new Map(this.state.devices.map((d) => [d.id, d.currentSecurityState] as const));
    const scores = new Map(this.state.devices.map((d) => [d.id, d.threatScore] as const));
    const isolations = this.state.devices.map((d) => ({
      id: d.id,
      attackDetectedAt: d.attackDetectedAt,
      threatThresholdAt: d.threatThresholdAt,
      isolationTriggeredAt: d.isolationTriggeredAt,
      quarantineTriggeredAt: d.quarantineTriggeredAt,
      isolationLatencyMs: d.isolationLatencyMs,
      currentSecurityState: d.currentSecurityState,
      threatScore: d.threatScore,
      status: d.status,
    }));

    const heartbeat = checkHeartbeat({ ...pod, lastHeartbeat: failedAt }, primary, t);
    if (heartbeat.timeout) {
      this.pushEvent(
        "HEARTBEAT_TIMEOUT",
        `Heartbeat timeout (${HEARTBEAT_TIMEOUT * 1000} ms configured) on ${pod.podId} primary link.`,
        { podId: pod.podId, zone: pod.zone, severity: "high", category: "FAILURE" },
      );
    }

    const failedOver = activateFailover(this.state.pods, this.state.links, this.state.devices, pod.podId);
    this.state.pods = failedOver.pods;
    this.state.links = failedOver.links;
    this.state.devices = failedOver.devices.map((device) => {
      const preserved = isolations.find((d) => d.id === device.id);
      return {
        ...device,
        currentSecurityState: snapshot.get(device.id) ?? device.currentSecurityState,
        threatScore: scores.get(device.id) ?? device.threatScore,
        attackDetectedAt: preserved?.attackDetectedAt ?? device.attackDetectedAt,
        threatThresholdAt: preserved?.threatThresholdAt ?? device.threatThresholdAt,
        isolationTriggeredAt: preserved?.isolationTriggeredAt ?? device.isolationTriggeredAt,
        quarantineTriggeredAt: preserved?.quarantineTriggeredAt ?? device.quarantineTriggeredAt,
        isolationLatencyMs: preserved?.isolationLatencyMs ?? device.isolationLatencyMs,
        status: preserved?.status ?? device.status,
      };
    });

    this.pushEvent(
      "FAILOVER_ACTIVATED",
      `${pod.podId} backup uplink is now active. Traffic rerouted through CORE-01 backup path.`,
      { podId: pod.podId, zone: pod.zone, category: "FAILURE" },
    );
    this.pushEvent(
      "ROUTE_RECALCULATED",
      `Routing table rebuilt for zone ${pod.zone}. Backup delay +2.4ms applied.`,
      { podId: pod.podId, zone: pod.zone, category: "FAILURE" },
    );
    this.pushEvent(
      "STATE_SYNCHRONIZED",
      "Smart Pod security state synchronized. Isolated/quarantined devices were not reset.",
      { podId: pod.podId, zone: pod.zone, category: "FAILURE" },
    );

    const durationMs = (t - failedAt) * 1000;
    const prev = this.state.failover;
    const sequence = [
      ...prev.sequence,
      { at: t, label: "HEARTBEAT TIMEOUT" },
      { at: t, label: "FAILURE DETECTED" },
      { at: t, label: "BACKUP LINK ACTIVATED" },
      { at: t, label: "ROUTE RECALCULATED" },
      { at: t, label: "TRAFFIC RESTORED" },
    ];
    this.state.failover = {
      ...prev,
      phase: "backup-active",
      failoverStartedAt: t,
      backupActivatedAt: t,
      failoverDurationMs: durationMs,
      sequence,
    };
    this.state.metrics.failoverDurationMs = durationMs;
  }

  private upsertIsolation(device: Device) {
    const existing = this.state.isolations.find((i) => i.deviceId === device.deviceName);
    const next: IsolationTiming = {
      deviceId: device.deviceName,
      attackDetectedAt: device.attackDetectedAt,
      threatThresholdAt: device.threatThresholdAt,
      isolationTriggeredAt: device.isolationTriggeredAt,
      quarantineTriggeredAt: device.quarantineTriggeredAt,
      isolationLatencyMs: device.isolationLatencyMs,
    };
    if (existing) Object.assign(existing, next);
    else this.state.isolations = [...this.state.isolations, next];
  }

  private runTrafficTick(t: number) {
    const rng = this.rng;
    const devices = this.state.devices;
    const byName = new Map(devices.map((d) => [d.deviceName, d]));
    const attacks = this.state.attacks.filter((a) => a.active);
    const attackByDevice = new Map(attacks.map((a) => [a.deviceId, a]));

    const failoverActive = this.state.pods.some((p) => p.status === "failover") || this.state.failover.phase === "backup-active";
    const failedLinks = this.state.links.filter((l) => l.failed).length;

    const preOffered = devices.reduce((sum, d) => {
      const attack = attackByDevice.get(d.deviceName);
      const rate = attack ? attackOfferedRate(attack, t) : offeredRate(d, t, 1, rng);
      return sum + rate;
    }, 0);

    const meanBytes = 640;
    const capacityPps = distributionCapacityPps(meanBytes);
    const congestion = evaluateCongestion({
      enabled: this.state.scenario.congestionEnabled,
      currentTime: t,
      offeredPps: preOffered,
      capacityPps,
      failedLinks,
    });

    const classOffered = emptyClass();
    const classForwarded = emptyClass();
    const flows: TrafficFlow[] = [];
    const perPod: Record<string, { pps: number; bps: number; loss: number; delivered: number }> = {};
    const zoneTraffic: ZoneTraffic = { academic: 0, student: 0, administration: 0, surveillance: 0, iot: 0 };
    let offeredBytes = 0;
    let deliveredBytes = 0;
    let offeredPps = 0;
    let forwardedPps = 0;
    let policyDropPps = 0;
    let securityDropPps = 0;
    let throttledPps = 0;
    let alerts = 0;

    const tickPorts = new Map<string, number[]>();
    const tickViolations = new Map<string, number>();
    const tickScan = new Map<string, boolean>();

    for (const device of devices) {
      const attack = attackByDevice.get(device.deviceName);
      let rate = offeredRate(device, t, congestion.loadMultiplier, rng);
      let dest = destinationFor(device, devices, rng);
      let ports = [portsFor(device, dest, rng)];
      let trafficType = `${device.zone}-normal`;
      let cls = classForFlow(device, dest);

      if (attack) {
        const elapsed = t - attack.startedAt;
        rate = attackOfferedRate(attack, t);
        const target = byName.get(attack.targetDeviceId) ?? dest;
        dest = target;
        ports = attackPorts(attack, elapsed, rng);
        trafficType = `attack-${attack.type}`;
        cls = "BACKGROUND";
        if (attack.type === "port-scan" || (attack.type === "combined" && elapsed >= 5)) {
          tickScan.set(device.id, true);
        }
      }

      device.offeredPacketRate = rate;
      offeredPps += rate;
      zoneTraffic[device.zone] += rate;
      const avgSize = packetSizeFor(cls, rng);
      offeredBytes += rate * avgSize;

      let allowedPps = 0;
      let violation = 0;
      for (const port of ports) {
        const share = rate / ports.length;
        const flow = makeFlow({
          id: `f-${flowSeq++}`,
          source: device,
          dest,
          port,
          rate: share,
          t,
          trafficType,
          cls,
          packetSize: avgSize,
        });
        const inspected = applyPolicy(flow, device, dest);
        if (!inspected.allowed) {
          violation += 1;
          policyDropPps += share;
          inspected.dropped = true;
          if (flows.length < 48) flows.push(inspected);
          continue;
        }
        const secured = applySecurityToRate(device, share, port, dest.zone, cls);
        if (secured.forwardedPps <= 0) {
          securityDropPps += share;
          inspected.dropped = true;
          inspected.dropReason = secured.reason;
          if (flows.length < 48) flows.push(inspected);
          continue;
        }
        if (secured.forwardedPps < share) {
          throttledPps += share - secured.forwardedPps;
        }
        allowedPps += secured.forwardedPps;
        inspected.packetRate = secured.forwardedPps;
        addClass(classForwarded, cls, secured.forwardedPps);
        if (flows.length < 48) flows.push(inspected);
      }

      addClass(classOffered, cls, rate);
      tickPorts.set(device.id, ports);
      tickViolations.set(device.id, violation);
      if (violation > 0) {
        device.policyViolations += violation;
        this.state.counters.policyViolations += violation;
      }

      const podKey = device.connectedPod;
      if (!perPod[podKey]) perPod[podKey] = { pps: 0, bps: 0, loss: 0, delivered: 0 };
      perPod[podKey].pps += rate;

      device.destinationPorts = [...new Set([...(tickPorts.get(device.id) ?? []), ...device.destinationPorts])].slice(0, 16);
      device.throttleFactor = throttleFactorFor(device);
      forwardedPps += allowedPps;
      device.packetRate = rate;
    }

    const dpq = applyDpq(classForwarded, capacityPps, congestion.intensity);
    const deliveredTotal =
      dpq.delivered.critical + dpq.delivered.high + dpq.delivered.normal + dpq.delivered.background;
    const droppedTotal = dpq.dropped.critical + dpq.dropped.high + dpq.dropped.normal + dpq.dropped.background;
    const dpqFactor = forwardedPps > 0 ? deliveredTotal / forwardedPps : 1;

    for (const device of devices) {
      const delivered = device.offeredPacketRate * device.throttleFactor * dpqFactor;
      const recv = delivered * (0.92 + this.rng() * 0.06);
      device.deliveredPacketRate = delivered;
      device.packetsSent += device.offeredPacketRate;
      device.packetsReceived += recv;
      const dropped = Math.max(0, device.offeredPacketRate - delivered);
      device.packetsDropped += dropped;
      if (device.currentSecurityState === "BANDWIDTH THROTTLED") {
        device.packetsThrottled += dropped;
      } else if (
        device.currentSecurityState === "RESTRICTED ISOLATION" ||
        device.currentSecurityState === "NETWORK-WIDE QUARANTINE"
      ) {
        device.packetsBlocked += dropped;
      }
      const size = 640;
      device.bytesSent += device.offeredPacketRate * size;
      device.bytesReceived += recv * size;
      deliveredBytes += delivered * size;
      const pod = perPod[device.connectedPod];
      if (pod) {
        pod.delivered += delivered;
        pod.bps += delivered * size;
      }
      device.threatHistory = [...device.threatHistory, device.threatScore].slice(-60);
      device.packetRateHistory = [...device.packetRateHistory, device.offeredPacketRate].slice(-60);
    }

    this.state.counters.packetsBlocked += policyDropPps + securityDropPps;
    this.state.counters.packetsThrottled += throttledPps;
    this.state.counters.packetsDropped += droppedTotal + policyDropPps + securityDropPps;

    this.state.trafficFlows = [
      ...flows.slice(0, 24),
      ...sampleNormalFlows(devices, t, rng, 8),
    ].slice(0, 40);

    const offeredMbps = (offeredBytes * 8) / 1_000_000;
    const coreUtilization = offeredMbps / DISTRIBUTION_CAPACITY_MBPS;
    const delay = computeDelay({
      baseMs: failoverActive ? 3.8 : 1.8,
      congestionIntensity: congestion.intensity,
      failover: failoverActive,
      utilization: coreUtilization,
    });
    const dpqDropRatio = forwardedPps > 0 ? droppedTotal / Math.max(forwardedPps, 1) : 0;
    const loss = computeLoss({
      extraLoss: congestion.extraLoss,
      dpqDrop: dpqDropRatio,
      failedLinks,
      quarantineDrop: securityDropPps / Math.max(offeredPps, 1),
    });
    const deliveredAfterLoss = deliveredTotal * (1 - loss);
    const pdr = offeredPps > 0 ? deliveredAfterLoss / offeredPps : 1;
    const throughputMbps = (deliveredBytes * (1 - loss) * 8) / 1_000_000;

    this.updateThreats(t, tickPorts, tickViolations, tickScan, attacks);

    const security = countSecurity(devices);
    alerts = security.alert + security.throttled + security.isolated + security.blocked;
    const health = computeHealth({
      loss: loss * 100,
      delay,
      failedLinks,
      blocked: security.blocked,
      isolated: security.isolated,
    });

    const isolationLatencyMs =
      this.state.isolations.find((i) => i.deviceId === PRIMARY_ATTACK_DEVICE)?.isolationLatencyMs ??
      this.state.isolations.find((i) => i.isolationLatencyMs != null)?.isolationLatencyMs ??
      null;

    const metrics: Metrics = {
      throughput: throughputMbps,
      averageDelay: delay,
      packetLoss: loss,
      packetDeliveryRatio: pdr,
      offeredPps,
      deliveredPps: deliveredAfterLoss,
      droppedPps: Math.max(0, offeredPps - deliveredAfterLoss),
      networkHealth: health,
      offeredMbps,
      coreUtilization,
      isolationLatencyMs,
      failoverDurationMs: this.state.failover.failoverDurationMs,
      policyViolations: this.state.counters.policyViolations,
      packetsBlocked: this.state.counters.packetsBlocked,
      packetsThrottled: this.state.counters.packetsThrottled,
    };

    this.state.metrics = metrics;
    this.state.security = security;
    this.state.dpq = dpq.stats;
    this.state.core = updateCore(this.state.core, metrics, this.state.links);
    this.state.pods = updatePodStats(this.state.pods, perPod).map((pod) => {
      const threatEvents = devices.filter(
        (d) => d.connectedPod === pod.podId && d.currentSecurityState !== "CLEAR ACCESS",
      ).length;
      const primary = this.state.links.find((l) => l.id === pod.primaryLink);
      const backup = this.state.links.find((l) => l.id === pod.backupLink);
      let status = pod.status;
      if (primary?.failed && backup?.status === "active") status = "failover";
      else if (primary?.failed) status = "degraded";
      else if (threatEvents > 0) status = "degraded";
      else status = "healthy";
      return { ...pod, threatEvents, status };
    });
    this.state.links = this.state.links.map((link) => {
      if (link.failed) return { ...link, utilization: 0, status: "failed" };
      const stats = perPod[link.podId];
      const util = linkUtilization(stats?.pps ?? 0, capacityPps);
      let status = link.status;
      if (link.kind === "backup" && status !== "active") status = "standby";
      else if (link.kind === "primary" && (util > 0.85 || congestion.intensity > 0.55)) status = "congested";
      else if (link.kind === "primary") status = "healthy";
      return { ...link, utilization: util, status, delayMs: delay * (link.kind === "backup" ? 1.2 : 1) };
    });

    const point: HistoryPoint = {
      t,
      throughput: throughputMbps,
      delay,
      loss: loss * 100,
      pdr: pdr * 100,
      avgThreat: devices.reduce((s, d) => s + d.threatScore, 0) / devices.length,
      maxThreat: devices.reduce((m, d) => Math.max(m, d.threatScore), 0),
      health,
      offeredPps,
      deliveredPps: deliveredAfterLoss,
      offeredMbps,
      coreUtilization,
      zoneTraffic,
      security: { ...security },
      dpq: { ...dpq.stats },
      alerts,
      throttled: security.throttled,
      isolated: security.isolated,
      blocked: security.blocked,
      activeDevices: devices.filter((d) => d.status !== "offline").length,
      policyViolations: this.state.counters.policyViolations,
      packetsBlocked: this.state.counters.packetsBlocked,
      packetsThrottled: this.state.counters.packetsThrottled,
      isolationLatencyMs,
      failoverDurationMs: this.state.failover.failoverDurationMs,
    };
    this.state.history = [...this.state.history, point].slice(-120);
  }

  private updateThreats(
    t: number,
    tickPorts: Map<string, number[]>,
    tickViolations: Map<string, number>,
    tickScan: Map<string, boolean>,
    attacks: AttackProfile[],
  ) {
    for (const device of this.state.devices) {
      const samplePorts = tickPorts.get(device.id) ?? device.destinationPorts;
      const violations = tickViolations.get(device.id) ?? 0;
      let behavior = this.behavior.get(device.id) ?? emptyBehavior();
      behavior = pushSample(behavior, {
        packetRate: device.offeredPacketRate,
        ports: samplePorts,
        policyViolations: violations,
      });
      this.behavior.set(device.id, behavior);

      const attack = attacks.find((a) => a.deviceId === device.deviceName);
      const rapid = Boolean(tickScan.get(device.id) || behavior.rapidPortProbe);

      const { telemetry } = computeTelemetry({
        policyViolationsThisTick: violations,
        packetRate: device.offeredPacketRate,
        rapidPortProbe: rapid,
      });

      const prev = device.threatScore;
      const next = nextThreatScore(prev, telemetry);
      const prevState = device.currentSecurityState;
      const nextState = stateFromScore(next);
      device.threatScore = next;
      device.currentSecurityState = nextState;
      device.status = statusFromState(nextState);
      device.destinationPorts = behavior.uniquePorts.slice(0, 16);

      if ((violations > 0 || attack || rapid) && device.attackDetectedAt == null) {
        device.attackDetectedAt = t;
      }
      if (next >= 40 && device.threatThresholdAt == null) {
        device.threatThresholdAt = t;
      }
      if (nextState === "RESTRICTED ISOLATION" && prevState !== "RESTRICTED ISOLATION") {
        device.isolationTriggeredAt = t;
        if (device.attackDetectedAt != null) {
          device.isolationLatencyMs = (t - device.attackDetectedAt) * 1000;
        }
      }
      if (nextState === "NETWORK-WIDE QUARANTINE" && prevState !== "NETWORK-WIDE QUARANTINE") {
        device.quarantineTriggeredAt = t;
        if (device.isolationTriggeredAt == null) {
          device.isolationTriggeredAt = t;
          if (device.attackDetectedAt != null) {
            device.isolationLatencyMs = (t - device.attackDetectedAt) * 1000;
          }
        }
      }
      if (device.attackDetectedAt != null || device.isolationTriggeredAt != null) {
        this.upsertIsolation(device);
      }

      if (prevState !== nextState) {
        device.stateHistory = [...device.stateHistory, { t, state: nextState }].slice(-16);
      }

      if (violations > 0) {
        this.pushEvent(
          "POLICY_VIOLATION",
          `${device.deviceName} violated zone policy (${violations} denied flow${violations > 1 ? "s" : ""} this second).`,
          { deviceId: device.deviceName, zone: device.zone, podId: device.connectedPod, severity: "medium" },
        );
        const pod = this.state.pods.find((p) => p.podId === device.connectedPod);
        if (pod) pod.threatEvents += 1;
      }

      if (rapid && (attack || behavior.uniquePorts.length >= 8)) {
        const last = this.lastThreatEmit.get(`${device.id}-scan`) ?? -10;
        if (t - last >= 3) {
          this.lastThreatEmit.set(`${device.id}-scan`, t);
          this.pushEvent(
            "PORT_SCAN_DETECTED",
            `${device.deviceName} traversed ${behavior.uniquePorts.length} destination ports inside the 5s behavior window.`,
            { deviceId: device.deviceName, zone: device.zone, podId: device.connectedPod, severity: "high" },
          );
        }
      }

      if (Math.abs(next - prev) >= 4) {
        const last = this.lastThreatEmit.get(device.id) ?? -10;
        if (t - last >= 2) {
          this.lastThreatEmit.set(device.id, t);
          this.pushEvent(
            "THREAT_SCORE_UPDATED",
            `${device.deviceName} threat score ${prev.toFixed(1)} → ${next.toFixed(1)}.`,
            {
              deviceId: device.deviceName,
              zone: device.zone,
              podId: device.connectedPod,
              oldState: prev.toFixed(1),
              newState: next.toFixed(1),
            },
          );
        }
      }

      if (prevState !== nextState) {
        this.pushEvent(
          "SECURITY_STATE_CHANGED",
          `${device.deviceName} moved ${prevState} → ${nextState}.`,
          {
            deviceId: device.deviceName,
            zone: device.zone,
            podId: device.connectedPod,
            oldState: prevState,
            newState: nextState,
            severity: nextState === "NETWORK-WIDE QUARANTINE" ? "critical" : "high",
          },
        );
        if (nextState === "BANDWIDTH THROTTLED") {
          this.pushEvent(
            "DEVICE_THROTTLED",
            `${device.deviceName} bandwidth reduced by Smart Pod ${device.connectedPod}.`,
            { deviceId: device.deviceName, zone: device.zone, podId: device.connectedPod },
          );
        }
        if (nextState === "RESTRICTED ISOLATION") {
          this.pushEvent(
            "DEVICE_ISOLATED",
            `${device.deviceName} placed in restricted isolation. East-west traffic dropped.`,
            { deviceId: device.deviceName, zone: device.zone, podId: device.connectedPod, severity: "high" },
          );
        }
        if (nextState === "NETWORK-WIDE QUARANTINE") {
          this.pushEvent(
            "DEVICE_BLOCKED",
            `${device.deviceName} entered network-wide quarantine. All forwarding blocked.`,
            { deviceId: device.deviceName, zone: device.zone, podId: device.connectedPod, severity: "critical" },
          );
        }
      }
    }
  }

  getPublicState(): SimulationState {
    return this.state;
  }
}

function countSecurity(devices: Device[]): SecurityCounts {
  const counts: SecurityCounts = { clear: 0, alert: 0, throttled: 0, isolated: 0, blocked: 0 };
  for (const device of devices) {
    switch (device.currentSecurityState) {
      case "HEURISTIC ALERT":
        counts.alert += 1;
        break;
      case "BANDWIDTH THROTTLED":
        counts.throttled += 1;
        break;
      case "RESTRICTED ISOLATION":
        counts.isolated += 1;
        break;
      case "NETWORK-WIDE QUARANTINE":
        counts.blocked += 1;
        break;
      default:
        counts.clear += 1;
    }
  }
  return counts;
}

function labelAttack(type: AttackType): string {
  switch (type) {
    case "cross-zone":
      return "cross-zone access";
    case "port-scan":
      return "port scan";
    case "traffic-flood":
      return "traffic flood";
    default:
      return "combined attack";
  }
}

export function randomStudent(engine: SimulationEngine): string {
  const students = engine.state.devices.filter((d) => d.zone === "student");
  return students[randInt(() => Math.random(), 0, students.length - 1)]?.deviceName ?? PRIMARY_ATTACK_DEVICE;
}

export type { FailoverTiming };
