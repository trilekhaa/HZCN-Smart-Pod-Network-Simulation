import { createFileRoute } from "@tanstack/react-router";
import { FailoverSequence } from "@/components/sim/FailoverSequence";
import { SimBanner } from "@/components/sim/SimBanner";
import { TopologyView } from "@/components/topology/TopologyView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulation } from "@/store/simulation-store";

export const Route = createFileRoute("/topology")({ component: TopologyPage });

function TopologyPage() {
  const sim = useSimulation();
  return (
    <div className="space-y-6">
      <div>
        <SimBanner />
        <p className="kicker mt-2">Campus topology</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">Virtual network map</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Core switch, five security zones, eight Smart Pods, and 120 virtual devices. Lines are the
          simulated Core → Smart Pod → device-group fabric. Click a device for details.
        </p>
      </div>
      <TopologyView />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {sim.pods.map((pod) => {
            const primary = sim.links.find((l) => l.id === pod.primaryLink);
            const backup = sim.links.find((l) => l.id === pod.backupLink);
            return (
              <Card key={pod.id}>
                <CardHeader>
                  <CardTitle>
                    {pod.podId} · {pod.podName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-xs text-muted">
                  <p>Status {pod.status}</p>
                  <p>Heartbeat {pod.heartbeatStatus}</p>
                  <p>
                    Primary {primary?.status} · Backup {backup?.status}
                  </p>
                  <p>{pod.connectedDevices.length} attached devices</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Failover sequence</CardTitle>
          </CardHeader>
          <CardContent>
            <FailoverSequence failover={sim.failover} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
