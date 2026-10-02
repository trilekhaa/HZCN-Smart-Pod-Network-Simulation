import type { Device, SecurityState, TrafficClass } from "@/models/types";

export interface ForwardingDecision {
  factor: number;
  eastWestAllowed: boolean;
  remediationOnly: boolean;
  blocked: boolean;
}

export function forwardingForState(state: SecurityState): ForwardingDecision {
  switch (state) {
    case "HEURISTIC ALERT":
      return { factor: 1, eastWestAllowed: true, remediationOnly: false, blocked: false };
    case "BANDWIDTH THROTTLED":
      return { factor: 0.4, eastWestAllowed: true, remediationOnly: false, blocked: false };
    case "RESTRICTED ISOLATION":
      return { factor: 0.12, eastWestAllowed: false, remediationOnly: true, blocked: false };
    case "NETWORK-WIDE QUARANTINE":
      return { factor: 0, eastWestAllowed: false, remediationOnly: true, blocked: true };
    default:
      return { factor: 1, eastWestAllowed: true, remediationOnly: false, blocked: false };
  }
}

const REMEDIATION_PORTS = new Set([53, 80, 443]);

export function applySecurityToRate(
  device: Device,
  offeredPps: number,
  destPort: number,
  destZone: string,
  trafficClass: TrafficClass,
): { forwardedPps: number; reason: string } {
  const decision = forwardingForState(device.currentSecurityState);

  if (decision.blocked) {
    return { forwardedPps: 0, reason: "Network-wide quarantine" };
  }

  if (decision.remediationOnly && !REMEDIATION_PORTS.has(destPort)) {
    return { forwardedPps: 0, reason: "Restricted isolation — non-remediation traffic blocked" };
  }

  if (!decision.eastWestAllowed && destZone === device.zone && !REMEDIATION_PORTS.has(destPort)) {
    return { forwardedPps: 0, reason: "East-west drop under restricted isolation" };
  }

  let factor = decision.factor;
  if (device.currentSecurityState === "BANDWIDTH THROTTLED" && trafficClass === "BACKGROUND") {
    factor *= 0.35;
  }

  return { forwardedPps: offeredPps * factor, reason: "" };
}

export function throttleFactorFor(device: Device): number {
  return forwardingForState(device.currentSecurityState).factor;
}
