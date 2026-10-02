import type {
  CoreSwitch,
  Device,
  DeviceType,
  NetworkLink,
  SmartPod,
  TrafficClass,
  Zone,
  ZoneId,
} from "@/models/types";
import {
  DEVICES_PER_ZONE,
  DISTRIBUTION_CAPACITY_MBPS,
  HEARTBEAT_TIMEOUT,
  ZONE_IDS,
} from "@/models/types";

export const DEFAULT_SEED = 20261002;

export const EMPTY_METRICS = {
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
  isolationLatencyMs: null as number | null,
  failoverDurationMs: null as number | null,
  policyViolations: 0,
  packetsBlocked: 0,
  packetsThrottled: 0,
};

function pad(n: number): string {
  return n.toString().padStart(3, "0");
}

function zoneOctet(zone: ZoneId): number {
  switch (zone) {
    case "academic":
      return 1;
    case "student":
      return 2;
    case "administration":
      return 3;
    case "surveillance":
      return 4;
    case "iot":
      return 5;
  }
}

export function createZones(): Zone[] {
  return [
    {
      id: "academic",
      name: "Academic",
      cidr: "10.10.1.0/24",
      description: "Faculty workstations, exam services, course platforms",
      podIds: ["POD-01", "POD-02"],
      deviceCount: 0,
    },
    {
      id: "student",
      name: "Student",
      cidr: "10.10.2.0/24",
      description: "Student laptops and residential endpoints",
      podIds: ["POD-03", "POD-04", "POD-05"],
      deviceCount: 0,
    },
    {
      id: "administration",
      name: "Administration",
      cidr: "10.10.3.0/24",
      description: "Registrar systems and university databases",
      podIds: ["POD-06"],
      deviceCount: 0,
    },
    {
      id: "surveillance",
      name: "Surveillance",
      cidr: "10.10.4.0/24",
      description: "Campus cameras and NVR collectors",
      podIds: ["POD-07"],
      deviceCount: 0,
    },
    {
      id: "iot",
      name: "IoT Laboratory",
      cidr: "10.10.5.0/24",
      description: "Lab controllers and environmental sensors",
      podIds: ["POD-08"],
      deviceCount: 0,
    },
  ];
}

export function createPods(): SmartPod[] {
  const specs: Array<{ id: string; name: string; zone: ZoneId }> = [
    { id: "POD-01", name: "Academic North Pod", zone: "academic" },
    { id: "POD-02", name: "Academic South Pod", zone: "academic" },
    { id: "POD-03", name: "Student East Pod", zone: "student" },
    { id: "POD-04", name: "Student West Pod", zone: "student" },
    { id: "POD-05", name: "Student Core Pod", zone: "student" },
    { id: "POD-06", name: "Administration Pod", zone: "administration" },
    { id: "POD-07", name: "Surveillance Pod", zone: "surveillance" },
    { id: "POD-08", name: "IoT Laboratory Pod", zone: "iot" },
  ];
  return specs.map((spec) => ({
    id: spec.id,
    podId: spec.id,
    podName: spec.name,
    zone: spec.zone,
    status: "healthy",
    connectedDevices: [],
    threatEvents: 0,
    trafficStats: { pps: 0, bps: 0, loss: 0, deliveredPps: 0 },
    primaryLink: `LNK-${spec.id}-PRI`,
    backupLink: `LNK-${spec.id}-BAK`,
    heartbeatStatus: "ok",
    lastHeartbeat: 0,
  }));
}

export function createLinks(pods: SmartPod[]): NetworkLink[] {
  const links: NetworkLink[] = [];
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
      failed: false,
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
      failed: false,
    });
  }
  return links;
}

export function createCore(): CoreSwitch {
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
    utilization: 0,
  };
}

function makeDevice(opts: {
  name: string;
  zone: ZoneId;
  type: DeviceType;
  role: string;
  cls: TrafficClass;
  ipHost: number;
  podId: string;
  baseRate: number;
}): Device {
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
    stateHistory: [{ t: 0, state: "CLEAR ACCESS" }],
    attackDetectedAt: null,
    threatThresholdAt: null,
    isolationTriggeredAt: null,
    quarantineTriggeredAt: null,
    isolationLatencyMs: null,
  };
}

