import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  loadBundledTypeScriptModule,
  PROJECT_ROOT,
} from "./seo-data-loader.mjs";

const DATA_DIR = path.join(PROJECT_ROOT, "public", "data");

function escapeCsvField(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function renderCsv(rows, columns) {
  return [
    columns.map(({ label }) => escapeCsvField(label)).join(","),
    ...rows.map((row) =>
      columns.map(({ key }) => escapeCsvField(row[key])).join(","),
    ),
    "",
  ].join("\n");
}

async function main() {
  const { mod, cleanup } = await loadBundledTypeScriptModule({
    entryPoint: "src/seo/publicData.ts",
    outfileName: "publicData.mjs",
    prefix: "ng-public-data-",
  });

  try {
    const tools = mod.PUBLIC_TOOLS_DATA;
    const blogPosts = mod.PUBLIC_BLOG_POSTS_DATA;

    await mkdir(DATA_DIR, { recursive: true });
    await Promise.all([
      writeFile(
        path.join(DATA_DIR, "tools.json"),
        `${JSON.stringify({ type: "NoGatekeepingToolCatalog", tools }, null, 2)}\n`,
        "utf8",
      ),
      writeFile(
        path.join(DATA_DIR, "blog-posts.json"),
        `${JSON.stringify(
          { type: "NoGatekeepingBlogPostCatalog", posts: blogPosts },
          null,
          2,
        )}\n`,
        "utf8",
      ),
      writeFile(
        path.join(DATA_DIR, "tools.csv"),
        renderCsv(tools, [
          { key: "id", label: "id" },
          { key: "title", label: "title" },
          { key: "category", label: "category" },
          { key: "url", label: "url" },
          { key: "description", label: "description" },
          { key: "summary", label: "summary" },
          { key: "useCases", label: "use_cases" },
        ]),
        "utf8",
      ),
      writeFile(
        path.join(DATA_DIR, "blog-posts.csv"),
        renderCsv(blogPosts, [
          { key: "slug", label: "slug" },
          { key: "title", label: "title" },
          { key: "category", label: "category" },
          { key: "url", label: "url" },
          { key: "description", label: "description" },
          { key: "date", label: "display_date" },
          { key: "readTime", label: "read_time" },
          { key: "publishedDate", label: "published_date" },
          { key: "modifiedDate", label: "modified_date" },
          { key: "sectionHeadings", label: "section_headings" },
        ]),
        "utf8",
      ),
    ]);

    console.log(
      `Generated public data exports for ${tools.length} tools and ${blogPosts.length} blog posts.`,
    );
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
