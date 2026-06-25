/* global document, window */
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  loadBundledTypeScriptModule,
  loadSeoDataModule,
  PROJECT_ROOT,
} from "./seo-data-loader.mjs";

const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const DOCS_REPORT_PATH = path.join(PROJECT_ROOT, "docs", "seo-audit.md");
const JSON_REPORT_PATH = path.join(
  PROJECT_ROOT,
  "qa",
  "seo-audit",
  "report.json",
);
const DEFAULT_ROBOTS = "index,follow";
const TITLE_WARN_LENGTH = 60;
const TITLE_FAIL_LENGTH = 65;
const DESCRIPTION_WARN_MIN = 80;
const DESCRIPTION_FAIL_MIN = 50;
const DESCRIPTION_WARN_MAX = 170;
const DESCRIPTION_FAIL_MAX = 190;
const FAIL_ON_WARN = process.argv.includes("--fail-on-warn");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function decodeHtml(value) {
  if (!value) return value;

  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function readTagContent(html, attribute, value) {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}="${value}"[^>]*content="([^"]*)"[^>]*>`,
    "i",
  );

  return decodeHtml(html.match(pattern)?.[1]);
}

function readTitle(html) {
  return decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
}

function readCanonical(html) {
  return decodeHtml(
    html.match(/<link\s+[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i)?.[1],
  );
}

function readJsonLdScripts(html) {
  return [
    ...html.matchAll(
      /<script\s+[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => JSON.parse(match[1]));
}

function snapshotFromHtml(html) {
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

function normalizeForMatch(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function markdownEscape(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
}

function truncate(value, maxLength = 86) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function check(id, label, status, detail) {
  return { id, label, status, detail };
}

function worstStatus(checks) {
  if (checks.some((item) => item.status === "fail")) return "fail";
  if (checks.some((item) => item.status === "warn")) return "warn";
  return "pass";
}

function countStatuses(items) {
  return items.reduce(
    (counts, item) => {
      counts[item.status] += 1;
      return counts;
    },
    { pass: 0, warn: 0, fail: 0 },
  );
}

function hasNoindex(descriptor) {
  return descriptor.robots?.toLowerCase().includes("noindex") ?? false;
}

function schemaTypes(descriptor) {
  const graph = descriptor.schema?.["@graph"];
  if (!Array.isArray(graph)) return [];

  return graph.flatMap((node) => {
    const type = node?.["@type"];
    return Array.isArray(type) ? type : [type].filter(Boolean);
  });
}

function routeType(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/tools") return "tools-index";
  if (pathname === "/blog") return "blog-index";
  if (pathname.startsWith("/tools/")) return "tool";
  if (pathname.startsWith("/blog/")) return "blog-post";
  return "other";
}

function expectedSchemaTypes(type, route, toolDataByPath) {
  if (type === "home") return ["WebPage", "ItemList"];
  if (type === "tools-index") return ["CollectionPage", "ItemList", "BreadcrumbList"];
  if (type === "blog-index") return ["CollectionPage", "Blog", "BreadcrumbList"];
  if (type === "blog-post") return ["WebPage", "BlogPosting", "ImageObject", "BreadcrumbList"];
  if (type === "tool") {
    return [
      "WebPage",
      "WebApplication",
      ...(toolDataByPath?.get(route.path)?.faqs?.length ? ["FAQPage"] : []),
      "BreadcrumbList",
    ];
  }
  return ["WebPage"];
}

function contentThresholds(type) {
  if (type === "blog-post") {
    return { words: 900, internalLinks: 4, h2: 4 };
  }

  if (type === "tool") {
    return { words: 220, internalLinks: 4, h2: 1 };
  }

  if (type === "home") {
    return { words: 350, internalLinks: 18, h2: 8 };
  }

  if (type === "tools-index") {
    return { words: 300, internalLinks: 18, h2: 1 };
  }

  if (type === "blog-index") {
    return { words: 300, internalLinks: 8, h2: 3 };
  }

  return { words: 200, internalLinks: 3, h2: 1 };
}

function expectedH1(route, type, toolDataByPath, postDataByPath) {
  if (type === "home") return "No Gatekeeping";
  if (type === "tools-index") return "Browse Every Tool";
  if (type === "blog-index") return "Blog";
  if (type === "tool") return toolDataByPath.get(route.path)?.title;
  if (type === "blog-post") return postDataByPath.get(route.path)?.title;
  return undefined;
}

function descriptorDuplicateChecks(route, titleCounts, descriptionCounts) {
  const checks = [];
  const { title, description } = route.descriptor;

  checks.push(
    check(
      "title_unique",
      "Title is unique",
      titleCounts.get(title) === 1 ? "pass" : "fail",
      titleCounts.get(title) === 1
        ? "No duplicate title found."
        : `Shared by ${titleCounts.get(title)} routes.`,
    ),
  );
  checks.push(
    check(
      "description_unique",
      "Description is unique",
      descriptionCounts.get(description) === 1 ? "pass" : "fail",
      descriptionCounts.get(description) === 1
        ? "No duplicate description found."
        : `Shared by ${descriptionCounts.get(description)} routes.`,
    ),
  );

  return checks;
}

function descriptorChecks({
  route,
  siteUrl,
  seoMod,
  sitemapUrls,
  toolDataByPath,
  titleCounts,
  descriptionCounts,
}) {
  const type = routeType(route.path);
  const descriptor = route.descriptor;
  const canonicalUrl = seoMod.absoluteUrl(descriptor.canonicalPath, siteUrl);
  const titleLength = descriptor.title.length;
  const descriptionLength = descriptor.description.length;
  const types = schemaTypes(descriptor);
  const expectedTypes = expectedSchemaTypes(type, route, toolDataByPath);
  const missingTypes = expectedTypes.filter((expectedType) => !types.includes(expectedType));
  const normalizedCanonicalPath = seoMod.normalizePathname(descriptor.canonicalPath);
  const normalizedRoutePath = seoMod.normalizePathname(route.path);
  const isIndexable = !hasNoindex(descriptor);

  return [
    check(
      "title_present",
      "Title is present",
      descriptor.title.trim() ? "pass" : "fail",
      descriptor.title || "Missing title.",
    ),
    check(
      "title_length",
      "Title length",
      titleLength <= TITLE_WARN_LENGTH
        ? "pass"
        : titleLength <= TITLE_FAIL_LENGTH
          ? "warn"
          : "fail",
      `${titleLength} characters.`,
    ),
    check(
      "description_present",
      "Meta description is present",
      descriptor.description.trim() ? "pass" : "fail",
      descriptor.description || "Missing description.",
    ),
    check(
      "description_length",
      "Meta description length",
      descriptionLength >= DESCRIPTION_WARN_MIN &&
        descriptionLength <= DESCRIPTION_WARN_MAX
        ? "pass"
        : descriptionLength >= DESCRIPTION_FAIL_MIN &&
            descriptionLength <= DESCRIPTION_FAIL_MAX
          ? "warn"
          : "fail",
      `${descriptionLength} characters.`,
    ),
    ...descriptorDuplicateChecks(route, titleCounts, descriptionCounts),
    check(
      "canonical_path",
      "Canonical path matches route",
      normalizedCanonicalPath === normalizedRoutePath ? "pass" : "fail",
      `${descriptor.canonicalPath} -> ${canonicalUrl}`,
    ),
    check(
      "robots_policy",
      "Robots policy is appropriate",
      isIndexable && (descriptor.robots ?? DEFAULT_ROBOTS) === DEFAULT_ROBOTS
        ? "pass"
        : "warn",
      descriptor.robots ?? DEFAULT_ROBOTS,
    ),
    check(
      "schema_present",
      "JSON-LD schema is present",
      descriptor.schema ? "pass" : "fail",
      descriptor.schema ? "One schema document in descriptor." : "Missing schema document.",
    ),
    check(
      "schema_core_nodes",
      "Schema includes organization and website",
      types.includes("Organization") && types.includes("WebSite") ? "pass" : "fail",
      types.join(", "),
    ),
    check(
      "schema_page_nodes",
      "Schema matches page type",
      missingTypes.length === 0 ? "pass" : "fail",
      missingTypes.length === 0
        ? expectedTypes.join(", ")
        : `Missing: ${missingTypes.join(", ")}`,
    ),
    check(
      "sitemap_coverage",
      "Sitemap contains indexable canonical",
      !isIndexable || sitemapUrls.has(canonicalUrl) ? "pass" : "fail",
      isIndexable ? canonicalUrl : "Route is noindex.",
    ),
  ];
}

function headMismatches(snapshot, descriptor, canonicalUrl, siteName) {
  const expected = {
    title: descriptor.title,
    description: descriptor.description,
    robots: descriptor.robots ?? DEFAULT_ROBOTS,
    canonical: canonicalUrl,
    ogSiteName: siteName,
    ogType: "website",
    ogTitle: descriptor.title,
    ogDescription: descriptor.description,
    ogUrl: canonicalUrl,
    twitterTitle: descriptor.title,
    twitterDescription: descriptor.description,
    jsonLdCount: descriptor.schema ? 1 : 0,
  };
  const mismatches = Object.entries(expected)
    .filter(([key, value]) => snapshot[key] !== value)
    .map(([key]) => key);

  if (descriptor.schema && stableJson(snapshot.schema) !== stableJson(descriptor.schema)) {
    mismatches.push("schema");
  }

  return mismatches;
}

function firstResponseChecks({ route, htmlSnapshot, siteUrl, seoMod }) {
  const canonicalUrl = seoMod.absoluteUrl(route.descriptor.canonicalPath, siteUrl);
  const mismatches = headMismatches(
    htmlSnapshot,
    route.descriptor,
    canonicalUrl,
    seoMod.SITE_NAME,
  );

  return [
    check(
      "first_response_head",
      "First-response HTML head matches descriptor",
      mismatches.length === 0 ? "pass" : "fail",
      mismatches.length === 0 ? "Head tags match." : `Mismatched: ${mismatches.join(", ")}`,
    ),
  ];
}

function domChecks({
  route,
  domSnapshot,
  siteUrl,
  seoMod,
  toolDataByPath,
  postDataByPath,
}) {
  if (domSnapshot.error) {
    return [
      check(
        "hydrated_dom_loaded",
        "Hydrated page loads",
        "fail",
        domSnapshot.error,
      ),
    ];
  }

  const type = routeType(route.path);
  const canonicalUrl = seoMod.absoluteUrl(route.descriptor.canonicalPath, siteUrl);
  const mismatches = headMismatches(
    domSnapshot,
    route.descriptor,
    canonicalUrl,
    seoMod.SITE_NAME,
  );
  const thresholds = contentThresholds(type);
  const expected = expectedH1(route, type, toolDataByPath, postDataByPath);
  const normalizedH1s = domSnapshot.h1s.map(normalizeForMatch);
  const normalizedExpected = normalizeForMatch(expected);
  const h1Aligned =
    !normalizedExpected ||
    normalizedH1s.some(
      (h1) => h1.includes(normalizedExpected) || normalizedExpected.includes(h1),
    );
  const checks = [
    check(
      "hydrated_head",
      "Hydrated DOM head matches descriptor",
      mismatches.length === 0 ? "pass" : "fail",
      mismatches.length === 0 ? "Head tags match." : `Mismatched: ${mismatches.join(", ")}`,
    ),
    check(
      "h1_count",
      "Exactly one H1",
      domSnapshot.h1s.length === 1 ? "pass" : "fail",
      `${domSnapshot.h1s.length} found: ${domSnapshot.h1s.join(" | ") || "none"}`,
    ),
    check(
      "h1_alignment",
      "H1 aligns with page intent",
      h1Aligned ? "pass" : "warn",
      expected ? `Expected signal: ${expected}` : "No expected H1 configured.",
    ),
    check(
      "heading_depth",
      "Page has supporting headings",
      domSnapshot.h2s.length >= thresholds.h2 ? "pass" : "warn",
      `${domSnapshot.h2s.length} H2 headings; threshold ${thresholds.h2}.`,
    ),
    check(
      "visible_content_depth",
      "Visible content has useful depth",
      domSnapshot.wordCount >= thresholds.words ? "pass" : "warn",
      `${domSnapshot.wordCount} visible words; threshold ${thresholds.words}.`,
    ),
    check(
      "internal_links",
      "Internal links support discovery",
      domSnapshot.internalLinkCount >= thresholds.internalLinks ? "pass" : "warn",
      `${domSnapshot.internalLinkCount} unique internal links; threshold ${thresholds.internalLinks}.`,
    ),
    check(
      "image_alt_text",
      "Images have alt text",
      domSnapshot.missingImageAltCount === 0 ? "pass" : "fail",
      `${domSnapshot.missingImageAltCount} image elements missing alt.`,
    ),
  ];

  if (type === "tool") {
    checks.push(
      check(
        "tool_landing_content",
        "Tool page includes SEO content band",
        domSnapshot.toolContentPresent ? "pass" : "fail",
        domSnapshot.toolContentPresent
          ? "Summary, FAQ, use cases, and related tools area present."
          : "Missing data-seo-content-for section.",
      ),
    );
    checks.push(
      check(
        "related_tools",
        "Tool page links to related tools",
        domSnapshot.relatedToolLinkCount >= 1 ? "pass" : "warn",
        `${domSnapshot.relatedToolLinkCount} related tool links found.`,
      ),
    );
  }

  if (type === "blog-post") {
    checks.push(
      check(
        "article_sections",
        "Article has multiple sections",
        domSnapshot.h2s.length >= 5 ? "pass" : "warn",
        `${domSnapshot.h2s.length} H2 headings found.`,
      ),
    );
  }

  return checks;
}

async function readOptionalFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return undefined;
  }
}

async function statOptional(filePath) {
  try {
    return await stat(filePath);
  } catch {
    return undefined;
  }
}

function ensureInsideDist(filePath) {
  const resolved = path.resolve(filePath);
  return resolved === DIST_DIR || resolved.startsWith(`${DIST_DIR}${path.sep}`);
}

async function resolveStaticFile(requestPathname) {
  const decodedPathname = decodeURIComponent(requestPathname);
  const pathname = decodedPathname === "/" ? "/index.html" : decodedPathname;
  const relativePath = pathname.replace(/^\/+/, "");
  const directPath = path.join(DIST_DIR, relativePath);

  if (!ensureInsideDist(directPath)) return undefined;

  const directStats = await statOptional(directPath);
  if (directStats?.isFile()) return { filePath: directPath, statusCode: 200 };
  if (directStats?.isDirectory()) {
    const indexPath = path.join(directPath, "index.html");
    if (existsSync(indexPath)) return { filePath: indexPath, statusCode: 200 };
  }

  if (!path.extname(relativePath)) {
    const htmlPath = path.join(DIST_DIR, `${relativePath}.html`);
    if (ensureInsideDist(htmlPath) && existsSync(htmlPath)) {
      return { filePath: htmlPath, statusCode: 200 };
    }

    const indexPath = path.join(DIST_DIR, relativePath, "index.html");
    if (ensureInsideDist(indexPath) && existsSync(indexPath)) {
      return { filePath: indexPath, statusCode: 200 };
    }
  }

  const notFoundPath = path.join(DIST_DIR, "404.html");
  if (existsSync(notFoundPath)) return { filePath: notFoundPath, statusCode: 404 };

  return undefined;
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const resolved = await resolveStaticFile(url.pathname);

      if (!resolved) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      const body = await readFile(resolved.filePath);
      const contentType =
        MIME_TYPES[path.extname(resolved.filePath)] ??
        "application/octet-stream";

      response.writeHead(resolved.statusCode, { "content-type": contentType });
      response.end(body);
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}

function htmlPathForRoute(pathname) {
  if (pathname === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, `${pathname.replace(/^\/+/, "")}.html`);
}

async function collectDomSnapshots(routes) {
  const server = await startStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const snapshots = new Map();

  try {
    for (const route of routes) {
      const slug = route.path.split("/").at(-1) ?? "";

      try {
        await page.goto(`${server.baseUrl}${route.path}`, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });
        await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => undefined);

        snapshots.set(
          route.path,
          await page.evaluate((currentSlug) => {
            const readMeta = (attribute, value) =>
              document
                .querySelector(`meta[${attribute}="${value}"]`)
                ?.getAttribute("content") ?? undefined;
            const jsonLdScripts = [
              ...document.querySelectorAll('script[type="application/ld+json"]'),
            ];
            const links = [
              ...document.querySelectorAll("a[href]"),
            ].map((link) => link.getAttribute("href") ?? "");
            const internalLinks = links.filter((href) => {
              if (href.startsWith("#") || href.startsWith("/")) return true;
              try {
                return new URL(href, window.location.origin).origin === window.location.origin;
              } catch {
                return false;
              }
            });
            const toolContent = document.querySelector(
              `[data-seo-content-for="${currentSlug}"]`,
            );
            const relatedToolLinks = toolContent
              ? [
                  ...toolContent.querySelectorAll('nav[aria-label^="Related tools"] a[href]'),
                ]
              : [];
            const text = document.body.innerText ?? "";
            const words = text.match(/\b[\w'-]+\b/g) ?? [];

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
              h1s: [...document.querySelectorAll("h1")].map((item) =>
                item.textContent?.replace(/\s+/g, " ").trim() ?? "",
              ),
              h2s: [...document.querySelectorAll("h2")].map((item) =>
                item.textContent?.replace(/\s+/g, " ").trim() ?? "",
              ),
              h3s: [...document.querySelectorAll("h3")].map((item) =>
                item.textContent?.replace(/\s+/g, " ").trim() ?? "",
              ),
              wordCount: words.length,
              internalLinkCount: new Set(internalLinks).size,
              missingImageAltCount: [
                ...document.querySelectorAll("img"),
              ].filter((item) => !item.hasAttribute("alt")).length,
              toolContentPresent: Boolean(toolContent),
              relatedToolLinkCount: relatedToolLinks.length,
            };
          }, slug),
        );
      } catch (error) {
        snapshots.set(route.path, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }

  return snapshots;
}

async function readSitemapUrls() {
  const sitemapXml =
    (await readOptionalFile(path.join(DIST_DIR, "sitemap.xml"))) ??
    (await readOptionalFile(path.join(PROJECT_ROOT, "public", "sitemap.xml"))) ??
    "";

  return new Set(
    [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
      decodeHtml(match[1]),
    ),
  );
}

function buildPageData(publicDataMod) {
  const toolDataByPath = new Map(
    publicDataMod.PUBLIC_TOOLS_DATA.map((tool) => [tool.url, tool]),
  );
  const postDataByPath = new Map(
    publicDataMod.PUBLIC_BLOG_POSTS_DATA.map((post) => [post.url, post]),
  );

  return { toolDataByPath, postDataByPath };
}

function pageSummary(pageAudit) {
  const failing = pageAudit.checks.filter((item) => item.status === "fail");
  const warnings = pageAudit.checks.filter((item) => item.status === "warn");
  const issues = [...failing, ...warnings].slice(0, 4);

  if (issues.length === 0) return "No issues.";

  return issues
    .map((item) => `${item.status.toUpperCase()}: ${item.label} (${item.detail})`)
    .join("<br>");
}

function renderMarkdown(report) {
  const pageRows = report.pages.map((page) => {
    const h1 = page.dom?.h1s?.join(" | ") || "n/a";
    const words = page.dom?.wordCount ?? "n/a";
    const links = page.dom?.internalLinkCount ?? "n/a";

    return [
      page.status.toUpperCase(),
      page.path,
      page.type,
      truncate(page.descriptor.title, 54),
      truncate(page.descriptor.description, 72),
      truncate(h1, 48),
      words,
      links,
      pageSummary(page),
    ];
  });
  const priorityIssues = report.pages.flatMap((page) =>
    page.checks
      .filter((item) => item.status !== "pass")
      .map((item) => ({ ...item, path: page.path })),
  );

  return [
    "# SEO Audit",
    "",
    "> Generated by `npm run audit:seo`. Do not edit report values by hand.",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Routes audited: ${report.summary.routes}`,
    `- Page status: ${report.summary.pages.pass} pass, ${report.summary.pages.warn} warn, ${report.summary.pages.fail} fail`,
    `- Check status: ${report.summary.checks.pass} pass, ${report.summary.checks.warn} warn, ${report.summary.checks.fail} fail`,
    `- Site URL: ${report.siteUrl}`,
    "",
    "## Page Matrix",
    "",
    "| Status | Route | Type | Title | Description | H1 | Words | Links | Issues |",
    "| --- | --- | --- | --- | --- | --- | ---: | ---: | --- |",
    ...pageRows.map((row) => `| ${row.map(markdownEscape).join(" | ")} |`),
    "",
    "## Priority Issues",
    "",
    priorityIssues.length === 0
      ? "No warnings or failures found."
      : priorityIssues
          .map(
            (item) =>
              `- **${item.status.toUpperCase()}** \`${item.path}\` - ${item.label}: ${item.detail}`,
          )
          .join("\n"),
    "",
  ].join("\n");
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    throw new Error("Missing dist/. Run `npm run build` before `node scripts/audit-seo.mjs`.");
  }

  const [{ mod: seoMod, cleanup: cleanupSeo }, publicDataBundle] =
    await Promise.all([
      loadSeoDataModule("ng-seo-audit-"),
      loadBundledTypeScriptModule({
        entryPoint: "src/seo/publicData.ts",
        outfileName: "publicData.mjs",
        prefix: "ng-seo-audit-public-",
      }),
    ]);
  const { mod: publicDataMod, cleanup: cleanupPublicData } = publicDataBundle;

  try {
    const siteUrl = seoMod.normalizeSiteUrl(
      process.env.VITE_SITE_URL || seoMod.DEFAULT_SITE_URL,
    );
    const routes = seoMod.getSeoPrerenderRoutes(siteUrl);
    const sitemapUrls = await readSitemapUrls();
    const { toolDataByPath, postDataByPath } = buildPageData(publicDataMod);
    const titleCounts = new Map();
    const descriptionCounts = new Map();

    for (const route of routes) {
      titleCounts.set(
        route.descriptor.title,
        (titleCounts.get(route.descriptor.title) ?? 0) + 1,
      );
      descriptionCounts.set(
        route.descriptor.description,
        (descriptionCounts.get(route.descriptor.description) ?? 0) + 1,
      );
    }

    const domSnapshots = await collectDomSnapshots(routes);
    const pages = [];

    for (const route of routes) {
      const type = routeType(route.path);
      const html = await readFile(htmlPathForRoute(route.path), "utf8");
      const firstResponse = snapshotFromHtml(html);
      const dom = domSnapshots.get(route.path) ?? {
        error: "No hydrated DOM snapshot collected.",
      };
      const checks = [
        ...descriptorChecks({
          route,
          siteUrl,
          seoMod,
          sitemapUrls,
          toolDataByPath,
          titleCounts,
          descriptionCounts,
        }),
        ...firstResponseChecks({
          route,
          htmlSnapshot: firstResponse,
          siteUrl,
          seoMod,
        }),
        ...domChecks({
          route,
          domSnapshot: dom,
          siteUrl,
          seoMod,
          toolDataByPath,
          postDataByPath,
        }),
      ];

      pages.push({
        path: route.path,
        type,
        status: worstStatus(checks),
        descriptor: route.descriptor,
        schemaTypes: schemaTypes(route.descriptor),
        firstResponse,
        dom,
        checks,
      });
    }

    const allChecks = pages.flatMap((page) => page.checks);
    const report = {
      generatedAt: new Date().toISOString(),
      siteUrl,
      summary: {
        routes: pages.length,
        pages: countStatuses(pages),
        checks: countStatuses(allChecks),
      },
      pages,
    };

    await Promise.all([
      mkdir(path.dirname(JSON_REPORT_PATH), { recursive: true }),
      mkdir(path.dirname(DOCS_REPORT_PATH), { recursive: true }),
    ]);
    await Promise.all([
      writeFile(JSON_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8"),
      writeFile(DOCS_REPORT_PATH, renderMarkdown(report), "utf8"),
    ]);

    console.log(
      `Audited ${pages.length} SEO routes: ${report.summary.pages.pass} pass, ${report.summary.pages.warn} warn, ${report.summary.pages.fail} fail.`,
    );
    console.log(`Wrote ${path.relative(PROJECT_ROOT, DOCS_REPORT_PATH)}`);
    console.log(`Wrote ${path.relative(PROJECT_ROOT, JSON_REPORT_PATH)}`);

    if (report.summary.checks.fail > 0) {
      process.exitCode = 1;
      console.error(
        `SEO audit failed with ${report.summary.checks.fail} failing checks.`,
      );
    } else if (FAIL_ON_WARN && report.summary.checks.warn > 0) {
      process.exitCode = 1;
      console.error(
        `SEO audit failed with ${report.summary.checks.warn} warnings because --fail-on-warn was set.`,
      );
    }
  } finally {
    await Promise.all([cleanupSeo(), cleanupPublicData()]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
