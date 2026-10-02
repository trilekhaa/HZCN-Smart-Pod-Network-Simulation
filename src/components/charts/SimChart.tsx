import { useEffect, useState, type ReactElement } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "@/models/types";

const tooltipStyle = {
  background: "#101410",
  border: "1px solid #27301c",
  borderRadius: 8,
  fontSize: 12,
  color: "#eef3e6",
};

export function ChartFrame({
  title,
  children,
  height = 220,
}: {
  title: string;
  children: ReactElement;
  height?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="kicker mb-3">{title}</p>
      <div className="h-56" style={height === 220 ? undefined : { height }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-lg bg-elevated" />
        )}
      </div>
    </div>
  );
}

export function ThroughputChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Throughput">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="thru" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4ff00" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#d4ff00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="throughput" stroke="#d4ff00" fill="url(#thru)" name="Mbps" />
      </AreaChart>
    </ChartFrame>
  );
}

export function DelayChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Average delay">
      <LineChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="delay" stroke="#d4ff00" dot={false} name="ms" />
      </LineChart>
    </ChartFrame>
  );
}

export function LossChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Packet loss">
      <LineChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="loss" stroke="#e05656" dot={false} name="%" />
      </LineChart>
    </ChartFrame>
  );
}

export function PdrChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Packet delivery ratio">
      <LineChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="pdr" stroke="#4fba6a" dot={false} name="%" />
      </LineChart>
    </ChartFrame>
  );
}

export function ThreatChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Threat score">
      <LineChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="maxThreat" stroke="#e05656" dot={false} name="Max" />
        <Line type="monotone" dataKey="avgThreat" stroke="#d4ff00" dot={false} name="Average" />
      </LineChart>
    </ChartFrame>
  );
}

export function ZoneTrafficChart({ data }: { data: HistoryPoint[] }) {
  const mapped = data.map((d) => ({ t: d.t, ...d.zoneTraffic }));
  return (
    <ChartFrame title="Traffic by zone">
      <AreaChart data={mapped}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Area type="monotone" dataKey="student" stackId="1" stroke="#d4ff00" fill="#d4ff00" fillOpacity={0.35} />
        <Area type="monotone" dataKey="academic" stackId="1" stroke="#4fba6a" fill="#4fba6a" fillOpacity={0.3} />
        <Area type="monotone" dataKey="administration" stackId="1" stroke="#e0c04a" fill="#e0c04a" fillOpacity={0.25} />
        <Area type="monotone" dataKey="surveillance" stackId="1" stroke="#8b9580" fill="#8b9580" fillOpacity={0.25} />
        <Area type="monotone" dataKey="iot" stackId="1" stroke="#e05656" fill="#e05656" fillOpacity={0.2} />
      </AreaChart>
    </ChartFrame>
  );
}

export function SecurityTrendChart({ data }: { data: HistoryPoint[] }) {
  const mapped = data.map((d) => ({ t: d.t, ...d.security }));
  return (
    <ChartFrame title="Security state distribution">
      <AreaChart data={mapped}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Area type="monotone" dataKey="clear" stackId="1" stroke="#4fba6a" fill="#4fba6a" fillOpacity={0.35} />
        <Area type="monotone" dataKey="alert" stackId="1" stroke="#e0c04a" fill="#e0c04a" fillOpacity={0.35} />
        <Area type="monotone" dataKey="throttled" stackId="1" stroke="#d4ff00" fill="#d4ff00" fillOpacity={0.3} />
        <Area type="monotone" dataKey="isolated" stackId="1" stroke="#e0c04a" fill="#8b9580" fillOpacity={0.4} />
        <Area type="monotone" dataKey="blocked" stackId="1" stroke="#e05656" fill="#e05656" fillOpacity={0.4} />
      </AreaChart>
    </ChartFrame>
  );
}

export function CountsChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Throttled / isolated / blocked">
      <LineChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Line type="monotone" dataKey="throttled" stroke="#d4ff00" dot={false} />
        <Line type="monotone" dataKey="isolated" stroke="#e0c04a" dot={false} />
        <Line type="monotone" dataKey="blocked" stroke="#e05656" dot={false} />
        <Line type="monotone" dataKey="alerts" stroke="#8b9580" dot={false} />
      </LineChart>
    </ChartFrame>
  );
}

export function ActiveDevicesChart({ data }: { data: HistoryPoint[] }) {
  return (
    <ChartFrame title="Active devices">
      <LineChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="t" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} domain={[100, 120]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="activeDevices" stroke="#d4ff00" dot={false} />
      </LineChart>
    </ChartFrame>
  );
}

export function SecurityBar({
  clear,
  alert,
  throttled,
  isolated,
  blocked,
}: {
  clear: number;
  alert: number;
  throttled: number;
  isolated: number;
  blocked: number;
}) {
  const data = [
    { name: "Clear", value: clear, color: "#4fba6a" },
    { name: "Alert", value: alert, color: "#e0c04a" },
    { name: "Throttled", value: throttled, color: "#d4ff00" },
    { name: "Isolated", value: isolated, color: "#8b9580" },
    { name: "Blocked", value: blocked, color: "#e05656" },
  ];
  return (
    <ChartFrame title="Current security states" height={200}>
      <BarChart data={data}>
        <CartesianGrid stroke="#27301c" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#8b9580" fontSize={11} />
        <YAxis stroke="#8b9580" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}
