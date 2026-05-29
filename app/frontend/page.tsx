import type { Metadata } from "next";
import DigestLayout from "@/components/DigestLayout";
import { frontendDigest, frontendItems } from "@/content/frontend/index";

export const metadata: Metadata = {
  title: "フロントエンド設計",
};

export default function FrontendPage() {
  return (
    <DigestLayout
      section="frontend"
      title={frontendDigest.title}
      description={frontendDigest.description}
      items={frontendItems}
    />
  );
}
