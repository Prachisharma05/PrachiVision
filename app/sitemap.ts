import type { MetadataRoute } from "next";
import { getPortfolioContent, published } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getPortfolioContent();
  const base = "https://prachivision.dev";
  const paths = ["", "/about", "/projects", "/research", "/achievements", "/updates", "/contact", "/club"];
  const detailPaths = [
    ...published(content.projects).map((item) => `/projects/${item.slug}`),
    ...published(content.papers).map((item) => `/research/${item.slug}`),
    ...published([...content.certificates, ...content.events]).map((item) => `/achievements/${item.slug}`),
    ...published(content.updates).map((item) => `/updates/${item.slug}`),
  ];
  return [
    ...paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: path === "" ? 1 : .7 })),
    ...detailPaths.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .8 })),
  ];
}
