import { createFileRoute } from "@tanstack/react-router";
import { getServerEngine } from "@/simulation/server-instance";

export const Route = createFileRoute("/api/analytics")({
  server: {
    handlers: {
      GET: async () => {
        const state = getServerEngine().state;
        return Response.json({
          metrics: state.metrics,
          security: state.security,
          dpq: state.dpq,
          history: state.history,
          mode: "SIMULATION MODE",
        });
      },
    },
  },
});
