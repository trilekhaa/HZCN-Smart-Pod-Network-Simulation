import { _ as formatNumber, g as formatMeasured, i as PAPER_ISOLATION_LATENCY_MS, x as useSimulation, y as formatSimTimestamp } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BfVvryt2.mjs";
import { a as LossChart, d as ThreatChart, f as ThroughputChart, i as DpqMeters, l as SecurityTrendChart, n as CountsChart, o as MetricCard, p as ZoneTrafficChart, r as DelayChart, s as PdrChart, t as ActiveDevicesChart, u as SimulationSummary } from "./SimulationSummary-C8jEjgvL.mjs";
import { t as SimBanner } from "./SimBanner-Da9PpyeK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-DZZZmy6d.js
var import_jsx_runtime = require_jsx_runtime();
function HzcnMetrics({ state }) {
	const history = state.history;
	const maxThreat = history.length ? Math.max(...history.map((h) => h.maxThreat)) : null;
	const peakThru = history.length ? Math.max(...history.map((h) => h.throughput)) : null;
	const last = history[history.length - 1];
	const dpq = state.dpq.allocatedMbps;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Maximum threat score",
					value: maxThreat == null ? "N/A" : formatNumber(maxThreat, 1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Policy violations",
					value: String(state.counters.policyViolations)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Blocked packets",
					value: String(Math.round(state.counters.packetsBlocked))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Throttled packets",
					value: String(Math.round(state.counters.packetsThrottled))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Isolated devices",
					value: String(state.security.isolated)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Quarantined devices",
					value: String(state.security.blocked)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Isolation latency",
					value: formatMeasured(state.metrics.isolationLatencyMs, " ms"),
					hint: "Measured in this simulation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Failover detection",
					value: state.failover.primaryFailureDetectedAt == null ? "N/A" : formatSimTimestamp(state.failover.primaryFailureDetectedAt)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Failover duration",
					value: formatMeasured(state.failover.failoverDurationMs, " ms"),
					hint: `Heartbeat timeout ${state.failover.heartbeatTimeoutMs} ms configured`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Core link utilization",
					value: last ? `${formatNumber(last.coreUtilization * 100, 2)}%` : "N/A",
					hint: "Simulated 1 Gbps core/distribution link"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Packet delivery ratio",
					value: last ? `${formatNumber(last.pdr, 1)}%` : "N/A"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Average delay",
					value: last ? `${formatNumber(last.delay, 1)} ms` : "N/A"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Throughput",
					value: last ? `${formatNumber(last.throughput, 2)} Mbps` : "N/A",
					hint: peakThru == null ? void 0 : `Peak ${formatNumber(peakThru, 2)} Mbps`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "DPQ CRITICAL",
					value: `${formatNumber(dpq.critical, 2)} Mbps`,
					hint: "Allocated on 1 Gbps distribution layer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "DPQ HIGH",
					value: `${formatNumber(dpq.high, 2)} Mbps`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "DPQ NORMAL",
					value: `${formatNumber(dpq.normal, 2)} Mbps`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-subtle",
			children: [
				"Isolation latency is measured from this engine's timestamps (0.1 s precision). Paper / NS-3 reported",
				" <",
				PAPER_ISOLATION_LATENCY_MS,
				" ms is a separate result."
			]
		})]
	});
}
function AnalyticsPage() {
	const sim = useSimulation();
	const empty = sim.history.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker mt-2",
					children: "Network analytics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: "Computed from the live engine"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Every series is a history buffer written once per simulated second. Unmeasured values show N/A."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HzcnMetrics, { state: sim }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationSummary, { state: sim }),
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "py-10 text-center text-sm text-muted",
				children: "No samples yet. Start the simulation to record throughput, delay, loss, and threat history."
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThroughputChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LossChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdrChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DelayChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreatChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoneTrafficChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActiveDevicesChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityTrendChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountsChart, { data: sim.history }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "DPQ class pressure" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DpqMeters, { dpq: sim.dpq }) })] })
				]
			})
		]
	});
}
//#endregion
export { AnalyticsPage as component };
