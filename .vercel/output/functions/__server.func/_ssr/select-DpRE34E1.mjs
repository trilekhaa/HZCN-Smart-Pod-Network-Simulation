import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { m as cn } from "./simulation-store-LlRr91Wq.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg", "focus-visible:border-accent/50 focus-visible:outline-none", className),
		...props,
		children
	});
}
//#endregion
export { Select as t };
