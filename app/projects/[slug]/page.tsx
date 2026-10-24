import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import { bySlug, getPortfolioContent } from "@/lib/content";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const p = bySlug((await getPortfolioContent()).projects, (await params).slug);
 return p ? { title: p.title, description: p.summary, alternates: { canonical: `/projects/${p.slug}` } } : { title: "Project not found" };
}
export default async function ProjectPage({ params }: Props) {
 const p = bySlug((await getPortfolioContent()).projects, (await params).slug); if (!p) notFound();
 return <ItemDetail item={p} eyebrow={p.category || "PROJECT"} backHref="/projects" backLabel="All projects" />;
}
