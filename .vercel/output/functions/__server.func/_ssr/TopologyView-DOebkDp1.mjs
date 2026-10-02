import { b as useSimStore, x as useSimulation } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as ZONE_LABEL } from "./labels-B5kj2H9D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TopologyView-DOebkDp1.js
var import_jsx_runtime = require_jsx_runtime();
var ZONE_ORDER = [
	"academic",
	"student",
	"administration",
	"surveillance",
	"iot"
];
var POD_LAYOUT = [
	{
		id: "POD-01",
		x: 86
	},
	{
		id: "POD-02",
		x: 198
	},
	{
		id: "POD-03",
		x: 352
	},
	{
		id: "POD-04",
		x: 464
	},
	{
		id: "POD-05",
		x: 576
	},
	{
		id: "POD-06",
		x: 730
	},
	{
		id: "POD-07",
		x: 868
	},
	{
		id: "POD-08",
		x: 1006
	}
];
var W = 1100;
var CORE = {
	x: 550,
	y: 46,
	w: 240,
	h: 56
};
function linkStroke(link, kind) {
	if (!link) return "var(--color-subtle)";
	if (link.failed || link.status === "failed") return "var(--color-danger)";
	if (kind === "backup" && link.status === "active") return "var(--color-accent)";
	if (kind === "backup") return "var(--color-subtle)";
	if (link.status === "congested") return "var(--color-warn)";
	return "var(--color-ok)";
}
function podFill(pod) {
	if (pod.status === "failover") return "var(--color-warn)";
	if (pod.status === "offline") return "var(--color-danger)";
	if (pod.status === "degraded") return "var(--color-warn)";
	return "var(--color-accent)";
}
function deviceTone(device) {
	switch (device.currentSecurityState) {
		case "NETWORK-WIDE QUARANTINE": return "var(--color-danger)";
		case "RESTRICTED ISOLATION": return "var(--color-warn)";
		case "BANDWIDTH THROTTLED": return "var(--color-accent)";
		case "HEURISTIC ALERT": return "color-mix(in oklab, var(--color-warn) 80%, white)";
		default: return "var(--color-ok)";
	}
}
function groupState(devices) {
	if (devices.some((d) => d.currentSecurityState === "NETWORK-WIDE QUARANTINE")) return "quarantine";
	if (devices.some((d) => d.currentSecurityState === "RESTRICTED ISOLATION")) return "isolated";
	if (devices.some((d) => d.currentSecurityState !== "CLEAR ACCESS")) return "threat";
	return "clear";
}
function TopologyView({ compact = false }) {
	const snapshot = useSimulation();
	const select = useSimStore((s) => s.selectDevice);
	const height = compact ? 300 : 640;
	const podY = compact ? 168 : 188;
	const groupY = compact ? 248 : 320;
	const busY = compact ? 108 : 118;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "SIMULATED 1 Gbps CORE/DISTRIBUTION LINK"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-accent tabular",
					children: [
						"Util ",
						(snapshot.core.utilization * 100).toFixed(2),
						"% · ",
						snapshot.core.distributionCapacityMbps,
						" Mbps"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `0 0 ${W} ${height}`,
					className: "h-auto w-full min-w-[40rem]",
					role: "img",
					"aria-label": "Campus topology: core switch, eight Smart Pods, five security zones",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "HZCN campus topology" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "0",
							y: "0",
							width: W,
							height,
							fill: "transparent"
						}),
						POD_LAYOUT.map((slot) => {
							const pod = snapshot.pods.find((p) => p.podId === slot.id);
							if (!pod) return null;
							const primary = snapshot.links.find((l) => l.id === pod.primaryLink);
							const backup = snapshot.links.find((l) => l.id === pod.backupLink);
							const coreBottom = CORE.y + CORE.h / 2;
							const primaryEnd = {
								x: slot.x,
								y: podY - 28
							};
							const backupEnd = {
								x: slot.x + 18,
								y: podY - 28
							};
							const activity = Math.min(1, (pod.trafficStats.pps || 0) / 80);
							const dash = 4 + activity * 8;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: `M ${CORE.x} ${coreBottom} V ${busY} H ${slot.x} V ${primaryEnd.y}`,
									fill: "none",
									stroke: linkStroke(primary, "primary"),
									strokeWidth: primary?.failed ? 1.5 : 2 + activity * 1.5,
									strokeDasharray: primary?.failed ? "4 5" : snapshot.running ? `${dash} 6` : void 0,
									className: snapshot.running && !primary?.failed ? "topo-flow" : void 0,
									opacity: primary?.failed ? .55 : .95
								}),
								primary?.failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									transform: `translate(${slot.x}, ${(busY + primaryEnd.y) / 2})`,
									stroke: "var(--color-danger)",
									strokeWidth: "2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "-7",
										y1: "-7",
										x2: "7",
										y2: "7"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
										x1: "7",
										y1: "-7",
										x2: "-7",
										y2: "7"
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: `M ${CORE.x + 36} ${coreBottom} Q ${slot.x + 40} ${busY + 10} ${backupEnd.x} ${backupEnd.y}`,
									fill: "none",
									stroke: linkStroke(backup, "backup"),
									strokeWidth: backup?.status === "active" ? 2.4 : 1.4,
									strokeDasharray: backup?.status === "active" ? "0" : "5 5",
									opacity: backup?.status === "active" ? 1 : .55
								})
							] }, `links-${slot.id}`);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: CORE.x - CORE.w / 2,
								y: CORE.y - CORE.h / 2,
								width: CORE.w,
								height: CORE.h,
								rx: "12",
								fill: "var(--color-elevated)",
								stroke: "var(--color-accent)",
								strokeWidth: "1.4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: CORE.x,
								y: CORE.y - 6,
								textAnchor: "middle",
								fill: "var(--color-muted)",
								fontSize: "9",
								letterSpacing: "0.16em",
								children: "CORE SWITCH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: CORE.x,
								y: CORE.y + 12,
								textAnchor: "middle",
								fill: "var(--color-accent)",
								fontSize: "13",
								fontFamily: "var(--font-mono)",
								children: snapshot.core.name
							})
						] }),
						POD_LAYOUT.map((slot) => {
							const pod = snapshot.pods.find((p) => p.podId === slot.id);
							if (!pod) return null;
							const devices = snapshot.devices.filter((d) => d.connectedPod === pod.podId);
							const gstate = groupState(devices);
							const groupStroke = gstate === "quarantine" ? "var(--color-danger)" : gstate === "isolated" ? "var(--color-warn)" : gstate === "threat" ? "var(--color-accent)" : "var(--color-border)";
							const groupBlocked = gstate === "quarantine" || gstate === "isolated";
							const cols = 6;
							const preview = compact ? devices.filter((d) => d.currentSecurityState !== "CLEAR ACCESS").slice(0, 8) : devices;
							const shown = compact ? preview.length ? preview : devices.slice(0, 8) : devices;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: slot.x,
									y1: podY + 28,
									x2: slot.x,
									y2: groupY - 8,
									stroke: groupBlocked ? "var(--color-danger)" : "var(--color-ok)",
									strokeWidth: "1.6",
									strokeDasharray: groupBlocked ? "3 5" : void 0,
									opacity: groupBlocked ? .7 : .9
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: slot.x,
									cy: podY,
									r: "26",
									fill: "var(--color-bg)",
									stroke: podFill(pod),
									strokeWidth: "1.8",
									className: pod.status === "healthy" ? "glow-pod" : void 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: slot.x,
									y: podY - 2,
									textAnchor: "middle",
									fill: "var(--color-accent)",
									fontSize: "10",
									fontFamily: "var(--font-mono)",
									children: pod.podId.replace("POD-0", "P")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: slot.x,
									y: podY + 12,
									textAnchor: "middle",
									fill: "var(--color-muted)",
									fontSize: "8",
									children: pod.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: slot.x - 48,
									y: groupY,
									width: "96",
									height: compact ? 36 : 118,
									rx: "10",
									fill: "var(--color-surface)",
									stroke: groupStroke,
									strokeDasharray: groupBlocked ? "4 4" : void 0
								}),
								shown.slice(0, compact ? 8 : 24).map((device, i) => {
									const col = i % cols;
									const row = Math.floor(i / cols);
									const dx = slot.x - 36 + col * 12;
									const dy = groupY + (compact ? 14 : 18) + row * 14;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: dx,
										cy: dy,
										r: "4",
										fill: deviceTone(device),
										className: "cursor-pointer",
										onClick: () => select(device.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${device.deviceName} · ${device.currentSecurityState}` })
									}, device.id);
								}),
								!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x: slot.x,
									y: groupY + 108,
									textAnchor: "middle",
									fill: "var(--color-subtle)",
									fontSize: "8",
									children: [devices.length, " devices"]
								}) : null
							] }, pod.podId);
						}),
						!compact ? ZONE_ORDER.map((zoneId) => {
							const xs = snapshot.pods.filter((p) => p.zone === zoneId).map((p) => POD_LAYOUT.find((s) => s.id === p.podId)?.x).filter((n) => n != null);
							if (!xs.length) return null;
							const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: mid,
								y: height - 18,
								textAnchor: "middle",
								fill: "var(--color-muted)",
								fontSize: "11",
								letterSpacing: "0.12em",
								children: ZONE_LABEL[zoneId].toUpperCase()
							}, zoneId);
						}) : null
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Solid lime: primary link" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dashed: backup / standby" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-danger",
						children: "X: primary failed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-accent",
						children: "Bright backup: failover active"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-warn",
						children: "Device highlight: threat / isolation"
					})
				]
			})
		]
	});
}
//#endregion
export { TopologyView as t };
