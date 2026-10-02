import { cn, formatSimTimestamp } from "@/lib/utils";
import { SCHEDULED_ATTACK_AT, SCHEDULED_FAILURE_AT, SIMULATION_DURATION } from "@/models/types";
import type { SimulationState } from "@/models/types";

const MARKS = [
  { t: 0, title: "Normal campus operation", body: "Core → Smart Pod → devices. Policy Enforcement Point idle." },
  {
    t: SCHEDULED_ATTACK_AT,
    title: "Attack begins",
    body: "Student-zone device attempts restricted Administration access, rapid multi-port probing, and a raised traffic rate.",
  },
  {
    t: SCHEDULED_FAILURE_AT,
    title: "Academic pod primary link failure",
    body: "Heartbeat timeout, failure detection, backup activation, route recalculation, service recovery.",
  },
  { t: SIMULATION_DURATION, title: "Simulation complete", body: "Deterministic 120-second demonstration ends." },
];

export function ScenarioTimeline({ state }: { state: SimulationState }) {
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {MARKS.map((mark) => {
        const reached = state.currentTime >= mark.t;
        const active =
          state.currentTime >= mark.t &&
          (MARKS.find((m) => m.t > mark.t)?.t ?? SIMULATION_DURATION + 1) > state.currentTime;
        return (
          <li
            key={mark.t}
            className={cn(
              "rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
              active && "shadow-[var(--shadow-border-hover)]",
            )}
          >
            <p className={cn("font-mono text-xs", reached ? "text-accent" : "text-subtle")}>
              {formatSimTimestamp(mark.t)}
            </p>
            <p className="mt-1 text-sm font-medium">{mark.title}</p>
            <p className="mt-1 text-xs text-muted">{mark.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
