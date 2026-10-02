import { createFileRoute } from "@tanstack/react-router";
import type { AttackRequest } from "@/models/types";
import { ATTACK_TYPES, PRIMARY_ATTACK_DEVICE } from "@/models/types";
import { ensureServerLoop, getServerEngine, publicSnapshot } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/simulation/attack")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Partial<AttackRequest> = {};
        try {
          body = (await request.json()) as Partial<AttackRequest>;
        } catch {
          body = {};
        }
        const type = ATTACK_TYPES.includes(body.type as AttackRequest["type"])
          ? (body.type as AttackRequest["type"])
          : "combined";
        getServerEngine().injectAttack({
          type,
          deviceId: body.deviceId || PRIMARY_ATTACK_DEVICE,
          targetDeviceId: body.targetDeviceId,
          targetZone: body.targetZone,
          targetService: body.targetService,
        });
        ensureServerLoop();
        return Response.json(publicSnapshot());
      },
    },
  },
});
