import { createFileRoute } from "@tanstack/react-router";
import { getServerEngine, publicSnapshot } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/simulation/reset")({
  server: {
    handlers: {
      POST: async () => {
        getServerEngine().reset();
        return Response.json(publicSnapshot());
      },
    },
  },
});
