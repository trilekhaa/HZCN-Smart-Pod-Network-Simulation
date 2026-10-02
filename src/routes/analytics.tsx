import { createFileRoute } from "@tanstack/react-router";
import {
  ActiveDevicesChart,
  CountsChart,
  DelayChart,
  LossChart,
  PdrChart,
  SecurityTrendChart,
  ThreatChart,
  ThroughputChart,
  ZoneTrafficChart,
} from "@/components/charts/SimChart";
import { DpqMeters } from "@/components/sim/DpqMeters";
import { HzcnMetrics } from "@/components/sim/HzcnMetrics";
import { SimBanner } from "@/components/sim/SimBanner";
import { SimulationSummary } from "@/components/sim/SimulationSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulation } from "@/store/simulation-store";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const sim = useSimulation();
  const empty = sim.history.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <SimBanner />
        <p className="kicker mt-2">Network analytics</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">Computed from the live engine</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Every series is a history buffer written once per simulated second. Unmeasured values show N/A.
        </p>
      </div>
      <HzcnMetrics state={sim} />
      <SimulationSummary state={sim} />
      {empty ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted">
            No samples yet. Start the simulation to record throughput, delay, loss, and threat history.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ThroughputChart data={sim.history} />
          <LossChart data={sim.history} />
          <PdrChart data={sim.history} />
          <DelayChart data={sim.history} />
          <ThreatChart data={sim.history} />
          <ZoneTrafficChart data={sim.history} />
          <ActiveDevicesChart data={sim.history} />
          <SecurityTrendChart data={sim.history} />
          <CountsChart data={sim.history} />
          <Card>
            <CardHeader>
              <CardTitle>DPQ class pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <DpqMeters dpq={sim.dpq} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
