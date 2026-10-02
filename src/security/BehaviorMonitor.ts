import { BEHAVIOR_WINDOW } from "@/models/types";

export interface BehaviorSample {
  packetRate: number;
  ports: number[];
  policyViolations: number;
}

export interface DeviceBehavior {
  window: BehaviorSample[];
  uniquePorts: number[];
  avgPacketRate: number;
  maxPacketRate: number;
  violationCount: number;
  rapidPortProbe: boolean;
}

export function emptyBehavior(): DeviceBehavior {
  return {
    window: [],
    uniquePorts: [],
    avgPacketRate: 0,
    maxPacketRate: 0,
    violationCount: 0,
    rapidPortProbe: false,
  };
}

/** Sliding 5-second window over measurable network behavior only. */
export function pushSample(current: DeviceBehavior, sample: BehaviorSample): DeviceBehavior {
  const window = [...current.window, sample].slice(-BEHAVIOR_WINDOW);
  const portSet = new Set<number>();
  let rateSum = 0;
  let maxRate = 0;
  let violations = 0;
  for (const item of window) {
    rateSum += item.packetRate;
    if (item.packetRate > maxRate) maxRate = item.packetRate;
    violations += item.policyViolations;
    for (const port of item.ports) portSet.add(port);
  }
  const uniquePorts = [...portSet].sort((a, b) => a - b);
  return {
    window,
    uniquePorts,
    avgPacketRate: window.length ? rateSum / window.length : 0,
    maxPacketRate: maxRate,
    violationCount: violations,
    rapidPortProbe: uniquePorts.length >= 8,
  };
}
