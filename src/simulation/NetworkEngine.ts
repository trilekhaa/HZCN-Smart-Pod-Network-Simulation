import type { CoreSwitch, Metrics, NetworkLink, SmartPod } from "@/models/types";
import { DISTRIBUTION_CAPACITY_MBPS } from "@/models/types";
import { clamp } from "@/simulation/rng";

export const MEAN_PACKET_BYTES = 640;

/** Simulated 1 Gbps core/distribution-layer capacity expressed as packets/s at mean size. */
export const DISTRIBUTION_CAPACITY_PPS =
  (DISTRIBUTION_CAPACITY_MBPS * 1_000_000) / (MEAN_PACKET_BYTES * 8);

/** @deprecated alias — same 1 Gbps distribution-layer model. */
export const CORE_CAPACITY_PPS = DISTRIBUTION_CAPACITY_PPS;

export function mbpsFromPps(pps: number, packetBytes = MEAN_PACKET_BYTES): number {
  return (pps * packetBytes * 8) / 1_000_000;
}

export function ppsFromMbps(mbps: number, packetBytes = MEAN_PACKET_BYTES): number {
  return (mbps * 1_000_000) / Math.max(1, packetBytes * 8);
}

export function computeDelay(input: {
  baseMs: number;
  congestionIntensity: number;
  failover: boolean;
  utilization: number;
}): number {
  const congestionDelay = input.congestionIntensity * 28;
  const queueDelay = Math.max(0, input.utilization - 0.6) * 22;
  const failoverDelay = input.failover ? 3.2 : 0;
  return input.baseMs + congestionDelay + queueDelay + failoverDelay;
}

export function computeLoss(input: {
  extraLoss: number;
  dpqDrop: number;
  failedLinks: number;
  quarantineDrop: number;
}): number {
  const failLoss = input.failedLinks > 0 ? 0.012 : 0;
  return clamp(0.0008 + input.extraLoss + input.dpqDrop * 0.65 + failLoss + input.quarantineDrop * 0.05, 0, 0.45);
}

export function computeHealth(input: {
  loss: number;
  delay: number;
  failedLinks: number;
  blocked: number;
  isolated: number;
}): number {
  const delayNorm = clamp((input.delay - 2) / 40, 0, 1);
  const penalty =
    input.loss * 48 +
    delayNorm * 22 +
    input.failedLinks * 8 +
    input.blocked * 0.35 +
    input.isolated * 0.2;
  return clamp(100 - penalty, 4, 100);
}

export function updateCore(
  core: CoreSwitch,
  metrics: Metrics,
  links: NetworkLink[],
): CoreSwitch {
  const failed = links.filter((l) => l.failed || l.status === "failed").length;
  const active = links.filter((l) => {
    if (l.failed || l.status === "failed") return false;
    if (l.kind === "primary") return true;
    return l.status === "active";
  }).length;
  return {
    ...core,
    totalThroughput: metrics.throughput,
    averageDelay: metrics.averageDelay,
    packetLoss: metrics.packetLoss,
    packetDeliveryRatio: metrics.packetDeliveryRatio,
    activeLinks: active,
    failedLinks: failed,
    networkHealth: metrics.networkHealth,
    distributionCapacityMbps: DISTRIBUTION_CAPACITY_MBPS,
    utilization: metrics.coreUtilization,
  };
}

export function updatePodStats(
  pods: SmartPod[],
  perPod: Record<string, { pps: number; bps: number; loss: number; delivered: number }>,
): SmartPod[] {
  return pods.map((pod) => {
    const stats = perPod[pod.podId] ?? { pps: 0, bps: 0, loss: 0, delivered: 0 };
    return {
      ...pod,
      trafficStats: {
        pps: stats.pps,
        bps: stats.bps,
        loss: stats.loss,
        deliveredPps: stats.delivered,
      },
    };
  });
}

export function linkUtilization(pps: number, capacityPps = DISTRIBUTION_CAPACITY_PPS): number {
  return clamp(pps / Math.max(1, capacityPps), 0, 1.4);
}
