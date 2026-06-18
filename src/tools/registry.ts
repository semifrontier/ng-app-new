import React from "react";
import type { ToolMeta } from "./types";
import { TOOL_META_BY_SLUG } from "./metaRegistry";

export type ToolDefinition = {
  meta: ToolMeta;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
};

type ToolModule = {
  default?: React.ComponentType<any>;
  // allow any named exports without fighting TS inference
  [key: string]: any;
};

/**
 * React.lazy requires a DEFAULT export.
 * This helper allows a safe fallback to a named export if default is missing.
 *
 * IMPORTANT: `namedExportFallback` is a string on purpose — TS often infers the module
 * type as only `{ default: ... }`, which would otherwise force `"default"` only.
 */
function lazyTool(
  importer: () => Promise<ToolModule>,
  namedExportFallback: string,
) {
  return React.lazy(async () => {
    const mod = await importer();
    const Component = mod.default ?? mod[namedExportFallback];

    if (!Component) {
      throw new Error(
        `Tool module is missing a default export and named export "${namedExportFallback}".`,
      );
    }

    return { default: Component };
  });
}

// lazy component imports (code-split per tool)
const CaseConverterTool = lazyTool(
  () => import("./case-converter/CaseConverterTool"),
  "CaseConverterTool",
);

const ImageConverterTool = lazyTool(
  () => import("./image-converter/ImageConverterTool"),
  "ImageConverterTool",
);

const CampaignUrlArchitectTool = lazyTool(
  () => import("./campaign-url-architect/CampaignUrlArchitectTool"),
  "CampaignUrlArchitectTool",
);

const ColorPickerTool = lazyTool(
  () => import("./color-picker/ColorPickerTool"),
  "ColorPickerTool",
);

const ColorPaletteGeneratorTool = lazyTool(
  () => import("./color-palette-generator/ColorPaletteGeneratorTool"),
  "ColorPaletteGeneratorTool",
);

const FontConverterTool = lazyTool(
  () => import("./font-converter/FontConverterTool"),
  "FontConverterTool",
);

const HeatmapTrackerTool = lazyTool(
  () => import("./heatmap-tracker/HeatmapTrackerTool"),
  "HeatmapTrackerTool",
);

const DictateTool = lazyTool(
  () => import("./dictate/DictateTool"),
  "DictateTool",
);

const DnsCheckerTool = lazyTool(
  () => import("./dns-checker/DnsCheckerTool"),
  "DnsCheckerTool",
);

const ImageCompressorTool = lazyTool(
  () => import("./image-compressor/ImageCompressorTool"),
  "ImageCompressorTool",
);

const ImageExtractorTool = lazyTool(
  () => import("./image-extractor/ImageExtractorTool"),
  "ImageExtractorTool",
);

const ImageToTextGeneratorTool = lazyTool(
  () => import("./image-to-text-converter/ImageToTextGeneratorTool"),
  "ImageToTextGeneratorTool",
);

const LoremIpsumGeneratorTool = lazyTool(
  () => import("./lorem-ipsum-generator/LoremIpsumGeneratorTool"),
  "LoremIpsumGeneratorTool",
);

const ModularWireframeGeneratorTool = lazyTool(
  () => import("./modular-wireframe-generator/ModularWireframeGeneratorTool"),
  "ModularWireframeGeneratorTool",
);

const ProportionScalerTool = lazyTool(
  () => import("./proportion-scaler/ProportionScalerTool"),
  "ProportionScalerTool",
);

const RedirectAnalyzerTool = lazyTool(
  () => import("./redirect-analyzer/RedirectAnalyzerTool"),
  "RedirectAnalyzerTool",
);

const SitemapRobotsExplorerTool = lazyTool(
  () => import("./sitemap-robots-explorer/SitemapRobotsExplorerTool"),
  "SitemapRobotsExplorerTool",
);

const VectorVaultTool = lazyTool(
  () => import("./vectorvault/VectorVaultTool"),
  "VectorVaultTool",
);

export const TOOLS: ToolDefinition[] = [
  { meta: TOOL_META_BY_SLUG["image-converter"], Component: ImageConverterTool },
  { meta: TOOL_META_BY_SLUG["campaign-url-architect"], Component: CampaignUrlArchitectTool },
  { meta: TOOL_META_BY_SLUG["case-converter"], Component: CaseConverterTool },
  { meta: TOOL_META_BY_SLUG["color-picker"], Component: ColorPickerTool },
  { meta: TOOL_META_BY_SLUG["color-palette-generator"], Component: ColorPaletteGeneratorTool },
  { meta: TOOL_META_BY_SLUG.dictate, Component: DictateTool },
  { meta: TOOL_META_BY_SLUG["dns-checker"], Component: DnsCheckerTool },
  { meta: TOOL_META_BY_SLUG["font-converter"], Component: FontConverterTool },
  { meta: TOOL_META_BY_SLUG["heatmap-tracker"], Component: HeatmapTrackerTool },
  { meta: TOOL_META_BY_SLUG["image-compressor"], Component: ImageCompressorTool },
  { meta: TOOL_META_BY_SLUG["image-extractor"], Component: ImageExtractorTool },
  { meta: TOOL_META_BY_SLUG["image-to-text"], Component: ImageToTextGeneratorTool },
  { meta: TOOL_META_BY_SLUG["lorem-ipsum-generator"], Component: LoremIpsumGeneratorTool },
  { meta: TOOL_META_BY_SLUG["modular-wireframe-generator"], Component: ModularWireframeGeneratorTool },
  { meta: TOOL_META_BY_SLUG["proportion-scaler"], Component: ProportionScalerTool },
  { meta: TOOL_META_BY_SLUG["redirect-analyzer"], Component: RedirectAnalyzerTool },
  { meta: TOOL_META_BY_SLUG["sitemap-robots-explorer"], Component: SitemapRobotsExplorerTool },
  { meta: TOOL_META_BY_SLUG.vectorvault, Component: VectorVaultTool },
];

export const TOOLS_BY_SLUG = Object.fromEntries(
  TOOLS.map((t) => [t.meta.slug, t]),
) as Record<string, ToolDefinition>;
