import { createFileRoute } from "@tanstack/react-router";
import { ensureServerLoop, getServerEngine, publicSnapshot } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/simulation/start")({
  server: {
    handlers: {
      POST: async () => {
        const engine = getServerEngine();
        engine.start();
        ensureServerLoop();
        return Response.json(publicSnapshot());
      },
    },
  },
});
