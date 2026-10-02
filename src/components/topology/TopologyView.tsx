import { ZONE_LABEL } from "@/components/sim/labels";
import { cn } from "@/lib/utils";
import type { Device, NetworkLink, SmartPod, ZoneId } from "@/models/types";
import { useSimStore, useSimulation } from "@/store/simulation-store";

const ZONE_ORDER: ZoneId[] = ["academic", "student", "administration", "surveillance", "iot"];

const POD_LAYOUT: Array<{ id: string; x: number }> = [
  { id: "POD-01", x: 86 },
  { id: "POD-02", x: 198 },
  { id: "POD-03", x: 352 },
  { id: "POD-04", x: 464 },
  { id: "POD-05", x: 576 },
  { id: "POD-06", x: 730 },
  { id: "POD-07", x: 868 },
  { id: "POD-08", x: 1006 },
];

const W = 1100;
const CORE = { x: 550, y: 46, w: 240, h: 56 };

function linkStroke(link: NetworkLink | undefined, kind: "primary" | "backup"): string {
  if (!link) return "var(--color-subtle)";
  if (link.failed || link.status === "failed") return "var(--color-danger)";
  if (kind === "backup" && link.status === "active") return "var(--color-accent)";
  if (kind === "backup") return "var(--color-subtle)";
  if (link.status === "congested") return "var(--color-warn)";
  return "var(--color-ok)";
}

function podFill(pod: SmartPod): string {
  if (pod.status === "failover") return "var(--color-warn)";
  if (pod.status === "offline") return "var(--color-danger)";
  if (pod.status === "degraded") return "var(--color-warn)";
  return "var(--color-accent)";
}

function deviceTone(device: Device): string {
  switch (device.currentSecurityState) {
    case "NETWORK-WIDE QUARANTINE":
      return "var(--color-danger)";
    case "RESTRICTED ISOLATION":
      return "var(--color-warn)";
    case "BANDWIDTH THROTTLED":
      return "var(--color-accent)";
    case "HEURISTIC ALERT":
      return "color-mix(in oklab, var(--color-warn) 80%, white)";
    default:
      return "var(--color-ok)";
  }
}

function groupState(devices: Device[]): "clear" | "threat" | "isolated" | "quarantine" {
  if (devices.some((d) => d.currentSecurityState === "NETWORK-WIDE QUARANTINE")) return "quarantine";
  if (devices.some((d) => d.currentSecurityState === "RESTRICTED ISOLATION")) return "isolated";
  if (devices.some((d) => d.currentSecurityState !== "CLEAR ACCESS")) return "threat";
  return "clear";
}

