import {
  PUBLISHED_BLOG_POSTS,
  getBlogPostPath,
  type BlogImage,
  type PublishedBlogPost,
} from "../blog/posts";
import { TOOL_CATALOG } from "../tools/catalog";
import { TOOL_META_BY_SLUG } from "../tools/metaRegistry";
import type { ToolCategory, ToolMeta } from "../tools/types";

export type JsonLdNode = Record<string, unknown>;

export type JsonLdDocument = {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
};

export type SeoDescriptor = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  schema?: JsonLdDocument;
};

export type SeoRoute = {
  path: string;
  descriptor: SeoDescriptor;
};

export const SITE_NAME = "No Gatekeeping";
export const DEFAULT_SITE_URL = "https://nogatekeeping.com";
export const SITE_DESCRIPTION =
  "Fast, free browser utilities for images, text, SEO checks, design workflows, conversions, extraction, and everyday cleanup.";

export const PAGE_CONTENT = {
  home: {
    title: "No Gatekeeping - Free Browser Tools for Image, Text, SEO, and Design",
    description: SITE_DESCRIPTION,
    canonicalPath: "/",
  },
  tools: {
    title: "All Free Browser Tools - No Gatekeeping",
    description:
      "Browse every No Gatekeeping utility for image conversion, text cleanup, SEO checks, design systems, URL work, and local productivity.",
    canonicalPath: "/tools",
  },
  blog: {
    title: "Blog - No Gatekeeping",
    description:
      "Read No Gatekeeping field notes about SEO preflights, image cleanup, text utilities, design handoffs, URL workflows, and faster browser-tool work.",
    canonicalPath: "/blog",
  },
  notFound: {
    title: "Page Not Found - No Gatekeeping",
    description:
      "This No Gatekeeping route does not exist. Head back home or browse the full tool directory.",
    canonicalPath: "/",
    robots: "noindex,follow",
  },
} satisfies Record<string, Omit<SeoDescriptor, "schema">>;

const APPLICATION_CATEGORY_BY_TOOL_CATEGORY: Record<ToolCategory, string> = {
  Text: "UtilitiesApplication",
  Images: "MultimediaApplication",
  URLs: "DeveloperApplication",
  SEO: "DeveloperApplication",
  Design: "DesignApplication",
  Other: "UtilitiesApplication",
};

export function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

export function absoluteUrl(pathname: string, siteUrl = DEFAULT_SITE_URL) {
  const normalized = normalizePathname(pathname);
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  return normalized === "/"
    ? `${normalizedSiteUrl}/`
    : `${normalizedSiteUrl}${normalized}`;
}

function organizationNode(siteUrl: string): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
  };
}

function websiteNode(siteUrl: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    description: SITE_DESCRIPTION,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function webpageNode(
  descriptor: Pick<SeoDescriptor, "title" | "description" | "canonicalPath">,
  pageType: string,
  siteUrl: string,
  mainEntity?: { "@id": string },
): JsonLdNode {
  const url = absoluteUrl(descriptor.canonicalPath, siteUrl);

  return {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name: descriptor.title,
    description: descriptor.description,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    ...(mainEntity ? { mainEntity } : {}),
  };
}

function toolUrl(tool: Pick<ToolMeta, "slug">, siteUrl: string) {
  return absoluteUrl(`/tools/${tool.slug}`, siteUrl);
}

function toolApplicationId(tool: Pick<ToolMeta, "slug">, siteUrl: string) {
  return `${toolUrl(tool, siteUrl)}#web-application`;
}

function toolApplicationNode(meta: ToolMeta, siteUrl: string): JsonLdNode {
  return {
    "@type": "WebApplication",
    "@id": toolApplicationId(meta, siteUrl),
    name: meta.title,
    description: meta.description,
    url: toolUrl(meta, siteUrl),
    applicationCategory: APPLICATION_CATEGORY_BY_TOOL_CATEGORY[meta.category],
    operatingSystem: "Any modern web browser",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function toolListNode(id: string, name: string, siteUrl: string): JsonLdNode {
  return {
    "@type": "ItemList",
    "@id": id,
    name,
    numberOfItems: TOOL_CATALOG.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: TOOL_CATALOG.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: absoluteUrl(tool.route, siteUrl),
      item: {
        "@id": toolApplicationId({ slug: tool.id }, siteUrl),
        "@type": "WebApplication",
        name: tool.title,
        description: tool.desc,
        url: absoluteUrl(tool.route, siteUrl),
        applicationCategory:
          APPLICATION_CATEGORY_BY_TOOL_CATEGORY[tool.category as ToolCategory],
      },
    })),
  };
}

