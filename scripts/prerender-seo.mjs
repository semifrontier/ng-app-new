import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSeoDataModule, PROJECT_ROOT } from "./seo-data-loader.mjs";

const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const SEO_BLOCK_PATTERN =
  /<!--ng-seo-start-->[\s\S]*?<!--ng-seo-end-->/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function outputPathsForRoute(routePath) {
  if (routePath === "/") return [path.join(DIST_DIR, "index.html")];

  const segments = routePath.replace(/^\/+|\/+$/g, "").split("/");
  const lastSegment = segments[segments.length - 1];
  const parentSegments = segments.slice(0, -1);

  return [
    path.join(DIST_DIR, ...segments, "index.html"),
    path.join(DIST_DIR, ...parentSegments, `${lastSegment}.html`),
  ];
}

function renderSeoBlock({ descriptor, siteUrl, absoluteUrl, SITE_NAME }) {
  const canonicalUrl = absoluteUrl(descriptor.canonicalPath, siteUrl);
  const robots = descriptor.robots ?? "index,follow";
  const schema = descriptor.schema
    ? JSON.stringify(descriptor.schema).replace(/</g, "\\u003c")
    : null;

  return [
    "<!--ng-seo-start-->",
    `    <meta name="description" content="${escapeAttribute(descriptor.description)}" />`,
    `    <meta name="robots" content="${escapeAttribute(robots)}" />`,
    `    <meta name="application-name" content="${escapeAttribute(SITE_NAME)}" />`,
    `    <meta property="og:site_name" content="${escapeAttribute(SITE_NAME)}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:title" content="${escapeAttribute(descriptor.title)}" />`,
    `    <meta property="og:description" content="${escapeAttribute(descriptor.description)}" />`,
    `    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`,
    '    <meta name="twitter:card" content="summary" />',
    `    <meta name="twitter:title" content="${escapeAttribute(descriptor.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttribute(descriptor.description)}" />`,
    `    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    `    <title>${escapeHtml(descriptor.title)}</title>`,
    schema
      ? `    <script id="ng-json-ld" type="application/ld+json">${schema}</script>`
      : null,
    "    <!--ng-seo-end-->",
  ]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const templatePath = path.join(DIST_DIR, "index.html");
  const template = await readFile(templatePath, "utf8");

  if (!SEO_BLOCK_PATTERN.test(template)) {
    throw new Error(
      "Could not find <!--ng-seo-start--> / <!--ng-seo-end--> markers in dist/index.html.",
    );
  }

  const { mod, cleanup } = await loadSeoDataModule("ng-seo-prerender-");

  try {
    const siteUrl = mod.normalizeSiteUrl(
      process.env.VITE_SITE_URL || mod.DEFAULT_SITE_URL,
    );
    const routes = mod.getSeoPrerenderRoutes(siteUrl);

    const writeTasks = routes.flatMap((route) => {
      const html = template.replace(
        SEO_BLOCK_PATTERN,
        renderSeoBlock({
          descriptor: route.descriptor,
          siteUrl,
          absoluteUrl: mod.absoluteUrl,
          SITE_NAME: mod.SITE_NAME,
        }),
      );

      return outputPathsForRoute(route.path).map(async (outputPath) => {
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, html, "utf8");
      });
    });

    await Promise.all(writeTasks);

    console.log(
      `Prerendered SEO HTML for ${routes.length} routes (${writeTasks.length} files).`,
    );
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
