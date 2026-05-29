import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailLayout from "@/components/DetailLayout";
import { backendItems } from "@/content/backend/index";

const contentMap: Record<string, () => Promise<{ default: import("@/content/types").DetailPage }>> = {
  "nlp-pipeline":       () => import("@/content/backend/nlp-pipeline"),
  "scoring-algorithm":  () => import("@/content/backend/scoring-algorithm"),
  "dictionary-api":     () => import("@/content/backend/dictionary-api"),
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(contentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = backendItems.find((i) => i.slug === slug);
  return { title: item?.title ?? "バックエンド設計" };
}

export default async function BackendDetailPage({ params }: Props) {
  const { slug } = await params;
  const loader = contentMap[slug];
  if (!loader) notFound();

  const { default: page } = await loader();

  return (
    <DetailLayout
      section="backend"
      sectionLabel="バックエンド設計"
      page={page}
    />
  );
}
