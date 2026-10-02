import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as formatNumber, b as useSimStore, c as SECURITY_STATES, f as ZONE_IDS, m as cn, x as useSimulation } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as SimBanner } from "./SimBanner-Da9PpyeK.mjs";
import { n as actionFromState, r as actionTone, t as ZONE_LABEL } from "./labels-B5kj2H9D.mjs";
import { t as Badge } from "./badge-DwrDLYw1.mjs";
import { n as StateBadge } from "./router-DynITv84.mjs";
import { t as Select } from "./select-DpRE34E1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-DyFiuhSr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle", "transition-[box-shadow,border-color] duration-150", "focus-visible:border-accent/50 focus-visible:outline-none", "disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
function SecurityPage() {
	const sim = useSimulation();
	const select = useSimStore((s) => s.selectDevice);
	const [query, setQuery] = (0, import_react.useState)("");
	const [zone, setZone] = (0, import_react.useState)("all");
	const [state, setState] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("threatScore");
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return sim.devices.filter((d) => {
			if (zone !== "all" && d.zone !== zone) return false;
			if (state !== "all" && d.currentSecurityState !== state) return false;
			if (!q) return true;
			return d.deviceName.toLowerCase().includes(q) || d.ipAddress.includes(q) || d.connectedPod.toLowerCase().includes(q);
		}).sort((a, b) => {
			const av = a[sort];
			const bv = b[sort];
			if (typeof av === "number" && typeof bv === "number") return bv - av;
			return String(av).localeCompare(String(bv));
		});
	}, [
		sim.devices,
		query,
		zone,
		state,
		sort
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker mt-2",
					children: "Security monitoring"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-2xl font-medium tracking-tight",
					children: "Smart Pod observations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Threat scores, security states, and the Action column are produced by the shared scoring engine. Action is the Policy Enforcement Point decision for the current state."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search device, IP, pod",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: zone,
						onChange: (e) => setZone(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All zones"
						}), ZONE_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: id,
							children: ZONE_LABEL[id]
						}, id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: state,
						onChange: (e) => setState(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All states"
						}), SECURITY_STATES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: id,
							children: id
						}, id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "threatScore",
								children: "Sort by threat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "packetRate",
								children: "Sort by packet rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "deviceName",
								children: "Sort by name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "zone",
								children: "Sort by zone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "currentSecurityState",
								children: "Sort by state"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[58rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Device"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Zone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Pod"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "IP address"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Packet rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Threat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Security state"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Last event"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((device) => {
						const action = actionFromState(device.currentSecurityState);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "cursor-pointer border-b border-border/70 hover:bg-elevated",
							onClick: () => select(device.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: device.deviceName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: ZONE_LABEL[device.zone]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: device.connectedPod
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: device.ipAddress
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono tabular",
									children: formatNumber(device.packetRate, 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-accent tabular",
									children: formatNumber(device.threatScore, 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateBadge, { state: device.currentSecurityState })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: actionTone(action),
										children: action
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-[16rem] truncate px-4 py-3 text-xs text-muted",
									children: device.lastEvent
								})
							]
						}, device.id);
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [rows.length, " devices"]
			})
		]
	});
}
//#endregion
export { SecurityPage as component };
