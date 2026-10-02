import { clamp, lerp } from "@/simulation/rng";

export interface CongestionResult {
  /** 0–1 congestion intensity used by delay/loss models. */
  intensity: number;
  /** Multiplier applied to offered background/normal load. */
  loadMultiplier: number;
  delayMultiplier: number;
  extraLoss: number;
}

export function evaluateCongestion(input: {
  enabled: boolean;
  currentTime: number;
  offeredPps: number;
  capacityPps: number;
  failedLinks: number;
}): CongestionResult {
  const utilization = input.offeredPps / Math.max(1, input.capacityPps);
  let intensity = clamp((utilization - 0.72) / 0.55, 0, 1);

  if (input.enabled) {
    const ramp = clamp((input.currentTime - 12) / 28, 0, 1);
    intensity = clamp(Math.max(intensity, 0.38 + ramp * 0.45), 0, 1);
  } else if (input.currentTime > 18 && input.currentTime < 45) {
    // Natural campus load growth before the research attack window.
    intensity = clamp(Math.max(intensity, (input.currentTime - 18) / 90), 0, 0.42);
  }

  intensity = clamp(intensity + input.failedLinks * 0.08, 0, 1);

  return {
    intensity,
    loadMultiplier: input.enabled ? lerp(1.15, 1.85, intensity) : lerp(1, 1.28, intensity),
    delayMultiplier: 1 + intensity * 3.4,
    extraLoss: intensity * 0.072,
  };
}
