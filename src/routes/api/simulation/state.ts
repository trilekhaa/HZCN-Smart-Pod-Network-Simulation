import { createFileRoute } from "@tanstack/react-router";
import { publicSnapshot } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/simulation/state")({
  server: {
    handlers: {
      GET: async () => Response.json(publicSnapshot()),
    },
  },
});
