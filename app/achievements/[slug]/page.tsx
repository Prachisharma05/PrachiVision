import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import { bySlug, getPortfolioContent } from "@/lib/content";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

async function findItem(slug: string) {
  const content = await getPortfolioContent();
  return bySlug([...content.certificates, ...content.events], slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await findItem((await params).slug);
  return item ? { title: item.title, description: item.summary } : { title: "Achievement not found" };
}

export default async function AchievementDetailPage({ params }: Props) {
  const item = await findItem((await params).slug);
  if (!item) notFound();
  return <ItemDetail item={item} eyebrow={item.category || "Achievement"} backHref="/achievements" backLabel="All achievements" />;
}
