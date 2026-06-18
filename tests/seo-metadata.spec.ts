import { expect, test } from "@playwright/test";
import {
  absoluteUrl,
  DEFAULT_SITE_URL,
  getSeoPrerenderRoutes,
  SITE_NAME,
  type JsonLdDocument,
  type SeoDescriptor,
} from "../src/seo/seoData";
import { TOOL_LANDING_CONTENT } from "../src/tools/landingContent";

type HeadSnapshot = {
  canonical?: string;
  description?: string;
  jsonLdCount: number;
  ogDescription?: string;
  ogSiteName?: string;
  ogTitle?: string;
  ogType?: string;
  ogUrl?: string;
  robots?: string;
  schema?: JsonLdDocument;
  title?: string;
  twitterDescription?: string;
  twitterTitle?: string;
};

const SITE_URL = DEFAULT_SITE_URL;
const SEO_ROUTES = getSeoPrerenderRoutes(SITE_URL);
const HYDRATION_SMOKE_PATHS = [
  "/",
  "/tools",
  "/blog",
  "/tools/dns-checker",
];
const TOOL_CONTENT_ROUTES = SEO_ROUTES.filter((route) =>
  route.path.startsWith("/tools/"),
);

function decodeHtml(value: string | undefined) {
  if (!value) return value;

  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function readTagContent(html: string, attribute: "name" | "property", value: string) {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}="${value}"[^>]*content="([^"]*)"[^>]*>`,
    "i",
  );
  return decodeHtml(html.match(pattern)?.[1]);
}

function readTitle(html: string) {
  return decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
}

function readCanonical(html: string) {
  return decodeHtml(
    html.match(/<link\s+[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i)?.[1],
  );
}

function readJsonLdScripts(html: string) {
  return [
    ...html.matchAll(
      /<script\s+[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => JSON.parse(match[1]) as JsonLdDocument);
}

function getExpectedCanonical(descriptor: SeoDescriptor) {
  return absoluteUrl(descriptor.canonicalPath, SITE_URL);
}

function expectHeadToMatchDescriptor(
  snapshot: HeadSnapshot,
  descriptor: SeoDescriptor,
) {
  const expectedCanonical = getExpectedCanonical(descriptor);

  expect(snapshot.title).toBe(descriptor.title);
  expect(snapshot.description).toBe(descriptor.description);
  expect(snapshot.robots).toBe(descriptor.robots ?? "index,follow");
  expect(snapshot.canonical).toBe(expectedCanonical);

  expect(snapshot.ogSiteName).toBe(SITE_NAME);
  expect(snapshot.ogType).toBe("website");
  expect(snapshot.ogTitle).toBe(descriptor.title);
  expect(snapshot.ogDescription).toBe(descriptor.description);
  expect(snapshot.ogUrl).toBe(expectedCanonical);

  expect(snapshot.twitterTitle).toBe(descriptor.title);
  expect(snapshot.twitterDescription).toBe(descriptor.description);

  expect(snapshot.jsonLdCount).toBe(descriptor.schema ? 1 : 0);
  if (descriptor.schema) {
    expect(snapshot.schema).toEqual(descriptor.schema);
  }
}

function snapshotFromHtml(html: string): HeadSnapshot {
  const jsonLdScripts = readJsonLdScripts(html);

  return {
    title: readTitle(html),
    description: readTagContent(html, "name", "description"),
    robots: readTagContent(html, "name", "robots"),
    canonical: readCanonical(html),
    ogSiteName: readTagContent(html, "property", "og:site_name"),
    ogType: readTagContent(html, "property", "og:type"),
    ogTitle: readTagContent(html, "property", "og:title"),
    ogDescription: readTagContent(html, "property", "og:description"),
    ogUrl: readTagContent(html, "property", "og:url"),
    twitterTitle: readTagContent(html, "name", "twitter:title"),
    twitterDescription: readTagContent(html, "name", "twitter:description"),
    jsonLdCount: jsonLdScripts.length,
    schema: jsonLdScripts[0],
  };
}

test.describe("SEO metadata and schema", () => {
  for (const route of SEO_ROUTES) {
    test(`${route.path} has prerendered metadata and JSON-LD`, async ({
      request,
    }) => {
      const response = await request.get(route.path);
      const html = await response.text();

      expect(response.status()).toBe(200);
      expectHeadToMatchDescriptor(snapshotFromHtml(html), route.descriptor);
    });
  }

  for (const path of HYDRATION_SMOKE_PATHS) {
    test(`${path} keeps metadata stable after hydration`, async ({ page }) => {
      const route = SEO_ROUTES.find((item) => item.path === path);
      expect(route, `Missing SEO route fixture for ${path}`).toBeTruthy();

      await page.goto(path, { waitUntil: "networkidle" });

      const snapshot = await page.evaluate(() => {
        const readMeta = (attribute: "name" | "property", value: string) =>
          document
            .querySelector(`meta[${attribute}="${value}"]`)
            ?.getAttribute("content") ?? undefined;
        const jsonLdScripts = [
          ...document.querySelectorAll<HTMLScriptElement>(
            'script[type="application/ld+json"]',
          ),
        ];

        return {
          title: document.title,
          description: readMeta("name", "description"),
          robots: readMeta("name", "robots"),
          canonical:
            document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
            undefined,
          ogSiteName: readMeta("property", "og:site_name"),
          ogType: readMeta("property", "og:type"),
          ogTitle: readMeta("property", "og:title"),
          ogDescription: readMeta("property", "og:description"),
          ogUrl: readMeta("property", "og:url"),
          twitterTitle: readMeta("name", "twitter:title"),
          twitterDescription: readMeta("name", "twitter:description"),
          jsonLdCount: jsonLdScripts.length,
          schema: jsonLdScripts[0]?.textContent
            ? JSON.parse(jsonLdScripts[0].textContent)
            : undefined,
        } satisfies HeadSnapshot;
      });

      expectHeadToMatchDescriptor(snapshot, route!.descriptor);
    });
  }

  for (const route of TOOL_CONTENT_ROUTES) {
    test(`${route.path} renders visible tool landing content`, async ({
      page,
    }) => {
      const slug = route.path.split("/").at(-1);
      expect(slug, `Could not parse tool slug from ${route.path}`).toBeTruthy();

      const content = TOOL_LANDING_CONTENT[slug!];
      expect(content, `Missing landing content for ${route.path}`).toBeTruthy();

      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const section = page.locator(`[data-seo-content-for="${slug}"]`);

      await expect(section).toBeVisible();
      await expect(section).toContainText(content.heading);
      await expect(section).toContainText(content.summary);

      for (const useCase of content.useCases) {
        await expect(section).toContainText(useCase);
      }
    });
  }

  test("sitemap and robots match indexable canonical routes", async ({
    request,
  }) => {
    const expectedUrls = SEO_ROUTES.filter(
      (route) => !route.descriptor.robots?.toLowerCase().includes("noindex"),
    ).map((route) => getExpectedCanonical(route.descriptor));

    const sitemapResponse = await request.get("/sitemap.xml");
    const sitemapXml = await sitemapResponse.text();
    const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match) => decodeHtml(match[1]),
    );

    expect(sitemapResponse.status()).toBe(200);
    expect(sitemapUrls).toEqual(expectedUrls);
    expect(new Set(sitemapUrls).size).toBe(sitemapUrls.length);
    expect(sitemapXml).not.toMatch(/<(lastmod|changefreq|priority)>/);

    const robotsResponse = await request.get("/robots.txt");
    const robotsTxt = await robotsResponse.text();

    expect(robotsResponse.status()).toBe(200);
    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});
