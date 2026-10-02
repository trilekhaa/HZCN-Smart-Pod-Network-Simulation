import { createFileRoute } from "@tanstack/react-router";
import { ensureServerLoop, getServerEngine, publicSnapshot } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/simulation/congestion")({
  server: {
    handlers: {
      POST: async () => {
        getServerEngine().startCongestion();
        ensureServerLoop();
        return Response.json(publicSnapshot());
      },
    },
  },
});
