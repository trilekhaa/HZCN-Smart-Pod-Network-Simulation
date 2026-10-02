import { x as useSimulation } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BfVvryt2.mjs";
import { t as SimBanner } from "./SimBanner-Da9PpyeK.mjs";
import { t as FailoverSequence } from "./FailoverSequence-TSnKsWPh.mjs";
import { t as TopologyView } from "./TopologyView-DOebkDp1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/topology-CDrEg_fR.js
var import_jsx_runtime = require_jsx_runtime();
function TopologyPage() {
	const sim = useSimulation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker mt-2",
					children: "Campus topology"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: "Virtual network map"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Core switch, five security zones, eight Smart Pods, and 120 virtual devices. Lines are the simulated Core → Smart Pod → device-group fabric. Click a device for details."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopologyView, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: sim.pods.map((pod) => {
						const primary = sim.links.find((l) => l.id === pod.primaryLink);
						const backup = sim.links.find((l) => l.id === pod.backupLink);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
							pod.podId,
							" · ",
							pod.podName
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-1 text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Status ", pod.status] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Heartbeat ", pod.heartbeatStatus] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Primary ",
									primary?.status,
									" · Backup ",
									backup?.status
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [pod.connectedDevices.length, " attached devices"] })
							]
						})] }, pod.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Failover sequence" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FailoverSequence, { failover: sim.failover }) })] })]
			})
		]
	});
}
//#endregion
export { TopologyPage as component };
