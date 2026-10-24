import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import { bySlug, getPortfolioContent } from "@/lib/content";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = bySlug((await getPortfolioContent()).updates, (await params).slug);
  return item ? { title: item.title, description: item.summary } : { title: "Update not found" };
}

export default async function UpdateDetailPage({ params }: Props) {
  const item = bySlug((await getPortfolioContent()).updates, (await params).slug);
  if (!item) notFound();
  return <ItemDetail item={item} eyebrow={item.category || "Latest update"} backHref="/updates" backLabel="All updates" />;
}
