import { createFileRoute } from "@tanstack/react-router";
import { ensureServerLoop, getServerEngine, publicSnapshot } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/simulation/failure")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let podId = "POD-01";
        try {
          const body = (await request.json()) as { podId?: string };
          if (body.podId) podId = body.podId;
        } catch {
          /* optional body */
        }
        getServerEngine().simulateLinkFailure(podId);
        ensureServerLoop();
        return Response.json(publicSnapshot());
      },
    },
  },
});
