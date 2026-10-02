export const ZONE_IDS = [
  "academic",
  "student",
  "administration",
  "surveillance",
  "iot",
] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

export const SECURITY_STATES = [
  "CLEAR ACCESS",
  "HEURISTIC ALERT",
  "BANDWIDTH THROTTLED",
  "RESTRICTED ISOLATION",
  "NETWORK-WIDE QUARANTINE",
] as const;

export type SecurityState = (typeof SECURITY_STATES)[number];

export const SECURITY_ACTIONS = ["ALLOW", "MONITOR", "THROTTLE", "ISOLATE", "QUARANTINE"] as const;
export type SecurityAction = (typeof SECURITY_ACTIONS)[number];

export const TRAFFIC_CLASSES = ["CRITICAL", "HIGH", "NORMAL", "BACKGROUND"] as const;
export type TrafficClass = (typeof TRAFFIC_CLASSES)[number];

export const DEVICE_TYPES = [
  "student-client",
  "academic-workstation",
  "exam-server",
  "admin-endpoint",
  "admin-db",
  "camera",
  "nvr",
  "iot-device",
  "sensor",
] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export const DEVICE_STATUSES = ["online", "degraded", "isolated", "blocked", "offline"] as const;
export type DeviceStatus = (typeof DEVICE_STATUSES)[number];

export const POD_STATUSES = ["healthy", "degraded", "failover", "offline"] as const;
export type PodStatus = (typeof POD_STATUSES)[number];

export const LINK_STATUSES = ["healthy", "congested", "failed", "standby", "active"] as const;
export type LinkStatus = (typeof LINK_STATUSES)[number];

export const ATTACK_TYPES = [
  "cross-zone",
  "port-scan",
  "traffic-flood",
  "combined",
] as const;
export type AttackType = (typeof ATTACK_TYPES)[number];

