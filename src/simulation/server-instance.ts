/**
 * Optional server-side inspection copy of SimulationEngine.
 *
 * The live dashboard does NOT use this instance. All UI pages read the
 * client Zustand store bound to a single browser SimulationEngine.
 * Hitting these REST endpoints starts a separate process-local engine
 * that is useful for curl/debug only.
 */
import { SIM_TICK } from "@/models/types";
import { SimulationEngine } from "@/simulation/SimulationEngine";

const g = globalThis as typeof globalThis & {
  __hzcnEngine?: SimulationEngine;
  __hzcnLoop?: ReturnType<typeof setInterval>;
};

export function getServerEngine(): SimulationEngine {
  if (!g.__hzcnEngine) g.__hzcnEngine = new SimulationEngine();
  return g.__hzcnEngine;
}

export function ensureServerLoop() {
  if (g.__hzcnLoop) return;
  g.__hzcnLoop = setInterval(() => {
    const engine = getServerEngine();
    if (engine.state.running) engine.step();
  }, Math.round(SIM_TICK * 1000));
}

export function publicSnapshot() {
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
    mode: "SIMULATION MODE",
  };
}
