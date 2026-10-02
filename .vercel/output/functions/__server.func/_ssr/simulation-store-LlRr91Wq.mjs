import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulation-store-LlRr91Wq.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatSimTime(seconds) {
	const tenths = Math.round(Math.max(0, Math.min(120, seconds)) * 10);
	const m = Math.floor(tenths / 600);
	const rem = tenths - m * 600;
	const s = Math.floor(rem / 10);
	const frac = rem % 10;
	const mm = m.toString().padStart(2, "0");
	const ss = s.toString().padStart(2, "0");
	if (frac === 0) return `${mm}:${ss}`;
	return `${mm}:${ss}.${frac}`;
}
/** Event / sequence timestamps: t=75.0s, t=75.5s */
function formatSimTimestamp(seconds) {
	return `t=${(Math.round(seconds * 10) / 10).toFixed(1)}s`;
}
function formatNumber(value, digits = 1) {
	if (!Number.isFinite(value)) return "—";
	return value.toLocaleString(void 0, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	});
}
function formatInteger(value) {
	return Math.round(value).toLocaleString();
}
function formatMeasured(value, suffix) {
	if (value == null || !Number.isFinite(value)) return "N/A";
	return `${Math.round(value)}${suffix}`;
}
var ZONE_IDS = [
	"academic",
	"student",
	"administration",
	"surveillance",
	"iot"
];
var SECURITY_STATES = [
	"CLEAR ACCESS",
	"HEURISTIC ALERT",
	"BANDWIDTH THROTTLED",
	"RESTRICTED ISOLATION",
	"NETWORK-WIDE QUARANTINE"
];
var ATTACK_TYPES = [
	"cross-zone",
	"port-scan",
	"traffic-flood",
	"combined"
];
var EVENT_CATEGORIES = [
	"ALL",
	"SECURITY",
	"TRAFFIC",
	"ATTACK",
	"FAILURE",
	"SYSTEM"
];
var SIM_TICK = .1;
var HEARTBEAT_TIMEOUT = .5;
var PRIMARY_ATTACK_DEVICE = "Student-027";
var PRIMARY_ATTACK_TARGET = "Admin-DB";
var DISTRIBUTION_CAPACITY_MBPS = 1e3;
/** NS-3 / paper reported figure — not a measurement of this JavaScript simulation. */
var PAPER_ISOLATION_LATENCY_MS = 4.2;
var SIM_SPEEDS = [
	.5,
	1,
	2,
	5,
	10
];
var POLICY_MATRIX = {
	academic: {
		academic: "ALLOW",
		student: "LIMITED",
		administration: "DENY",
		surveillance: "DENY",
		iot: "LIMITED"
	},
	student: {
		academic: "LIMITED",
		student: "ALLOW",
		administration: "DENY",
		surveillance: "DENY",
		iot: "DENY"
	},
	administration: {
		academic: "LIMITED",
		student: "LIMITED",
		administration: "ALLOW",
		surveillance: "LIMITED",
		iot: "LIMITED"
	},
	surveillance: {
		academic: "DENY",
		student: "DENY",
		administration: "LIMITED",
		surveillance: "ALLOW",
		iot: "DENY"
	},
	iot: {
		academic: "LIMITED",
		student: "DENY",
		administration: "DENY",
		surveillance: "DENY",
		iot: "ALLOW"
	}
};
/** Permitted destination ports for LIMITED cross-zone pairs. */
var LIMITED_PORTS = {
	student: { academic: [
		53,
		80,
		443,
		8080
	] },
	academic: {
		student: [
			80,
			443,
			8080
		],
		iot: [443, 1883]
	},
	administration: {
		academic: [
			22,
			80,
			443,
			8080
		],
		student: [443],
		surveillance: [443, 554],
		iot: [443, 1883]
	},
	surveillance: { administration: [443, 6514] },
	iot: { academic: [443, 1883] }
};
var ZONE_LABEL = {
	academic: "Academic",
	student: "Student",
	administration: "Administration",
	surveillance: "Surveillance",
	iot: "IoT Laboratory"
};
function inspectFlow(source, destination, destinationPort) {
	if (source.zone === destination.zone) return {
		allowed: true,
		decision: "ALLOW",
		reason: "Intra-zone traffic"
	};
	const decision = POLICY_MATRIX[source.zone][destination.zone];
	if (decision === "ALLOW") return {
		allowed: true,
		decision,
		reason: "Zone policy allow"
	};
	if (decision === "DENY") return {
		allowed: false,
		decision,
		reason: `${ZONE_LABEL[source.zone]} → ${ZONE_LABEL[destination.zone]} denied by Smart Pod policy`
	};
	if ((LIMITED_PORTS[source.zone]?.[destination.zone] ?? []).includes(destinationPort)) return {
		allowed: true,
		decision: "LIMITED",
		reason: `Permitted academic/designated service on port ${destinationPort}`
	};
	return {
		allowed: false,
		decision: "LIMITED",
		reason: `Port ${destinationPort} is not a designated service for ${ZONE_LABEL[source.zone]} → ${ZONE_LABEL[destination.zone]}`
	};
}
function applyPolicy(flow, source, destination) {
	const result = inspectFlow(source, destination, flow.destinationPort);
	if (!result.allowed) return {
		...flow,
		allowed: false,
		dropped: true,
		dropReason: result.reason
	};
	return {
		...flow,
		allowed: true,
		dropped: false,
		dropReason: ""
	};
}
function emptyBehavior() {
	return {
		window: [],
		uniquePorts: [],
		avgPacketRate: 0,
		maxPacketRate: 0,
		violationCount: 0,
		rapidPortProbe: false
	};
}
/** Sliding 5-second window over measurable network behavior only. */
function pushSample(current, sample) {
	const window = [...current.window, sample].slice(-5);
	const portSet = /* @__PURE__ */ new Set();
	let rateSum = 0;
	let maxRate = 0;
	let violations = 0;
	for (const item of window) {
		rateSum += item.packetRate;
		if (item.packetRate > maxRate) maxRate = item.packetRate;
		violations += item.policyViolations;
		for (const port of item.ports) portSet.add(port);
	}
	const uniquePorts = [...portSet].sort((a, b) => a - b);
	return {
		window,
		uniquePorts,
		avgPacketRate: window.length ? rateSum / window.length : 0,
		maxPacketRate: maxRate,
		violationCount: violations,
		rapidPortProbe: uniquePorts.length >= 8
	};
}
function forwardingForState(state) {
	switch (state) {
		case "HEURISTIC ALERT": return {
			factor: 1,
			eastWestAllowed: true,
			remediationOnly: false,
			blocked: false
		};
		case "BANDWIDTH THROTTLED": return {
			factor: .4,
			eastWestAllowed: true,
			remediationOnly: false,
			blocked: false
		};
		case "RESTRICTED ISOLATION": return {
			factor: .12,
			eastWestAllowed: false,
			remediationOnly: true,
			blocked: false
		};
		case "NETWORK-WIDE QUARANTINE": return {
			factor: 0,
			eastWestAllowed: false,
			remediationOnly: true,
			blocked: true
		};
		default: return {
			factor: 1,
			eastWestAllowed: true,
			remediationOnly: false,
			blocked: false
		};
	}
}
var REMEDIATION_PORTS = /* @__PURE__ */ new Set([
	53,
	80,
	443
]);
function applySecurityToRate(device, offeredPps, destPort, destZone, trafficClass) {
	const decision = forwardingForState(device.currentSecurityState);
	if (decision.blocked) return {
		forwardedPps: 0,
		reason: "Network-wide quarantine"
	};
	if (decision.remediationOnly && !REMEDIATION_PORTS.has(destPort)) return {
		forwardedPps: 0,
		reason: "Restricted isolation — non-remediation traffic blocked"
	};
	if (!decision.eastWestAllowed && destZone === device.zone && !REMEDIATION_PORTS.has(destPort)) return {
		forwardedPps: 0,
		reason: "East-west drop under restricted isolation"
	};
	let factor = decision.factor;
	if (device.currentSecurityState === "BANDWIDTH THROTTLED" && trafficClass === "BACKGROUND") factor *= .35;
	return {
		forwardedPps: offeredPps * factor,
		reason: ""
	};
}
function throttleFactorFor(device) {
	return forwardingForState(device.currentSecurityState).factor;
}
/** Deterministic mulberry32 PRNG for reproducible demonstrations. */
function mulberry32(seed) {
	let s = seed >>> 0;
	return () => {
		s += 1831565813;
		let t = s;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function randRange(rng, min, max) {
	return min + rng() * (max - min);
}
function randInt(rng, min, max) {
	return Math.floor(randRange(rng, min, max + 1));
}
function pick(rng, items) {
	return items[Math.floor(rng() * items.length)];
}
function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
/**
* Research threat model:
* Threat(t) = Threat(t-1) × 0.95 + NewTelemetry(t), clamped 0–100.
*/
function computeTelemetry(input) {
	let telemetry = 0;
	const parts = [];
	if (input.policyViolationsThisTick > 0) {
		telemetry += 25;
		parts.push("policy+25");
	}
	if (input.packetRate > 80) {
		const volumetric = Math.min(input.packetRate / 3.5, 40);
		telemetry += volumetric;
		parts.push(`vol+${volumetric.toFixed(1)}`);
	}
	if (input.rapidPortProbe) {
		telemetry += 35;
		parts.push("scan+35");
	}
	if (input.packetRate > 160) {
		const severe = Math.min(20, (input.packetRate - 160) / 80 * 20);
		telemetry += severe;
		parts.push(`dev+${severe.toFixed(1)}`);
	}
	return {
		telemetry,
		parts
	};
}
function nextThreatScore(previous, telemetry) {
	return clamp(previous * .95 + telemetry, 0, 100);
}
function stateFromScore(score) {
	if (score >= 85) return "NETWORK-WIDE QUARANTINE";
	if (score >= 70) return "RESTRICTED ISOLATION";
	if (score >= 55) return "BANDWIDTH THROTTLED";
	if (score >= 40) return "HEURISTIC ALERT";
	return "CLEAR ACCESS";
}
function statusFromState(state) {
	switch (state) {
		case "NETWORK-WIDE QUARANTINE": return "blocked";
		case "RESTRICTED ISOLATION": return "isolated";
		case "BANDWIDTH THROTTLED":
		case "HEURISTIC ALERT": return "degraded";
		default: return "online";
	}
}
/** Simulated 1 Gbps core/distribution-layer capacity expressed as packets/s at mean size. */
var DISTRIBUTION_CAPACITY_PPS = DISTRIBUTION_CAPACITY_MBPS * 1e6 / 5120;
function mbpsFromPps(pps, packetBytes = 640) {
	return pps * packetBytes * 8 / 1e6;
}
function ppsFromMbps(mbps, packetBytes = 640) {
	return mbps * 1e6 / Math.max(1, packetBytes * 8);
}
function computeDelay(input) {
	const congestionDelay = input.congestionIntensity * 28;
	const queueDelay = Math.max(0, input.utilization - .6) * 22;
	const failoverDelay = input.failover ? 3.2 : 0;
	return input.baseMs + congestionDelay + queueDelay + failoverDelay;
}
function computeLoss(input) {
	const failLoss = input.failedLinks > 0 ? .012 : 0;
	return clamp(8e-4 + input.extraLoss + input.dpqDrop * .65 + failLoss + input.quarantineDrop * .05, 0, .45);
}
function computeHealth(input) {
	const delayNorm = clamp((input.delay - 2) / 40, 0, 1);
	return clamp(100 - (input.loss * 48 + delayNorm * 22 + input.failedLinks * 8 + input.blocked * .35 + input.isolated * .2), 4, 100);
}
function updateCore(core, metrics, links) {
	const failed = links.filter((l) => l.failed || l.status === "failed").length;
	const active = links.filter((l) => {
		if (l.failed || l.status === "failed") return false;
		if (l.kind === "primary") return true;
		return l.status === "active";
	}).length;
	return {
		...core,
		totalThroughput: metrics.throughput,
		averageDelay: metrics.averageDelay,
		packetLoss: metrics.packetLoss,
		packetDeliveryRatio: metrics.packetDeliveryRatio,
		activeLinks: active,
		failedLinks: failed,
		networkHealth: metrics.networkHealth,
		distributionCapacityMbps: DISTRIBUTION_CAPACITY_MBPS,
		utilization: metrics.coreUtilization
	};
}
function updatePodStats(pods, perPod) {
	return pods.map((pod) => {
		const stats = perPod[pod.podId] ?? {
			pps: 0,
			bps: 0,
			loss: 0,
			delivered: 0
		};
		return {
			...pod,
			trafficStats: {
				pps: stats.pps,
				bps: stats.bps,
				loss: stats.loss,
				deliveredPps: stats.delivered
			}
		};
	});
}
function linkUtilization(pps, capacityPps = DISTRIBUTION_CAPACITY_PPS) {
	return clamp(pps / Math.max(1, capacityPps), 0, 1.4);
}
var ORDER = [
	"CRITICAL",
	"HIGH",
	"NORMAL",
	"BACKGROUND"
];
/**
* Simulated Dynamic Priority Queuing.
* This is not Linux tc — it models class-based protection during congestion
* against the 1 Gbps distribution-layer capacity.
*/
function applyDpq(offered, capacityPps, congestion) {
	const effectiveCapacity = capacityPps * (1 - congestion * .22);
	const delivered = {
		critical: 0,
		high: 0,
		normal: 0,
		background: 0
	};
	const dropped = {
		critical: 0,
		high: 0,
		normal: 0,
		background: 0
	};
	let remaining = Math.max(40, effectiveCapacity);
	for (const cls of ORDER) {
		const key = cls.toLowerCase();
		const want = offered[key];
		const give = Math.min(want, remaining);
		delivered[key] = give;
		dropped[key] = Math.max(0, want - give);
		remaining -= give;
	}
	delivered.critical + delivered.high + delivered.normal + delivered.background;
	return {
		delivered,
		dropped,
		stats: {
			critical: occupancy(offered.critical, delivered.critical),
			high: occupancy(offered.high, delivered.high),
			normal: occupancy(offered.normal, delivered.normal),
			background: occupancy(offered.background, delivered.background),
			criticalDrop: dropRatio(offered.critical, dropped.critical),
			highDrop: dropRatio(offered.high, dropped.high),
			normalDrop: dropRatio(offered.normal, dropped.normal),
			backgroundDrop: dropRatio(offered.background, dropped.background),
			capacity: effectiveCapacity,
			capacityMbps: DISTRIBUTION_CAPACITY_MBPS * (1 - congestion * .22),
			allocatedMbps: {
				critical: mbpsFromPps(delivered.critical),
				high: mbpsFromPps(delivered.high),
				normal: mbpsFromPps(delivered.normal),
				background: mbpsFromPps(delivered.background)
			}
		}
	};
}
function occupancy(offered, delivered) {
	if (offered <= 0) return 8;
	return clamp((1.05 - delivered / Math.max(offered, 1)) * 70 + 12, 6, 100);
}
function dropRatio(offered, dropped) {
	if (offered <= 0) return 0;
	return dropped / offered;
}
function evaluateCongestion(input) {
	let intensity = clamp((input.offeredPps / Math.max(1, input.capacityPps) - .72) / .55, 0, 1);
	if (input.enabled) {
		const ramp = clamp((input.currentTime - 12) / 28, 0, 1);
		intensity = clamp(Math.max(intensity, .38 + ramp * .45), 0, 1);
	} else if (input.currentTime > 18 && input.currentTime < 45) intensity = clamp(Math.max(intensity, (input.currentTime - 18) / 90), 0, .42);
	intensity = clamp(intensity + input.failedLinks * .08, 0, 1);
	return {
		intensity,
		loadMultiplier: input.enabled ? lerp(1.15, 1.85, intensity) : lerp(1, 1.28, intensity),
		delayMultiplier: 1 + intensity * 3.4,
		extraLoss: intensity * .072
	};
}
/** Packets/s the simulated 1 Gbps distribution layer can carry at a given mean size. */
function distributionCapacityPps(meanPacketBytes) {
	return ppsFromMbps(DISTRIBUTION_CAPACITY_MBPS, meanPacketBytes);
}
/**
* Activate backup path and recalculate routes.
* Security state on every device is preserved — routing must not reset it.
*/
function activateFailover(pods, links, devices, podId) {
	const nextLinks = links.map((link) => {
		if (link.podId !== podId) return link;
		if (link.kind === "primary") return {
			...link,
			failed: true,
			status: "failed",
			utilization: 0
		};
		return {
			...link,
			status: "active",
			failed: false,
			delayMs: link.delayMs + 2.4
		};
	});
	return {
		pods: pods.map((pod) => {
			if (pod.podId !== podId) return pod;
			return {
				...pod,
				status: "failover",
				heartbeatStatus: "timeout"
			};
		}),
		links: nextLinks,
		devices: devices.map((device) => ({ ...device }))
	};
}
function failPrimaryLink(link) {
	return {
		...link,
		failed: true,
		status: "failed",
		utilization: 0
	};
}
function checkHeartbeat(pod, primary, simTime) {
	if (primary.failed || primary.status === "failed") return {
		timeout: simTime - pod.lastHeartbeat + 1e-9 >= HEARTBEAT_TIMEOUT,
		podId: pod.podId,
		linkId: primary.id
	};
	return {
		timeout: false,
		podId: pod.podId,
		linkId: primary.id
	};
}
function beat(pod, simTime) {
	return {
		...pod,
		lastHeartbeat: simTime,
		heartbeatStatus: "ok"
	};
}
/** Snap virtual time to 0.1s so 75 + 0.5 is exactly 75.5, not 75.499999. */
function roundSimTime(t) {
	return Math.round(t * 10) / 10;
}
function isWholeSimSecond(t) {
	return Math.abs(t - Math.round(t)) < 1e-9;
}
var SimulationClock = class {
	currentTime = 0;
	running = false;
	completed = false;
	start() {
		if (this.completed) return;
		this.running = true;
	}
	pause() {
		this.running = false;
	}
	reset() {
		this.currentTime = 0;
		this.running = false;
		this.completed = false;
	}
	tick() {
		if (!this.running || this.completed) return {
			time: this.currentTime,
			completed: this.completed
		};
		this.currentTime = roundSimTime(this.currentTime + SIM_TICK);
		if (this.currentTime >= 120 - 1e-9) {
			this.currentTime = 120;
			this.running = false;
			this.completed = true;
		}
		return {
			time: this.currentTime,
			completed: this.completed
		};
	}
};
var ACADEMIC_PORTS = [
	80,
	443,
	8080,
	53
];
var STUDENT_PORTS = [
	80,
	443,
	53
];
var ADMIN_PORTS = [
	443,
	22,
	5432
];
var CAMERA_PORTS = [554, 443];
var IOT_PORTS = [1883, 443];
var SCAN_PORTS = [
	21,
	22,
	23,
	80,
	135,
	139,
	443,
	445,
	1433,
	3306,
	3389,
	5432,
	5900,
	8080,
	8443
];
function destinationFor(device, devices, rng) {
	const sameZone = devices.filter((d) => d.zone === device.zone && d.id !== device.id);
	const academic = devices.filter((d) => d.zone === "academic");
	const exam = devices.find((d) => d.deviceType === "exam-server") ?? academic[0];
	const adminDb = devices.find((d) => d.deviceType === "admin-db");
	const nvr = devices.find((d) => d.deviceType === "nvr");
	switch (device.zone) {
		case "student":
			if (rng() < .62 && academic.length) return pick(rng, academic);
			return sameZone.length ? pick(rng, sameZone) : device;
		case "academic":
			if (rng() < .2 && exam) return exam;
			return sameZone.length ? pick(rng, sameZone) : device;
		case "administration":
			if (rng() < .35 && adminDb && adminDb.id !== device.id) return adminDb;
			return sameZone.length ? pick(rng, sameZone) : device;
		case "surveillance":
			if (nvr && device.deviceType === "camera") return nvr;
			return sameZone.length ? pick(rng, sameZone) : device;
		case "iot": {
			const academicLab = academic[1] ?? academic[0];
			if (rng() < .4 && academicLab) return academicLab;
			return sameZone.length ? pick(rng, sameZone) : device;
		}
	}
}
function portsFor(device, dest, rng) {
	if (dest.deviceType === "admin-db") return pick(rng, [443, 5432]);
	if (dest.deviceType === "exam-server") return pick(rng, [443, 8080]);
	if (dest.deviceType === "nvr") return 554;
	if (dest.zone === "iot") return pick(rng, IOT_PORTS);
	if (device.zone === "student") return pick(rng, STUDENT_PORTS);
	if (device.zone === "academic") return pick(rng, ACADEMIC_PORTS);
	if (device.zone === "administration") return pick(rng, ADMIN_PORTS);
	if (device.zone === "surveillance") return pick(rng, CAMERA_PORTS);
	return 443;
}
function classForFlow(source, dest) {
	if (dest.deviceType === "exam-server" || source.deviceType === "exam-server") return "CRITICAL";
	if (dest.deviceType === "admin-db" || source.deviceType === "admin-db") return "HIGH";
	if (source.zone === "surveillance" || dest.zone === "surveillance") return "HIGH";
	if (source.zone === "student") return "BACKGROUND";
	return source.defaultClass;
}
function offeredRate(device, t, congestionMul, rng) {
	const jitter = .82 + rng() * .36;
	const diurnal = .9 + .15 * Math.sin(t / 120 * Math.PI);
	return Math.max(.4, device.basePacketRate * jitter * diurnal * congestionMul);
}
function packetSizeFor(cls, rng) {
	switch (cls) {
		case "CRITICAL": return randInt(rng, 520, 900);
		case "HIGH": return randInt(rng, 700, 1280);
		case "NORMAL": return randInt(rng, 400, 1100);
		default: return randInt(rng, 220, 760);
	}
}
function attackOfferedRate(profile, t) {
	const elapsed = t - profile.startedAt;
	switch (profile.type) {
		case "cross-zone": return 22 + Math.min(18, elapsed * 3);
		case "port-scan": return 36 + elapsed * 4;
		case "traffic-flood": return 90 + elapsed * 14;
		case "combined":
			if (elapsed <= 1) return 28;
			if (elapsed <= 3) return 48;
			if (elapsed <= 5) return 86;
			return 170 + elapsed * 6;
	}
}
function attackPorts(profile, elapsed, rng) {
	if (profile.type === "cross-zone") return [5432, 443];
	if (profile.type === "traffic-flood") return [5432];
	if (profile.type === "port-scan") {
		const count = Math.min(SCAN_PORTS.length, 6 + elapsed * 2);
		return SCAN_PORTS.slice(0, count);
	}
	if (elapsed <= 1) return [5432];
	if (elapsed <= 4) return [
		5432,
		443,
		22
	];
	const count = Math.min(SCAN_PORTS.length, 8 + elapsed);
	const shuffled = [...SCAN_PORTS];
	for (let i = shuffled.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, count);
}
function makeFlow(opts) {
	return {
		id: opts.id,
		sourceDevice: opts.source.deviceName,
		destinationDevice: opts.dest.deviceName,
		sourceZone: opts.source.zone,
		destinationZone: opts.dest.zone,
		protocol: opts.protocol ?? "TCP",
		sourcePort: 4e4 + (opts.t * 17 + opts.source.deviceName.length) % 2e4,
		destinationPort: opts.port,
		packetSize: opts.packetSize,
		packetRate: opts.rate,
		timestamp: opts.t,
		priority: opts.cls,
		trafficType: opts.trafficType,
		allowed: true,
		dropped: false,
		dropReason: ""
	};
}
function sampleNormalFlows(devices, t, rng, limit = 10) {
	const flows = [];
	const candidates = devices.filter((d) => d.status !== "offline");
	for (let i = 0; i < limit; i += 1) {
		const source = pick(rng, candidates);
		const dest = destinationFor(source, devices, rng);
		if (dest.id === source.id) continue;
		const cls = classForFlow(source, dest);
		const port = portsFor(source, dest, rng);
		flows.push(makeFlow({
			id: `flow-${t}-${i}`,
			source,
			dest,
			port,
			rate: Math.max(1, source.offeredPacketRate / 4),
			t,
			trafficType: `${source.zone}-to-${dest.zone}`,
			cls,
			packetSize: packetSizeFor(cls, rng)
		}));
	}
	return flows;
}
var DEFAULT_SEED = 20261002;
var EMPTY_METRICS = {
	throughput: 0,
	averageDelay: 1.8,
	packetLoss: 0,
	packetDeliveryRatio: 1,
	offeredPps: 0,
	deliveredPps: 0,
	droppedPps: 0,
	networkHealth: 100,
	offeredMbps: 0,
	coreUtilization: 0,
	isolationLatencyMs: null,
	failoverDurationMs: null,
	policyViolations: 0,
	packetsBlocked: 0,
	packetsThrottled: 0
};
function pad(n) {
	return n.toString().padStart(3, "0");
}
function zoneOctet(zone) {
	switch (zone) {
		case "academic": return 1;
		case "student": return 2;
		case "administration": return 3;
		case "surveillance": return 4;
		case "iot": return 5;
	}
}
function createZones() {
	return [
		{
			id: "academic",
			name: "Academic",
			cidr: "10.10.1.0/24",
			description: "Faculty workstations, exam services, course platforms",
			podIds: ["POD-01", "POD-02"],
			deviceCount: 0
		},
		{
			id: "student",
			name: "Student",
			cidr: "10.10.2.0/24",
			description: "Student laptops and residential endpoints",
			podIds: [
				"POD-03",
				"POD-04",
				"POD-05"
			],
			deviceCount: 0
		},
		{
			id: "administration",
			name: "Administration",
			cidr: "10.10.3.0/24",
			description: "Registrar systems and university databases",
			podIds: ["POD-06"],
			deviceCount: 0
		},
		{
			id: "surveillance",
			name: "Surveillance",
			cidr: "10.10.4.0/24",
			description: "Campus cameras and NVR collectors",
			podIds: ["POD-07"],
			deviceCount: 0
		},
		{
			id: "iot",
			name: "IoT Laboratory",
			cidr: "10.10.5.0/24",
			description: "Lab controllers and environmental sensors",
			podIds: ["POD-08"],
			deviceCount: 0
		}
	];
}
function createPods() {
	return [
		{
			id: "POD-01",
			name: "Academic North Pod",
			zone: "academic"
		},
		{
			id: "POD-02",
			name: "Academic South Pod",
			zone: "academic"
		},
		{
			id: "POD-03",
			name: "Student East Pod",
			zone: "student"
		},
		{
			id: "POD-04",
			name: "Student West Pod",
			zone: "student"
		},
		{
			id: "POD-05",
			name: "Student Core Pod",
			zone: "student"
		},
		{
			id: "POD-06",
			name: "Administration Pod",
			zone: "administration"
		},
		{
			id: "POD-07",
			name: "Surveillance Pod",
			zone: "surveillance"
		},
		{
			id: "POD-08",
			name: "IoT Laboratory Pod",
			zone: "iot"
		}
	].map((spec) => ({
		id: spec.id,
		podId: spec.id,
		podName: spec.name,
		zone: spec.zone,
		status: "healthy",
		connectedDevices: [],
		threatEvents: 0,
		trafficStats: {
			pps: 0,
			bps: 0,
			loss: 0,
			deliveredPps: 0
		},
		primaryLink: `LNK-${spec.id}-PRI`,
		backupLink: `LNK-${spec.id}-BAK`,
		heartbeatStatus: "ok",
		lastHeartbeat: 0
	}));
}
function createLinks(pods) {
	const links = [];
	for (const pod of pods) {
		links.push({
			id: pod.primaryLink,
			name: `${pod.podId} primary`,
			from: pod.podId,
			to: "CORE-01",
			kind: "primary",
			podId: pod.podId,
			status: "healthy",
			utilization: 0,
			delayMs: 1.6,
			failed: false
		});
		links.push({
			id: pod.backupLink,
			name: `${pod.podId} backup`,
			from: pod.podId,
			to: "CORE-01",
			kind: "backup",
			podId: pod.podId,
			status: "standby",
			utilization: 0,
			delayMs: 3.1,
			failed: false
		});
	}
	return links;
}
function createCore() {
	return {
		id: "CORE-01",
		name: "Virtual Core Switch",
		ipAddress: "10.10.0.1",
		totalThroughput: 0,
		averageDelay: 1.8,
		packetLoss: 0,
		packetDeliveryRatio: 1,
		activeLinks: 8,
		failedLinks: 0,
		networkHealth: 100,
		distributionCapacityMbps: DISTRIBUTION_CAPACITY_MBPS,
		utilization: 0
	};
}
function makeDevice(opts) {
	return {
		id: opts.name,
		deviceId: opts.name,
		deviceName: opts.name,
		ipAddress: `10.10.${zoneOctet(opts.zone)}.${opts.ipHost}`,
		zone: opts.zone,
		deviceType: opts.type,
		connectedPod: opts.podId,
		status: "online",
		threatScore: 0,
		packetRate: 0,
		packetsSent: 0,
		packetsReceived: 0,
		bytesSent: 0,
		bytesReceived: 0,
		destinationPorts: [],
		policyViolations: 0,
		currentSecurityState: "CLEAR ACCESS",
		lastEvent: "Idle",
		lastEventType: "",
		basePacketRate: opts.baseRate,
		offeredPacketRate: 0,
		deliveredPacketRate: 0,
		throttleFactor: 1,
		role: opts.role,
		defaultClass: opts.cls,
		packetsDropped: 0,
		packetsBlocked: 0,
		packetsThrottled: 0,
		threatHistory: [],
		packetRateHistory: [],
		stateHistory: [{
			t: 0,
			state: "CLEAR ACCESS"
		}],
		attackDetectedAt: null,
		threatThresholdAt: null,
		isolationTriggeredAt: null,
		quarantineTriggeredAt: null,
		isolationLatencyMs: null
	};
}
function createDevices(pods) {
	const podByZone = {
		academic: pods.filter((p) => p.zone === "academic"),
		student: pods.filter((p) => p.zone === "student"),
		administration: pods.filter((p) => p.zone === "administration"),
		surveillance: pods.filter((p) => p.zone === "surveillance"),
		iot: pods.filter((p) => p.zone === "iot")
	};
	const pickPod = (zone, index) => {
		const list = podByZone[zone];
		return list[index % list.length].podId;
	};
	const devices = [];
	for (let i = 1; i <= 24; i += 1) {
		const index = i === 24 ? 27 : i;
		devices.push(makeDevice({
			name: `Student-${pad(index)}`,
			zone: "student",
			type: "student-client",
			role: "Student endpoint",
			cls: "BACKGROUND",
			ipHost: index,
			podId: pickPod("student", i - 1),
			baseRate: 9 + index % 11
		}));
	}
	for (let i = 1; i <= 24; i += 1) {
		const isExam = i === 1;
		devices.push(makeDevice({
			name: `Academic-${pad(i)}`,
			zone: "academic",
			type: isExam ? "exam-server" : "academic-workstation",
			role: isExam ? "Exam server" : "Faculty workstation",
			cls: isExam ? "CRITICAL" : "NORMAL",
			ipHost: i,
			podId: pickPod("academic", i - 1),
			baseRate: isExam ? 28 : 16 + i % 7
		}));
	}
	devices.push(makeDevice({
		name: "Admin-DB",
		zone: "administration",
		type: "admin-db",
		role: "University database",
		cls: "HIGH",
		ipHost: 1,
		podId: "POD-06",
		baseRate: 36
	}));
	for (let i = 1; i <= 23; i += 1) devices.push(makeDevice({
		name: `Admin-${pad(i)}`,
		zone: "administration",
		type: "admin-endpoint",
		role: "Administrative endpoint",
		cls: "HIGH",
		ipHost: i + 1,
		podId: "POD-06",
		baseRate: 14 + i % 6
	}));
	for (let i = 1; i <= 22; i += 1) devices.push(makeDevice({
		name: `Camera-${pad(i)}`,
		zone: "surveillance",
		type: "camera",
		role: "Campus camera",
		cls: "HIGH",
		ipHost: i,
		podId: "POD-07",
		baseRate: 32 + i % 5
	}));
	devices.push(makeDevice({
		name: "NVR-001",
		zone: "surveillance",
		type: "nvr",
		role: "Network video recorder",
		cls: "HIGH",
		ipHost: 23,
		podId: "POD-07",
		baseRate: 44
	}));
	devices.push(makeDevice({
		name: "NVR-002",
		zone: "surveillance",
		type: "nvr",
		role: "Network video recorder",
		cls: "HIGH",
		ipHost: 24,
		podId: "POD-07",
		baseRate: 40
	}));
	for (let i = 1; i <= 16; i += 1) devices.push(makeDevice({
		name: `IoT-${pad(i)}`,
		zone: "iot",
		type: "iot-device",
		role: "Lab controller",
		cls: "NORMAL",
		ipHost: i,
		podId: "POD-08",
		baseRate: 6 + i % 8
	}));
	for (let i = 1; i <= 8; i += 1) devices.push(makeDevice({
		name: `Sensor-${pad(i)}`,
		zone: "iot",
		type: "sensor",
		role: "Environmental sensor",
		cls: "BACKGROUND",
		ipHost: 20 + i,
		podId: "POD-08",
		baseRate: 3 + i
	}));
	for (const device of devices) {
		const pod = pods.find((p) => p.podId === device.connectedPod);
		if (pod) pod.connectedDevices.push(device.id);
	}
	return devices;
}
function emptyDpq() {
	return {
		critical: 10,
		high: 10,
		normal: 10,
		background: 10,
		criticalDrop: 0,
		highDrop: 0,
		normalDrop: 0,
		backgroundDrop: 0,
		capacity: 0,
		capacityMbps: DISTRIBUTION_CAPACITY_MBPS,
		allocatedMbps: {
			critical: 0,
			high: 0,
			normal: 0,
			background: 0
		}
	};
}
function emptyFailover() {
	return {
		podId: "",
		podName: "",
		phase: "idle",
		primaryFailureAt: null,
		primaryFailureDetectedAt: null,
		failoverStartedAt: null,
		backupActivatedAt: null,
		heartbeatTimeoutMs: HEARTBEAT_TIMEOUT * 1e3,
		failoverDurationMs: null,
		sequence: []
	};
}
function emptyCounters() {
	return {
		policyViolations: 0,
		packetsBlocked: 0,
		packetsThrottled: 0,
		packetsDropped: 0,
		attacksDetected: 0
	};
}
function assertCampusCounts(devices, pods) {
	if (devices.length !== 120) throw new Error(`Expected 120 devices, got ${devices.length}`);
	if (pods.length !== 8) throw new Error(`Expected 8 Smart Pods, got ${pods.length}`);
	for (const zone of ZONE_IDS) {
		const count = devices.filter((d) => d.zone === zone).length;
		if (count !== 24) throw new Error(`Expected 24 devices in ${zone}, got ${count}`);
	}
	if (!devices.some((d) => d.deviceName === "Student-027")) throw new Error("Student-027 missing from campus seed");
	if (!devices.some((d) => d.deviceName === "Admin-DB")) throw new Error("Admin-DB missing from campus seed");
}
var eventSeq = 1;
var flowSeq = 1;
function emptyClass() {
	return {
		critical: 0,
		high: 0,
		normal: 0,
		background: 0
	};
}
function addClass(target, cls, pps) {
	target[cls.toLowerCase()] += pps;
}
function categoryFor(type) {
	switch (type) {
		case "POLICY_VIOLATION":
		case "PORT_SCAN_DETECTED":
		case "THREAT_SCORE_UPDATED":
		case "SECURITY_STATE_CHANGED":
		case "DEVICE_THROTTLED":
		case "DEVICE_ISOLATED":
		case "DEVICE_BLOCKED": return "SECURITY";
		case "TRAFFIC_STARTED":
		case "CONGESTION_STARTED":
		case "CONGESTION_STOPPED": return "TRAFFIC";
		case "ATTACK_INJECTED": return "ATTACK";
		case "LINK_FAILURE":
		case "HEARTBEAT_TIMEOUT":
		case "FAILOVER_ACTIVATED":
		case "ROUTE_RECALCULATED":
		case "STATE_SYNCHRONIZED": return "FAILURE";
		default: return "SYSTEM";
	}
}
function severityFor(type) {
	switch (type) {
		case "DEVICE_BLOCKED":
		case "LINK_FAILURE": return "critical";
		case "DEVICE_ISOLATED":
		case "HEARTBEAT_TIMEOUT":
		case "PORT_SCAN_DETECTED":
		case "FAILOVER_ACTIVATED":
		case "ATTACK_INJECTED": return "high";
		case "DEVICE_THROTTLED":
		case "POLICY_VIOLATION":
		case "SECURITY_STATE_CHANGED":
		case "CONGESTION_STARTED": return "medium";
		default: return "info";
	}
}
function createInitialState(seed = DEFAULT_SEED) {
	const zones = createZones();
	const pods = createPods();
	const devices = createDevices(pods);
	const links = createLinks(pods);
	assertCampusCounts(devices, pods);
	for (const zone of zones) zone.deviceCount = devices.filter((d) => d.zone === zone.id).length;
	return {
		running: false,
		currentTime: 0,
		version: 0,
		devices,
		pods,
		zones,
		links,
		core: createCore(),
		trafficFlows: [],
		metrics: { ...EMPTY_METRICS },
		security: {
			clear: devices.length,
			alert: 0,
			throttled: 0,
			isolated: 0,
			blocked: 0
		},
		dpq: emptyDpq(),
		events: [],
		history: [],
		attacks: [],
		scenario: {
			scheduledAttackFired: false,
			scheduledFailureFired: false,
			trafficEnabled: false,
			congestionEnabled: false,
			completed: false
		},
		seed,
		isolations: [],
		failover: emptyFailover(),
		counters: emptyCounters()
	};
}
var SimulationEngine = class {
	state;
	clock = new SimulationClock();
	rng;
	behavior = /* @__PURE__ */ new Map();
	listeners = /* @__PURE__ */ new Set();
	lastThreatEmit = /* @__PURE__ */ new Map();
	pendingFailovers = [];
	constructor(seed = DEFAULT_SEED) {
		this.rng = mulberry32(seed);
		this.state = createInitialState(seed);
		this.resetBehavior();
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	emit() {
		this.state = {
			...this.state,
			version: this.state.version + 1
		};
		for (const listener of this.listeners) listener(this.state);
	}
	resetBehavior() {
		this.behavior.clear();
		for (const device of this.state.devices) this.behavior.set(device.id, emptyBehavior());
		this.lastThreatEmit.clear();
		this.pendingFailovers = [];
	}
	pushEvent(type, description, extra = {}) {
		const event = {
			id: `evt-${eventSeq++}`,
			timestamp: Date.now(),
			simulationTime: extra.simulationTime ?? this.state.currentTime,
			eventType: type,
			deviceId: extra.deviceId ?? "",
			zone: extra.zone ?? "",
			podId: extra.podId ?? "",
			severity: extra.severity ?? severityFor(type),
			oldState: extra.oldState ?? "",
			newState: extra.newState ?? "",
			description,
			category: extra.category ?? categoryFor(type)
		};
		this.state.events = [event, ...this.state.events].slice(0, 500);
		if (event.deviceId) {
			const device = this.state.devices.find((d) => d.deviceId === event.deviceId || d.id === event.deviceId);
			if (device) {
				device.lastEvent = description;
				device.lastEventType = type;
			}
		}
		return event;
	}
	start() {
		if (this.state.scenario.completed && this.state.currentTime >= 120) return;
		this.clock.start();
		this.state.running = true;
		const firstStart = !this.state.scenario.trafficEnabled;
		this.state.scenario.trafficEnabled = true;
		if (firstStart && this.state.currentTime === 0) {
			this.pushEvent("SIMULATION_STARTED", "120-second HZCN demonstration started in SIMULATION MODE.");
			this.pushEvent("TRAFFIC_STARTED", "Normal campus traffic generation is active.");
			this.runTrafficTick(0);
		}
		this.emit();
	}
	pause() {
		this.clock.pause();
		this.state.running = false;
		this.pushEvent("SIMULATION_PAUSED", `Simulation paused at t=${roundSimTime(this.state.currentTime).toFixed(1)}s.`);
		this.emit();
	}
	resume() {
		this.start();
	}
	reset(seed = this.state.seed) {
		eventSeq = 1;
		flowSeq = 1;
		this.clock.reset();
		this.rng = mulberry32(seed);
		this.state = createInitialState(seed);
		this.resetBehavior();
		this.pushEvent("SIMULATION_RESET", "Campus, Smart Pods, and security state restored to t=0.");
		this.emit();
	}
	startCongestion() {
		this.state.scenario.congestionEnabled = true;
		if (this.state.scenario.trafficEnabled === false) this.start();
		this.pushEvent("CONGESTION_STARTED", "Congestion engine engaged. DPQ will protect CRITICAL/HIGH classes.");
		this.emit();
	}
	stopCongestion() {
		this.state.scenario.congestionEnabled = false;
		this.pushEvent("CONGESTION_STOPPED", "Congestion engine disengaged.");
		this.emit();
	}
	injectAttack(request, silent = false) {
		if (!this.state.running) this.start();
		const device = this.state.devices.find((d) => d.deviceId === request.deviceId || d.deviceName === request.deviceId) ?? this.state.devices.find((d) => d.deviceName === "Student-027");
		const target = this.state.devices.find((d) => d.deviceId === request.targetDeviceId || d.deviceName === request.targetDeviceId || d.deviceName === "Admin-DB") ?? this.state.devices.find((d) => d.deviceType === "admin-db");
		const profile = {
			type: request.type,
			deviceId: device.deviceName,
			targetDeviceId: target.deviceName,
			targetZone: request.targetZone ?? target.zone,
			targetService: request.targetService ?? target.role,
			startedAt: this.state.currentTime,
			active: true,
			phase: 0
		};
		this.state.attacks = [...this.state.attacks.filter((a) => a.deviceId !== profile.deviceId), profile];
		this.state.counters.attacksDetected += 1;
		if (device.attackDetectedAt == null) device.attackDetectedAt = this.state.currentTime;
		this.upsertIsolation(device);
		this.pushEvent("ATTACK_INJECTED", `Simulated ${labelAttack(request.type)} injected from ${device.deviceName} toward ${target.deviceName} (${profile.targetService}).`, {
			deviceId: device.deviceName,
			zone: device.zone,
			podId: device.connectedPod,
			category: "ATTACK",
			severity: "high"
		});
		if (!silent) this.emit();
	}
	injectPrimaryAttack() {
		this.injectAttack({
			type: "combined",
			deviceId: PRIMARY_ATTACK_DEVICE,
			targetDeviceId: PRIMARY_ATTACK_TARGET,
			targetZone: "administration",
			targetService: "Admin Database"
		});
	}
	simulateLinkFailure(podId = "POD-01", silent = false) {
		const pod = this.state.pods.find((p) => p.podId === podId);
		if (!pod) return;
		const primary = this.state.links.find((l) => l.id === pod.primaryLink);
		if (!primary || primary.failed) return;
		this.state.links = this.state.links.map((l) => l.id === primary.id ? failPrimaryLink(l) : l);
		const failedAt = this.state.currentTime;
		const sequence = [{
			at: failedAt,
			label: "PRIMARY LINK FAILURE"
		}];
		this.state.failover = {
			podId: pod.podId,
			podName: pod.podName,
			phase: "primary-failed",
			primaryFailureAt: failedAt,
			primaryFailureDetectedAt: failedAt,
			failoverStartedAt: null,
			backupActivatedAt: null,
			heartbeatTimeoutMs: HEARTBEAT_TIMEOUT * 1e3,
			failoverDurationMs: null,
			sequence
		};
		this.pushEvent("LINK_FAILURE", `${pod.podName} primary uplink failed. Heartbeat path is broken.`, {
			podId: pod.podId,
			zone: pod.zone,
			severity: "critical",
			category: "FAILURE"
		});
		this.pendingFailovers.push({
			podId: pod.podId,
			failedAt,
			dueAt: roundSimTime(failedAt + HEARTBEAT_TIMEOUT)
		});
		if (!silent) this.emit();
	}
	step() {
		if (!this.state.running || this.state.scenario.completed) return this.state;
		const { time, completed } = this.clock.tick();
		this.state.currentTime = time;
		this.tickAt(time);
		if (completed) {
			this.state.running = false;
			this.state.scenario.completed = true;
			this.pushEvent("SIMULATION_COMPLETED", "120-second demonstration complete. Network remains in SIMULATION MODE.");
		}
		this.emit();
		return this.state;
	}
	/** Advance `seconds` of virtual time (0.1s ticks). */
	stepN(seconds) {
		const ticks = Math.round(seconds / SIM_TICK);
		for (let i = 0; i < ticks; i += 1) this.step();
	}
	tickAt(t) {
		this.state.pods = this.state.pods.map((pod) => {
			const primary = this.state.links.find((l) => l.id === pod.primaryLink);
			if (primary && !primary.failed) return beat(pod, t);
			return pod;
		});
		if (!this.state.scenario.scheduledAttackFired && t >= 45) {
			this.state.scenario.scheduledAttackFired = true;
			this.injectAttack({
				type: "combined",
				deviceId: PRIMARY_ATTACK_DEVICE,
				targetDeviceId: PRIMARY_ATTACK_TARGET,
				targetZone: "administration",
				targetService: "Admin Database"
			}, true);
		}
		if (!this.state.scenario.scheduledFailureFired && t >= 75) {
			this.state.scenario.scheduledFailureFired = true;
			this.simulateLinkFailure("POD-01", true);
		}
		this.processPendingFailovers(t);
		if (isWholeSimSecond(t)) this.runTrafficTick(t);
	}
	processPendingFailovers(t) {
		const due = this.pendingFailovers.filter((p) => t + 1e-9 >= p.dueAt);
		this.pendingFailovers = this.pendingFailovers.filter((p) => t + 1e-9 < p.dueAt);
		for (const pending of due) this.completeFailover(pending.podId, pending.failedAt, t);
	}
	completeFailover(podId, failedAt, t) {
		const pod = this.state.pods.find((p) => p.podId === podId);
		if (!pod) return;
		const primary = this.state.links.find((l) => l.id === pod.primaryLink);
		if (!primary) return;
		const snapshot = new Map(this.state.devices.map((d) => [d.id, d.currentSecurityState]));
		const scores = new Map(this.state.devices.map((d) => [d.id, d.threatScore]));
		const isolations = this.state.devices.map((d) => ({
			id: d.id,
			attackDetectedAt: d.attackDetectedAt,
			threatThresholdAt: d.threatThresholdAt,
			isolationTriggeredAt: d.isolationTriggeredAt,
			quarantineTriggeredAt: d.quarantineTriggeredAt,
			isolationLatencyMs: d.isolationLatencyMs,
			currentSecurityState: d.currentSecurityState,
			threatScore: d.threatScore,
			status: d.status
		}));
		if (checkHeartbeat({
			...pod,
			lastHeartbeat: failedAt
		}, primary, t).timeout) this.pushEvent("HEARTBEAT_TIMEOUT", `Heartbeat timeout (${HEARTBEAT_TIMEOUT * 1e3} ms configured) on ${pod.podId} primary link.`, {
			podId: pod.podId,
			zone: pod.zone,
			severity: "high",
			category: "FAILURE"
		});
		const failedOver = activateFailover(this.state.pods, this.state.links, this.state.devices, pod.podId);
		this.state.pods = failedOver.pods;
		this.state.links = failedOver.links;
		this.state.devices = failedOver.devices.map((device) => {
			const preserved = isolations.find((d) => d.id === device.id);
			return {
				...device,
				currentSecurityState: snapshot.get(device.id) ?? device.currentSecurityState,
				threatScore: scores.get(device.id) ?? device.threatScore,
				attackDetectedAt: preserved?.attackDetectedAt ?? device.attackDetectedAt,
				threatThresholdAt: preserved?.threatThresholdAt ?? device.threatThresholdAt,
				isolationTriggeredAt: preserved?.isolationTriggeredAt ?? device.isolationTriggeredAt,
				quarantineTriggeredAt: preserved?.quarantineTriggeredAt ?? device.quarantineTriggeredAt,
				isolationLatencyMs: preserved?.isolationLatencyMs ?? device.isolationLatencyMs,
				status: preserved?.status ?? device.status
			};
		});
		this.pushEvent("FAILOVER_ACTIVATED", `${pod.podId} backup uplink is now active. Traffic rerouted through CORE-01 backup path.`, {
			podId: pod.podId,
			zone: pod.zone,
			category: "FAILURE"
		});
		this.pushEvent("ROUTE_RECALCULATED", `Routing table rebuilt for zone ${pod.zone}. Backup delay +2.4ms applied.`, {
			podId: pod.podId,
			zone: pod.zone,
			category: "FAILURE"
		});
		this.pushEvent("STATE_SYNCHRONIZED", "Smart Pod security state synchronized. Isolated/quarantined devices were not reset.", {
			podId: pod.podId,
			zone: pod.zone,
			category: "FAILURE"
		});
		const durationMs = (t - failedAt) * 1e3;
		const prev = this.state.failover;
		const sequence = [
			...prev.sequence,
			{
				at: t,
				label: "HEARTBEAT TIMEOUT"
			},
			{
				at: t,
				label: "FAILURE DETECTED"
			},
			{
				at: t,
				label: "BACKUP LINK ACTIVATED"
			},
			{
				at: t,
				label: "ROUTE RECALCULATED"
			},
			{
				at: t,
				label: "TRAFFIC RESTORED"
			}
		];
		this.state.failover = {
			...prev,
			phase: "backup-active",
			failoverStartedAt: t,
			backupActivatedAt: t,
			failoverDurationMs: durationMs,
			sequence
		};
		this.state.metrics.failoverDurationMs = durationMs;
	}
	upsertIsolation(device) {
		const existing = this.state.isolations.find((i) => i.deviceId === device.deviceName);
		const next = {
			deviceId: device.deviceName,
			attackDetectedAt: device.attackDetectedAt,
			threatThresholdAt: device.threatThresholdAt,
			isolationTriggeredAt: device.isolationTriggeredAt,
			quarantineTriggeredAt: device.quarantineTriggeredAt,
			isolationLatencyMs: device.isolationLatencyMs
		};
		if (existing) Object.assign(existing, next);
		else this.state.isolations = [...this.state.isolations, next];
	}
	runTrafficTick(t) {
		const rng = this.rng;
		const devices = this.state.devices;
		const byName = new Map(devices.map((d) => [d.deviceName, d]));
		const attacks = this.state.attacks.filter((a) => a.active);
		const attackByDevice = new Map(attacks.map((a) => [a.deviceId, a]));
		const failoverActive = this.state.pods.some((p) => p.status === "failover") || this.state.failover.phase === "backup-active";
		const failedLinks = this.state.links.filter((l) => l.failed).length;
		const preOffered = devices.reduce((sum, d) => {
			const attack = attackByDevice.get(d.deviceName);
			return sum + (attack ? attackOfferedRate(attack, t) : offeredRate(d, t, 1, rng));
		}, 0);
		const capacityPps = distributionCapacityPps(640);
		const congestion = evaluateCongestion({
			enabled: this.state.scenario.congestionEnabled,
			currentTime: t,
			offeredPps: preOffered,
			capacityPps,
			failedLinks
		});
		const classOffered = emptyClass();
		const classForwarded = emptyClass();
		const flows = [];
		const perPod = {};
		const zoneTraffic = {
			academic: 0,
			student: 0,
			administration: 0,
			surveillance: 0,
			iot: 0
		};
		let offeredBytes = 0;
		let deliveredBytes = 0;
		let offeredPps = 0;
		let forwardedPps = 0;
		let policyDropPps = 0;
		let securityDropPps = 0;
		let throttledPps = 0;
		let alerts = 0;
		const tickPorts = /* @__PURE__ */ new Map();
		const tickViolations = /* @__PURE__ */ new Map();
		const tickScan = /* @__PURE__ */ new Map();
		for (const device of devices) {
			const attack = attackByDevice.get(device.deviceName);
			let rate = offeredRate(device, t, congestion.loadMultiplier, rng);
			let dest = destinationFor(device, devices, rng);
			let ports = [portsFor(device, dest, rng)];
			let trafficType = `${device.zone}-normal`;
			let cls = classForFlow(device, dest);
			if (attack) {
				const elapsed = t - attack.startedAt;
				rate = attackOfferedRate(attack, t);
				dest = byName.get(attack.targetDeviceId) ?? dest;
				ports = attackPorts(attack, elapsed, rng);
				trafficType = `attack-${attack.type}`;
				cls = "BACKGROUND";
				if (attack.type === "port-scan" || attack.type === "combined" && elapsed >= 5) tickScan.set(device.id, true);
			}
			device.offeredPacketRate = rate;
			offeredPps += rate;
			zoneTraffic[device.zone] += rate;
			const avgSize = packetSizeFor(cls, rng);
			offeredBytes += rate * avgSize;
			let allowedPps = 0;
			let violation = 0;
			for (const port of ports) {
				const share = rate / ports.length;
				const inspected = applyPolicy(makeFlow({
					id: `f-${flowSeq++}`,
					source: device,
					dest,
					port,
					rate: share,
					t,
					trafficType,
					cls,
					packetSize: avgSize
				}), device, dest);
				if (!inspected.allowed) {
					violation += 1;
					policyDropPps += share;
					inspected.dropped = true;
					if (flows.length < 48) flows.push(inspected);
					continue;
				}
				const secured = applySecurityToRate(device, share, port, dest.zone, cls);
				if (secured.forwardedPps <= 0) {
					securityDropPps += share;
					inspected.dropped = true;
					inspected.dropReason = secured.reason;
					if (flows.length < 48) flows.push(inspected);
					continue;
				}
				if (secured.forwardedPps < share) throttledPps += share - secured.forwardedPps;
				allowedPps += secured.forwardedPps;
				inspected.packetRate = secured.forwardedPps;
				addClass(classForwarded, cls, secured.forwardedPps);
				if (flows.length < 48) flows.push(inspected);
			}
			addClass(classOffered, cls, rate);
			tickPorts.set(device.id, ports);
			tickViolations.set(device.id, violation);
			if (violation > 0) {
				device.policyViolations += violation;
				this.state.counters.policyViolations += violation;
			}
			const podKey = device.connectedPod;
			if (!perPod[podKey]) perPod[podKey] = {
				pps: 0,
				bps: 0,
				loss: 0,
				delivered: 0
			};
			perPod[podKey].pps += rate;
			device.destinationPorts = [.../* @__PURE__ */ new Set([...tickPorts.get(device.id) ?? [], ...device.destinationPorts])].slice(0, 16);
			device.throttleFactor = throttleFactorFor(device);
			forwardedPps += allowedPps;
			device.packetRate = rate;
		}
		const dpq = applyDpq(classForwarded, capacityPps, congestion.intensity);
		const deliveredTotal = dpq.delivered.critical + dpq.delivered.high + dpq.delivered.normal + dpq.delivered.background;
		const droppedTotal = dpq.dropped.critical + dpq.dropped.high + dpq.dropped.normal + dpq.dropped.background;
		const dpqFactor = forwardedPps > 0 ? deliveredTotal / forwardedPps : 1;
		for (const device of devices) {
			const delivered = device.offeredPacketRate * device.throttleFactor * dpqFactor;
			const recv = delivered * (.92 + this.rng() * .06);
			device.deliveredPacketRate = delivered;
			device.packetsSent += device.offeredPacketRate;
			device.packetsReceived += recv;
			const dropped = Math.max(0, device.offeredPacketRate - delivered);
			device.packetsDropped += dropped;
			if (device.currentSecurityState === "BANDWIDTH THROTTLED") device.packetsThrottled += dropped;
			else if (device.currentSecurityState === "RESTRICTED ISOLATION" || device.currentSecurityState === "NETWORK-WIDE QUARANTINE") device.packetsBlocked += dropped;
			const size = 640;
			device.bytesSent += device.offeredPacketRate * size;
			device.bytesReceived += recv * size;
			deliveredBytes += delivered * size;
			const pod = perPod[device.connectedPod];
			if (pod) {
				pod.delivered += delivered;
				pod.bps += delivered * size;
			}
			device.threatHistory = [...device.threatHistory, device.threatScore].slice(-60);
			device.packetRateHistory = [...device.packetRateHistory, device.offeredPacketRate].slice(-60);
		}
		this.state.counters.packetsBlocked += policyDropPps + securityDropPps;
		this.state.counters.packetsThrottled += throttledPps;
		this.state.counters.packetsDropped += droppedTotal + policyDropPps + securityDropPps;
		this.state.trafficFlows = [...flows.slice(0, 24), ...sampleNormalFlows(devices, t, rng, 8)].slice(0, 40);
		const offeredMbps = offeredBytes * 8 / 1e6;
		const coreUtilization = offeredMbps / DISTRIBUTION_CAPACITY_MBPS;
		const delay = computeDelay({
			baseMs: failoverActive ? 3.8 : 1.8,
			congestionIntensity: congestion.intensity,
			failover: failoverActive,
			utilization: coreUtilization
		});
		const dpqDropRatio = forwardedPps > 0 ? droppedTotal / Math.max(forwardedPps, 1) : 0;
		const loss = computeLoss({
			extraLoss: congestion.extraLoss,
			dpqDrop: dpqDropRatio,
			failedLinks,
			quarantineDrop: securityDropPps / Math.max(offeredPps, 1)
		});
		const deliveredAfterLoss = deliveredTotal * (1 - loss);
		const pdr = offeredPps > 0 ? deliveredAfterLoss / offeredPps : 1;
		const throughputMbps = deliveredBytes * (1 - loss) * 8 / 1e6;
		this.updateThreats(t, tickPorts, tickViolations, tickScan, attacks);
		const security = countSecurity(devices);
		alerts = security.alert + security.throttled + security.isolated + security.blocked;
		const health = computeHealth({
			loss: loss * 100,
			delay,
			failedLinks,
			blocked: security.blocked,
			isolated: security.isolated
		});
		const isolationLatencyMs = this.state.isolations.find((i) => i.deviceId === "Student-027")?.isolationLatencyMs ?? this.state.isolations.find((i) => i.isolationLatencyMs != null)?.isolationLatencyMs ?? null;
		const metrics = {
			throughput: throughputMbps,
			averageDelay: delay,
			packetLoss: loss,
			packetDeliveryRatio: pdr,
			offeredPps,
			deliveredPps: deliveredAfterLoss,
			droppedPps: Math.max(0, offeredPps - deliveredAfterLoss),
			networkHealth: health,
			offeredMbps,
			coreUtilization,
			isolationLatencyMs,
			failoverDurationMs: this.state.failover.failoverDurationMs,
			policyViolations: this.state.counters.policyViolations,
			packetsBlocked: this.state.counters.packetsBlocked,
			packetsThrottled: this.state.counters.packetsThrottled
		};
		this.state.metrics = metrics;
		this.state.security = security;
		this.state.dpq = dpq.stats;
		this.state.core = updateCore(this.state.core, metrics, this.state.links);
		this.state.pods = updatePodStats(this.state.pods, perPod).map((pod) => {
			const threatEvents = devices.filter((d) => d.connectedPod === pod.podId && d.currentSecurityState !== "CLEAR ACCESS").length;
			const primary = this.state.links.find((l) => l.id === pod.primaryLink);
			const backup = this.state.links.find((l) => l.id === pod.backupLink);
			let status = pod.status;
			if (primary?.failed && backup?.status === "active") status = "failover";
			else if (primary?.failed) status = "degraded";
			else if (threatEvents > 0) status = "degraded";
			else status = "healthy";
			return {
				...pod,
				threatEvents,
				status
			};
		});
		this.state.links = this.state.links.map((link) => {
			if (link.failed) return {
				...link,
				utilization: 0,
				status: "failed"
			};
			const stats = perPod[link.podId];
			const util = linkUtilization(stats?.pps ?? 0, capacityPps);
			let status = link.status;
			if (link.kind === "backup" && status !== "active") status = "standby";
			else if (link.kind === "primary" && (util > .85 || congestion.intensity > .55)) status = "congested";
			else if (link.kind === "primary") status = "healthy";
			return {
				...link,
				utilization: util,
				status,
				delayMs: delay * (link.kind === "backup" ? 1.2 : 1)
			};
		});
		const point = {
			t,
			throughput: throughputMbps,
			delay,
			loss: loss * 100,
			pdr: pdr * 100,
			avgThreat: devices.reduce((s, d) => s + d.threatScore, 0) / devices.length,
			maxThreat: devices.reduce((m, d) => Math.max(m, d.threatScore), 0),
			health,
			offeredPps,
			deliveredPps: deliveredAfterLoss,
			offeredMbps,
			coreUtilization,
			zoneTraffic,
			security: { ...security },
			dpq: { ...dpq.stats },
			alerts,
			throttled: security.throttled,
			isolated: security.isolated,
			blocked: security.blocked,
			activeDevices: devices.filter((d) => d.status !== "offline").length,
			policyViolations: this.state.counters.policyViolations,
			packetsBlocked: this.state.counters.packetsBlocked,
			packetsThrottled: this.state.counters.packetsThrottled,
			isolationLatencyMs,
			failoverDurationMs: this.state.failover.failoverDurationMs
		};
		this.state.history = [...this.state.history, point].slice(-120);
	}
	updateThreats(t, tickPorts, tickViolations, tickScan, attacks) {
		for (const device of this.state.devices) {
			const samplePorts = tickPorts.get(device.id) ?? device.destinationPorts;
			const violations = tickViolations.get(device.id) ?? 0;
			let behavior = this.behavior.get(device.id) ?? emptyBehavior();
			behavior = pushSample(behavior, {
				packetRate: device.offeredPacketRate,
				ports: samplePorts,
				policyViolations: violations
			});
			this.behavior.set(device.id, behavior);
			const attack = attacks.find((a) => a.deviceId === device.deviceName);
			const rapid = Boolean(tickScan.get(device.id) || behavior.rapidPortProbe);
			const { telemetry } = computeTelemetry({
				policyViolationsThisTick: violations,
				packetRate: device.offeredPacketRate,
				rapidPortProbe: rapid
			});
			const prev = device.threatScore;
			const next = nextThreatScore(prev, telemetry);
			const prevState = device.currentSecurityState;
			const nextState = stateFromScore(next);
			device.threatScore = next;
			device.currentSecurityState = nextState;
			device.status = statusFromState(nextState);
			device.destinationPorts = behavior.uniquePorts.slice(0, 16);
			if ((violations > 0 || attack || rapid) && device.attackDetectedAt == null) device.attackDetectedAt = t;
			if (next >= 40 && device.threatThresholdAt == null) device.threatThresholdAt = t;
			if (nextState === "RESTRICTED ISOLATION" && prevState !== "RESTRICTED ISOLATION") {
				device.isolationTriggeredAt = t;
				if (device.attackDetectedAt != null) device.isolationLatencyMs = (t - device.attackDetectedAt) * 1e3;
			}
			if (nextState === "NETWORK-WIDE QUARANTINE" && prevState !== "NETWORK-WIDE QUARANTINE") {
				device.quarantineTriggeredAt = t;
				if (device.isolationTriggeredAt == null) {
					device.isolationTriggeredAt = t;
					if (device.attackDetectedAt != null) device.isolationLatencyMs = (t - device.attackDetectedAt) * 1e3;
				}
			}
			if (device.attackDetectedAt != null || device.isolationTriggeredAt != null) this.upsertIsolation(device);
			if (prevState !== nextState) device.stateHistory = [...device.stateHistory, {
				t,
				state: nextState
			}].slice(-16);
			if (violations > 0) {
				this.pushEvent("POLICY_VIOLATION", `${device.deviceName} violated zone policy (${violations} denied flow${violations > 1 ? "s" : ""} this second).`, {
					deviceId: device.deviceName,
					zone: device.zone,
					podId: device.connectedPod,
					severity: "medium"
				});
				const pod = this.state.pods.find((p) => p.podId === device.connectedPod);
				if (pod) pod.threatEvents += 1;
			}
			if (rapid && (attack || behavior.uniquePorts.length >= 8)) {
				if (t - (this.lastThreatEmit.get(`${device.id}-scan`) ?? -10) >= 3) {
					this.lastThreatEmit.set(`${device.id}-scan`, t);
					this.pushEvent("PORT_SCAN_DETECTED", `${device.deviceName} traversed ${behavior.uniquePorts.length} destination ports inside the 5s behavior window.`, {
						deviceId: device.deviceName,
						zone: device.zone,
						podId: device.connectedPod,
						severity: "high"
					});
				}
			}
			if (Math.abs(next - prev) >= 4) {
				if (t - (this.lastThreatEmit.get(device.id) ?? -10) >= 2) {
					this.lastThreatEmit.set(device.id, t);
					this.pushEvent("THREAT_SCORE_UPDATED", `${device.deviceName} threat score ${prev.toFixed(1)} → ${next.toFixed(1)}.`, {
						deviceId: device.deviceName,
						zone: device.zone,
						podId: device.connectedPod,
						oldState: prev.toFixed(1),
						newState: next.toFixed(1)
					});
				}
			}
			if (prevState !== nextState) {
				this.pushEvent("SECURITY_STATE_CHANGED", `${device.deviceName} moved ${prevState} → ${nextState}.`, {
					deviceId: device.deviceName,
					zone: device.zone,
					podId: device.connectedPod,
					oldState: prevState,
					newState: nextState,
					severity: nextState === "NETWORK-WIDE QUARANTINE" ? "critical" : "high"
				});
				if (nextState === "BANDWIDTH THROTTLED") this.pushEvent("DEVICE_THROTTLED", `${device.deviceName} bandwidth reduced by Smart Pod ${device.connectedPod}.`, {
					deviceId: device.deviceName,
					zone: device.zone,
					podId: device.connectedPod
				});
				if (nextState === "RESTRICTED ISOLATION") this.pushEvent("DEVICE_ISOLATED", `${device.deviceName} placed in restricted isolation. East-west traffic dropped.`, {
					deviceId: device.deviceName,
					zone: device.zone,
					podId: device.connectedPod,
					severity: "high"
				});
				if (nextState === "NETWORK-WIDE QUARANTINE") this.pushEvent("DEVICE_BLOCKED", `${device.deviceName} entered network-wide quarantine. All forwarding blocked.`, {
					deviceId: device.deviceName,
					zone: device.zone,
					podId: device.connectedPod,
					severity: "critical"
				});
			}
		}
	}
	getPublicState() {
		return this.state;
	}
};
function countSecurity(devices) {
	const counts = {
		clear: 0,
		alert: 0,
		throttled: 0,
		isolated: 0,
		blocked: 0
	};
	for (const device of devices) switch (device.currentSecurityState) {
		case "HEURISTIC ALERT":
			counts.alert += 1;
			break;
		case "BANDWIDTH THROTTLED":
			counts.throttled += 1;
			break;
		case "RESTRICTED ISOLATION":
			counts.isolated += 1;
			break;
		case "NETWORK-WIDE QUARANTINE":
			counts.blocked += 1;
			break;
		default: counts.clear += 1;
	}
	return counts;
}
function labelAttack(type) {
	switch (type) {
		case "cross-zone": return "cross-zone access";
		case "port-scan": return "port scan";
		case "traffic-flood": return "traffic flood";
		default: return "combined attack";
	}
}
var engine = null;
var loop = null;
function getEngine() {
	if (!engine) engine = new SimulationEngine();
	return engine;
}
function syncFromEngine() {
	useSimStore.setState({ snapshot: getEngine().state });
}
function loopIntervalMs(speed) {
	return Math.max(10, Math.round(SIM_TICK * 1e3 / speed));
}
function restartLoop() {
	if (typeof window === "undefined") return;
	if (loop != null) {
		window.clearInterval(loop);
		loop = null;
	}
	const speed = useSimStore.getState().speed;
	loop = window.setInterval(() => {
		const e = getEngine();
		if (e.state.running) e.step();
	}, loopIntervalMs(speed));
}
function ensureLoop() {
	if (typeof window === "undefined") return;
	if (loop != null) return;
	restartLoop();
}
var useSimStore = create((set) => ({
	snapshot: createInitialState(),
	selectedDeviceId: null,
	mobileNavOpen: false,
	speed: 1,
	selectDevice: (id) => set({ selectedDeviceId: id }),
	setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
	setSpeed: (speed) => {
		set({ speed });
		if (typeof window !== "undefined" && loop != null) restartLoop();
	},
	start: () => {
		getEngine().start();
		ensureLoop();
		syncFromEngine();
	},
	pause: () => {
		getEngine().pause();
		syncFromEngine();
	},
	resume: () => {
		getEngine().resume();
		ensureLoop();
		syncFromEngine();
	},
	reset: () => {
		getEngine().reset();
		syncFromEngine();
	},
	startCongestion: () => {
		getEngine().startCongestion();
		ensureLoop();
		syncFromEngine();
	},
	injectAttack: (request) => {
		getEngine().injectAttack(request);
		ensureLoop();
		syncFromEngine();
	},
	injectPrimaryAttack: () => {
		getEngine().injectPrimaryAttack();
		ensureLoop();
		syncFromEngine();
	},
	simulateFailure: (podId) => {
		getEngine().simulateLinkFailure(podId);
		ensureLoop();
		syncFromEngine();
	}
}));
function bindEngineToStore() {
	if (typeof window === "undefined") return () => {};
	const e = getEngine();
	syncFromEngine();
	const unsub = e.subscribe((state) => {
		useSimStore.setState({ snapshot: state });
	});
	ensureLoop();
	return unsub;
}
function useSimulation() {
	return useSimStore((s) => s.snapshot);
}
//#endregion
export { formatNumber as _, POLICY_MATRIX as a, useSimStore as b, SECURITY_STATES as c, SimulationEngine as d, ZONE_IDS as f, formatMeasured as g, formatInteger as h, PAPER_ISOLATION_LATENCY_MS as i, SIM_SPEEDS as l, cn as m, EVENT_CATEGORIES as n, PRIMARY_ATTACK_DEVICE as o, bindEngineToStore as p, HEARTBEAT_TIMEOUT as r, PRIMARY_ATTACK_TARGET as s, ATTACK_TYPES as t, SIM_TICK as u, formatSimTime as v, useSimulation as x, formatSimTimestamp as y };
