import { PUBLISHED_BLOG_POSTS, getBlogPostPath } from "../blog/posts";
import { TOOL_CATALOG } from "../tools/catalog";
import { TOOL_LANDING_CONTENT } from "../tools/landingContent";

export const PUBLIC_TOOLS_DATA = TOOL_CATALOG.map((tool) => {
  const content = TOOL_LANDING_CONTENT[tool.id];

  return {
    id: tool.id,
    title: tool.title,
    category: tool.category,
    url: tool.route,
    description: tool.desc,
    summary: content?.summary ?? tool.desc,
    sections: content?.sections ?? [],
    useCases: content?.useCases ?? [],
    workflowSteps: content?.workflowSteps ?? [],
    faqs: content?.faqs ?? [],
  };
});

export const PUBLIC_BLOG_POSTS_DATA = PUBLISHED_BLOG_POSTS.map((post) => ({
  slug: post.slug,
  title: post.title,
  category: post.category,
  url: getBlogPostPath(post),
  description: post.excerpt,
  date: post.date,
  readTime: post.readTime,
  publishedDate: post.article.publishedDate,
  modifiedDate: post.article.modifiedDate,
  sectionHeadings: post.article.sections.map((section) => section.heading),
  images: [
    post.article.heroImage,
    ...post.article.sections.flatMap((section) =>
      section.image ? [section.image] : [],
    ),
  ].map((image) => ({
    src: image.src,
    alt: image.alt,
    caption: image.caption,
    credit: image.credit,
  })),
}));
