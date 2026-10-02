import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EventChain } from "@/components/sim/EventChain";
import { EventList } from "@/components/sim/EventList";
import { FailoverSequence } from "@/components/sim/FailoverSequence";
import { ScenarioTimeline } from "@/components/sim/ScenarioTimeline";
import { SimBanner } from "@/components/sim/SimBanner";
import { StateBadge } from "@/components/sim/StateBadge";
import { ZONE_LABEL, actionFromState } from "@/components/sim/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { POLICY_MATRIX } from "@/security/AccessPolicy";
import type { AttackType, ZoneId } from "@/models/types";
import { ATTACK_TYPES, PAPER_ISOLATION_LATENCY_MS, PRIMARY_ATTACK_DEVICE, PRIMARY_ATTACK_TARGET } from "@/models/types";
import { formatMeasured } from "@/lib/utils";
import { useSimStore, useSimulation } from "@/store/simulation-store";

export const Route = createFileRoute("/attack")({ component: AttackPage });

const ATTACK_LABEL: Record<AttackType, string> = {
  "cross-zone": "Cross-Zone Access",
  "port-scan": "Port Scan",
  "traffic-flood": "Traffic Flood",
  combined: "Combined Attack",
};

function AttackPage() {
  const sim = useSimulation();
  const inject = useSimStore((s) => s.injectAttack);
  const injectPrimary = useSimStore((s) => s.injectPrimaryAttack);
  const [type, setType] = useState<AttackType>("combined");
  const [deviceId, setDeviceId] = useState(PRIMARY_ATTACK_DEVICE);
  const [targetId, setTargetId] = useState(PRIMARY_ATTACK_TARGET);

  const students = useMemo(
    () => sim.devices.filter((d) => d.zone === "student").map((d) => d.deviceName),
    [sim.devices],
  );
  const target = sim.devices.find((d) => d.deviceName === targetId);
  const source = sim.devices.find((d) => d.deviceName === deviceId);
  const attackEvents = sim.events.filter(
    (e) =>
      e.category === "ATTACK" ||
      e.eventType === "POLICY_VIOLATION" ||
      e.eventType === "PORT_SCAN_DETECTED" ||
      e.deviceId === deviceId,
  ).slice(0, 12);
  const attackerTiming = sim.isolations.find((i) => i.deviceId === (source?.deviceName ?? PRIMARY_ATTACK_DEVICE));

  return (
    <div className="space-y-6">
      <div>
        <SimBanner />
        <p className="kicker mt-2">Attack simulation</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">Inject simulated adversarial traffic</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Nothing here is captured from a real campus. Attacks are generated inside the JavaScript engine
          and scored by the same Smart Pod pipeline used on every other page.
        </p>
      </div>

      <ScenarioTimeline state={sim} />

      <Card>
        <CardHeader>
          <CardTitle>Primary research scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>
            At simulation time 45s, <span className="text-fg">{PRIMARY_ATTACK_DEVICE}</span> in the Student
            zone issues cross-zone TCP toward <span className="text-fg">{PRIMARY_ATTACK_TARGET}</span>, then
            ramps into rapid multi-port probing and a high packet-rate flood.
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Policy violation at the Student Smart Pod</li>
            <li>Behavior window records port traversal and rate spike</li>
            <li>Threat score increases with decayed history</li>
            <li>Security state walks toward throttle / isolation / quarantine</li>
            <li>Forwarding restrictions change topology, analytics, and logs together</li>
          </ol>
          <Button onClick={injectPrimary}>Run primary scenario now</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Manual inject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="block text-xs text-muted">
              Attack type
              <Select className="mt-1" value={type} onChange={(e) => setType(e.target.value as AttackType)}>
                {ATTACK_TYPES.map((id) => (
                  <option key={id} value={id}>
                    {ATTACK_LABEL[id]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block text-xs text-muted">
              Source device
              <Select className="mt-1" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
                {students.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block text-xs text-muted">
              Target service
              <Select className="mt-1" value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                {sim.devices
                  .filter((d) => d.zone === "administration" || d.deviceType === "exam-server")
                  .map((d) => (
                    <option key={d.id} value={d.deviceName}>
                      {d.deviceName} · {d.role}
                    </option>
                  ))}
              </Select>
            </label>
            <p className="text-xs text-subtle">
              Target zone: {target ? ZONE_LABEL[target.zone] : "—"} · Service: {target?.role ?? "—"}
            </p>
            <Button
              onClick={() =>
                inject({
                  type,
                  deviceId,
                  targetDeviceId: targetId,
                  targetZone: (target?.zone ?? "administration") as ZoneId,
                  targetService: target?.role,
                })
              }
            >
              Inject attack
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observed subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {source ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono">{source.deviceName}</span>
                  <StateBadge state={source.currentSecurityState} />
                  <span className="text-xs text-muted">{actionFromState(source.currentSecurityState)}</span>
                </div>
                <p className="text-muted">
                  Pod {source.connectedPod} · {source.ipAddress}
                </p>
                <p className="font-mono text-accent">Threat {source.threatScore.toFixed(1)}</p>
                <p className="text-muted">Packet rate {source.packetRate.toFixed(1)} pps</p>
                <p className="text-muted">
                  Ports {source.destinationPorts.join(", ") || "—"} · Violations {source.policyViolations}
                </p>
                <p className="text-xs text-muted">
                  Isolation latency (this simulation): {formatMeasured(attackerTiming?.isolationLatencyMs, " ms")}
                </p>
                <p className="text-xs text-subtle">
                  Paper / NS-3 reported: {"<"}
                  {PAPER_ISOLATION_LATENCY_MS} ms — not this run.
                </p>
              </>
            ) : null}
            <div className="pt-2">
              <p className="kicker mb-2">Detection feed</p>
              <EventList events={attackEvents} empty="No attack observations yet." />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event chain</CardTitle>
          </CardHeader>
          <CardContent>
            <EventChain state={sim} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Link failure / failover</CardTitle>
          </CardHeader>
          <CardContent>
            <FailoverSequence failover={sim.failover} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zone access matrix</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-xs">
            <thead>
              <tr className="text-muted">
                <th className="py-2 pr-3">From \ To</th>
                {Object.keys(POLICY_MATRIX).map((to) => (
                  <th key={to} className="py-2 pr-3">
                    {ZONE_LABEL[to as ZoneId]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(POLICY_MATRIX) as ZoneId[]).map((from) => (
                <tr key={from} className="border-t border-border">
                  <td className="py-2 pr-3 text-fg">{ZONE_LABEL[from]}</td>
                  {(Object.keys(POLICY_MATRIX) as ZoneId[]).map((to) => (
                    <td key={to} className="py-2 pr-3 font-mono text-muted">
                      {POLICY_MATRIX[from][to]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
