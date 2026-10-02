import type { SecurityAction, SecurityState } from "@/models/types";

/** Enforcement action currently applied by the Policy Enforcement Point. */
export function actionFromState(state: SecurityState): SecurityAction {
  switch (state) {
    case "HEURISTIC ALERT":
      return "MONITOR";
    case "BANDWIDTH THROTTLED":
      return "THROTTLE";
    case "RESTRICTED ISOLATION":
      return "ISOLATE";
    case "NETWORK-WIDE QUARANTINE":
      return "QUARANTINE";
    default:
      return "ALLOW";
  }
}

export function currentRoute(device: {
  connectedPod: string;
  currentSecurityState: SecurityState;
  status: string;
}, backupActive: boolean): { hops: string[]; via: "primary" | "backup" | "blocked"; blocked: boolean } {
  if (
    device.currentSecurityState === "NETWORK-WIDE QUARANTINE" ||
    device.currentSecurityState === "RESTRICTED ISOLATION"
  ) {
    return {
      hops: ["CORE-01", backupActive ? "BACKUP LINK" : "PRIMARY LINK", device.connectedPod, device.currentSecurityState],
      via: "blocked",
      blocked: true,
    };
  }
  if (backupActive) {
    return {
      hops: ["CORE-01", "BACKUP LINK", device.connectedPod],
      via: "backup",
      blocked: false,
    };
  }
  return {
    hops: ["CORE-01", "PRIMARY LINK", device.connectedPod],
    via: "primary",
    blocked: false,
  };
}
