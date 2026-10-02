import { createFileRoute } from "@tanstack/react-router";
import { getServerEngine } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/devices")({
  server: {
    handlers: {
      GET: async () => Response.json(getServerEngine().state.devices),
    },
  },
});
