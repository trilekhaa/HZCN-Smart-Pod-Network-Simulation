import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as formatNumber, i as PAPER_ISOLATION_LATENCY_MS, m as cn } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Card } from "./card-BfVvryt2.mjs";
import { a as XAxis, c as CartesianGrid, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Bar, n as BarChart, o as Area, p as Legend, r as LineChart, s as Line, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SimulationSummary-C8jEjgvL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tooltipStyle = {
	background: "#101410",
	border: "1px solid #27301c",
	borderRadius: 8,
	fontSize: 12,
	color: "#eef3e6"
};
function ChartFrame({ title, children, height = 220 }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker mb-3",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-56",
			style: height === 220 ? void 0 : { height },
			children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-lg bg-elevated" })
		})]
	});
}
function ThroughputChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Throughput",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "thru",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#d4ff00",
						stopOpacity: .35
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "#d4ff00",
						stopOpacity: 0
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "throughput",
					stroke: "#d4ff00",
					fill: "url(#thru)",
					name: "Mbps"
				})
			]
		})
	});
}
function DelayChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Average delay",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "delay",
					stroke: "#d4ff00",
					dot: false,
					name: "ms"
				})
			]
		})
	});
}
function LossChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Packet loss",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "loss",
					stroke: "#e05656",
					dot: false,
					name: "%"
				})
			]
		})
	});
}
function PdrChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Packet delivery ratio",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11,
					domain: [0, 100]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "pdr",
					stroke: "#4fba6a",
					dot: false,
					name: "%"
				})
			]
		})
	});
}
function ThreatChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Threat score",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11,
					domain: [0, 100]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "maxThreat",
					stroke: "#e05656",
					dot: false,
					name: "Max"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "avgThreat",
					stroke: "#d4ff00",
					dot: false,
					name: "Average"
				})
			]
		})
	});
}
function ZoneTrafficChart({ data }) {
	const mapped = data.map((d) => ({
		t: d.t,
		...d.zoneTraffic
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Traffic by zone",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data: mapped,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "student",
					stackId: "1",
					stroke: "#d4ff00",
					fill: "#d4ff00",
					fillOpacity: .35
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "academic",
					stackId: "1",
					stroke: "#4fba6a",
					fill: "#4fba6a",
					fillOpacity: .3
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "administration",
					stackId: "1",
					stroke: "#e0c04a",
					fill: "#e0c04a",
					fillOpacity: .25
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "surveillance",
					stackId: "1",
					stroke: "#8b9580",
					fill: "#8b9580",
					fillOpacity: .25
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "iot",
					stackId: "1",
					stroke: "#e05656",
					fill: "#e05656",
					fillOpacity: .2
				})
			]
		})
	});
}
function SecurityTrendChart({ data }) {
	const mapped = data.map((d) => ({
		t: d.t,
		...d.security
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Security state distribution",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data: mapped,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "clear",
					stackId: "1",
					stroke: "#4fba6a",
					fill: "#4fba6a",
					fillOpacity: .35
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "alert",
					stackId: "1",
					stroke: "#e0c04a",
					fill: "#e0c04a",
					fillOpacity: .35
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "throttled",
					stackId: "1",
					stroke: "#d4ff00",
					fill: "#d4ff00",
					fillOpacity: .3
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "isolated",
					stackId: "1",
					stroke: "#e0c04a",
					fill: "#8b9580",
					fillOpacity: .4
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "blocked",
					stackId: "1",
					stroke: "#e05656",
					fill: "#e05656",
					fillOpacity: .4
				})
			]
		})
	});
}
function CountsChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Throttled / isolated / blocked",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11,
					allowDecimals: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "throttled",
					stroke: "#d4ff00",
					dot: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "isolated",
					stroke: "#e0c04a",
					dot: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "blocked",
					stroke: "#e05656",
					dot: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "alerts",
					stroke: "#8b9580",
					dot: false
				})
			]
		})
	});
}
function ActiveDevicesChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Active devices",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11,
					domain: [100, 120]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "activeDevices",
					stroke: "#d4ff00",
					dot: false
				})
			]
		})
	});
}
function SecurityBar({ clear, alert, throttled, isolated, blocked }) {
	const data = [
		{
			name: "Clear",
			value: clear,
			color: "#4fba6a"
		},
		{
			name: "Alert",
			value: alert,
			color: "#e0c04a"
		},
		{
			name: "Throttled",
			value: throttled,
			color: "#d4ff00"
		},
		{
			name: "Isolated",
			value: isolated,
			color: "#8b9580"
		},
		{
			name: "Blocked",
			value: blocked,
			color: "#e05656"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFrame, {
		title: "Current security states",
		height: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "#27301c",
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "name",
					stroke: "#8b9580",
					fontSize: 11
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "#8b9580",
					fontSize: 11,
					allowDecimals: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "value",
					radius: [
						4,
						4,
						0,
						0
					],
					children: data.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, entry.name))
				})
			]
		})
	});
}
var ROWS = [
	{
		key: "critical",
		label: "CRITICAL",
		drop: "criticalDrop",
		alloc: "critical"
	},
	{
		key: "high",
		label: "HIGH",
		drop: "highDrop",
		alloc: "high"
	},
	{
		key: "normal",
		label: "NORMAL",
		drop: "normalDrop",
		alloc: "normal"
	},
	{
		key: "background",
		label: "BACKGROUND",
		drop: "backgroundDrop",
		alloc: "background"
	}
];
function DpqMeters({ dpq }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [ROWS.map((row) => {
			const fill = dpq[row.key];
			const drop = dpq[row.drop] * 100;
			const mbps = dpq.allocatedMbps[row.alloc];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-muted",
					children: row.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-subtle tabular",
					children: [
						formatNumber(mbps, 2),
						" Mbps · ",
						drop.toFixed(0),
						"% drop"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-accent",
					style: { width: `${Math.min(100, fill)}%` }
				})
			})] }, row.key);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-subtle",
			children: [
				"Simulated DPQ / priority queue on the 1 Gbps distribution layer — not Linux traffic control. Capacity ",
				formatNumber(dpq.capacityMbps, 0),
				" Mbps."
			]
		})]
	});
}
function MetricCard({ label, value, hint, tone = "accent" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2 font-mono text-2xl tracking-tight tabular", tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : tone === "danger" ? "text-danger" : tone === "fg" ? "text-fg" : "text-accent"),
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function last(items) {
	return items[items.length - 1];
}
function buildSimulationSummary(state) {
	const history = state.history;
	const peakThroughput = history.length ? Math.max(...history.map((h) => h.throughput)) : null;
	const meanDelay = history.length ? history.reduce((s, h) => s + h.delay, 0) / history.length : null;
	const lastPoint = last(history);
	const isolationLatencyMs = state.devices.find((d) => d.deviceName === "Student-027")?.isolationLatencyMs ?? state.isolations.find((i) => i.isolationLatencyMs != null)?.isolationLatencyMs ?? null;
	const maxThreat = history.length ? Math.max(...history.map((h) => h.maxThreat)) : state.devices.reduce((m, d) => Math.max(m, d.threatScore), 0);
	return {
		duration: 120,
		devices: state.devices.length,
		zones: state.zones.length,
		smartPods: state.pods.length,
		attacksDetected: state.counters.attacksDetected,
		policyViolations: state.counters.policyViolations,
		maximumThreatScore: history.length || maxThreat > 0 ? maxThreat : null,
		devicesIsolated: state.security.isolated,
		devicesQuarantined: state.security.blocked,
		packetsBlocked: Math.round(state.counters.packetsBlocked),
		peakThroughput,
		averageDelay: meanDelay,
		packetDeliveryRatio: lastPoint ? lastPoint.pdr / 100 : null,
		isolationLatencyMs,
		failoverDurationMs: state.failover.failoverDurationMs,
		coreUtilization: lastPoint ? lastPoint.coreUtilization : null
	};
}
function na(value, format) {
	if (value == null || !Number.isFinite(value)) return "N/A";
	return format(value);
}
function SimulationSummary({ state }) {
	if (!state.scenario.completed) return null;
	const s = buildSimulationSummary(state);
	const rows = [
		["Duration", `${s.duration} sec`],
		["Devices", String(s.devices)],
		["Zones", String(s.zones)],
		["Smart Pods", String(s.smartPods)],
		["Attacks detected", String(s.attacksDetected)],
		["Policy violations", String(s.policyViolations)],
		["Maximum threat score", na(s.maximumThreatScore, (n) => formatNumber(n, 1))],
		["Devices isolated", String(s.devicesIsolated)],
		["Devices quarantined", String(s.devicesQuarantined)],
		["Packets blocked", String(s.packetsBlocked)],
		["Peak throughput", na(s.peakThroughput, (n) => `${formatNumber(n, 2)} Mbps`)],
		["Average delay", na(s.averageDelay, (n) => `${formatNumber(n, 1)} ms`)],
		["Packet delivery ratio", na(s.packetDeliveryRatio, (n) => `${formatNumber(n * 100, 1)}%`)],
		["Measured isolation latency", na(s.isolationLatencyMs, (n) => `${Math.round(n)} ms`)],
		["Measured failover duration", na(s.failoverDurationMs, (n) => `${Math.round(n)} ms`)]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Simulation complete"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 text-lg font-medium",
				children: "Measured in this simulation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5",
				children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-[0.7rem] text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "font-mono text-sm text-accent tabular",
					children: value
				})] }, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-subtle",
				children: [
					"Paper / NS-3 reported isolation: ",
					"<",
					PAPER_ISOLATION_LATENCY_MS,
					" ms. That figure is not a result of this JavaScript simulation."
				]
			})
		]
	});
}
//#endregion
export { LossChart as a, SecurityBar as c, ThreatChart as d, ThroughputChart as f, DpqMeters as i, SecurityTrendChart as l, CountsChart as n, MetricCard as o, ZoneTrafficChart as p, DelayChart as r, PdrChart as s, ActiveDevicesChart as t, SimulationSummary as u };
