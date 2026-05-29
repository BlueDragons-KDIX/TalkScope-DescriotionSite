import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailLayout from "@/components/DetailLayout";
import { frontendItems } from "@/content/frontend/index";
import type { DetailPage } from "@/content/types";

const contentMap: Record<string, () => Promise<{ default: DetailPage }>> = {
  "clean-architecture": () => import("@/content/frontend/clean-architecture"),
  "bubble-physics":     () => import("@/content/frontend/bubble-physics"),
  "layout-engine":      () => import("@/content/frontend/layout-engine"),
  "bubble-lifetime":    () => import("@/content/frontend/bubble-lifetime"),
  "customization":      () => import("@/content/frontend/customization"),
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(contentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = frontendItems.find((i) => i.slug === slug);
  return {
    title: item?.title ?? "フロントエンド設計",
    description: item?.description,
  };
}

export default async function FrontendDetailPage({ params }: Props) {
  const { slug } = await params;
  const loader = contentMap[slug];
  if (!loader) notFound();

  const { default: page } = await loader();
  const idx = frontendItems.findIndex((i) => i.slug === slug);
  const prev = idx > 0 ? frontendItems[idx - 1] : null;
  const next = idx >= 0 && idx < frontendItems.length - 1 ? frontendItems[idx + 1] : null;

  return (
    <DetailLayout
      section="frontend"
      sectionLabel="フロントエンド設計"
      page={page}
      prev={prev && { slug: prev.slug, title: prev.title }}
      next={next && { slug: next.slug, title: next.title }}
    />
  );
}
