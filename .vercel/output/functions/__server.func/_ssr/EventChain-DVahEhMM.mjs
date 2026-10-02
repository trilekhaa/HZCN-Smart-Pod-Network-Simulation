import { m as cn } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EventChain-DVahEhMM.js
var import_jsx_runtime = require_jsx_runtime();
var PROCESS = [
	{
		type: "TRAFFIC_STARTED",
		label: "Traffic Generated"
	},
	{
		type: "POLICY_VIOLATION",
		label: "Policy Evaluation"
	},
	{
		type: "PORT_SCAN_DETECTED",
		label: "Behavior Monitoring"
	},
	{
		type: "THREAT_SCORE_UPDATED",
		label: "Threat Score Update"
	},
	{
		type: "SECURITY_STATE_CHANGED",
		label: "Security State"
	},
	{
		type: [
			"DEVICE_THROTTLED",
			"DEVICE_ISOLATED",
			"DEVICE_BLOCKED"
		],
		label: "Decision"
	},
	{
		type: ["DEVICE_THROTTLED", "DEVICE_ISOLATED"],
		label: "Traffic Action"
	},
	{
		type: ["DEVICE_ISOLATED", "DEVICE_BLOCKED"],
		label: "Isolation / Quarantine"
	},
	{
		type: "STATE_SYNCHRONIZED",
		label: "Recovery"
	}
];
var ATTACK_CHAIN = [
	{
		type: "ATTACK_INJECTED",
		label: "ATTACK"
	},
	{
		type: "POLICY_VIOLATION",
		label: "POLICY VIOLATION"
	},
	{
		type: "THREAT_SCORE_UPDATED",
		label: "THREAT SCORE ↑"
	},
	{
		type: "SECURITY_STATE_CHANGED",
		label: "ALERT"
	},
	{
		type: "DEVICE_THROTTLED",
		label: "THROTTLE"
	},
	{
		type: "DEVICE_ISOLATED",
		label: "ISOLATION"
	},
	{
		type: "DEVICE_BLOCKED",
		label: "QUARANTINE"
	}
];
var FAILURE_CHAIN = [
	{
		type: "LINK_FAILURE",
		label: "LINK FAILURE"
	},
	{
		type: "HEARTBEAT_TIMEOUT",
		label: "HEARTBEAT TIMEOUT"
	},
	{
		type: "FAILOVER_ACTIVATED",
		label: "FAILOVER"
	},
	{
		type: "ROUTE_RECALCULATED",
		label: "ROUTE RECALCULATION"
	},
	{
		type: "STATE_SYNCHRONIZED",
		label: "RECOVERY"
	}
];
function occurred(state, type) {
	const types = Array.isArray(type) ? type : [type];
	return state.events.some((e) => types.includes(e.eventType));
}
function Chain({ title, steps, state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "kicker mb-3",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-col gap-0",
		children: steps.map((step, index) => {
			const on = occurred(state, step.type);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full", on ? "bg-accent" : "bg-elevated") }), index < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-px flex-1", on ? "bg-accent/50" : "bg-border") }) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("pb-3 font-mono text-xs", on ? "text-fg" : "text-subtle"),
					children: step.label
				})]
			}, step.label);
		})
	})] });
}
function EventChain({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 md:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chain, {
				title: "HZCN process",
				steps: PROCESS,
				state
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chain, {
				title: "Attack chain",
				steps: ATTACK_CHAIN,
				state
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chain, {
				title: "Failure chain",
				steps: FAILURE_CHAIN,
				state
			})
		]
	});
}
//#endregion
export { EventChain as t };
