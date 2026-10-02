import { SIMULATION_DURATION, SIM_TICK } from "@/models/types";

/** Snap virtual time to 0.1s so 75 + 0.5 is exactly 75.5, not 75.499999. */
export function roundSimTime(t: number): number {
  return Math.round(t * 10) / 10;
}

export function isWholeSimSecond(t: number): boolean {
  return Math.abs(t - Math.round(t)) < 1e-9;
}

export function simTimeEquals(a: number, b: number): boolean {
  return Math.abs(roundSimTime(a) - roundSimTime(b)) < 1e-9;
}

export class SimulationClock {
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

  tick(): { time: number; completed: boolean } {
    if (!this.running || this.completed) {
      return { time: this.currentTime, completed: this.completed };
    }
    this.currentTime = roundSimTime(this.currentTime + SIM_TICK);
    if (this.currentTime >= SIMULATION_DURATION - 1e-9) {
      this.currentTime = SIMULATION_DURATION;
      this.running = false;
      this.completed = true;
    }
    return { time: this.currentTime, completed: this.completed };
  }
}