function breadcrumbNode(
  id: string,
  crumbs: Array<{ name: string; path: string }>,
  siteUrl: string,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, siteUrl),
    })),
  };
}

function blogImageObjectId(pageUrl: string, index: number) {
  return `${pageUrl}#image-${index + 1}`;
}

function blogImageObjectNode(
  image: BlogImage,
  pageUrl: string,
  siteUrl: string,
  index: number,
): JsonLdNode {
  const contentUrl = absoluteUrl(image.src, siteUrl);

  return {
    "@type": "ImageObject",
    "@id": blogImageObjectId(pageUrl, index),
    url: contentUrl,
    contentUrl,
    name: image.alt,
    description: image.alt,
    ...(image.caption ? { caption: image.caption } : {}),
    ...(image.credit ? { creditText: image.credit } : {}),
  };
}

function blogPostImages(post: PublishedBlogPost) {
  return [
    post.article.heroImage,
    ...post.article.sections.flatMap((section) =>
      section.image ? [section.image] : [],
    ),
  ];
}

function schemaGraph(nodes: JsonLdNode[], siteUrl: string): JsonLdDocument {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(siteUrl), websiteNode(siteUrl), ...nodes],
  };
}

function homeSchema(
  descriptor: SeoDescriptor,
  siteUrl: string,
): JsonLdDocument {
  const url = absoluteUrl(descriptor.canonicalPath, siteUrl);
  const listId = `${url}#tool-list`;

  return schemaGraph(
    [
      webpageNode(descriptor, "WebPage", siteUrl, { "@id": listId }),
      toolListNode(listId, "No Gatekeeping tool catalog", siteUrl),
    ],
    siteUrl,
  );
}

function toolsSchema(
  descriptor: SeoDescriptor,
  siteUrl: string,
): JsonLdDocument {
  const url = absoluteUrl(descriptor.canonicalPath, siteUrl);
  const listId = `${url}#tool-list`;

  return schemaGraph(
    [
      webpageNode(descriptor, "CollectionPage", siteUrl, { "@id": listId }),
      toolListNode(listId, "All No Gatekeeping tools", siteUrl),
      breadcrumbNode(
        `${url}#breadcrumb`,
        [
          { name: "Home", path: "/" },
          { name: "All Tools", path: "/tools" },
        ],
        siteUrl,
      ),
    ],
    siteUrl,
  );
}

function blogSchema(
  descriptor: SeoDescriptor,
  siteUrl: string,
): JsonLdDocument {
  const url = absoluteUrl(descriptor.canonicalPath, siteUrl);
  const blogId = `${url}#blog`;

  return schemaGraph(
    [
      webpageNode(descriptor, "CollectionPage", siteUrl, { "@id": blogId }),
      {
        "@type": "Blog",
        "@id": blogId,
        name: "No Gatekeeping Blog",
        description: descriptor.description,
        url,
        blogPost: PUBLISHED_BLOG_POSTS.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(getBlogPostPath(post), siteUrl)}#blog-post`,
          headline: post.title,
          url: absoluteUrl(getBlogPostPath(post), siteUrl),
        })),
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      breadcrumbNode(
        `${url}#breadcrumb`,
        [
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ],
        siteUrl,
      ),
    ],
    siteUrl,
  );
}

function blogPostSchema(
  descriptor: SeoDescriptor,
  post: PublishedBlogPost,
  siteUrl: string,
): JsonLdDocument {
  const url = absoluteUrl(descriptor.canonicalPath, siteUrl);
  const postId = `${url}#blog-post`;
  const imageNodes = blogPostImages(post).map((image, index) =>
    blogImageObjectNode(image, url, siteUrl, index),
  );

  return schemaGraph(
    [
      webpageNode(descriptor, "WebPage", siteUrl, { "@id": postId }),
      {
        "@type": "BlogPosting",
        "@id": postId,
        headline: post.title,
        description: post.excerpt,
        image: imageNodes.map((_, index) => ({
          "@id": blogImageObjectId(url, index),
        })),
        datePublished: post.article.publishedDate,
        dateModified: post.article.modifiedDate,
        author: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: post.article.author,
        },
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        mainEntityOfPage: {
          "@id": `${url}#webpage`,
        },
      },
      ...imageNodes,
      breadcrumbNode(
        `${url}#breadcrumb`,
        [
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: getBlogPostPath(post) },
        ],
        siteUrl,
      ),
    ],
    siteUrl,
  );
}

