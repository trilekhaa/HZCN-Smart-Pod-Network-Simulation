import type { NetworkLink, SmartPod } from "@/models/types";

export function failPrimaryLink(link: NetworkLink): NetworkLink {
  return {
    ...link,
    failed: true,
    status: "failed",
    utilization: 0,
  };
}

export function findAcademicPrimary(links: NetworkLink[], pods: SmartPod[]): NetworkLink | undefined {
  const academicPod = pods.find((p) => p.podId === "POD-01") ?? pods.find((p) => p.zone === "academic");
  if (!academicPod) return undefined;
  return links.find((l) => l.id === academicPod.primaryLink);
}
