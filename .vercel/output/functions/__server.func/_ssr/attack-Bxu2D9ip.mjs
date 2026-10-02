import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as POLICY_MATRIX, b as useSimStore, g as formatMeasured, i as PAPER_ISOLATION_LATENCY_MS, o as PRIMARY_ATTACK_DEVICE, s as PRIMARY_ATTACK_TARGET, t as ATTACK_TYPES, x as useSimulation } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BfVvryt2.mjs";
import { t as SimBanner } from "./SimBanner-Da9PpyeK.mjs";
import { n as actionFromState, t as ZONE_LABEL } from "./labels-B5kj2H9D.mjs";
import { n as StateBadge, r as Button } from "./router-DynITv84.mjs";
import { t as EventChain } from "./EventChain-DVahEhMM.mjs";
import { n as ScenarioTimeline, t as EventList } from "./ScenarioTimeline-k9F_-DzO.mjs";
import { t as FailoverSequence } from "./FailoverSequence-TSnKsWPh.mjs";
import { t as Select } from "./select-DpRE34E1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attack-Bxu2D9ip.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ATTACK_LABEL = {
	"cross-zone": "Cross-Zone Access",
	"port-scan": "Port Scan",
	"traffic-flood": "Traffic Flood",
	combined: "Combined Attack"
};
function AttackPage() {
	const sim = useSimulation();
	const inject = useSimStore((s) => s.injectAttack);
	const injectPrimary = useSimStore((s) => s.injectPrimaryAttack);
	const [type, setType] = (0, import_react.useState)("combined");
	const [deviceId, setDeviceId] = (0, import_react.useState)(PRIMARY_ATTACK_DEVICE);
	const [targetId, setTargetId] = (0, import_react.useState)(PRIMARY_ATTACK_TARGET);
	const students = (0, import_react.useMemo)(() => sim.devices.filter((d) => d.zone === "student").map((d) => d.deviceName), [sim.devices]);
	const target = sim.devices.find((d) => d.deviceName === targetId);
	const source = sim.devices.find((d) => d.deviceName === deviceId);
	const attackEvents = sim.events.filter((e) => e.category === "ATTACK" || e.eventType === "POLICY_VIOLATION" || e.eventType === "PORT_SCAN_DETECTED" || e.deviceId === deviceId).slice(0, 12);
	const attackerTiming = sim.isolations.find((i) => i.deviceId === (source?.deviceName ?? "Student-027"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker mt-2",
					children: "Attack simulation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: "Inject simulated adversarial traffic"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Nothing here is captured from a real campus. Attacks are generated inside the JavaScript engine and scored by the same Smart Pod pipeline used on every other page."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenarioTimeline, { state: sim }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Primary research scenario" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"At simulation time 45s, ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: PRIMARY_ATTACK_DEVICE
						}),
						" in the Student zone issues cross-zone TCP toward ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: PRIMARY_ATTACK_TARGET
						}),
						", then ramps into rapid multi-port probing and a high packet-rate flood."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal space-y-1 pl-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Policy violation at the Student Smart Pod" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Behavior window records port traversal and rate spike" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Threat score increases with decayed history" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Security state walks toward throttle / isolation / quarantine" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Forwarding restrictions change topology, analytics, and logs together" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: injectPrimary,
						children: "Run primary scenario now"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Manual inject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted",
							children: ["Attack type", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								className: "mt-1",
								value: type,
								onChange: (e) => setType(e.target.value),
								children: ATTACK_TYPES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: id,
									children: ATTACK_LABEL[id]
								}, id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted",
							children: ["Source device", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								className: "mt-1",
								value: deviceId,
								onChange: (e) => setDeviceId(e.target.value),
								children: students.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: name,
									children: name
								}, name))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted",
							children: ["Target service", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								className: "mt-1",
								value: targetId,
								onChange: (e) => setTargetId(e.target.value),
								children: sim.devices.filter((d) => d.zone === "administration" || d.deviceType === "exam-server").map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: d.deviceName,
									children: [
										d.deviceName,
										" · ",
										d.role
									]
								}, d.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [
								"Target zone: ",
								target ? ZONE_LABEL[target.zone] : "—",
								" · Service: ",
								target?.role ?? "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => inject({
								type,
								deviceId,
								targetDeviceId: targetId,
								targetZone: target?.zone ?? "administration",
								targetService: target?.role
							}),
							children: "Inject attack"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Observed subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm",
					children: [source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: source.deviceName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateBadge, { state: source.currentSecurityState }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: actionFromState(source.currentSecurityState)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								"Pod ",
								source.connectedPod,
								" · ",
								source.ipAddress
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-accent",
							children: ["Threat ", source.threatScore.toFixed(1)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								"Packet rate ",
								source.packetRate.toFixed(1),
								" pps"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								"Ports ",
								source.destinationPorts.join(", ") || "—",
								" · Violations ",
								source.policyViolations
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: ["Isolation latency (this simulation): ", formatMeasured(attackerTiming?.isolationLatencyMs, " ms")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [
								"Paper / NS-3 reported: ",
								"<",
								PAPER_ISOLATION_LATENCY_MS,
								" ms — not this run."
							]
						})
					] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mb-2",
							children: "Detection feed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventList, {
							events: attackEvents,
							empty: "No attack observations yet."
						})]
					})]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Event chain" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventChain, { state: sim }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Link failure / failover" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FailoverSequence, { failover: sim.failover }) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Zone access matrix" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3",
							children: "From \\ To"
						}), Object.keys(POLICY_MATRIX).map((to) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3",
							children: ZONE_LABEL[to]
						}, to))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.keys(POLICY_MATRIX).map((from) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3 text-fg",
							children: ZONE_LABEL[from]
						}), Object.keys(POLICY_MATRIX).map((to) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3 font-mono text-muted",
							children: POLICY_MATRIX[from][to]
						}, to))]
					}, from)) })]
				})
			})] })
		]
	});
}
//#endregion
export { AttackPage as component };
