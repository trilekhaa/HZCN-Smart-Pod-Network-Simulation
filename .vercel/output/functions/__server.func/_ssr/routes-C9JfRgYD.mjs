import { _ as formatNumber, b as useSimStore, x as useSimulation } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BfVvryt2.mjs";
import { c as SecurityBar, d as ThreatChart, f as ThroughputChart, i as DpqMeters, o as MetricCard, u as SimulationSummary } from "./SimulationSummary-C8jEjgvL.mjs";
import { t as SimBanner } from "./SimBanner-Da9PpyeK.mjs";
import { c as Play, i as TriangleAlert, n as Waves, r as Unplug, s as RotateCcw } from "../_libs/lucide-react.mjs";
import { r as Button } from "./router-DynITv84.mjs";
import { t as EventChain } from "./EventChain-DVahEhMM.mjs";
import { n as ScenarioTimeline, t as EventList } from "./ScenarioTimeline-k9F_-DzO.mjs";
import { t as TopologyView } from "./TopologyView-DOebkDp1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C9JfRgYD.js
var import_jsx_runtime = require_jsx_runtime();
function ControlRow() {
	const start = useSimStore((s) => s.start);
	const startCongestion = useSimStore((s) => s.startCongestion);
	const injectPrimaryAttack = useSimStore((s) => s.injectPrimaryAttack);
	const simulateFailure = useSimStore((s) => s.simulateFailure);
	const reset = useSimStore((s) => s.reset);
	const completed = useSimStore((s) => s.snapshot.scenario.completed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: start,
				disabled: completed,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Start normal traffic"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: startCongestion,
				disabled: completed,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "size-3.5" }), "Start congestion"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: injectPrimaryAttack,
				disabled: completed,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5" }), "Inject attack"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => simulateFailure("POD-01"),
				disabled: completed,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, { className: "size-3.5" }), "Simulate link failure"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: reset,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Reset"]
			})
		]
	});
}
function DashboardPage() {
	const sim = useSimulation();
	const healthTone = sim.metrics.networkHealth >= 80 ? "ok" : sim.metrics.networkHealth >= 55 ? "warn" : "danger";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker mt-2",
					children: "Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: "Campus simulation overview"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "One shared engine drives every panel. Metrics are computed from virtual devices, Smart Pods, and simulated flows — not a live network."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenarioTimeline, { state: sim }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulationSummary, { state: sim }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Total devices",
						value: String(sim.devices.length),
						hint: "120 virtual endpoints",
						tone: "fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Active Smart Pods",
						value: String(sim.pods.filter((p) => p.status !== "offline").length),
						hint: "8 Policy Enforcement Points",
						tone: "fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Throughput",
						value: `${formatNumber(sim.metrics.throughput, 2)} Mbps`,
						hint: "Delivered traffic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Average delay",
						value: `${formatNumber(sim.metrics.averageDelay, 1)} ms`,
						hint: "Core-to-pod path"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Packet loss",
						value: `${formatNumber(sim.metrics.packetLoss * 100, 2)}%`,
						hint: "Offered vs delivered",
						tone: sim.metrics.packetLoss > .05 ? "warn" : "accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Network health",
						value: formatNumber(sim.metrics.networkHealth, 0),
						hint: `PDR ${formatNumber(sim.metrics.packetDeliveryRatio * 100, 1)}%`,
						tone: healthTone
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 xl:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Core topology" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopologyView, { compact: true }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityBar, { ...sim.security }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "DPQ / priority queue" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DpqMeters, { dpq: sim.dpq }) })] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Event chain" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventChain, { state: sim }) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreatChart, { data: sim.history }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThroughputChart, { data: sim.history })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent events" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventList, { events: sim.events.slice(0, 8) }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Active alerts" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventList, {
					events: sim.events.filter((e) => e.severity === "high" || e.severity === "critical").slice(0, 8),
					empty: "No active alerts."
				}) })] })]
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
