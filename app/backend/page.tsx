import type { Metadata } from "next";
import DigestLayout from "@/components/DigestLayout";
import { backendDigest, backendItems } from "@/content/backend/index";

export const metadata: Metadata = {
  title: "バックエンド設計",
};

export default function BackendPage() {
  return (
    <DigestLayout
      section="backend"
      title={backendDigest.title}
      description={backendDigest.description}
      items={backendItems}
    />
  );
}
