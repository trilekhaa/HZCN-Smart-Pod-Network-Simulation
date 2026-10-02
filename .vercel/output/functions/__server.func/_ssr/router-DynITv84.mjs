import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as formatNumber, b as useSimStore, d as SimulationEngine, h as formatInteger, l as SIM_SPEEDS, m as cn, p as bindEngineToStore, t as ATTACK_TYPES, u as SIM_TICK, v as formatSimTime, y as formatSimTimestamp } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as Slot, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as currentRoute, n as actionFromState, o as stateTone, r as actionTone, t as ZONE_LABEL } from "./labels-B5kj2H9D.mjs";
import { t as Badge } from "./badge-DwrDLYw1.mjs";
import { _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shield, c as Play, d as Menu, f as LayoutGrid, i as TriangleAlert, l as Pause, m as Activity, o as ScrollText, p as Crosshair, s as RotateCcw, t as X, u as Network } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DynITv84.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent-dim",
			outline: "border border-border bg-transparent text-fg hover:border-accent/50 hover:text-accent",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			danger: "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
			muted: "bg-elevated text-fg hover:bg-surface-2"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Sheet = Dialog;
function SheetContent({ className, children, side = "right", title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-full max-w-sm flex-col bg-surface shadow-[var(--shadow-border)]", "transition-transform duration-200 ease-out", side === "right" ? "top-0 right-0" : "top-0 left-0", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "rounded-md p-2 text-muted hover:bg-elevated hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto",
			children
		})]
	})] });
}
function ClockBar() {
	const snapshot = useSimStore((s) => s.snapshot);
	const speed = useSimStore((s) => s.speed);
	const setSpeed = useSimStore((s) => s.setSpeed);
	const start = useSimStore((s) => s.start);
	const pause = useSimStore((s) => s.pause);
	const resume = useSimStore((s) => s.resume);
	const reset = useSimStore((s) => s.reset);
	const progress = snapshot.currentTime / 120 * 100;
	const canResume = !snapshot.running && snapshot.currentTime > 0 && !snapshot.scenario.completed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Simulation time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-lg text-accent tabular",
						children: [formatSimTime(snapshot.currentTime), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" / ", formatSimTime(120)]
						})]
					}),
					snapshot.scenario.completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Complete"
					}) : snapshot.running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-ok",
						children: "Running"
					}) : canResume ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Paused"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Idle"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-1.5 overflow-hidden rounded-full bg-elevated",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 bg-accent transition-[width] duration-300",
						style: { width: `${progress}%` }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-warn",
						style: { left: `37.5%` },
						title: "Attack at 45s"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-danger",
						style: { left: `62.5%` },
						title: "Link failure at 75s"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					snapshot.running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "min-h-11 sm:min-h-9",
						onClick: pause,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }), "Pause"]
					}) : canResume ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "min-h-11 sm:min-h-9",
						onClick: resume,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Resume"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "min-h-11 sm:min-h-9",
						onClick: start,
						disabled: snapshot.scenario.completed,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Start"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "min-h-11 sm:min-h-9",
						onClick: reset,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Reset"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pr-1 text-[0.65rem] tracking-[0.14em] text-subtle uppercase",
							children: "Speed"
						}), SIM_SPEEDS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: speed === value ? "default" : "outline",
							className: "min-h-11 min-w-11 px-2 sm:min-h-9 sm:min-w-9",
							onClick: () => setSpeed(value),
							children: [value, "x"]
						}, value))]
					})
				]
			})
		]
	});
}
function StateBadge({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: stateTone(state),
		children: state
	});
}
function Field({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[8.5rem_1fr] gap-2 border-b border-border py-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-mono text-fg tabular",
			children: value
		})]
	});
}
function MiniSpark({ values, color = "var(--color-accent)" }) {
	if (values.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted",
		children: "N/A"
	});
	const max = Math.max(...values, 1);
	const min = Math.min(...values, 0);
	const w = 220;
	const h = 48;
	const pts = values.map((v, i) => {
		return `${i / (values.length - 1) * w},${h - (v - min) / Math.max(max - min, 1) * 44 - 2}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "h-12 w-full",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
			fill: "none",
			stroke: color,
			strokeWidth: "1.6",
			points: pts
		})
	});
}
function DeviceDrawer() {
	const selected = useSimStore((s) => s.selectedDeviceId);
	const select = useSimStore((s) => s.selectDevice);
	const snapshot = useSimStore((s) => s.snapshot);
	const device = snapshot.devices.find((d) => d.id === selected || d.deviceName === selected);
	const events = device ? snapshot.events.filter((e) => e.deviceId === device.deviceName).slice(0, 8) : [];
	const pod = device ? snapshot.pods.find((p) => p.podId === device.connectedPod) : void 0;
	const backup = pod ? snapshot.links.find((l) => l.id === pod.backupLink) : void 0;
	const route = device ? currentRoute(device, backup?.status === "active") : null;
	const action = device ? actionFromState(device.currentSecurityState) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: Boolean(device),
		onOpenChange: (open) => !open && select(null),
		children: device ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			title: device.deviceName,
			side: "right",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateBadge, { state: device.currentSecurityState }),
							action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: actionTone(action),
								children: action
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: device.role
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Device ID",
							value: device.deviceId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "IP address",
							value: device.ipAddress
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Zone",
							value: ZONE_LABEL[device.zone]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Smart Pod",
							value: device.connectedPod
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Device type",
							value: device.deviceType
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Packet rate",
							value: `${formatNumber(device.packetRate, 1)} pps`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Threat score",
							value: formatNumber(device.threatScore, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Security state",
							value: device.currentSecurityState
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Current action",
							value: action ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Policy violations",
							value: formatInteger(device.policyViolations)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Destination ports",
							value: device.destinationPorts.length ? device.destinationPorts.join(", ") : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Current route",
							value: route ? `${route.hops.join(" → ")}${route.blocked ? " (blocked)" : ""}` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Isolation latency",
							value: device.isolationLatencyMs == null ? "N/A" : `${Math.round(device.isolationLatencyMs)} ms`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Last event",
							value: device.lastEvent || "—"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker mt-6 mb-2",
						children: "Threat score history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSpark, {
						values: device.threatHistory,
						color: "var(--color-danger)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker mt-4 mb-2",
						children: "Packet rate history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSpark, { values: device.packetRateHistory }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker mt-4 mb-2",
						children: "Security state history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 text-xs",
						children: device.stateHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted",
							children: "N/A"
						}) : device.stateHistory.map((sample, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "font-mono text-muted",
							children: [
								formatSimTimestamp(sample.t),
								" · ",
								sample.state
							]
						}, `${sample.t}-${i}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker mt-6 mb-2",
						children: "Recent events"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "No device events yet."
						}) : events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-elevated px-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-accent",
								children: [
									formatSimTimestamp(event.simulationTime),
									" · ",
									event.eventType
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: event.description
							})]
						}, event.id))
					})
				]
			})
		}) : null
	});
}
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutGrid
	},
	{
		to: "/topology",
		label: "Campus Topology",
		icon: Network
	},
	{
		to: "/security",
		label: "Security Monitoring",
		icon: Shield
	},
	{
		to: "/attack",
		label: "Attack Simulation",
		icon: Crosshair
	},
	{
		to: "/analytics",
		label: "Network Analytics",
		icon: Activity
	},
	{
		to: "/logs",
		label: "Logs & Events",
		icon: ScrollText
	}
];
function NavLinks({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item) => {
			const active = pathname === item.to;
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150", active ? "bg-accent/15 text-accent" : "text-muted hover:bg-elevated hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
			}, item.to);
		})
	});
}
function AppShell({ children }) {
	const mobileOpen = useSimStore((s) => s.mobileNavOpen);
	const setMobile = useSimStore((s) => s.setMobileNavOpen);
	(0, import_react.useEffect)(() => bindEngineToStore(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden border-r border-border bg-surface lg:flex lg:flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 pt-6 pb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Smart Pod HZCN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 text-lg font-medium tracking-tight",
								children: "Control center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Hybrid Zoned Campus Network"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto px-5 py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.7rem] leading-relaxed text-subtle",
							children: "Software simulation only. No live campus traffic, packet capture, or physical Smart Pods."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "outline",
								className: "lg:hidden",
								onClick: () => setMobile(true),
								"aria-label": "Open navigation",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Smart Pod HZCN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.14em] text-accent uppercase",
									children: "Simulation mode"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "HZCN simulation · not live network monitoring"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockBar, {})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 py-5 sm:px-6",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: mobileOpen,
				onOpenChange: setMobile,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					side: "left",
					title: "Smart Pod HZCN",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate: () => setMobile(false) })
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceDrawer, {})
		]
	});
}
var styles_default = "/assets/styles-Bh97XtHW.css";
var APP_NAME = "Smart Pod HZCN";
var Route$17 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#070807"
			},
			{
				name: "description",
				content: "Software simulation of a Hybrid Zoned Campus Network with Smart Pod edge enforcement, threat scoring, and failover."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-C9JfRgYD.mjs");
var Route$16 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./analytics-DZZZmy6d.mjs");
var Route$15 = createFileRoute("/analytics")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./attack-Bxu2D9ip.mjs");
var Route$14 = createFileRoute("/attack")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./logs-CUeSEA24.mjs");
var Route$13 = createFileRoute("/logs")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./security-DyFiuhSr.mjs");
var Route$12 = createFileRoute("/security")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./topology-CDrEg_fR.mjs");
var Route$11 = createFileRoute("/topology")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
/**
* Optional server-side inspection copy of SimulationEngine.
*
* The live dashboard does NOT use this instance. All UI pages read the
* client Zustand store bound to a single browser SimulationEngine.
* Hitting these REST endpoints starts a separate process-local engine
* that is useful for curl/debug only.
*/
var g = globalThis;
function getServerEngine() {
	if (!g.__hzcnEngine) g.__hzcnEngine = new SimulationEngine();
	return g.__hzcnEngine;
}
function ensureServerLoop() {
	if (g.__hzcnLoop) return;
	g.__hzcnLoop = setInterval(() => {
		const engine = getServerEngine();
		if (engine.state.running) engine.step();
	}, Math.round(SIM_TICK * 1e3));
}
function publicSnapshot() {
	const state = getServerEngine().state;
	return {
		running: state.running,
		currentTime: state.currentTime,
		version: state.version,
		metrics: state.metrics,
		security: state.security,
		dpq: state.dpq,
		core: state.core,
		scenario: state.scenario,
		devices: state.devices,
		pods: state.pods,
		zones: state.zones,
		links: state.links,
		trafficFlows: state.trafficFlows,
		events: state.events.slice(0, 100),
		history: state.history,
		attacks: state.attacks,
		mode: "SIMULATION MODE"
	};
}
var Route$10 = createFileRoute("/api/analytics")({ server: { handlers: { GET: async () => {
	const state = getServerEngine().state;
	return Response.json({
		metrics: state.metrics,
		security: state.security,
		dpq: state.dpq,
		history: state.history,
		mode: "SIMULATION MODE"
	});
} } } });
var Route$9 = createFileRoute("/api/devices")({ server: { handlers: { GET: async () => Response.json(getServerEngine().state.devices) } } });
var Route$8 = createFileRoute("/api/events")({ server: { handlers: { GET: async () => Response.json(getServerEngine().state.events) } } });
var Route$7 = createFileRoute("/api/pods")({ server: { handlers: { GET: async () => Response.json(getServerEngine().state.pods) } } });
var Route$6 = createFileRoute("/api/zones")({ server: { handlers: { GET: async () => Response.json(getServerEngine().state.zones) } } });
var Route$5 = createFileRoute("/api/simulation/attack")({ server: { handlers: { POST: async ({ request }) => {
	let body = {};
	try {
		body = await request.json();
	} catch {
		body = {};
	}
	const type = ATTACK_TYPES.includes(body.type) ? body.type : "combined";
	getServerEngine().injectAttack({
		type,
		deviceId: body.deviceId || "Student-027",
		targetDeviceId: body.targetDeviceId,
		targetZone: body.targetZone,
		targetService: body.targetService
	});
	ensureServerLoop();
	return Response.json(publicSnapshot());
} } } });
var Route$4 = createFileRoute("/api/simulation/congestion")({ server: { handlers: { POST: async () => {
	getServerEngine().startCongestion();
	ensureServerLoop();
	return Response.json(publicSnapshot());
} } } });
var Route$3 = createFileRoute("/api/simulation/failure")({ server: { handlers: { POST: async ({ request }) => {
	let podId = "POD-01";
	try {
		const body = await request.json();
		if (body.podId) podId = body.podId;
	} catch {}
	getServerEngine().simulateLinkFailure(podId);
	ensureServerLoop();
	return Response.json(publicSnapshot());
} } } });
var Route$2 = createFileRoute("/api/simulation/reset")({ server: { handlers: { POST: async () => {
	getServerEngine().reset();
	return Response.json(publicSnapshot());
} } } });
var Route$1 = createFileRoute("/api/simulation/start")({ server: { handlers: { POST: async () => {
	getServerEngine().start();
	ensureServerLoop();
	return Response.json(publicSnapshot());
} } } });
var Route = createFileRoute("/api/simulation/state")({ server: { handlers: { GET: async () => Response.json(publicSnapshot()) } } });
var rootRouteChildren = {
	IndexRoute: Route$16.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$17
	}),
	AnalyticsRoute: Route$15.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => Route$17
	}),
	AttackRoute: Route$14.update({
		id: "/attack",
		path: "/attack",
		getParentRoute: () => Route$17
	}),
	LogsRoute: Route$13.update({
		id: "/logs",
		path: "/logs",
		getParentRoute: () => Route$17
	}),
	SecurityRoute: Route$12.update({
		id: "/security",
		path: "/security",
		getParentRoute: () => Route$17
	}),
	TopologyRoute: Route$11.update({
		id: "/topology",
		path: "/topology",
		getParentRoute: () => Route$17
	}),
	ApiAnalyticsRoute: Route$10.update({
		id: "/api/analytics",
		path: "/api/analytics",
		getParentRoute: () => Route$17
	}),
	ApiDevicesRoute: Route$9.update({
		id: "/api/devices",
		path: "/api/devices",
		getParentRoute: () => Route$17
	}),
	ApiEventsRoute: Route$8.update({
		id: "/api/events",
		path: "/api/events",
		getParentRoute: () => Route$17
	}),
	ApiPodsRoute: Route$7.update({
		id: "/api/pods",
		path: "/api/pods",
		getParentRoute: () => Route$17
	}),
	ApiZonesRoute: Route$6.update({
		id: "/api/zones",
		path: "/api/zones",
		getParentRoute: () => Route$17
	}),
	ApiSimulationAttackRoute: Route$5.update({
		id: "/api/simulation/attack",
		path: "/api/simulation/attack",
		getParentRoute: () => Route$17
	}),
	ApiSimulationCongestionRoute: Route$4.update({
		id: "/api/simulation/congestion",
		path: "/api/simulation/congestion",
		getParentRoute: () => Route$17
	}),
	ApiSimulationFailureRoute: Route$3.update({
		id: "/api/simulation/failure",
		path: "/api/simulation/failure",
		getParentRoute: () => Route$17
	}),
	ApiSimulationResetRoute: Route$2.update({
		id: "/api/simulation/reset",
		path: "/api/simulation/reset",
		getParentRoute: () => Route$17
	}),
	ApiSimulationStartRoute: Route$1.update({
		id: "/api/simulation/start",
		path: "/api/simulation/start",
		getParentRoute: () => Route$17
	}),
	ApiSimulationStateRoute: Route.update({
		id: "/api/simulation/state",
		path: "/api/simulation/state",
		getParentRoute: () => Route$17
	})
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { StateBadge as n, Button as r, router_exports as t };
