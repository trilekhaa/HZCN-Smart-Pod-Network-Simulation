import { HEARTBEAT_TIMEOUT } from "@/models/types";
import type { FailoverTiming } from "@/models/types";
import { cn, formatMeasured, formatSimTimestamp } from "@/lib/utils";

export function FailoverSequence({ failover }: { failover: FailoverTiming }) {
  const idle = failover.phase === "idle";
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="kicker">Heartbeat timeout</p>
          <p className="mt-1 font-mono text-accent tabular">{HEARTBEAT_TIMEOUT * 1000} ms</p>
          <p className="text-xs text-subtle">Configured</p>
        </div>
        <div>
          <p className="kicker">Measured failover time</p>
          <p className="mt-1 font-mono text-accent tabular">
            {formatMeasured(failover.failoverDurationMs, " ms")}
          </p>
          <p className="text-xs text-subtle">Measured in this simulation</p>
        </div>
      </div>
      <ol>
        {(idle
          ? [
              "PRIMARY LINK FAILURE",
              "HEARTBEAT TIMEOUT",
              "FAILURE DETECTED",
              "BACKUP LINK ACTIVATED",
              "ROUTE RECALCULATED",
              "TRAFFIC RESTORED",
            ].map((label) => ({ at: null as number | null, label }))
          : failover.sequence
        ).map((step, index, all) => {
          const on = !idle && step.at != null;
          return (
            <li key={`${step.label}-${index}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={cn("size-2.5 rounded-full", on ? "bg-accent" : "bg-elevated")} />
                {index < all.length - 1 ? (
                  <span className={cn("w-px flex-1 min-h-4", on ? "bg-accent/50" : "bg-border")} />
                ) : null}
              </div>
              <p className={cn("pb-3 font-mono text-xs", on ? "text-fg" : "text-subtle")}>
                {step.label}
                {on && step.at != null ? (
                  <span className="text-muted"> · {formatSimTimestamp(step.at)}</span>
                ) : null}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
