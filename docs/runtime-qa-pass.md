# Runtime QA Pass

This pass is for route-by-route runtime validation of the merged app, with two goals:

1. catch UX inconsistencies that are easy to miss in build-only validation
2. decide whether custom tools should stay custom, get a lighter shared treatment, or be simplified

## Automated Browser Pass

Current browser pass status as of 2026-06-15:

- `18/18` routes passed `npm run qa:routes:browser`
- route artifacts were regenerated in `qa/artifacts/route-runtime/*`
- every route report has `0` console errors, `0` page errors, and `0` failed requests
- homepage icon QA found 18 tool cards, 18 tool icons, 6 hero icons, and 0 hidden icon fallbacks on both desktop and mobile
- visual inspection covered the homepage, Proportion Scaler, Modular Wireframe Generator, and Campaign URL Architect after the lucide icon cleanup
- focused functional QA passed for `dns-checker`, `redirect-analyzer`, and `dictate`

## Run It

1. Build the app with `npm run build`.
2. Start the built app with `npm run preview -- --host 127.0.0.1 --port 4173`.
3. In another terminal, run `npm run qa:routes:browser`.
4. Review generated reports and screenshots under `qa/artifacts/route-runtime/*`.
5. For a manual route checklist, run `npm run qa:routes`.

For deeper manual review, visit each route in the order listed in `qa/route-runtime-manifest.json` and record:

- visible UX issues
- console/runtime errors
- broken flows
- mobile layout issues
- whether the route should stay custom, keep the current shared shell, or be simplified.

## Legacy Manual Checklist

1. Start the app with `npm run dev`.
2. In another terminal, print the route checklist with `npm run qa:routes`.
3. Visit each route in the order listed in `qa/route-runtime-manifest.json`.
4. For each route, record:
   - visible UX issues
   - console/runtime errors
   - broken flows
   - mobile layout issues
   - whether the route should stay custom, keep the current shared shell, or be simplified

## Core Checks For Every Route

- The route loads without crashing or blank states.
- The top-level shell feels consistent with the rest of the app.
- The primary action is obvious within 3 seconds.
- Empty, loading, success, and error states all make sense.
- Interactive controls are keyboard- and mobile-usable.
- There are no obvious visual regressions between desktop and mobile widths.
- There are no console errors during the main user flow.

## Shell Decision Rules

- `full_layout`
  Use when the tool is mostly a single-task workflow and benefits from standard app framing.

- `lite_header`
  Use when the tool still behaves like its own mini app but should remain visibly connected to the larger product.

- `custom_app`
  Keep only when the route genuinely needs its own navigation model, workspace, or multi-surface behavior.

## Locked Decisions

Browser pass status as of 2026-06-15:

- `18/18` routes passed the Playwright runtime sweep
- route artifacts were captured in `qa/artifacts/route-runtime`
- `vectorvault` remains free of the SVG path runtime error
- `font-converter` remains on the simplified stable conversion baseline
- `heatmap-tracker` is registered as a local-first prototype utility
- `dns-checker`, `redirect-analyzer`, and `dictate` have focused functional QA artifacts in `qa/artifacts/functional-qa`

Keep `ToolLayout`:

- `case-converter`
- `color-picker`
- `proportion-scaler`
- `image-to-text`
- `image-compressor`
- `image-converter`
- `image-extractor`
- `lorem-ipsum-generator`
- `font-converter`
- `dns-checker`
- `redirect-analyzer`
- `dictate`
- `heatmap-tracker`

Keep `lite_header`:

- `campaign-url-architect`
- `sitemap-robots-explorer`

Keep custom:

- `color-palette-generator`
- `vectorvault`
- `modular-wireframe-generator`

Notes:

- `font-converter` is no longer a “review for simplification” route. The simpler batch workflow is now the baseline.
- `vectorvault` remains custom, but its default icon data should be treated as part of runtime QA because malformed SVG paths can break rendering without TypeScript catching them.
- `heatmap-tracker` should continue to describe itself as a local-first prototype, not a production cross-visitor analytics backend.
- The homepage and tool-level icon cleanup now rely on `lucide-react` where direct equivalents exist.

## Source Of Truth

- Route manifest: [`qa/route-runtime-manifest.json`](/Users/SPalombo/Desktop/misc/NoGatekeeping/qa/route-runtime-manifest.json)
- Browser route QA: [`tests/route-runtime.spec.ts`](/Users/SPalombo/Desktop/misc/NoGatekeeping/tests/route-runtime.spec.ts)
- CLI checklist: [`scripts/route-runtime-qa.mjs`](/Users/SPalombo/Desktop/misc/NoGatekeeping/scripts/route-runtime-qa.mjs)
- Route artifacts: [`qa/artifacts/route-runtime`](/Users/SPalombo/Desktop/misc/NoGatekeeping/qa/artifacts/route-runtime)
- Functional artifacts: [`qa/artifacts/functional-qa`](/Users/SPalombo/Desktop/misc/NoGatekeeping/qa/artifacts/functional-qa)
- Homepage icon artifacts: [`qa/artifacts/home-icons`](/Users/SPalombo/Desktop/misc/NoGatekeeping/qa/artifacts/home-icons)
