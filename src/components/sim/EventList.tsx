import { eventTone } from "@/components/sim/labels";
import { Badge } from "@/components/ui/badge";
import { formatSimTimestamp } from "@/lib/utils";
import type { SimEvent } from "@/models/types";

export function EventList({ events, empty = "No events yet." }: { events: SimEvent[]; empty?: string }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {events.map((event) => (
        <li key={event.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-accent tabular">
              {formatSimTimestamp(event.simulationTime)}
            </span>
            <Badge variant={eventTone(event.eventType)}>{event.eventType}</Badge>
            {event.deviceId ? <span className="text-xs text-muted">{event.deviceId}</span> : null}
          </div>
          <p className="text-sm text-fg/90">{event.description}</p>
        </li>
      ))}
    </ul>
  );
}
