import type { DpqStats } from "@/models/types";
import { formatNumber } from "@/lib/utils";

const ROWS = [
  { key: "critical", label: "CRITICAL", drop: "criticalDrop", alloc: "critical" },
  { key: "high", label: "HIGH", drop: "highDrop", alloc: "high" },
  { key: "normal", label: "NORMAL", drop: "normalDrop", alloc: "normal" },
  { key: "background", label: "BACKGROUND", drop: "backgroundDrop", alloc: "background" },
] as const;

export function DpqMeters({ dpq }: { dpq: DpqStats }) {
  return (
    <div className="space-y-3">
      {ROWS.map((row) => {
        const fill = dpq[row.key];
        const drop = dpq[row.drop] * 100;
        const mbps = dpq.allocatedMbps[row.alloc];
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-mono text-muted">{row.label}</span>
              <span className="font-mono text-subtle tabular">
                {formatNumber(mbps, 2)} Mbps · {drop.toFixed(0)}% drop
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-elevated">
              <div className="h-full bg-accent" style={{ width: `${Math.min(100, fill)}%` }} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-subtle">
        Simulated DPQ / priority queue on the 1 Gbps distribution layer — not Linux traffic control.
        Capacity {formatNumber(dpq.capacityMbps, 0)} Mbps.
      </p>
    </div>
  );
}
