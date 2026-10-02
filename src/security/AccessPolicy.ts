import type { Device, TrafficFlow, ZoneId } from "@/models/types";

export type PolicyDecision = "ALLOW" | "DENY" | "LIMITED";

export const POLICY_MATRIX: Record<ZoneId, Record<ZoneId, PolicyDecision>> = {
  academic: {
    academic: "ALLOW",
    student: "LIMITED",
    administration: "DENY",
    surveillance: "DENY",
    iot: "LIMITED",
  },
  student: {
    academic: "LIMITED",
    student: "ALLOW",
    administration: "DENY",
    surveillance: "DENY",
    iot: "DENY",
  },
  administration: {
    academic: "LIMITED",
    student: "LIMITED",
    administration: "ALLOW",
    surveillance: "LIMITED",
    iot: "LIMITED",
  },
  surveillance: {
    academic: "DENY",
    student: "DENY",
    administration: "LIMITED",
    surveillance: "ALLOW",
    iot: "DENY",
  },
  iot: {
    academic: "LIMITED",
    student: "DENY",
    administration: "DENY",
    surveillance: "DENY",
    iot: "ALLOW",
  },
};

/** Permitted destination ports for LIMITED cross-zone pairs. */
export const LIMITED_PORTS: Partial<Record<ZoneId, Partial<Record<ZoneId, number[]>>>> = {
  student: {
    academic: [53, 80, 443, 8080],
  },
  academic: {
    student: [80, 443, 8080],
    iot: [443, 1883],
  },
  administration: {
    academic: [22, 80, 443, 8080],
    student: [443],
    surveillance: [443, 554],
    iot: [443, 1883],
  },
  surveillance: {
    administration: [443, 6514],
  },
  iot: {
    academic: [443, 1883],
  },
};

export const ZONE_LABEL: Record<ZoneId, string> = {
  academic: "Academic",
  student: "Student",
  administration: "Administration",
  surveillance: "Surveillance",
  iot: "IoT Laboratory",
};

export function inspectFlow(
  source: Device,
  destination: Device,
  destinationPort: number,
): { allowed: boolean; decision: PolicyDecision; reason: string } {
  if (source.zone === destination.zone) {
    return { allowed: true, decision: "ALLOW", reason: "Intra-zone traffic" };
  }

  const decision = POLICY_MATRIX[source.zone][destination.zone];
  if (decision === "ALLOW") {
    return { allowed: true, decision, reason: "Zone policy allow" };
  }
  if (decision === "DENY") {
    return {
      allowed: false,
      decision,
      reason: `${ZONE_LABEL[source.zone]} → ${ZONE_LABEL[destination.zone]} denied by Smart Pod policy`,
    };
  }

  const ports = LIMITED_PORTS[source.zone]?.[destination.zone] ?? [];
  if (ports.includes(destinationPort)) {
    return {
      allowed: true,
      decision: "LIMITED",
      reason: `Permitted academic/designated service on port ${destinationPort}`,
    };
  }

  return {
    allowed: false,
    decision: "LIMITED",
    reason: `Port ${destinationPort} is not a designated service for ${ZONE_LABEL[source.zone]} → ${ZONE_LABEL[destination.zone]}`,
  };
}

export function applyPolicy(flow: TrafficFlow, source: Device, destination: Device): TrafficFlow {
  const result = inspectFlow(source, destination, flow.destinationPort);
  if (!result.allowed) {
    return {
      ...flow,
      allowed: false,
      dropped: true,
      dropReason: result.reason,
    };
  }
  return { ...flow, allowed: true, dropped: false, dropReason: "" };
}
