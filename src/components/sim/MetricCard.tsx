import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  tone = "accent",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "accent" | "ok" | "warn" | "danger" | "fg";
}) {
  const valueClass =
    tone === "ok"
      ? "text-ok"
      : tone === "warn"
        ? "text-warn"
        : tone === "danger"
          ? "text-danger"
          : tone === "fg"
            ? "text-fg"
            : "text-accent";

  return (
    <Card className="px-4 py-4">
      <p className="kicker">{label}</p>
      <p className={cn("mt-2 font-mono text-2xl tracking-tight tabular", valueClass)}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </Card>
  );
}
