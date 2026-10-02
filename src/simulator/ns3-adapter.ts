/**
 * Optional future NS-3 integration.
 *
 * The live dashboard runs a JavaScript discrete-event approximation so the
 * research demonstration works without a native simulator. This adapter is the
 * seam where an NS-3 process could later publish traces (throughput, delay,
 * loss, PDR) into the same SimulationEngine snapshot.
 */
export interface Ns3Metrics {
  throughputMbps: number;
  averageDelayMs: number;
  packetLoss: number;
  packetDeliveryRatio: number;
}

export class Ns3Adapter {
  connected = false;

  async connect(_endpoint = "tcp://127.0.0.1:5555"): Promise<void> {
    throw new Error(
      "NS-3 adapter is a documented extension point. This build uses the JavaScript simulation engine.",
    );
  }

  mapMetrics(_raw: unknown): Ns3Metrics {
    return {
      throughputMbps: 0,
      averageDelayMs: 0,
      packetLoss: 0,
      packetDeliveryRatio: 1,
    };
  }
}

export const ns3Adapter = new Ns3Adapter();
