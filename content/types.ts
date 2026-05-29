export type ImageRef = {
  src: string;
  alt: string;
  caption?: string;
};

export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "image"; image: ImageRef }
  | { type: "images"; images: ImageRef[]; layout?: "grid" | "row" }
  | { type: "code"; code: { lang: string; code: string } }
  | { type: "callout"; variant: "info" | "tip" | "warning"; content: string }
  | { type: "list"; items: string[] };

export type Section = {
  id: string;
  heading: string;
  blocks: ContentBlock[];
};

export type DetailPage = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  sections: Section[];
};

export type DigestItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImage?: ImageRef;
};
