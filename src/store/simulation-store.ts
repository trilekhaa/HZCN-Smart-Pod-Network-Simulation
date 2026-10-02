import { create } from "zustand";
import type { AttackRequest, SimSpeed, SimulationState } from "@/models/types";
import { SIM_TICK } from "@/models/types";
import { SimulationEngine, createInitialState } from "@/simulation/SimulationEngine";

let engine: SimulationEngine | null = null;
let loop: number | null = null;

export function getEngine(): SimulationEngine {
  if (!engine) engine = new SimulationEngine();
  return engine;
}

function syncFromEngine() {
  useSimStore.setState({ snapshot: getEngine().state });
}

function loopIntervalMs(speed: number): number {
  return Math.max(10, Math.round((SIM_TICK * 1000) / speed));
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

export interface SimStore {
  snapshot: SimulationState;
  selectedDeviceId: string | null;
  mobileNavOpen: boolean;
  speed: SimSpeed;
  selectDevice: (id: string | null) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSpeed: (speed: SimSpeed) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  startCongestion: () => void;
  injectAttack: (request: AttackRequest) => void;
  injectPrimaryAttack: () => void;
  simulateFailure: (podId?: string) => void;
}

export const useSimStore = create<SimStore>((set) => ({
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
  },
}));

export function bindEngineToStore() {
  if (typeof window === "undefined") return () => {};
  const e = getEngine();
  syncFromEngine();
  const unsub = e.subscribe((state) => {
    useSimStore.setState({ snapshot: state });
  });
  ensureLoop();
  return unsub;
}

export function useSimulation(): SimulationState {
  return useSimStore((s) => s.snapshot);
}
