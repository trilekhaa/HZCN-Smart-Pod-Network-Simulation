import { SimulationEngine } from "@/simulation/SimulationEngine";
import { simTimeEquals } from "@/simulation/SimulationClock";
import {
  DEVICES_PER_ZONE,
  HEARTBEAT_TIMEOUT,
  PRIMARY_ATTACK_DEVICE,
  SCHEDULED_ATTACK_AT,
  SCHEDULED_FAILURE_AT,
  SIMULATION_DURATION,
  ZONE_IDS,
} from "@/models/types";

export function runEngineSelfTest(): string[] {
  const errors: string[] = [];
  const engine = new SimulationEngine();
  if (engine.state.devices.length !== 120) errors.push(`devices ${engine.state.devices.length}`);
  if (engine.state.pods.length !== 8) errors.push(`pods ${engine.state.pods.length}`);
  if (engine.state.zones.length !== 5) errors.push(`zones ${engine.state.zones.length}`);
  if (engine.state.links.length !== 16) errors.push(`links ${engine.state.links.length}`);
  if (engine.state.core.distributionCapacityMbps !== 1000) {
    errors.push(`distribution capacity ${engine.state.core.distributionCapacityMbps}`);
  }
  for (const zone of ZONE_IDS) {
    const count = engine.state.devices.filter((d) => d.zone === zone).length;
    if (count !== DEVICES_PER_ZONE) errors.push(`${zone} devices ${count}`);
  }
  if (!engine.state.devices.some((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)) {
    errors.push("Student-027 missing");
  }

  engine.start();
  engine.stepN(SCHEDULED_ATTACK_AT - 1);
  const before = engine.state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)!;
  if (before.currentSecurityState !== "CLEAR ACCESS") {
    errors.push(`pre-attack state ${before.currentSecurityState}`);
  }
  if (engine.state.scenario.scheduledAttackFired) errors.push("attack fired early");

  engine.stepN(1);
  if (!simTimeEquals(engine.state.currentTime, SCHEDULED_ATTACK_AT)) {
    errors.push(`attack tick ${engine.state.currentTime}`);
  }
  if (!engine.state.scenario.scheduledAttackFired) errors.push("attack did not start at t=45");
  const attackEvent = engine.state.events.find((e) => e.eventType === "ATTACK_INJECTED");
  if (!attackEvent) errors.push("missing event ATTACK_INJECTED");
  else if (!simTimeEquals(attackEvent.simulationTime, SCHEDULED_ATTACK_AT)) {
    errors.push(`attack at ${attackEvent.simulationTime}`);
  }

  engine.stepN(10);
  const attacker = engine.state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)!;
  if (attacker.threatScore < 40) errors.push(`threat ${attacker.threatScore}`);
  if (attacker.policyViolations < 1) errors.push("no policy violations");
  if (attacker.currentSecurityState === "CLEAR ACCESS") errors.push("attacker still clear");

  while (
    engine.state.currentTime < SCHEDULED_FAILURE_AT - 1 &&
    attacker.currentSecurityState !== "RESTRICTED ISOLATION" &&
    attacker.currentSecurityState !== "NETWORK-WIDE QUARANTINE"
  ) {
    engine.step();
  }
  const escalated = engine.state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)!;
  if (
    escalated.currentSecurityState !== "RESTRICTED ISOLATION" &&
    escalated.currentSecurityState !== "NETWORK-WIDE QUARANTINE" &&
    escalated.currentSecurityState !== "BANDWIDTH THROTTLED"
  ) {
    errors.push(`no isolation/throttle ${escalated.currentSecurityState}`);
  }
  if (escalated.isolationTriggeredAt != null && escalated.attackDetectedAt != null) {
    const expectedIsolationMs = (escalated.isolationTriggeredAt - escalated.attackDetectedAt) * 1000;
    if (escalated.isolationLatencyMs == null) errors.push("isolation latency not measured");
    else if (Math.abs(escalated.isolationLatencyMs - expectedIsolationMs) > 1e-6) {
      errors.push(`isolation latency ${escalated.isolationLatencyMs} != ${expectedIsolationMs}`);
    }
  }

  const remainingToFailure = SCHEDULED_FAILURE_AT - engine.state.currentTime;
  if (remainingToFailure > 0) engine.stepN(remainingToFailure);
  if (!simTimeEquals(engine.state.currentTime, SCHEDULED_FAILURE_AT)) {
    errors.push(`failure tick ${engine.state.currentTime}`);
  }
  const podAtFail = engine.state.pods.find((p) => p.podId === "POD-01")!;
  const primaryAtFail = engine.state.links.find((l) => l.id === podAtFail.primaryLink)!;
  if (!primaryAtFail.failed) errors.push("primary not failed at t=75");
  if (engine.state.failover.phase === "idle") errors.push("failover timing idle at t=75");
  if (engine.state.failover.phase === "backup-active") {
    errors.push("backup activated before heartbeat timeout");
  }
  if (engine.state.events.some((e) => e.eventType === "HEARTBEAT_TIMEOUT")) {
    errors.push("heartbeat timeout before 75.5s");
  }
  const failEvent = engine.state.events.find((e) => e.eventType === "LINK_FAILURE");
  if (!failEvent) errors.push("missing event LINK_FAILURE");
  else if (!simTimeEquals(failEvent.simulationTime, SCHEDULED_FAILURE_AT)) {
    errors.push(`primary failure at ${failEvent.simulationTime}`);
  }
  if (
    engine.state.failover.primaryFailureAt == null ||
    !simTimeEquals(engine.state.failover.primaryFailureAt, SCHEDULED_FAILURE_AT)
  ) {
    errors.push(`primaryFailureAt ${engine.state.failover.primaryFailureAt}`);
  }
  const preFailover = engine.state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)!;
  const isolatedState = preFailover.currentSecurityState;

  const heartbeatAt = SCHEDULED_FAILURE_AT + HEARTBEAT_TIMEOUT;
  engine.stepN(HEARTBEAT_TIMEOUT);
  if (!simTimeEquals(engine.state.currentTime, heartbeatAt)) {
    errors.push(`heartbeat tick ${engine.state.currentTime}`);
  }
  const afterFail = engine.state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE)!;
  if (isolatedState !== "CLEAR ACCESS" && afterFail.currentSecurityState === "CLEAR ACCESS") {
    errors.push(`failover reset security ${isolatedState} -> ${afterFail.currentSecurityState}`);
  }
  const pod = engine.state.pods.find((p) => p.podId === "POD-01")!;
  if (pod.status !== "failover") errors.push(`pod status ${pod.status}`);
  const primary = engine.state.links.find((l) => l.id === pod.primaryLink)!;
  const backup = engine.state.links.find((l) => l.id === pod.backupLink)!;
  if (!primary.failed) errors.push("primary not failed");
  if (backup.status !== "active") errors.push(`backup ${backup.status}`);
  if (engine.state.failover.heartbeatTimeoutMs !== HEARTBEAT_TIMEOUT * 1000) {
    errors.push(`heartbeat config ${engine.state.failover.heartbeatTimeoutMs}`);
  }

  const heartbeatEvent = engine.state.events.find((e) => e.eventType === "HEARTBEAT_TIMEOUT");
  if (!heartbeatEvent) errors.push("missing event HEARTBEAT_TIMEOUT");
  else if (!simTimeEquals(heartbeatEvent.simulationTime, heartbeatAt)) {
    errors.push(`heartbeat timeout at ${heartbeatEvent.simulationTime}`);
  }
  const failoverEvent = engine.state.events.find((e) => e.eventType === "FAILOVER_ACTIVATED");
  if (!failoverEvent) errors.push("missing event FAILOVER_ACTIVATED");
  else {
    if (heartbeatEvent && failoverEvent.simulationTime + 1e-9 < heartbeatEvent.simulationTime) {
      errors.push("backup activated before heartbeat timeout");
    }
    if (!simTimeEquals(failoverEvent.simulationTime, heartbeatAt)) {
      errors.push(`backup activation at ${failoverEvent.simulationTime}`);
    }
  }

  const { backupActivatedAt, primaryFailureAt, failoverDurationMs } = engine.state.failover;
  if (failoverDurationMs == null) errors.push("failover duration not measured");
  if (backupActivatedAt == null || primaryFailureAt == null) {
    errors.push("failover timestamps missing");
  } else {
    const expectedMs = (backupActivatedAt - primaryFailureAt) * 1000;
    if (failoverDurationMs == null) {
      errors.push("failover duration not measured");
    } else if (Math.abs(failoverDurationMs - expectedMs) > 1e-6) {
      errors.push(`failover duration ${failoverDurationMs} != ${expectedMs}`);
    }
  }

  const types = new Set(engine.state.events.map((e) => e.eventType));
  for (const needed of [
    "ATTACK_INJECTED",
    "POLICY_VIOLATION",
    "LINK_FAILURE",
    "HEARTBEAT_TIMEOUT",
    "FAILOVER_ACTIVATED",
    "STATE_SYNCHRONIZED",
    "ROUTE_RECALCULATED",
  ] as const) {
    if (!types.has(needed)) errors.push(`missing event ${needed}`);
  }

  engine.stepN(SIMULATION_DURATION - engine.state.currentTime);
  if (!simTimeEquals(engine.state.currentTime, SIMULATION_DURATION)) {
    errors.push(`final time ${engine.state.currentTime}`);
  }
  if (!engine.state.scenario.completed) errors.push("simulation did not complete");

  const invalid = engine.state.devices.filter(
    (d) => d.threatScore < 0 || d.threatScore > 100 || !d.connectedPod,
  );
  if (invalid.length) errors.push(`invalid device state ${invalid.length}`);

  return errors;
}
