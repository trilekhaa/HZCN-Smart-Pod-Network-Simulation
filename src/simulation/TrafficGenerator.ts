import type {
  AttackProfile,
  Device,
  Protocol,
  TrafficClass,
  TrafficFlow,
} from "@/models/types";
import { pick, randInt, randRange } from "@/simulation/rng";

const ACADEMIC_PORTS = [80, 443, 8080, 53];
const STUDENT_PORTS = [80, 443, 53];
const ADMIN_PORTS = [443, 22, 5432];
const CAMERA_PORTS = [554, 443];
const IOT_PORTS = [1883, 443];
const SCAN_PORTS = [21, 22, 23, 80, 135, 139, 443, 445, 1433, 3306, 3389, 5432, 5900, 8080, 8443];

function hashTick(id: string, t: number): number {
  let h = 2166136261 ^ t;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

export function destinationFor(device: Device, devices: Device[], rng: () => number): Device {
  const sameZone = devices.filter((d) => d.zone === device.zone && d.id !== device.id);
  const academic = devices.filter((d) => d.zone === "academic");
  const exam = devices.find((d) => d.deviceType === "exam-server") ?? academic[0];
  const adminDb = devices.find((d) => d.deviceType === "admin-db");
  const nvr = devices.find((d) => d.deviceType === "nvr");

  switch (device.zone) {
    case "student": {
      // Most student traffic stays recreational or hits academic services.
      if (rng() < 0.62 && academic.length) return pick(rng, academic);
      return sameZone.length ? pick(rng, sameZone) : device;
    }
    case "academic": {
      if (rng() < 0.2 && exam) return exam;
      return sameZone.length ? pick(rng, sameZone) : device;
    }
    case "administration": {
      if (rng() < 0.35 && adminDb && adminDb.id !== device.id) return adminDb;
      return sameZone.length ? pick(rng, sameZone) : device;
    }
    case "surveillance": {
      if (nvr && device.deviceType === "camera") return nvr;
      return sameZone.length ? pick(rng, sameZone) : device;
    }
    case "iot": {
      const academicLab = academic[1] ?? academic[0];
      if (rng() < 0.4 && academicLab) return academicLab;
      return sameZone.length ? pick(rng, sameZone) : device;
    }
  }
}

export function portsFor(device: Device, dest: Device, rng: () => number): number {
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

export function classForFlow(source: Device, dest: Device): TrafficClass {
  if (dest.deviceType === "exam-server" || source.deviceType === "exam-server") return "CRITICAL";
  if (dest.deviceType === "admin-db" || source.deviceType === "admin-db") return "HIGH";
  if (source.zone === "surveillance" || dest.zone === "surveillance") return "HIGH";
  if (source.zone === "student") return "BACKGROUND";
  return source.defaultClass;
}

export function offeredRate(device: Device, t: number, congestionMul: number, rng: () => number): number {
  const jitter = 0.82 + rng() * 0.36;
  const diurnal = 0.9 + 0.15 * Math.sin((t / 120) * Math.PI);
  return Math.max(0.4, device.basePacketRate * jitter * diurnal * congestionMul);
}

export function packetSizeFor(cls: TrafficClass, rng: () => number): number {
  switch (cls) {
    case "CRITICAL":
      return randInt(rng, 520, 900);
    case "HIGH":
      return randInt(rng, 700, 1280);
    case "NORMAL":
      return randInt(rng, 400, 1100);
    default:
      return randInt(rng, 220, 760);
  }
}

export function attackOfferedRate(profile: AttackProfile, t: number): number {
  const elapsed = t - profile.startedAt;
  switch (profile.type) {
    case "cross-zone":
      return 22 + Math.min(18, elapsed * 3);
    case "port-scan":
      return 36 + elapsed * 4;
    case "traffic-flood":
      return 90 + elapsed * 14;
    case "combined": {
      if (elapsed <= 1) return 28;
      if (elapsed <= 3) return 48;
      if (elapsed <= 5) return 86;
      return 170 + elapsed * 6;
    }
  }
}

export function attackPorts(profile: AttackProfile, elapsed: number, rng: () => number): number[] {
  if (profile.type === "cross-zone") return [5432, 443];
  if (profile.type === "traffic-flood") return [5432];
  if (profile.type === "port-scan") {
    const count = Math.min(SCAN_PORTS.length, 6 + elapsed * 2);
    return SCAN_PORTS.slice(0, count);
  }
  // Combined: graduate from cross-zone → flood → scan
  if (elapsed <= 1) return [5432];
  if (elapsed <= 4) return [5432, 443, 22];
  const count = Math.min(SCAN_PORTS.length, 8 + elapsed);
  const shuffled = [...SCAN_PORTS];
  // light shuffle
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, count);
}

export function makeFlow(opts: {
  id: string;
  source: Device;
  dest: Device;
  port: number;
  rate: number;
  t: number;
  protocol?: Protocol;
  trafficType: string;
  cls: TrafficClass;
  packetSize: number;
}): TrafficFlow {
  return {
    id: opts.id,
    sourceDevice: opts.source.deviceName,
    destinationDevice: opts.dest.deviceName,
    sourceZone: opts.source.zone,
    destinationZone: opts.dest.zone,
    protocol: opts.protocol ?? "TCP",
    sourcePort: 40000 + (opts.t * 17 + opts.source.deviceName.length) % 20000,
    destinationPort: opts.port,
    packetSize: opts.packetSize,
    packetRate: opts.rate,
    timestamp: opts.t,
    priority: opts.cls,
    trafficType: opts.trafficType,
    allowed: true,
    dropped: false,
    dropReason: "",
  };
}

export function sampleNormalFlows(
  devices: Device[],
  t: number,
  rng: () => number,
  limit = 10,
): TrafficFlow[] {
  const flows: TrafficFlow[] = [];
  const candidates = devices.filter((d) => d.status !== "offline");
  for (let i = 0; i < limit; i += 1) {
    const source = pick(rng, candidates);
    const dest = destinationFor(source, devices, rng);
    if (dest.id === source.id) continue;
    const cls = classForFlow(source, dest);
    const port = portsFor(source, dest, rng);
    flows.push(
      makeFlow({
        id: `flow-${t}-${i}`,
        source,
        dest,
        port,
        rate: Math.max(1, source.offeredPacketRate / 4),
        t,
        trafficType: `${source.zone}-to-${dest.zone}`,
        cls,
        packetSize: packetSizeFor(cls, rng),
      }),
    );
  }
  return flows;
}

export { SCAN_PORTS, hashTick, randRange };
