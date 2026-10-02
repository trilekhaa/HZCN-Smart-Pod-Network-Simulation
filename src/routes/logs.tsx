import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EventChain } from "@/components/sim/EventChain";
import { SimBanner } from "@/components/sim/SimBanner";
import { eventTone } from "@/components/sim/labels";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { EventCategory } from "@/models/types";
import { EVENT_CATEGORIES } from "@/models/types";
import { formatSimTimestamp } from "@/lib/utils";
import { useSimulation } from "@/store/simulation-store";

export const Route = createFileRoute("/logs")({ component: LogsPage });

function LogsPage() {
  const sim = useSimulation();
  const [category, setCategory] = useState<EventCategory>("ALL");

  const rows = useMemo(() => {
    if (category === "ALL") return sim.events;
    return sim.events.filter((e) => e.category === category);
  }, [sim.events, category]);

  return (
    <div className="space-y-6">
      <div>
        <SimBanner />
        <p className="kicker mt-2">Logs & events</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">Simulation audit trail</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Every control action, policy decision, state change, and failover is recorded from the same
          engine tick.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live event chain</CardTitle>
        </CardHeader>
        <CardContent>
          <EventChain state={sim} />
        </CardContent>
      </Card>

      <div className="max-w-xs">
        <Select value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}>
          {EVENT_CATEGORIES.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">t</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Zone</th>
              <th className="px-4 py-3 font-medium">Pod</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={9}>
                  No events in this filter.
                </td>
              </tr>
            ) : (
              rows.map((event) => (
                <tr key={event.id} className="border-b border-border/70 align-top">
                  <td className="px-4 py-3 font-mono text-xs text-accent tabular">
                    {formatSimTimestamp(event.simulationTime)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={eventTone(event.eventType)}>{event.eventType}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{event.deviceId || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted">{event.zone || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{event.podId || "—"}</td>
                  <td className="px-4 py-3 text-xs uppercase">{event.severity}</td>
                  <td className="px-4 py-3 text-xs text-muted">{event.oldState || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted">{event.newState || "—"}</td>
                  <td className="px-4 py-3 text-xs">{event.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-subtle">{rows.length} events</p>
    </div>
  );
}
