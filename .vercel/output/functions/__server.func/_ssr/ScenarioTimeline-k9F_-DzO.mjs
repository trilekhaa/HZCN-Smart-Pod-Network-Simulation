import { m as cn, y as formatSimTimestamp } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as eventTone } from "./labels-B5kj2H9D.mjs";
import { t as Badge } from "./badge-DwrDLYw1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ScenarioTimeline-k9F_-DzO.js
var import_jsx_runtime = require_jsx_runtime();
function EventList({ events, empty = "No events yet." }) {
	if (events.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-col gap-1 py-3 first:pt-0 last:pb-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-accent tabular",
						children: formatSimTimestamp(event.simulationTime)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: eventTone(event.eventType),
						children: event.eventType
					}),
					event.deviceId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: event.deviceId
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg/90",
				children: event.description
			})]
		}, event.id))
	});
}
var MARKS = [
	{
		t: 0,
		title: "Normal campus operation",
		body: "Core → Smart Pod → devices. Policy Enforcement Point idle."
	},
	{
		t: 45,
		title: "Attack begins",
		body: "Student-zone device attempts restricted Administration access, rapid multi-port probing, and a raised traffic rate."
	},
	{
		t: 75,
		title: "Academic pod primary link failure",
		body: "Heartbeat timeout, failure detection, backup activation, route recalculation, service recovery."
	},
	{
		t: 120,
		title: "Simulation complete",
		body: "Deterministic 120-second demonstration ends."
	}
];
function ScenarioTimeline({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid gap-3 md:grid-cols-4",
		children: MARKS.map((mark) => {
			const reached = state.currentTime >= mark.t;
			const active = state.currentTime >= mark.t && (MARKS.find((m) => m.t > mark.t)?.t ?? 121) > state.currentTime;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]", active && "shadow-[var(--shadow-border-hover)]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("font-mono text-xs", reached ? "text-accent" : "text-subtle"),
						children: formatSimTimestamp(mark.t)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: mark.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: mark.body
					})
				]
			}, mark.t);
		})
	});
}
//#endregion
export { ScenarioTimeline as n, EventList as t };
