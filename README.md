# Smart Pod HZCN

Software simulation of **Hybrid Zoned Campus Network Enhanced with Intelligent Communication Pods**.

This is **SIMULATION MODE** only. There is no physical Smart Pod, no live campus network, no packet capture, and no real attack monitoring. Virtual devices, zones, traffic, congestion, attacks, failover, and threat scoring are computed in JavaScript.

## What it demonstrates

1. Normal campus traffic on a simulated **1 Gbps core/distribution link**
2. Congestion with simulated Dynamic Priority Queuing
3. Attack at t = 45s (`Student-027` → `Admin-DB`)
4. Smart Pod policy + behavior window + threat scoring
5. Throttle / isolation / quarantine with **measured isolation latency**
6. Academic pod primary-link failure at t = 75s
7. Heartbeat timeout (configured 500 ms), measured failover duration, backup activation, route recalculation
8. Security state preserved through failover
9. Simulation completes at t = 120s

## Run the 120-second scenario

1. Open the dashboard and click **Start**.
2. Use **Pause / Resume / Reset** and speed (0.5x–10x).
3. Watch throughput, delay, loss, and DPQ meters respond to load.
4. At 45s the combined research attack starts automatically — or inject it from **Attack Simulation**.
5. At 75s POD-01’s primary uplink fails; after the heartbeat timeout the backup path takes over.
6. Use **Reset** to restore a deterministic campus (seed `20261002`).

## Architecture

The live dashboard runs **one** shared client-side `SimulationEngine`. Every page reads the same Zustand snapshot.

```
React dashboard
      ↓
Zustand store
      ↓
SimulationEngine
      ↓
Security / traffic / resilience modules
```

REST endpoints under `/api/*` expose a separate server-side instance of the same engine for inspection only. The interactive UI does not depend on them.

An NS-3 seam lives in `src/simulator/ns3-adapter.ts` for a later native coupling.

## Campus model

| Entity | Count |
| --- | --- |
| Zones | Academic, Student, Administration, Surveillance, IoT Laboratory |
| Virtual devices | 120 (24 per zone) |
| Smart Pods | POD-01 … POD-08 |
| Core switch | CORE-01 |
| Distribution layer | Simulated 1 Gbps |
| Uplinks | 8 primary + 8 backup |

Primary research host: **Student-027**. Primary target: **Admin-DB**.

## Threat model

```
Threat(t) = clamp(Threat(t-1) × 0.95 + NewTelemetry(t), 0, 100)
```

Telemetry includes policy violations (+25), volumetric anomaly, rapid multi-port probing (+35), and severe profile deviation. States:

| Score | State | Action |
| --- | --- | --- |
| 0–39 | CLEAR ACCESS | ALLOW |
| 40–54 | HEURISTIC ALERT | MONITOR |
| 55–69 | BANDWIDTH THROTTLED | THROTTLE |
| 70–84 | RESTRICTED ISOLATION | ISOLATE |
| 85–100 | NETWORK-WIDE QUARANTINE | QUARANTINE |

Paper / NS-3 reported isolation (<4.2 ms) is labeled separately from **Measured in this simulation**.

## API

- `GET /api/simulation/state`
- `POST /api/simulation/start`
- `POST /api/simulation/reset`
- `POST /api/simulation/congestion`
- `POST /api/simulation/attack`
- `POST /api/simulation/failure`
- `GET /api/devices`
- `GET /api/pods`
- `GET /api/zones`
- `GET /api/events`
- `GET /api/analytics`
