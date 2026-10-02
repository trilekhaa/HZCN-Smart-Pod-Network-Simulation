import { PAPER_ISOLATION_LATENCY_MS } from "@/models/types";
import type { SimulationState } from "@/models/types";
import { formatNumber } from "@/lib/utils";
import { buildSimulationSummary, na } from "@/simulation/summary";

export function SimulationSummary({ state }: { state: SimulationState }) {
  if (!state.scenario.completed) return null;
  const s = buildSimulationSummary(state);
  const rows: Array<[string, string]> = [
    ["Duration", `${s.duration} sec`],
    ["Devices", String(s.devices)],
    ["Zones", String(s.zones)],
    ["Smart Pods", String(s.smartPods)],
    ["Attacks detected", String(s.attacksDetected)],
    ["Policy violations", String(s.policyViolations)],
    ["Maximum threat score", na(s.maximumThreatScore, (n) => formatNumber(n, 1))],
    ["Devices isolated", String(s.devicesIsolated)],
    ["Devices quarantined", String(s.devicesQuarantined)],
    ["Packets blocked", String(s.packetsBlocked)],
    ["Peak throughput", na(s.peakThroughput, (n) => `${formatNumber(n, 2)} Mbps`)],
    ["Average delay", na(s.averageDelay, (n) => `${formatNumber(n, 1)} ms`)],
    ["Packet delivery ratio", na(s.packetDeliveryRatio, (n) => `${formatNumber(n * 100, 1)}%`)],
    ["Measured isolation latency", na(s.isolationLatencyMs, (n) => `${Math.round(n)} ms`)],
    ["Measured failover duration", na(s.failoverDurationMs, (n) => `${Math.round(n)} ms`)],
  ];

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="kicker">Simulation complete</p>
      <h3 className="mt-1 text-lg font-medium">Measured in this simulation</h3>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.7rem] text-muted">{label}</dt>
            <dd className="font-mono text-sm text-accent tabular">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-subtle">
        Paper / NS-3 reported isolation: {"<"}
        {PAPER_ISOLATION_LATENCY_MS} ms. That figure is not a result of
        this JavaScript simulation.
      </p>
    </section>
  );
}
