import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");

export async function loadSeoDataModule(prefix = "ng-seo-data-") {
  const tempDir = await mkdtemp(path.join(tmpdir(), prefix));
  const outfile = path.join(tempDir, "seoData.mjs");

  await build({
    entryPoints: [path.join(PROJECT_ROOT, "src/seo/seoData.ts")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });

  const mod = await import(pathToFileURL(outfile).href);

  return {
    mod,
    cleanup: () => rm(tempDir, { recursive: true, force: true }),
  };
}
