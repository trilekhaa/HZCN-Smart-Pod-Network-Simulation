//#region node_modules/.nitro/vite/services/ssr/assets/labels-B5kj2H9D.js
/** Enforcement action currently applied by the Policy Enforcement Point. */
function actionFromState$1(state) {
	switch (state) {
		case "HEURISTIC ALERT": return "MONITOR";
		case "BANDWIDTH THROTTLED": return "THROTTLE";
		case "RESTRICTED ISOLATION": return "ISOLATE";
		case "NETWORK-WIDE QUARANTINE": return "QUARANTINE";
		default: return "ALLOW";
	}
}
function currentRoute(device, backupActive) {
	if (device.currentSecurityState === "NETWORK-WIDE QUARANTINE" || device.currentSecurityState === "RESTRICTED ISOLATION") return {
		hops: [
			"CORE-01",
			backupActive ? "BACKUP LINK" : "PRIMARY LINK",
			device.connectedPod,
			device.currentSecurityState
		],
		via: "blocked",
		blocked: true
	};
	if (backupActive) return {
		hops: [
			"CORE-01",
			"BACKUP LINK",
			device.connectedPod
		],
		via: "backup",
		blocked: false
	};
	return {
		hops: [
			"CORE-01",
			"PRIMARY LINK",
			device.connectedPod
		],
		via: "primary",
		blocked: false
	};
}
var ZONE_LABEL = {
	academic: "Academic",
	student: "Student",
	administration: "Administration",
	surveillance: "Surveillance",
	iot: "IoT Laboratory"
};
function actionFromState(state) {
	return actionFromState$1(state);
}
function stateTone(state) {
	switch (state) {
		case "CLEAR ACCESS": return "ok";
		case "HEURISTIC ALERT": return "warn";
		case "BANDWIDTH THROTTLED": return "default";
		case "RESTRICTED ISOLATION": return "warn";
		case "NETWORK-WIDE QUARANTINE": return "danger";
		default: return "muted";
	}
}
function actionTone(action) {
	switch (action) {
		case "ALLOW": return "ok";
		case "MONITOR": return "warn";
		case "THROTTLE": return "default";
		case "ISOLATE": return "warn";
		case "QUARANTINE": return "danger";
		default: return "muted";
	}
}
function eventTone(type) {
	if (type.includes("BLOCKED") || type.includes("FAILURE") || type === "DEVICE_ISOLATED") return "danger";
	if (type.includes("THROTTLED") || type.includes("VIOLATION") || type.includes("SCAN") || type.includes("ATTACK")) return "warn";
	if (type.includes("FAILOVER") || type.includes("STARTED")) return "default";
	return "muted";
}
//#endregion
export { eventTone as a, currentRoute as i, actionFromState as n, stateTone as o, actionTone as r, ZONE_LABEL as t };
