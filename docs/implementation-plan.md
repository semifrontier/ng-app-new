# NoGatekeeping Implementation Plan

Last updated: 2026-06-15

This plan tracks the current app cleanup pass: refresh the tool source of truth, verify the runtime, fix repeated or inconsistent icons, and re-run route QA.

## 1. Refresh The Source Of Truth

- Update `docs/tool-completeness-matrix.md` so it matches the current app registry.
- Track all 17 registered tools.
- Call out tools that are wired but still need fresh route QA artifacts.
- Note that `heatmap-tracker` exists in source but is not currently registered.

## 2. Restore Local Runtime

- Confirm the intended Node/npm setup for this workspace.
- Install dependencies or restore `node_modules`.
- Run:

```bash
npm run build
npm run qa:routes:browser
```

## 3. Fresh QA For Missing Routes

Prioritize the routes that are registered but do not have saved QA artifacts:

- `dictate`: speech support messaging, transcript editing, copy flow, text-to-speech controls.
- `dns-checker`: `/api/dns-check` behavior, resolver states, empty records, failed records.
- `redirect-analyzer`: `/api/redirect-analyzer` behavior, redirect timeline, error states.

## 4. Decide Heatmap Tracker

- Decision: register `heatmap-tracker` as a local-first prototype utility.
- Keep the tool copy clear that it is not a real cross-visitor analytics backend.
- Cover it with route QA and later icon/visual review.

## 5. Fix Homepage Tool Icons

Status: complete.

Replace repeated generic tool-card icons with more specific mappings:

- `dns-checker`: server, globe, or network icon.
- `redirect-analyzer`: route, arrow, or path icon.
- `campaign-url-architect`: link, tag, or megaphone icon.
- `sitemap-robots-explorer`: sitemap or file-search icon.
- `image-extractor`: image-search or image-download icon.

The homepage icon renderer now uses `lucide-react` instead of maintaining hand-written SVG paths.

## 6. Clean Up Tool-Level Hand-Rolled Icons

Status: complete.

Replace local custom SVGs with lucide icons where there is an equivalent:

- `modular-wireframe-generator`: toolbar and export icons.
- `proportion-scaler`: swap, copy, check, and clear icons.
- `campaign-url-architect`: link, copy, history, trash, check, info, and plus icons.

Keep custom SVGs only when they are part of a deliberate custom visual system.

The matching hand-rolled SVG helpers in Modular Wireframe Generator, Proportion Scaler, and Campaign URL Architect now render `lucide-react` icons while preserving the existing UI structure.

## 7. Re-Run Visual QA

Status: complete.

After icon updates, run the route QA sweep and inspect desktop/mobile screenshots for:

- repeated or generic homepage icons
- tiny, misaligned, or inconsistent toolbar icons
- button text/icon wrapping
- route crashes or console errors

Route QA passed across all 18 registered tools. The refreshed homepage icon report found 18 tool cards, 18 tool icons, 6 hero icons, and 0 hidden fallbacks on both desktop and mobile. Visual inspection of the homepage, Proportion Scaler, Modular Wireframe Generator, and Campaign URL Architect screenshots found no icon alignment, wrapping, or generic-repeat regressions.

## 8. Update Docs With Results

Status: complete.

Update:

- `docs/tool-completeness-matrix.md`
- `docs/runtime-qa-pass.md`
- regenerated `qa/artifacts/route-runtime/*`

The docs now reflect the current 18/18 browser route QA pass, focused functional QA for DNS Checker, Redirect Analyzer, and Dictate, refreshed homepage icon artifacts, and the regenerated route-runtime artifacts.

## 9. Final Readiness Pass

Status: complete.

Run the final release/readiness gate after the implementation and docs pass:

- `npm run build`
- `npm run qa:routes:browser`
- confirm regenerated route reports are clean
- confirm the preview server is stopped
- capture a concise readiness summary

The final pass completed with a clean production build, `18/18` browser route QA passing, 18 clean route reports, clean homepage icon counts, and no process listening on port `4173`.