export function TopologyView({ compact = false }: { compact?: boolean }) {
  const snapshot = useSimulation();
  const select = useSimStore((s) => s.selectDevice);
  const height = compact ? 300 : 640;
  const podY = compact ? 168 : 188;
  const groupY = compact ? 248 : 320;
  const busY = compact ? 108 : 118;

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">SIMULATED 1 Gbps CORE/DISTRIBUTION LINK</p>
        <p className="font-mono text-xs text-accent tabular">
          Util {(snapshot.core.utilization * 100).toFixed(2)}% · {snapshot.core.distributionCapacityMbps} Mbps
        </p>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${height}`}
          className="h-auto w-full min-w-[40rem]"
          role="img"
          aria-label="Campus topology: core switch, eight Smart Pods, five security zones"
        >
          <title>HZCN campus topology</title>
          <rect x="0" y="0" width={W} height={height} fill="transparent" />

          {POD_LAYOUT.map((slot) => {
            const pod = snapshot.pods.find((p) => p.podId === slot.id);
            if (!pod) return null;
            const primary = snapshot.links.find((l) => l.id === pod.primaryLink);
            const backup = snapshot.links.find((l) => l.id === pod.backupLink);
            const coreBottom = CORE.y + CORE.h / 2;
            const primaryEnd = { x: slot.x, y: podY - 28 };
            const backupEnd = { x: slot.x + 18, y: podY - 28 };
            const activity = Math.min(1, (pod.trafficStats.pps || 0) / 80);
            const dash = 4 + activity * 8;
            return (
              <g key={`links-${slot.id}`}>
                <path
                  d={`M ${CORE.x} ${coreBottom} V ${busY} H ${slot.x} V ${primaryEnd.y}`}
                  fill="none"
                  stroke={linkStroke(primary, "primary")}
                  strokeWidth={primary?.failed ? 1.5 : 2 + activity * 1.5}
                  strokeDasharray={primary?.failed ? "4 5" : snapshot.running ? `${dash} 6` : undefined}
                  className={snapshot.running && !primary?.failed ? "topo-flow" : undefined}
                  opacity={primary?.failed ? 0.55 : 0.95}
                />
                {primary?.failed ? (
                  <g transform={`translate(${slot.x}, ${(busY + primaryEnd.y) / 2})`} stroke="var(--color-danger)" strokeWidth="2">
                    <line x1="-7" y1="-7" x2="7" y2="7" />
                    <line x1="7" y1="-7" x2="-7" y2="7" />
                  </g>
                ) : null}
                <path
                  d={`M ${CORE.x + 36} ${coreBottom} Q ${slot.x + 40} ${busY + 10} ${backupEnd.x} ${backupEnd.y}`}
                  fill="none"
                  stroke={linkStroke(backup, "backup")}
                  strokeWidth={backup?.status === "active" ? 2.4 : 1.4}
                  strokeDasharray={backup?.status === "active" ? "0" : "5 5"}
                  opacity={backup?.status === "active" ? 1 : 0.55}
                />
              </g>
            );
          })}

          <g>
            <rect
              x={CORE.x - CORE.w / 2}
              y={CORE.y - CORE.h / 2}
              width={CORE.w}
              height={CORE.h}
              rx="12"
              fill="var(--color-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="1.4"
            />
            <text
              x={CORE.x}
              y={CORE.y - 6}
              textAnchor="middle"
              fill="var(--color-muted)"
              fontSize="9"
              letterSpacing="0.16em"
            >
              CORE SWITCH
            </text>
            <text x={CORE.x} y={CORE.y + 12} textAnchor="middle" fill="var(--color-accent)" fontSize="13" fontFamily="var(--font-mono)">
              {snapshot.core.name}
            </text>
          </g>

          {POD_LAYOUT.map((slot) => {
            const pod = snapshot.pods.find((p) => p.podId === slot.id);
            if (!pod) return null;
            const devices = snapshot.devices.filter((d) => d.connectedPod === pod.podId);
            const gstate = groupState(devices);
            const groupStroke =
              gstate === "quarantine"
                ? "var(--color-danger)"
                : gstate === "isolated"
                  ? "var(--color-warn)"
                  : gstate === "threat"
                    ? "var(--color-accent)"
                    : "var(--color-border)";
            const groupBlocked = gstate === "quarantine" || gstate === "isolated";
            const cols = 6;
            const preview = compact ? devices.filter((d) => d.currentSecurityState !== "CLEAR ACCESS").slice(0, 8) : devices;
            const shown = compact ? (preview.length ? preview : devices.slice(0, 8)) : devices;
            return (
              <g key={pod.podId}>
                <line
                  x1={slot.x}
                  y1={podY + 28}
                  x2={slot.x}
                  y2={groupY - 8}
                  stroke={groupBlocked ? "var(--color-danger)" : "var(--color-ok)"}
                  strokeWidth="1.6"
                  strokeDasharray={groupBlocked ? "3 5" : undefined}
                  opacity={groupBlocked ? 0.7 : 0.9}
                />
                <circle
                  cx={slot.x}
                  cy={podY}
                  r="26"
                  fill="var(--color-bg)"
                  stroke={podFill(pod)}
                  strokeWidth="1.8"
                  className={pod.status === "healthy" ? "glow-pod" : undefined}
                />
                <text x={slot.x} y={podY - 2} textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)">
                  {pod.podId.replace("POD-0", "P")}
                </text>
                <text x={slot.x} y={podY + 12} textAnchor="middle" fill="var(--color-muted)" fontSize="8">
                  {pod.status}
                </text>
                <rect
                  x={slot.x - 48}
                  y={groupY}
                  width="96"
                  height={compact ? 36 : 118}
                  rx="10"
                  fill="var(--color-surface)"
                  stroke={groupStroke}
                  strokeDasharray={groupBlocked ? "4 4" : undefined}
                />
                {shown.slice(0, compact ? 8 : 24).map((device, i) => {
                  const col = i % cols;
                  const row = Math.floor(i / cols);
                  const dx = slot.x - 36 + col * 12;
                  const dy = groupY + (compact ? 14 : 18) + row * 14;
                  return (
                    <circle
                      key={device.id}
                      cx={dx}
                      cy={dy}
                      r="4"
                      fill={deviceTone(device)}
                      className="cursor-pointer"
                      onClick={() => select(device.id)}
                    >
                      <title>{`${device.deviceName} · ${device.currentSecurityState}`}</title>
                    </circle>
                  );
                })}
                {!compact ? (
                  <text x={slot.x} y={groupY + 108} textAnchor="middle" fill="var(--color-subtle)" fontSize="8">
                    {devices.length} devices
                  </text>
                ) : null}
              </g>
            );
          })}

          {!compact
            ? ZONE_ORDER.map((zoneId) => {
                const pods = snapshot.pods.filter((p) => p.zone === zoneId);
                const xs = pods
                  .map((p) => POD_LAYOUT.find((s) => s.id === p.podId)?.x)
                  .filter((n): n is number => n != null);
                if (!xs.length) return null;
                const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
                return (
                  <text
                    key={zoneId}
                    x={mid}
                    y={height - 18}
                    textAnchor="middle"
                    fill="var(--color-muted)"
                    fontSize="11"
                    letterSpacing="0.12em"
                  >
                    {ZONE_LABEL[zoneId].toUpperCase()}
                  </text>
                );
              })
            : null}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-muted">
        <li>Solid lime: primary link</li>
        <li>Dashed: backup / standby</li>
        <li className="text-danger">X: primary failed</li>
        <li className="text-accent">Bright backup: failover active</li>
        <li className="text-warn">Device highlight: threat / isolation</li>
      </ul>
    </div>
  );
}

export function TopologyLegend({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-subtle", className)}>
      Core → Smart Pod → device group. Link color is live simulation state, not a physical capture.
    </p>
  );
}
