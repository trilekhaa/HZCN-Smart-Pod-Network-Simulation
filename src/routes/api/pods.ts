import { createFileRoute } from "@tanstack/react-router";
import { getServerEngine } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/pods")({
  server: {
    handlers: {
      GET: async () => Response.json(getServerEngine().state.pods),
    },
  },
});
