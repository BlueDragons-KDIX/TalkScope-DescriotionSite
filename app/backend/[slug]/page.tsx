import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailLayout from "@/components/DetailLayout";
import { backendItems } from "@/content/backend/index";
import type { DetailPage } from "@/content/types";

const contentMap: Record<string, () => Promise<{ default: DetailPage }>> = {
  "architecture":      () => import("@/content/backend/architecture"),
  "nlp-pipeline":      () => import("@/content/backend/nlp-pipeline"),
  "scoring-algorithm": () => import("@/content/backend/scoring-algorithm"),
  "dictionary-api":    () => import("@/content/backend/dictionary-api"),
  "optimizations":     () => import("@/content/backend/optimizations"),
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(contentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = backendItems.find((i) => i.slug === slug);
  return {
    title: item?.title ?? "バックエンド設計",
    description: item?.description,
  };
}

export default async function BackendDetailPage({ params }: Props) {
  const { slug } = await params;
  const loader = contentMap[slug];
  if (!loader) notFound();

  const { default: page } = await loader();
  const idx = backendItems.findIndex((i) => i.slug === slug);
  const prev = idx > 0 ? backendItems[idx - 1] : null;
  const next = idx >= 0 && idx < backendItems.length - 1 ? backendItems[idx + 1] : null;

  return (
    <DetailLayout
      section="backend"
      sectionLabel="バックエンド設計"
      page={page}
      prev={prev && { slug: prev.slug, title: prev.title }}
      next={next && { slug: next.slug, title: next.title }}
    />
  );
}
