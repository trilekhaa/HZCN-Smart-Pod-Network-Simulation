import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StateBadge } from "@/components/sim/StateBadge";
import { Badge } from "@/components/ui/badge";
import { ZONE_LABEL, actionFromState, actionTone } from "@/components/sim/labels";
import { formatInteger, formatNumber, formatSimTimestamp } from "@/lib/utils";
import type { Device, SimEvent } from "@/models/types";
import { currentRoute } from "@/security/SecurityAction";
import { useSimStore } from "@/store/simulation-store";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-2 border-b border-border py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono text-fg tabular">{value}</dd>
    </div>
  );
}

function MiniSpark({ values, color = "var(--color-accent)" }: { values: number[]; color?: string }) {
  if (values.length < 2) {
    return <p className="text-xs text-muted">N/A</p>;
  }
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const w = 220;
  const h = 48;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / Math.max(max - min, 1)) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.6" points={pts} />
    </svg>
  );
}

export function DeviceDrawer() {
  const selected = useSimStore((s) => s.selectedDeviceId);
  const select = useSimStore((s) => s.selectDevice);
  const snapshot = useSimStore((s) => s.snapshot);
  const device: Device | undefined = snapshot.devices.find(
    (d) => d.id === selected || d.deviceName === selected,
  );
  const events: SimEvent[] = device
    ? snapshot.events.filter((e) => e.deviceId === device.deviceName).slice(0, 8)
    : [];
  const pod = device ? snapshot.pods.find((p) => p.podId === device.connectedPod) : undefined;
  const backup = pod ? snapshot.links.find((l) => l.id === pod.backupLink) : undefined;
  const route = device ? currentRoute(device, backup?.status === "active") : null;
  const action = device ? actionFromState(device.currentSecurityState) : null;

  return (
    <Sheet open={Boolean(device)} onOpenChange={(open) => !open && select(null)}>
      {device ? (
        <SheetContent title={device.deviceName} side="right">
          <div className="px-5 py-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StateBadge state={device.currentSecurityState} />
              {action ? <Badge variant={actionTone(action)}>{action}</Badge> : null}
              <span className="text-xs text-muted">{device.role}</span>
            </div>
            <dl>
              <Field label="Device ID" value={device.deviceId} />
              <Field label="IP address" value={device.ipAddress} />
              <Field label="Zone" value={ZONE_LABEL[device.zone]} />
              <Field label="Smart Pod" value={device.connectedPod} />
              <Field label="Device type" value={device.deviceType} />
              <Field label="Packet rate" value={`${formatNumber(device.packetRate, 1)} pps`} />
              <Field label="Threat score" value={formatNumber(device.threatScore, 1)} />
              <Field label="Security state" value={device.currentSecurityState} />
              <Field label="Current action" value={action ?? "—"} />
              <Field label="Policy violations" value={formatInteger(device.policyViolations)} />
              <Field
                label="Destination ports"
                value={device.destinationPorts.length ? device.destinationPorts.join(", ") : "—"}
              />
              <Field
                label="Current route"
                value={route ? `${route.hops.join(" → ")}${route.blocked ? " (blocked)" : ""}` : "—"}
              />
              <Field
                label="Isolation latency"
                value={device.isolationLatencyMs == null ? "N/A" : `${Math.round(device.isolationLatencyMs)} ms`}
              />
              <Field label="Last event" value={device.lastEvent || "—"} />
            </dl>
            <p className="kicker mt-6 mb-2">Threat score history</p>
            <MiniSpark values={device.threatHistory} color="var(--color-danger)" />
            <p className="kicker mt-4 mb-2">Packet rate history</p>
            <MiniSpark values={device.packetRateHistory} />
            <p className="kicker mt-4 mb-2">Security state history</p>
            <ul className="space-y-1 text-xs">
              {device.stateHistory.length === 0 ? (
                <li className="text-muted">N/A</li>
              ) : (
                device.stateHistory.map((sample, i) => (
                  <li key={`${sample.t}-${i}`} className="font-mono text-muted">
                    {formatSimTimestamp(sample.t)} · {sample.state}
                  </li>
                ))
              )}
            </ul>
            <p className="kicker mt-6 mb-2">Recent events</p>
            <ul className="space-y-2">
              {events.length === 0 ? (
                <li className="text-sm text-muted">No device events yet.</li>
              ) : (
                events.map((event) => (
                  <li key={event.id} className="rounded-lg bg-elevated px-3 py-2 text-xs">
                    <p className="font-mono text-accent">
                      {formatSimTimestamp(event.simulationTime)} · {event.eventType}
                    </p>
                    <p className="mt-1 text-muted">{event.description}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </SheetContent>
      ) : null}
    </Sheet>
  );
}
