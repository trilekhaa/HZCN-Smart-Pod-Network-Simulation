import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSimTime(seconds: number): string {
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
export function formatSimTimestamp(seconds: number): string {
  const t = Math.round(seconds * 10) / 10;
  return `t=${t.toFixed(1)}s`;
}

export function formatNumber(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function formatInteger(value: number): string {
  return Math.round(value).toLocaleString();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatMbps(mbps: number): string {
  return `${formatNumber(mbps, 2)} Mbps`;
}

export function formatMeasured(value: number | null | undefined, suffix: string): string {
  if (value == null || !Number.isFinite(value)) return "N/A";
  return `${Math.round(value)}${suffix}`;
}