export function createDevices(pods: SmartPod[]): Device[] {
  const podByZone: Record<ZoneId, SmartPod[]> = {
    academic: pods.filter((p) => p.zone === "academic"),
    student: pods.filter((p) => p.zone === "student"),
    administration: pods.filter((p) => p.zone === "administration"),
    surveillance: pods.filter((p) => p.zone === "surveillance"),
    iot: pods.filter((p) => p.zone === "iot"),
  };

  const pickPod = (zone: ZoneId, index: number) => {
    const list = podByZone[zone];
    return list[index % list.length]!.podId;
  };

  const devices: Device[] = [];

  // 24 student endpoints. Keep research attacker Student-027 as a stable ID.
  for (let i = 1; i <= DEVICES_PER_ZONE; i += 1) {
    const isAttacker = i === 24;
    const index = isAttacker ? 27 : i;
    devices.push(
      makeDevice({
        name: `Student-${pad(index)}`,
        zone: "student",
        type: "student-client",
        role: "Student endpoint",
        cls: "BACKGROUND",
        ipHost: index,
        podId: pickPod("student", i - 1),
        baseRate: 9 + (index % 11),
      }),
    );
  }

  // 24 academic (Academic-001 remains the exam server)
  for (let i = 1; i <= DEVICES_PER_ZONE; i += 1) {
    const isExam = i === 1;
    devices.push(
      makeDevice({
        name: `Academic-${pad(i)}`,
        zone: "academic",
        type: isExam ? "exam-server" : "academic-workstation",
        role: isExam ? "Exam server" : "Faculty workstation",
        cls: isExam ? "CRITICAL" : "NORMAL",
        ipHost: i,
        podId: pickPod("academic", i - 1),
        baseRate: isExam ? 28 : 16 + (i % 7),
      }),
    );
  }

  // 24 administration — Admin-DB first, then Admin-001..023
  devices.push(
    makeDevice({
      name: "Admin-DB",
      zone: "administration",
      type: "admin-db",
      role: "University database",
      cls: "HIGH",
      ipHost: 1,
      podId: "POD-06",
      baseRate: 36,
    }),
  );
  for (let i = 1; i <= DEVICES_PER_ZONE - 1; i += 1) {
    devices.push(
      makeDevice({
        name: `Admin-${pad(i)}`,
        zone: "administration",
        type: "admin-endpoint",
        role: "Administrative endpoint",
        cls: "HIGH",
        ipHost: i + 1,
        podId: "POD-06",
        baseRate: 14 + (i % 6),
      }),
    );
  }

  // 24 surveillance: 22 cameras + 2 NVRs
  for (let i = 1; i <= 22; i += 1) {
    devices.push(
      makeDevice({
        name: `Camera-${pad(i)}`,
        zone: "surveillance",
        type: "camera",
        role: "Campus camera",
        cls: "HIGH",
        ipHost: i,
        podId: "POD-07",
        baseRate: 32 + (i % 5),
      }),
    );
  }
  devices.push(
    makeDevice({
      name: "NVR-001",
      zone: "surveillance",
      type: "nvr",
      role: "Network video recorder",
      cls: "HIGH",
      ipHost: 23,
      podId: "POD-07",
      baseRate: 44,
    }),
  );
  devices.push(
    makeDevice({
      name: "NVR-002",
      zone: "surveillance",
      type: "nvr",
      role: "Network video recorder",
      cls: "HIGH",
      ipHost: 24,
      podId: "POD-07",
      baseRate: 40,
    }),
  );

  // 24 IoT Laboratory: 16 controllers + 8 sensors
  for (let i = 1; i <= 16; i += 1) {
    devices.push(
      makeDevice({
        name: `IoT-${pad(i)}`,
        zone: "iot",
        type: "iot-device",
        role: "Lab controller",
        cls: "NORMAL",
        ipHost: i,
        podId: "POD-08",
        baseRate: 6 + (i % 8),
      }),
    );
  }
  for (let i = 1; i <= 8; i += 1) {
    devices.push(
      makeDevice({
        name: `Sensor-${pad(i)}`,
        zone: "iot",
        type: "sensor",
        role: "Environmental sensor",
        cls: "BACKGROUND",
        ipHost: 20 + i,
        podId: "POD-08",
        baseRate: 3 + i,
      }),
    );
  }

  for (const device of devices) {
    const pod = pods.find((p) => p.podId === device.connectedPod);
    if (pod) pod.connectedDevices.push(device.id);
  }

  return devices;
}

export function emptyDpq() {
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
    allocatedMbps: { critical: 0, high: 0, normal: 0, background: 0 },
  };
}

export function emptyFailover() {
  return {
    podId: "",
    podName: "",
    phase: "idle" as const,
    primaryFailureAt: null,
    primaryFailureDetectedAt: null,
    failoverStartedAt: null,
    backupActivatedAt: null,
    heartbeatTimeoutMs: HEARTBEAT_TIMEOUT * 1000,
    failoverDurationMs: null,
    sequence: [],
  };
}

export function emptyCounters() {
  return {
    policyViolations: 0,
    packetsBlocked: 0,
    packetsThrottled: 0,
    packetsDropped: 0,
    attacksDetected: 0,
  };
}

export function assertCampusCounts(devices: Device[], pods: SmartPod[]): void {
  if (devices.length !== 120) {
    throw new Error(`Expected 120 devices, got ${devices.length}`);
  }
  if (pods.length !== 8) {
    throw new Error(`Expected 8 Smart Pods, got ${pods.length}`);
  }
  for (const zone of ZONE_IDS) {
    const count = devices.filter((d) => d.zone === zone).length;
    if (count !== DEVICES_PER_ZONE) {
      throw new Error(`Expected ${DEVICES_PER_ZONE} devices in ${zone}, got ${count}`);
    }
  }
  if (!devices.some((d) => d.deviceName === "Student-027")) {
    throw new Error("Student-027 missing from campus seed");
  }
  if (!devices.some((d) => d.deviceName === "Admin-DB")) {
    throw new Error("Admin-DB missing from campus seed");
  }
}