function toolSchema(
  descriptor: SeoDescriptor,
  meta: ToolMeta,
  siteUrl: string,
): JsonLdDocument {
  const url = absoluteUrl(descriptor.canonicalPath, siteUrl);
  const appId = toolApplicationId(meta, siteUrl);

  return schemaGraph(
    [
      webpageNode(descriptor, "WebPage", siteUrl, { "@id": appId }),
      toolApplicationNode(meta, siteUrl),
      breadcrumbNode(
        `${url}#breadcrumb`,
        [
          { name: "Home", path: "/" },
          { name: "All Tools", path: "/tools" },
          { name: meta.title, path: `/tools/${meta.slug}` },
        ],
        siteUrl,
      ),
    ],
    siteUrl,
  );
}

function toolDescriptor(meta: ToolMeta, siteUrl: string): SeoDescriptor {
  const descriptor = {
    title: `${meta.title} - Free Browser Tool - No Gatekeeping`,
    description: meta.description,
    canonicalPath: `/tools/${meta.slug}`,
  };

  return {
    ...descriptor,
    schema: toolSchema(descriptor, meta, siteUrl),
  };
}

function blogPostDescriptor(
  post: PublishedBlogPost,
  siteUrl: string,
): SeoDescriptor {
  const descriptor = {
    title: `${post.title} - No Gatekeeping`,
    description: post.excerpt,
    canonicalPath: getBlogPostPath(post),
  };

  return {
    ...descriptor,
    schema: blogPostSchema(descriptor, post, siteUrl),
  };
}

export function getSeoDescriptor(
  pathname: string,
  siteUrl = DEFAULT_SITE_URL,
): SeoDescriptor {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const pathnameWithoutTrailingSlash = normalizePathname(pathname);

  if (pathnameWithoutTrailingSlash === "/") {
    return {
      ...PAGE_CONTENT.home,
      schema: homeSchema(PAGE_CONTENT.home, normalizedSiteUrl),
    };
  }

  if (pathnameWithoutTrailingSlash === "/tools") {
    return {
      ...PAGE_CONTENT.tools,
      schema: toolsSchema(PAGE_CONTENT.tools, normalizedSiteUrl),
    };
  }

  if (pathnameWithoutTrailingSlash === "/blog") {
    return {
      ...PAGE_CONTENT.blog,
      schema: blogSchema(PAGE_CONTENT.blog, normalizedSiteUrl),
    };
  }

  const blogPostMatch = pathnameWithoutTrailingSlash.match(/^\/blog\/([^/]+)$/);
  if (blogPostMatch) {
    const post = PUBLISHED_BLOG_POSTS.find(
      (item) => item.slug === blogPostMatch[1],
    );
    if (post) return blogPostDescriptor(post, normalizedSiteUrl);
  }

  const toolMatch = pathnameWithoutTrailingSlash.match(/^\/tools\/([^/]+)$/);
  if (toolMatch) {
    const entry = TOOL_META_BY_SLUG[toolMatch[1]];
    if (entry) return toolDescriptor(entry, normalizedSiteUrl);
  }

  const legacyToolMatch = pathnameWithoutTrailingSlash.match(/^\/tool\/([^/]+)$/);
  if (legacyToolMatch) {
    const entry = TOOL_META_BY_SLUG[legacyToolMatch[1]];
    if (entry) return toolDescriptor(entry, normalizedSiteUrl);
  }

  return PAGE_CONTENT.notFound;
}

export function getSeoPrerenderRoutes(
  siteUrl = DEFAULT_SITE_URL,
): SeoRoute[] {
  return [
    "/",
    "/tools",
    "/blog",
    ...PUBLISHED_BLOG_POSTS.map((post) => getBlogPostPath(post)),
    ...TOOL_CATALOG.map((tool) => tool.route),
  ].map((path) => ({
    path,
    descriptor: getSeoDescriptor(path, siteUrl),
  }));
}
