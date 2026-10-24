import { z } from "zod";
import type { PortfolioContent } from "@/lib/types";

const text = z.string().trim();
const lines = z.array(text).transform(items => items.filter(Boolean));
const url = text.refine(value => {
  if (!value || /^\/(?!\/)/.test(value)) return true;
  try { const parsed = new URL(value); return ["http:", "https:"].includes(parsed.protocol) && Boolean(parsed.hostname); }
  catch { return false; }
}, "Use an https:// URL or a local /path.");
const link = z.object({ id: text, label: text, url, kind: z.enum(["github", "live", "paper", "doi", "youtube", "instagram", "linkedin", "website", "custom"]) });
const media = z.object({ id: text, url, type: z.enum(["image", "video", "pdf"]), alt: text, caption: text.optional(), thumbnailUrl: url.optional() });
const entry = z.object({
  id: text, slug: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a unique lowercase slug with hyphens."), title: text,
  subtitle: text.optional(), summary: text, description: text.optional(), organization: text.optional(), role: text.optional(), location: text.optional(),
  startDate: text.optional(), endDate: text.optional(), date: text.optional(), status: text.optional(), category: text.optional(), coverImage: url.optional(),
  featured: z.boolean(), published: z.boolean(), tags: lines, highlights: lines, metrics: lines.optional(),
  media: z.array(media), links: z.array(link), sections: z.array(z.object({ id: text, title: text, body: text })).optional(),
});
const entries = z.array(entry).superRefine((items, ctx) => {
  const slugs = new Set<string>();
  items.forEach((item, i) => {
    if (slugs.has(item.slug)) ctx.addIssue({ code: "custom", message: "Each entry needs a unique slug.", path: [i, "slug"] });
    slugs.add(item.slug);
  });
});
const schema = z.object({
  settings: z.object({ siteTitle: text, siteDescription: text, accent: text.regex(/^#[a-f0-9]{6}$/i) }),
  profile: z.object({ name: text, shortName: text, role: text, eyebrow: text, heroTitle: text, introduction: text, location: text,
    email: text.refine(value => !value || z.email().safeParse(value).success, "Enter a valid email address."), phone: text, availability: text,
    avatarUrl: url, logoUrl: url.default(""), resumeUrl: url, resumeUpdatedAt: text, socials: z.array(link) }),
  about: z.object({ heading: text, paragraphs: lines, principles: lines, interests: lines }),
  skills: z.array(z.object({ id: text, title: text, description: text, skills: lines })),
  projects: entries, papers: entries, certificates: entries, events: entries, education: entries, experience: entries, updates: entries,
  club: z.object({ enabled: z.boolean(), name: text, role: text, summary: text, description: text, media: z.array(media), links: z.array(link) }),
});

export function parsePortfolio(value: unknown): PortfolioContent {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`${issue.path.join(" → ")}: ${issue.message}`);
  }
  const { certificates, events } = result.data;
  const slugs = [...certificates, ...events].map(item => item.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error("Certificates and events must have distinct slugs.");
  return result.data;
}

// Public rendering removes blank entries, empty links, and whitespace-only
// fields. The database independently removes unpublished entries before reads.
export function publicPortfolio(value: unknown): PortfolioContent {
  const c = parsePortfolio(value);
  const cleanLinks = (items: typeof c.profile.socials) => items.filter(x => x.url && x.label);
  const cleanMedia = (items: typeof c.club.media) => items.filter(x => x.url);
  for (const key of ["projects", "papers", "certificates", "events", "education", "experience", "updates"] as const) {
    c[key] = c[key].filter(x => x.published && x.title).map(x => ({ ...x, links: cleanLinks(x.links), media: cleanMedia(x.media), sections: x.sections?.filter(s => s.title || s.body) }));
  }
  c.profile.socials = cleanLinks(c.profile.socials);
  c.skills = c.skills.filter(s => s.title || s.description || s.skills.length);
  c.club.links = cleanLinks(c.club.links); c.club.media = cleanMedia(c.club.media);
  return c;
}
