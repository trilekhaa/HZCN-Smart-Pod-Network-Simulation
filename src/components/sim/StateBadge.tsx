import { Badge } from "@/components/ui/badge";
import type { SecurityState } from "@/models/types";
import { stateTone } from "@/components/sim/labels";

export function StateBadge({ state }: { state: SecurityState }) {
  return <Badge variant={stateTone(state)}>{state}</Badge>;
}
