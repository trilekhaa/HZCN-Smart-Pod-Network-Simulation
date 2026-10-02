import { g as formatMeasured, m as cn, r as HEARTBEAT_TIMEOUT, y as formatSimTimestamp } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FailoverSequence-TSnKsWPh.js
var import_jsx_runtime = require_jsx_runtime();
function FailoverSequence({ failover }) {
	const idle = failover.phase === "idle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Heartbeat timeout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-accent tabular",
					children: [HEARTBEAT_TIMEOUT * 1e3, " ms"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Configured"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Measured failover time"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-accent tabular",
					children: formatMeasured(failover.failoverDurationMs, " ms")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Measured in this simulation"
				})
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: (idle ? [
			"PRIMARY LINK FAILURE",
			"HEARTBEAT TIMEOUT",
			"FAILURE DETECTED",
			"BACKUP LINK ACTIVATED",
			"ROUTE RECALCULATED",
			"TRAFFIC RESTORED"
		].map((label) => ({
			at: null,
			label
		})) : failover.sequence).map((step, index, all) => {
			const on = !idle && step.at != null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full", on ? "bg-accent" : "bg-elevated") }), index < all.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-px flex-1 min-h-4", on ? "bg-accent/50" : "bg-border") }) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("pb-3 font-mono text-xs", on ? "text-fg" : "text-subtle"),
					children: [step.label, on && step.at != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" · ", formatSimTimestamp(step.at)]
					}) : null]
				})]
			}, `${step.label}-${index}`);
		}) })]
	});
}
//#endregion
export { FailoverSequence as t };
