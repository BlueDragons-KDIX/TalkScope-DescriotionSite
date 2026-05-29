import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailLayout from "@/components/DetailLayout";
import { frontendItems } from "@/content/frontend/index";

const contentMap: Record<string, () => Promise<{ default: import("@/content/types").DetailPage }>> = {
  "clean-architecture": () => import("@/content/frontend/clean-architecture"),
  "bubble-physics":     () => import("@/content/frontend/bubble-physics"),
  "layout-engine":      () => import("@/content/frontend/layout-engine"),
  "bubble-lifetime":    () => import("@/content/frontend/bubble-lifetime"),
  "phase-system":       () => import("@/content/frontend/phase-system"),
  "customization":      () => import("@/content/frontend/customization"),
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(contentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = frontendItems.find((i) => i.slug === slug);
  return { title: item?.title ?? "フロントエンド設計" };
}

export default async function FrontendDetailPage({ params }: Props) {
  const { slug } = await params;
  const loader = contentMap[slug];
  if (!loader) notFound();

  const { default: page } = await loader();

  return (
    <DetailLayout
      section="frontend"
      sectionLabel="フロントエンド設計"
      page={page}
    />
  );
}
