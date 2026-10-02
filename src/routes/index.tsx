import { createFileRoute } from "@tanstack/react-router";
import { SecurityBar, ThreatChart, ThroughputChart } from "@/components/charts/SimChart";
import { ControlRow } from "@/components/sim/ControlRow";
import { DpqMeters } from "@/components/sim/DpqMeters";
import { EventChain } from "@/components/sim/EventChain";
import { EventList } from "@/components/sim/EventList";
import { MetricCard } from "@/components/sim/MetricCard";
import { ScenarioTimeline } from "@/components/sim/ScenarioTimeline";
import { SimBanner } from "@/components/sim/SimBanner";
import { SimulationSummary } from "@/components/sim/SimulationSummary";
import { TopologyView } from "@/components/topology/TopologyView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { useSimulation } from "@/store/simulation-store";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const sim = useSimulation();
  const healthTone =
    sim.metrics.networkHealth >= 80 ? "ok" : sim.metrics.networkHealth >= 55 ? "warn" : "danger";

  return (
    <div className="space-y-6">
      <div>
        <SimBanner />
        <p className="kicker mt-2">Dashboard</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">Campus simulation overview</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          One shared engine drives every panel. Metrics are computed from virtual devices, Smart Pods, and
          simulated flows — not a live network.
        </p>
      </div>

      <ControlRow />
      <ScenarioTimeline state={sim} />
      <SimulationSummary state={sim} />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Total devices" value={String(sim.devices.length)} hint="120 virtual endpoints" tone="fg" />
        <MetricCard
          label="Active Smart Pods"
          value={String(sim.pods.filter((p) => p.status !== "offline").length)}
          hint="8 Policy Enforcement Points"
          tone="fg"
        />
        <MetricCard
          label="Throughput"
          value={`${formatNumber(sim.metrics.throughput, 2)} Mbps`}
          hint="Delivered traffic"
        />
        <MetricCard
          label="Average delay"
          value={`${formatNumber(sim.metrics.averageDelay, 1)} ms`}
          hint="Core-to-pod path"
        />
        <MetricCard
          label="Packet loss"
          value={`${formatNumber(sim.metrics.packetLoss * 100, 2)}%`}
          hint="Offered vs delivered"
          tone={sim.metrics.packetLoss > 0.05 ? "warn" : "accent"}
        />
        <MetricCard
          label="Network health"
          value={formatNumber(sim.metrics.networkHealth, 0)}
          hint={`PDR ${formatNumber(sim.metrics.packetDeliveryRatio * 100, 1)}%`}
          tone={healthTone}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Core topology</CardTitle>
          </CardHeader>
          <CardContent>
            <TopologyView compact />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <SecurityBar {...sim.security} />
          <Card>
            <CardHeader>
              <CardTitle>DPQ / priority queue</CardTitle>
            </CardHeader>
            <CardContent>
              <DpqMeters dpq={sim.dpq} />
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Event chain</CardTitle>
        </CardHeader>
        <CardContent>
          <EventChain state={sim} />
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <ThreatChart data={sim.history} />
        <ThroughputChart data={sim.history} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent events</CardTitle>
          </CardHeader>
          <CardContent>
            <EventList events={sim.events.slice(0, 8)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <EventList
              events={sim.events
                .filter((e) => e.severity === "high" || e.severity === "critical")
                .slice(0, 8)}
              empty="No active alerts."
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
