import type { DpqStats, TrafficClass } from "@/models/types";
import { DISTRIBUTION_CAPACITY_MBPS } from "@/models/types";
import { clamp } from "@/simulation/rng";
import { mbpsFromPps } from "@/simulation/NetworkEngine";

export interface ClassLoad {
  critical: number;
  high: number;
  normal: number;
  background: number;
}

const ORDER: TrafficClass[] = ["CRITICAL", "HIGH", "NORMAL", "BACKGROUND"];

/**
 * Simulated Dynamic Priority Queuing.
 * This is not Linux tc — it models class-based protection during congestion
 * against the 1 Gbps distribution-layer capacity.
 */
export function applyDpq(
  offered: ClassLoad,
  capacityPps: number,
  congestion: number,
): { delivered: ClassLoad; dropped: ClassLoad; stats: DpqStats } {
  const effectiveCapacity = capacityPps * (1 - congestion * 0.22);
  const delivered: ClassLoad = { critical: 0, high: 0, normal: 0, background: 0 };
  const dropped: ClassLoad = { critical: 0, high: 0, normal: 0, background: 0 };

  let remaining = Math.max(40, effectiveCapacity);
  for (const cls of ORDER) {
    const key = cls.toLowerCase() as keyof ClassLoad;
    const want = offered[key];
    const give = Math.min(want, remaining);
    delivered[key] = give;
    dropped[key] = Math.max(0, want - give);
    remaining -= give;
  }

  const served = delivered.critical + delivered.high + delivered.normal + delivered.background;
  const stats: DpqStats = {
    critical: occupancy(offered.critical, delivered.critical),
    high: occupancy(offered.high, delivered.high),
    normal: occupancy(offered.normal, delivered.normal),
    background: occupancy(offered.background, delivered.background),
    criticalDrop: dropRatio(offered.critical, dropped.critical),
    highDrop: dropRatio(offered.high, dropped.high),
    normalDrop: dropRatio(offered.normal, dropped.normal),
    backgroundDrop: dropRatio(offered.background, dropped.background),
    capacity: effectiveCapacity,
    capacityMbps: DISTRIBUTION_CAPACITY_MBPS * (1 - congestion * 0.22),
    allocatedMbps: {
      critical: mbpsFromPps(delivered.critical),
      high: mbpsFromPps(delivered.high),
      normal: mbpsFromPps(delivered.normal),
      background: mbpsFromPps(delivered.background),
    },
  };

  void served;
  return { delivered, dropped, stats };
}

function occupancy(offered: number, delivered: number): number {
  if (offered <= 0) return 8;
  const fill = delivered / Math.max(offered, 1);
  return clamp((1.05 - fill) * 70 + 12, 6, 100);
}

function dropRatio(offered: number, dropped: number): number {
  if (offered <= 0) return 0;
  return dropped / offered;
}

export function classShare(cls: TrafficClass, delivered: ClassLoad, total: number): number {
  if (total <= 0) return 0;
  return delivered[cls.toLowerCase() as keyof ClassLoad] / total;
}
