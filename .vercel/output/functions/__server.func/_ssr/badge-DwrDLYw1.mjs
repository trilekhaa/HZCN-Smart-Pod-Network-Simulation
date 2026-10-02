import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { m as cn } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DwrDLYw1.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-wide", {
	variants: { variant: {
		default: "border-accent/30 bg-accent/10 text-accent",
		muted: "border-border bg-elevated text-muted",
		ok: "border-ok/30 bg-ok/10 text-ok",
		warn: "border-warn/30 bg-warn/10 text-warn",
		danger: "border-danger/30 bg-danger/10 text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
