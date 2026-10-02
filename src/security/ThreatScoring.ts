import { clamp } from "@/simulation/rng";
import type { SecurityState } from "@/models/types";

export interface TelemetryInput {
  policyViolationsThisTick: number;
  packetRate: number;
  rapidPortProbe: boolean;
}

/**
 * Research threat model:
 * Threat(t) = Threat(t-1) × 0.95 + NewTelemetry(t), clamped 0–100.
 */
export function computeTelemetry(input: TelemetryInput): { telemetry: number; parts: string[] } {
  let telemetry = 0;
  const parts: string[] = [];

  if (input.policyViolationsThisTick > 0) {
    telemetry += 25;
    parts.push("policy+25");
  }
  if (input.packetRate > 80) {
    const volumetric = Math.min(input.packetRate / 3.5, 40);
    telemetry += volumetric;
    parts.push(`vol+${volumetric.toFixed(1)}`);
  }
  if (input.rapidPortProbe) {
    telemetry += 35;
    parts.push("scan+35");
  }
  if (input.packetRate > 160) {
    const severe = Math.min(20, ((input.packetRate - 160) / 80) * 20);
    telemetry += severe;
    parts.push(`dev+${severe.toFixed(1)}`);
  }

  return { telemetry, parts };
}

export function nextThreatScore(previous: number, telemetry: number): number {
  return clamp(previous * 0.95 + telemetry, 0, 100);
}

export function stateFromScore(score: number): SecurityState {
  if (score >= 85) return "NETWORK-WIDE QUARANTINE";
  if (score >= 70) return "RESTRICTED ISOLATION";
  if (score >= 55) return "BANDWIDTH THROTTLED";
  if (score >= 40) return "HEURISTIC ALERT";
  return "CLEAR ACCESS";
}

export function statusFromState(state: SecurityState): "online" | "degraded" | "isolated" | "blocked" {
  switch (state) {
    case "NETWORK-WIDE QUARANTINE":
      return "blocked";
    case "RESTRICTED ISOLATION":
      return "isolated";
    case "BANDWIDTH THROTTLED":
    case "HEURISTIC ALERT":
      return "degraded";
    default:
      return "online";
  }
}
