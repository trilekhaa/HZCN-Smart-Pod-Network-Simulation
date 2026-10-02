import type { SimulationState } from "@/models/types";
import { PRIMARY_ATTACK_DEVICE, SIMULATION_DURATION } from "@/models/types";

export interface SimulationSummary {
  duration: number;
  devices: number;
  zones: number;
  smartPods: number;
  attacksDetected: number;
  policyViolations: number;
  maximumThreatScore: number | null;
  devicesIsolated: number;
  devicesQuarantined: number;
  packetsBlocked: number;
  peakThroughput: number | null;
  averageDelay: number | null;
  packetDeliveryRatio: number | null;
  isolationLatencyMs: number | null;
  failoverDurationMs: number | null;
  coreUtilization: number | null;
}

function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

export function buildSimulationSummary(state: SimulationState): SimulationSummary {
  const history = state.history;
  const peakThroughput = history.length ? Math.max(...history.map((h) => h.throughput)) : null;
  const meanDelay = history.length
    ? history.reduce((s, h) => s + h.delay, 0) / history.length
    : null;
  const lastPoint = last(history);
  const attacker = state.devices.find((d) => d.deviceName === PRIMARY_ATTACK_DEVICE);
  const isolationLatencyMs =
    attacker?.isolationLatencyMs ??
    state.isolations.find((i) => i.isolationLatencyMs != null)?.isolationLatencyMs ??
    null;
  const maxThreat = history.length
    ? Math.max(...history.map((h) => h.maxThreat))
    : state.devices.reduce((m, d) => Math.max(m, d.threatScore), 0);

  return {
    duration: SIMULATION_DURATION,
    devices: state.devices.length,
    zones: state.zones.length,
    smartPods: state.pods.length,
    attacksDetected: state.counters.attacksDetected,
    policyViolations: state.counters.policyViolations,
    maximumThreatScore: history.length || maxThreat > 0 ? maxThreat : null,
    devicesIsolated: state.security.isolated,
    devicesQuarantined: state.security.blocked,
    packetsBlocked: Math.round(state.counters.packetsBlocked),
    peakThroughput,
    averageDelay: meanDelay,
    packetDeliveryRatio: lastPoint ? lastPoint.pdr / 100 : null,
    isolationLatencyMs,
    failoverDurationMs: state.failover.failoverDurationMs,
    coreUtilization: lastPoint ? lastPoint.coreUtilization : null,
  };
}

export function na(value: number | null | undefined, format: (n: number) => string): string {
  if (value == null || !Number.isFinite(value)) return "N/A";
  return format(value);
}
