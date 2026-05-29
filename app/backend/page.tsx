import type { Metadata } from "next";
import DigestLayout from "@/components/DigestLayout";
import { backendDigest, backendItems, backendStack } from "@/content/backend/index";

export const metadata: Metadata = {
  title: "バックエンド設計",
  description: backendDigest.description,
};

export default function BackendPage() {
  return (
    <DigestLayout
      section="backend"
      title={backendDigest.title}
      description={backendDigest.description}
      items={backendItems}
      stack={backendStack}
    />
  );
}
