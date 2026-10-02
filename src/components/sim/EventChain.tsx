import { cn } from "@/lib/utils";
import type { EventType, SimulationState } from "@/models/types";

const PROCESS: Array<{ type: EventType | EventType[]; label: string }> = [
  { type: "TRAFFIC_STARTED", label: "Traffic Generated" },
  { type: "POLICY_VIOLATION", label: "Policy Evaluation" },
  { type: "PORT_SCAN_DETECTED", label: "Behavior Monitoring" },
  { type: "THREAT_SCORE_UPDATED", label: "Threat Score Update" },
  { type: "SECURITY_STATE_CHANGED", label: "Security State" },
  { type: ["DEVICE_THROTTLED", "DEVICE_ISOLATED", "DEVICE_BLOCKED"], label: "Decision" },
  { type: ["DEVICE_THROTTLED", "DEVICE_ISOLATED"], label: "Traffic Action" },
  { type: ["DEVICE_ISOLATED", "DEVICE_BLOCKED"], label: "Isolation / Quarantine" },
  { type: "STATE_SYNCHRONIZED", label: "Recovery" },
];

const ATTACK_CHAIN: Array<{ type: EventType; label: string }> = [
  { type: "ATTACK_INJECTED", label: "ATTACK" },
  { type: "POLICY_VIOLATION", label: "POLICY VIOLATION" },
  { type: "THREAT_SCORE_UPDATED", label: "THREAT SCORE ↑" },
  { type: "SECURITY_STATE_CHANGED", label: "ALERT" },
  { type: "DEVICE_THROTTLED", label: "THROTTLE" },
  { type: "DEVICE_ISOLATED", label: "ISOLATION" },
  { type: "DEVICE_BLOCKED", label: "QUARANTINE" },
];

const FAILURE_CHAIN: Array<{ type: EventType; label: string }> = [
  { type: "LINK_FAILURE", label: "LINK FAILURE" },
  { type: "HEARTBEAT_TIMEOUT", label: "HEARTBEAT TIMEOUT" },
  { type: "FAILOVER_ACTIVATED", label: "FAILOVER" },
  { type: "ROUTE_RECALCULATED", label: "ROUTE RECALCULATION" },
  { type: "STATE_SYNCHRONIZED", label: "RECOVERY" },
];

function occurred(state: SimulationState, type: EventType | EventType[]): boolean {
  const types = Array.isArray(type) ? type : [type];
  return state.events.some((e) => types.includes(e.eventType));
}

function Chain({
  title,
  steps,
  state,
}: {
  title: string;
  steps: Array<{ type: EventType | EventType[]; label: string }>;
  state: SimulationState;
}) {
  return (
    <div>
      <p className="kicker mb-3">{title}</p>
      <ol className="flex flex-col gap-0">
        {steps.map((step, index) => {
          const on = occurred(state, step.type);
          return (
            <li key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    on ? "bg-accent" : "bg-elevated",
                  )}
                />
                {index < steps.length - 1 ? (
                  <span className={cn("w-px flex-1", on ? "bg-accent/50" : "bg-border")} />
                ) : null}
              </div>
              <p className={cn("pb-3 font-mono text-xs", on ? "text-fg" : "text-subtle")}>{step.label}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function EventChain({ state }: { state: SimulationState }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Chain title="HZCN process" steps={PROCESS} state={state} />
      <Chain title="Attack chain" steps={ATTACK_CHAIN} state={state} />
      <Chain title="Failure chain" steps={FAILURE_CHAIN} state={state} />
    </div>
  );
}
