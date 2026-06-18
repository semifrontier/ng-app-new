import { toolMeta as caseConverter } from "./case-converter/meta";
import { toolMeta as imageConverter } from "./image-converter/meta";
import { toolMeta as campaignUrlArchitect } from "./campaign-url-architect/meta";
import { toolMeta as colorPicker } from "./color-picker/meta";
import { toolMeta as colorPaletteGenerator } from "./color-palette-generator/meta";
import { toolMeta as dictate } from "./dictate/meta";
import { toolMeta as dnsChecker } from "./dns-checker/meta";
import { toolMeta as fontConverter } from "./font-converter/meta";
import { toolMeta as heatmapTracker } from "./heatmap-tracker/meta";
import { toolMeta as imageCompressor } from "./image-compressor/meta";
import { toolMeta as imageExtractor } from "./image-extractor/meta";
import { toolMeta as imageToTextGenerator } from "./image-to-text-converter/meta";
import { toolMeta as loremIpsumGenerator } from "./lorem-ipsum-generator/meta";
import { toolMeta as modularWireframeGenerator } from "./modular-wireframe-generator/meta";
import { toolMeta as proportionScaler } from "./proportion-scaler/meta";
import { toolMeta as redirectAnalyzer } from "./redirect-analyzer/meta";
import { toolMeta as sitemapRobotsExplorer } from "./sitemap-robots-explorer/meta";
import { toolMeta as vectorVault } from "./vectorvault/meta";
import type { ToolMeta } from "./types";

export const TOOL_METAS: ToolMeta[] = [
  imageConverter,
  campaignUrlArchitect,
  caseConverter,
  colorPicker,
  colorPaletteGenerator,
  dictate,
  dnsChecker,
  fontConverter,
  heatmapTracker,
  imageCompressor,
  imageExtractor,
  imageToTextGenerator,
  loremIpsumGenerator,
  modularWireframeGenerator,
  proportionScaler,
  redirectAnalyzer,
  sitemapRobotsExplorer,
  vectorVault,
];

export const TOOL_META_BY_SLUG = Object.fromEntries(
  TOOL_METAS.map((meta) => [meta.slug, meta]),
) as Record<string, ToolMeta>;
