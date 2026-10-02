import { createFileRoute } from "@tanstack/react-router";
import { getServerEngine } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/zones")({
  server: {
    handlers: {
      GET: async () => Response.json(getServerEngine().state.zones),
    },
  },
});
