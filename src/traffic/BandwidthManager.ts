import type { SecurityState, TrafficClass } from "@/models/types";
import { DISTRIBUTION_CAPACITY_MBPS } from "@/models/types";
import { ppsFromMbps } from "@/simulation/NetworkEngine";

export function classWeight(cls: TrafficClass): number {
  switch (cls) {
    case "CRITICAL":
      return 4;
    case "HIGH":
      return 3;
    case "NORMAL":
      return 2;
    default:
      return 1;
  }
}

export function allocatedShare(state: SecurityState, cls: TrafficClass): number {
  if (state === "NETWORK-WIDE QUARANTINE") return 0;
  if (state === "RESTRICTED ISOLATION") {
    return cls === "CRITICAL" ? 0.2 : 0;
  }
  if (state === "BANDWIDTH THROTTLED") {
    if (cls === "CRITICAL") return 0.85;
    if (cls === "HIGH") return 0.55;
    if (cls === "NORMAL") return 0.35;
    return 0.12;
  }
  return 1;
}

/** Packets/s the simulated 1 Gbps distribution layer can carry at a given mean size. */
export function distributionCapacityPps(meanPacketBytes: number): number {
  return ppsFromMbps(DISTRIBUTION_CAPACITY_MBPS, meanPacketBytes);
}

export function distributionCapacityMbps(): number {
  return DISTRIBUTION_CAPACITY_MBPS;
}
