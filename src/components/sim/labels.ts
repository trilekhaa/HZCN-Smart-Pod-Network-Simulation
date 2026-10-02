import type { EventCategory, EventType, SecurityAction, SecurityState, ZoneId } from "@/models/types";
import { actionFromState as actionFromSecurityState } from "@/security/SecurityAction";

export const ZONE_LABEL: Record<ZoneId, string> = {
  academic: "Academic",
  student: "Student",
  administration: "Administration",
  surveillance: "Surveillance",
  iot: "IoT Laboratory",
};

export function actionFromState(state: SecurityState): SecurityAction {
  return actionFromSecurityState(state);
}

export function stateTone(state: SecurityState): "ok" | "warn" | "danger" | "default" | "muted" {
  switch (state) {
    case "CLEAR ACCESS":
      return "ok";
    case "HEURISTIC ALERT":
      return "warn";
    case "BANDWIDTH THROTTLED":
      return "default";
    case "RESTRICTED ISOLATION":
      return "warn";
    case "NETWORK-WIDE QUARANTINE":
      return "danger";
    default:
      return "muted";
  }
}

export function actionTone(action: SecurityAction): "ok" | "warn" | "danger" | "default" | "muted" {
  switch (action) {
    case "ALLOW":
      return "ok";
    case "MONITOR":
      return "warn";
    case "THROTTLE":
      return "default";
    case "ISOLATE":
      return "warn";
    case "QUARANTINE":
      return "danger";
    default:
      return "muted";
  }
}

export function eventTone(type: EventType): "ok" | "warn" | "danger" | "default" | "muted" {
  if (type.includes("BLOCKED") || type.includes("FAILURE") || type === "DEVICE_ISOLATED") return "danger";
  if (type.includes("THROTTLED") || type.includes("VIOLATION") || type.includes("SCAN") || type.includes("ATTACK")) {
    return "warn";
  }
  if (type.includes("FAILOVER") || type.includes("STARTED")) return "default";
  return "muted";
}

export const CATEGORY_EVENT_TYPES: Record<Exclude<EventCategory, "ALL">, EventType[]> = {
  SECURITY: [
    "POLICY_VIOLATION",
    "PORT_SCAN_DETECTED",
    "THREAT_SCORE_UPDATED",
    "SECURITY_STATE_CHANGED",
    "DEVICE_THROTTLED",
    "DEVICE_ISOLATED",
    "DEVICE_BLOCKED",
  ],
  TRAFFIC: ["TRAFFIC_STARTED", "CONGESTION_STARTED", "CONGESTION_STOPPED"],
  ATTACK: ["ATTACK_INJECTED"],
  FAILURE: [
    "LINK_FAILURE",
    "HEARTBEAT_TIMEOUT",
    "FAILOVER_ACTIVATED",
    "ROUTE_RECALCULATED",
    "STATE_SYNCHRONIZED",
  ],
  SYSTEM: ["SIMULATION_STARTED", "SIMULATION_PAUSED", "SIMULATION_COMPLETED", "SIMULATION_RESET"],
};
