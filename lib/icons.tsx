import { ExternalLink, Github, Instagram, Linkedin, Play, ScrollText, Youtube } from "lucide-react";
import type { LinkItem } from "@/lib/types";

export function LinkIcon({ kind, size = 16 }: { kind: LinkItem["kind"]; size?: number }) {
  const props = { size, strokeWidth: 1.8, "aria-hidden": true as const };
  if (kind === "github") return <Github {...props} />;
  if (kind === "linkedin") return <Linkedin {...props} />;
  if (kind === "instagram") return <Instagram {...props} />;
  if (kind === "youtube") return <Youtube {...props} />;
  if (kind === "paper" || kind === "doi") return <ScrollText {...props} />;
  if (kind === "live") return <Play {...props} />;
  return <ExternalLink {...props} />;
}