export const EVENT_TYPES = [
  "SIMULATION_STARTED",
  "TRAFFIC_STARTED",
  "CONGESTION_STARTED",
  "CONGESTION_STOPPED",
  "POLICY_VIOLATION",
  "PORT_SCAN_DETECTED",
  "THREAT_SCORE_UPDATED",
  "SECURITY_STATE_CHANGED",
  "DEVICE_THROTTLED",
  "DEVICE_ISOLATED",
  "DEVICE_BLOCKED",
  "ATTACK_INJECTED",
  "LINK_FAILURE",
  "HEARTBEAT_TIMEOUT",
  "FAILOVER_ACTIVATED",
  "ROUTE_RECALCULATED",
  "STATE_SYNCHRONIZED",
  "SIMULATION_PAUSED",
  "SIMULATION_COMPLETED",
  "SIMULATION_RESET",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_CATEGORIES = ["ALL", "SECURITY", "TRAFFIC", "ATTACK", "FAILURE", "SYSTEM"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export type EventSeverity = (typeof EVENT_SEVERITIES)[number];

export type Protocol = "TCP" | "UDP" | "ICMP";

export interface Zone {
  id: ZoneId;
  name: string;
  cidr: string;
  description: string;
  podIds: string[];
  deviceCount: number;
}

export interface DeviceStateSample {
  t: number;
  state: SecurityState;
}

export interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  zone: ZoneId;
  deviceType: DeviceType;
  connectedPod: string;
  status: DeviceStatus;
  threatScore: number;
  packetRate: number;
  packetsSent: number;
  packetsReceived: number;
  bytesSent: number;
  bytesReceived: number;
  destinationPorts: number[];
  policyViolations: number;
  currentSecurityState: SecurityState;
  lastEvent: string;
  lastEventType: EventType | "";
  basePacketRate: number;
  offeredPacketRate: number;
  deliveredPacketRate: number;
  throttleFactor: number;
  role: string;
  defaultClass: TrafficClass;
  packetsDropped: number;
  packetsBlocked: number;
  packetsThrottled: number;
  threatHistory: number[];
  packetRateHistory: number[];
  stateHistory: DeviceStateSample[];
  attackDetectedAt: number | null;
  threatThresholdAt: number | null;
  isolationTriggeredAt: number | null;
  quarantineTriggeredAt: number | null;
  isolationLatencyMs: number | null;
}

export interface PodTrafficStats {
  pps: number;
  bps: number;
  loss: number;
  deliveredPps: number;
}

export interface SmartPod {
  id: string;
  podId: string;
  podName: string;
  zone: ZoneId;
  status: PodStatus;
  connectedDevices: string[];
  threatEvents: number;
  trafficStats: PodTrafficStats;
  primaryLink: string;
  backupLink: string;
  heartbeatStatus: "ok" | "timeout";
  lastHeartbeat: number;
}

export interface NetworkLink {
  id: string;
  name: string;
  from: string;
  to: string;
  kind: "primary" | "backup";
  podId: string;
  status: LinkStatus;
  utilization: number;
  delayMs: number;
  failed: boolean;
}

export interface CoreSwitch {
  id: string;
  name: string;
  ipAddress: string;
  totalThroughput: number;
  averageDelay: number;
  packetLoss: number;
  packetDeliveryRatio: number;
  activeLinks: number;
  failedLinks: number;
  networkHealth: number;
  distributionCapacityMbps: number;
  utilization: number;
}

export interface TrafficFlow {
  id: string;
  sourceDevice: string;
  destinationDevice: string;
  sourceZone: ZoneId;
  destinationZone: ZoneId;
  protocol: Protocol;
  sourcePort: number;
  destinationPort: number;
  packetSize: number;
  packetRate: number;
  timestamp: number;
  priority: TrafficClass;
  trafficType: string;
  allowed: boolean;
  dropped: boolean;
  dropReason: string;
}

export interface SimEvent {
  id: string;
  timestamp: number;
  simulationTime: number;
  eventType: EventType;
  deviceId: string;
  zone: ZoneId | "";
  podId: string;
  severity: EventSeverity;
  oldState: string;
  newState: string;
  description: string;
  category: Exclude<EventCategory, "ALL">;
}

export interface Metrics {
  throughput: number;
  averageDelay: number;
  packetLoss: number;
  packetDeliveryRatio: number;
  offeredPps: number;
  deliveredPps: number;
  droppedPps: number;
  networkHealth: number;
  offeredMbps: number;
  coreUtilization: number;
  isolationLatencyMs: number | null;
  failoverDurationMs: number | null;
  policyViolations: number;
  packetsBlocked: number;
  packetsThrottled: number;
}

export interface SecurityCounts {
  clear: number;
  alert: number;
  throttled: number;
  isolated: number;
  blocked: number;
}

export interface DpqStats {
  critical: number;
  high: number;
  normal: number;
  background: number;
  criticalDrop: number;
  highDrop: number;
  normalDrop: number;
  backgroundDrop: number;
  capacity: number;
  capacityMbps: number;
  allocatedMbps: {
    critical: number;
    high: number;
    normal: number;
    background: number;
  };
}

export interface ZoneTraffic {
  academic: number;
  student: number;
  administration: number;
  surveillance: number;
  iot: number;
}

export interface HistoryPoint {
  t: number;
  throughput: number;
  delay: number;
  loss: number;
  pdr: number;
  avgThreat: number;
  maxThreat: number;
  health: number;
  offeredPps: number;
  deliveredPps: number;
  offeredMbps: number;
  coreUtilization: number;
  zoneTraffic: ZoneTraffic;
  security: SecurityCounts;
  dpq: DpqStats;
  alerts: number;
  throttled: number;
  isolated: number;
  blocked: number;
  activeDevices: number;
  policyViolations: number;
  packetsBlocked: number;
  packetsThrottled: number;
  isolationLatencyMs: number | null;
  failoverDurationMs: number | null;
}

export interface AttackProfile {
  type: AttackType;
  deviceId: string;
  targetDeviceId: string;
  targetZone: ZoneId;
  targetService: string;
  startedAt: number;
  active: boolean;
  phase: number;
}

export interface ScenarioFlags {
  scheduledAttackFired: boolean;
  scheduledFailureFired: boolean;
  trafficEnabled: boolean;
  congestionEnabled: boolean;
  completed: boolean;
}

export interface IsolationTiming {
  deviceId: string;
  attackDetectedAt: number | null;
  threatThresholdAt: number | null;
  isolationTriggeredAt: number | null;
  quarantineTriggeredAt: number | null;
  isolationLatencyMs: number | null;
}

export type FailoverPhase =
  | "idle"
  | "primary-failed"
  | "heartbeat-timeout"
  | "backup-active";

export interface FailoverSequenceStep {
  at: number;
  label: string;
}

export interface FailoverTiming {
  podId: string;
  podName: string;
  phase: FailoverPhase;
  primaryFailureAt: number | null;
  primaryFailureDetectedAt: number | null;
  failoverStartedAt: number | null;
  backupActivatedAt: number | null;
  heartbeatTimeoutMs: number;
  failoverDurationMs: number | null;
  sequence: FailoverSequenceStep[];
}

export interface SimCounters {
  policyViolations: number;
  packetsBlocked: number;
  packetsThrottled: number;
  packetsDropped: number;
  attacksDetected: number;
}

export interface SimulationState {
  running: boolean;
  currentTime: number;
  version: number;
  devices: Device[];
  pods: SmartPod[];
  zones: Zone[];
  links: NetworkLink[];
  core: CoreSwitch;
  trafficFlows: TrafficFlow[];
  metrics: Metrics;
  security: SecurityCounts;
  dpq: DpqStats;
  events: SimEvent[];
  history: HistoryPoint[];
  attacks: AttackProfile[];
  scenario: ScenarioFlags;
  seed: number;
  isolations: IsolationTiming[];
  failover: FailoverTiming;
  counters: SimCounters;
}

export interface AttackRequest {
  type: AttackType;
  deviceId: string;
  targetDeviceId?: string;
  targetZone?: ZoneId;
  targetService?: string;
}

export const SIMULATION_DURATION = 120;
export const SIM_TICK = 0.1;
export const BEHAVIOR_WINDOW = 5;
export const HEARTBEAT_TIMEOUT = 0.5;
export const SCHEDULED_ATTACK_AT = 45;
export const SCHEDULED_FAILURE_AT = 75;
export const PRIMARY_ATTACK_DEVICE = "Student-027";
export const PRIMARY_ATTACK_TARGET = "Admin-DB";
export const DEVICES_PER_ZONE = 24;
export const DISTRIBUTION_CAPACITY_MBPS = 1000;
/** NS-3 / paper reported figure — not a measurement of this JavaScript simulation. */
export const PAPER_ISOLATION_LATENCY_MS = 4.2;
export const SIM_SPEEDS = [0.5, 1, 2, 5, 10] as const;
export type SimSpeed = (typeof SIM_SPEEDS)[number];
