import { AlertTriangle, Play, RotateCcw, Unplug, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimStore } from "@/store/simulation-store";

export function ControlRow() {
  const start = useSimStore((s) => s.start);
  const startCongestion = useSimStore((s) => s.startCongestion);
  const injectPrimaryAttack = useSimStore((s) => s.injectPrimaryAttack);
  const simulateFailure = useSimStore((s) => s.simulateFailure);
  const reset = useSimStore((s) => s.reset);
  const completed = useSimStore((s) => s.snapshot.scenario.completed);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={start} disabled={completed}>
        <Play className="size-3.5" />
        Start normal traffic
      </Button>
      <Button size="sm" variant="outline" onClick={startCongestion} disabled={completed}>
        <Waves className="size-3.5" />
        Start congestion
      </Button>
      <Button size="sm" variant="outline" onClick={injectPrimaryAttack} disabled={completed}>
        <AlertTriangle className="size-3.5" />
        Inject attack
      </Button>
      <Button size="sm" variant="outline" onClick={() => simulateFailure("POD-01")} disabled={completed}>
        <Unplug className="size-3.5" />
        Simulate link failure
      </Button>
      <Button size="sm" variant="ghost" onClick={reset}>
        <RotateCcw className="size-3.5" />
        Reset
      </Button>
    </div>
  );
}
