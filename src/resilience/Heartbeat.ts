import { HEARTBEAT_TIMEOUT } from "@/models/types";
import type { NetworkLink, SmartPod } from "@/models/types";

export interface HeartbeatResult {
  timeout: boolean;
  podId: string;
  linkId: string;
}

export function checkHeartbeat(
  pod: SmartPod,
  primary: NetworkLink,
  simTime: number,
): HeartbeatResult {
  if (primary.failed || primary.status === "failed") {
    const elapsed = simTime - pod.lastHeartbeat;
    return {
      timeout: elapsed + 1e-9 >= HEARTBEAT_TIMEOUT,
      podId: pod.podId,
      linkId: primary.id,
    };
  }
  return { timeout: false, podId: pod.podId, linkId: primary.id };
}

export function beat(pod: SmartPod, simTime: number): SmartPod {
  return { ...pod, lastHeartbeat: simTime, heartbeatStatus: "ok" };
}
