import { PAPER_ISOLATION_LATENCY_MS } from "@/models/types";
import type { SimulationState } from "@/models/types";
import { formatNumber, formatMeasured, formatSimTimestamp } from "@/lib/utils";
import { MetricCard } from "@/components/sim/MetricCard";

export function HzcnMetrics({ state }: { state: SimulationState }) {
  const history = state.history;
  const maxThreat = history.length ? Math.max(...history.map((h) => h.maxThreat)) : null;
  const peakThru = history.length ? Math.max(...history.map((h) => h.throughput)) : null;
  const last = history[history.length - 1];
  const dpq = state.dpq.allocatedMbps;

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        <MetricCard
          label="Maximum threat score"
          value={maxThreat == null ? "N/A" : formatNumber(maxThreat, 1)}
        />
        <MetricCard label="Policy violations" value={String(state.counters.policyViolations)} />
        <MetricCard label="Blocked packets" value={String(Math.round(state.counters.packetsBlocked))} />
        <MetricCard label="Throttled packets" value={String(Math.round(state.counters.packetsThrottled))} />
        <MetricCard label="Isolated devices" value={String(state.security.isolated)} />
        <MetricCard label="Quarantined devices" value={String(state.security.blocked)} />
        <MetricCard
          label="Isolation latency"
          value={formatMeasured(state.metrics.isolationLatencyMs, " ms")}
          hint="Measured in this simulation"
        />
        <MetricCard
          label="Failover detection"
          value={
            state.failover.primaryFailureDetectedAt == null
              ? "N/A"
              : formatSimTimestamp(state.failover.primaryFailureDetectedAt)
          }
        />
        <MetricCard
          label="Failover duration"
          value={formatMeasured(state.failover.failoverDurationMs, " ms")}
          hint={`Heartbeat timeout ${state.failover.heartbeatTimeoutMs} ms configured`}
        />
        <MetricCard
          label="Core link utilization"
          value={last ? `${formatNumber(last.coreUtilization * 100, 2)}%` : "N/A"}
          hint="Simulated 1 Gbps core/distribution link"
        />
        <MetricCard
          label="Packet delivery ratio"
          value={last ? `${formatNumber(last.pdr, 1)}%` : "N/A"}
        />
        <MetricCard
          label="Average delay"
          value={last ? `${formatNumber(last.delay, 1)} ms` : "N/A"}
        />
        <MetricCard
          label="Throughput"
          value={last ? `${formatNumber(last.throughput, 2)} Mbps` : "N/A"}
          hint={peakThru == null ? undefined : `Peak ${formatNumber(peakThru, 2)} Mbps`}
        />
        <MetricCard
          label="DPQ CRITICAL"
          value={`${formatNumber(dpq.critical, 2)} Mbps`}
          hint="Allocated on 1 Gbps distribution layer"
        />
        <MetricCard label="DPQ HIGH" value={`${formatNumber(dpq.high, 2)} Mbps`} />
        <MetricCard label="DPQ NORMAL" value={`${formatNumber(dpq.normal, 2)} Mbps`} />
      </section>
      <p className="text-xs text-subtle">
        Isolation latency is measured from this engine's timestamps (0.1 s precision). Paper / NS-3 reported
        {" <"}
        {PAPER_ISOLATION_LATENCY_MS} ms is a separate result.
      </p>
    </div>
  );
}
