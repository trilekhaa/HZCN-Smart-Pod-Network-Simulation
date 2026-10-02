import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSimTime } from "@/lib/utils";
import { SCHEDULED_ATTACK_AT, SCHEDULED_FAILURE_AT, SIM_SPEEDS, SIMULATION_DURATION } from "@/models/types";
import type { SimSpeed } from "@/models/types";
import { useSimStore } from "@/store/simulation-store";

export function ClockBar() {
  const snapshot = useSimStore((s) => s.snapshot);
  const speed = useSimStore((s) => s.speed);
  const setSpeed = useSimStore((s) => s.setSpeed);
  const start = useSimStore((s) => s.start);
  const pause = useSimStore((s) => s.pause);
  const resume = useSimStore((s) => s.resume);
  const reset = useSimStore((s) => s.reset);
  const progress = (snapshot.currentTime / SIMULATION_DURATION) * 100;
  const canResume = !snapshot.running && snapshot.currentTime > 0 && !snapshot.scenario.completed;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="kicker">Simulation time</span>
        <span className="font-mono text-lg text-accent tabular">
          {formatSimTime(snapshot.currentTime)}
          <span className="text-muted"> / {formatSimTime(SIMULATION_DURATION)}</span>
        </span>
        {snapshot.scenario.completed ? (
          <span className="text-xs text-muted">Complete</span>
        ) : snapshot.running ? (
          <span className="text-xs text-ok">Running</span>
        ) : canResume ? (
          <span className="text-xs text-muted">Paused</span>
        ) : (
          <span className="text-xs text-muted">Idle</span>
        )}
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-elevated">
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
        <span
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-warn"
          style={{ left: `${(SCHEDULED_ATTACK_AT / SIMULATION_DURATION) * 100}%` }}
          title="Attack at 45s"
        />
        <span
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-danger"
          style={{ left: `${(SCHEDULED_FAILURE_AT / SIMULATION_DURATION) * 100}%` }}
          title="Link failure at 75s"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {snapshot.running ? (
          <Button size="sm" variant="outline" className="min-h-11 sm:min-h-9" onClick={pause}>
            <Pause className="size-3.5" />
            Pause
          </Button>
        ) : canResume ? (
          <Button size="sm" className="min-h-11 sm:min-h-9" onClick={resume}>
            <Play className="size-3.5" />
            Resume
          </Button>
        ) : (
          <Button size="sm" className="min-h-11 sm:min-h-9" onClick={start} disabled={snapshot.scenario.completed}>
            <Play className="size-3.5" />
            Start
          </Button>
        )}
        <Button size="sm" variant="ghost" className="min-h-11 sm:min-h-9" onClick={reset}>
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
        <div className="flex flex-wrap items-center gap-1">
          <span className="pr-1 text-[0.65rem] tracking-[0.14em] text-subtle uppercase">Speed</span>
          {SIM_SPEEDS.map((value) => (
            <Button
              key={value}
              size="sm"
              variant={speed === value ? "default" : "outline"}
              className="min-h-11 min-w-11 px-2 sm:min-h-9 sm:min-w-9"
              onClick={() => setSpeed(value as SimSpeed)}
            >
              {value}x
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
