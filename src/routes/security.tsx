import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StateBadge } from "@/components/sim/StateBadge";
import { SimBanner } from "@/components/sim/SimBanner";
import { ZONE_LABEL, actionFromState, actionTone } from "@/components/sim/labels";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatNumber } from "@/lib/utils";
import type { SecurityState, ZoneId } from "@/models/types";
import { SECURITY_STATES, ZONE_IDS } from "@/models/types";
import { useSimStore, useSimulation } from "@/store/simulation-store";

export const Route = createFileRoute("/security")({ component: SecurityPage });

type SortKey = "deviceName" | "zone" | "packetRate" | "threatScore" | "currentSecurityState";

function SecurityPage() {
  const sim = useSimulation();
  const select = useSimStore((s) => s.selectDevice);
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<"all" | ZoneId>("all");
  const [state, setState] = useState<"all" | SecurityState>("all");
  const [sort, setSort] = useState<SortKey>("threatScore");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = sim.devices.filter((d) => {
      if (zone !== "all" && d.zone !== zone) return false;
      if (state !== "all" && d.currentSecurityState !== state) return false;
      if (!q) return true;
      return (
        d.deviceName.toLowerCase().includes(q) ||
        d.ipAddress.includes(q) ||
        d.connectedPod.toLowerCase().includes(q)
      );
    });
    return filtered.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === "number" && typeof bv === "number") return bv - av;
      return String(av).localeCompare(String(bv));
    });
  }, [sim.devices, query, zone, state, sort]);

  return (
    <div className="space-y-6">
      <div>
        <SimBanner />
        <p className="kicker mt-2">Security monitoring</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">Smart Pod observations</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Threat scores, security states, and the Action column are produced by the shared scoring engine.
          Action is the Policy Enforcement Point decision for the current state.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search device, IP, pod"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={zone} onChange={(e) => setZone(e.target.value as "all" | ZoneId)}>
          <option value="all">All zones</option>
          {ZONE_IDS.map((id) => (
            <option key={id} value={id}>
              {ZONE_LABEL[id]}
            </option>
          ))}
        </Select>
        <Select value={state} onChange={(e) => setState(e.target.value as "all" | SecurityState)}>
          <option value="all">All states</option>
          {SECURITY_STATES.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="threatScore">Sort by threat</option>
          <option value="packetRate">Sort by packet rate</option>
          <option value="deviceName">Sort by name</option>
          <option value="zone">Sort by zone</option>
          <option value="currentSecurityState">Sort by state</option>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[58rem] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Zone</th>
              <th className="px-4 py-3 font-medium">Pod</th>
              <th className="px-4 py-3 font-medium">IP address</th>
              <th className="px-4 py-3 font-medium">Packet rate</th>
              <th className="px-4 py-3 font-medium">Threat</th>
              <th className="px-4 py-3 font-medium">Security state</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Last event</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((device) => {
              const action = actionFromState(device.currentSecurityState);
              return (
                <tr
                  key={device.id}
                  className="cursor-pointer border-b border-border/70 hover:bg-elevated"
                  onClick={() => select(device.id)}
                >
                  <td className="px-4 py-3 font-mono text-xs">{device.deviceName}</td>
                  <td className="px-4 py-3 text-muted">{ZONE_LABEL[device.zone]}</td>
                  <td className="px-4 py-3 font-mono text-xs">{device.connectedPod}</td>
                  <td className="px-4 py-3 font-mono text-xs">{device.ipAddress}</td>
                  <td className="px-4 py-3 font-mono tabular">{formatNumber(device.packetRate, 1)}</td>
                  <td className="px-4 py-3 font-mono text-accent tabular">
                    {formatNumber(device.threatScore, 1)}
                  </td>
                  <td className="px-4 py-3">
                    <StateBadge state={device.currentSecurityState} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={actionTone(action)}>{action}</Badge>
                  </td>
                  <td className="max-w-[16rem] truncate px-4 py-3 text-xs text-muted">{device.lastEvent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-subtle">{rows.length} devices</p>
    </div>
  );
}
