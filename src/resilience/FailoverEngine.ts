import type { Device, NetworkLink, SmartPod } from "@/models/types";

export interface FailoverResult {
  pods: SmartPod[];
  links: NetworkLink[];
  devices: Device[];
}

/**
 * Activate backup path and recalculate routes.
 * Security state on every device is preserved — routing must not reset it.
 */
export function activateFailover(
  pods: SmartPod[],
  links: NetworkLink[],
  devices: Device[],
  podId: string,
): FailoverResult {
  const nextLinks = links.map((link) => {
    if (link.podId !== podId) return link;
    if (link.kind === "primary") {
      return { ...link, failed: true, status: "failed" as const, utilization: 0 };
    }
    return {
      ...link,
      status: "active" as const,
      failed: false,
      delayMs: link.delayMs + 2.4,
    };
  });

  const nextPods = pods.map((pod) => {
    if (pod.podId !== podId) return pod;
    return {
      ...pod,
      status: "failover" as const,
      heartbeatStatus: "timeout" as const,
    };
  });

  // Explicit identity copy — threat score and security state are unchanged.
  const nextDevices = devices.map((device) => ({ ...device }));

  return { pods: nextPods, links: nextLinks, devices: nextDevices };
}

export function recalculateRoutes(links: NetworkLink[]): { active: number; failed: number } {
  let active = 0;
  let failed = 0;
  for (const link of links) {
    if (link.failed || link.status === "failed") {
      failed += 1;
      continue;
    }
    if (link.kind === "primary" || link.status === "active") {
      active += 1;
    }
  }
  return { active, failed };
}
