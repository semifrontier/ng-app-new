export type ToolCategory =
  | "Text"
  | "Images"
  | "URLs"
  | "SEO"
  | "Design"
  | "Other";

export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  category: ToolCategory;
};
