# Tool Completeness Matrix

Last reviewed: 2026-06-15

This matrix tracks whether each registered tool is fully complete in the merged app experience or still has a meaningful gap.

| Tool | Slug | Status | Shell | Notes |
| --- | --- | --- | --- | --- |
| Color Picker | `color-picker` | QA-passed | `ToolLayout` | Route, upload flow, color sampling, and shared shell are wired and covered by saved route QA artifacts. |
| Case Converter | `case-converter` | QA-passed | `ToolLayout` | Core transforms, copy flow, and route integration are covered by saved route QA artifacts. |
| Proportion Scaler | `proportion-scaler` | QA-passed | `ToolLayout` | Calculator flow is wired, does not rely on missing services, and is covered by saved route QA artifacts. |
| Image to Text | `image-to-text` | QA-passed | `ToolLayout` | OCR route is wired, build-safe, and covered by saved route QA artifacts. |
| Image Compressor | `image-compressor` | QA-passed | `ToolLayout` | Batch flow, download flow, and route integration are active and covered by saved route QA artifacts. |
| Color Palette Generator | `color-palette-generator` | QA-passed | Custom | Main palette, visualizer, trending, gradients, and recolor views are wired and covered by saved route QA artifacts. |
| Vector Vault | `vectorvault` | QA-passed | Custom | Search, editor, and local icon persistence are wired and covered by saved route QA artifacts after SVG-path repair. |
| DNS Checker | `dns-checker` | QA-passed | `ToolLayout` | Registered, wired, covered by saved route QA artifacts, and functionally validated against `/api/dns-check` with resolver records and error states. |
| Redirect Analyzer | `redirect-analyzer` | QA-passed | `ToolLayout` | Registered, wired, covered by saved route QA artifacts, and functionally validated against `/api/redirect-analyzer` with URL normalization, timeline, and summary states. |
| Sitemap Robots Explorer | `sitemap-robots-explorer` | QA-passed | Lite header | Explorer flow is active, integrated into the shared app shell, and covered by saved route QA artifacts. |
| Modular Wireframe Generator | `modular-wireframe-generator` | QA-passed | Custom | Builder and export flows are active, export libraries are lazy-loaded, and route load is covered by saved route QA artifacts. |
| Image Converter | `image-converter` | QA-passed | `ToolLayout` | Browser path, server-backed HEIC conversion, and focused HEIC integration coverage are in place. |
| Image Extractor | `image-extractor` | QA-passed | `ToolLayout` | URL extraction and download flows are wired and covered by saved route QA artifacts. |
| Font Converter | `font-converter` | QA-passed | `ToolLayout` | Simplified stable conversion flow is active and covered by saved route QA artifacts. |
| Heatmap Tracker | `heatmap-tracker` | QA-passed | `ToolLayout` | Registered as a local-first prototype utility for screenshot-based click heatmaps and covered by saved route QA artifacts. |
| Dictate | `dictate` | QA-passed | `ToolLayout` | Registered, wired, covered by saved route QA artifacts, and functionally validated for workspace rendering, support messaging, editor updates, clear state, and font sizing. |
| Campaign URL Architect | `campaign-url-architect` | QA-passed | Lite header | Form flow, history, and URL generation are active and covered by saved route QA artifacts. |
| Lorem Ipsum Generator | `lorem-ipsum-generator` | QA-passed | `ToolLayout` | Generator and copy flow are wired and covered by saved route QA artifacts. |

## Summary

- Registered tools: 18
- QA-passed from saved route artifacts: 18
- Functional QA pass covered `dns-checker`, `redirect-analyzer`, and `dictate`.
- Homepage visual QA found 18 tool cards, 18 tool icons, 6 hero icons, and 0 hidden icon fallbacks on desktop and mobile.
- Needs fresh route QA artifacts: 0
- Unregistered source tools: 0
