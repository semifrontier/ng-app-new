# Redirect audit

Audited June 29, 2026 against the 21 URLs in Ubersuggest's
`temporary_redirects.csv`.

## Finding

Every listed URL currently follows the same two-hop normalization chain:

1. `307` from `https://nogatekeeping.com/{path}/` to
   `https://www.nogatekeeping.com/{path}/`.
2. `308` from the trailing-slash `www` URL to the slashless URL.
3. `200` at `https://www.nogatekeeping.com/{path}`.

Neither redirect is temporary. The repository's canonical source of truth is
`https://nogatekeeping.com` with slashless paths, so the intended deployed
behavior is one `301` from each listed URL to the slashless apex URL, followed
by `200`.

| Listed URL | First response and destination | Second response and final URL |
| --- | --- | --- |
| `https://nogatekeeping.com/blog/` | `307` → `https://www.nogatekeeping.com/blog/` | `308` → `https://www.nogatekeeping.com/blog` (`200`) |
| `https://nogatekeeping.com/blog/ai-in-graphic-design-keeping-the-human-touch/` | `307` → `https://www.nogatekeeping.com/blog/ai-in-graphic-design-keeping-the-human-touch/` | `308` → `https://www.nogatekeeping.com/blog/ai-in-graphic-design-keeping-the-human-touch` (`200`) |
| `https://nogatekeeping.com/tools/` | `307` → `https://www.nogatekeeping.com/tools/` | `308` → `https://www.nogatekeeping.com/tools` (`200`) |
| `https://nogatekeeping.com/tools/campaign-url-architect/` | `307` → `https://www.nogatekeeping.com/tools/campaign-url-architect/` | `308` → `https://www.nogatekeeping.com/tools/campaign-url-architect` (`200`) |
| `https://nogatekeeping.com/tools/case-converter/` | `307` → `https://www.nogatekeeping.com/tools/case-converter/` | `308` → `https://www.nogatekeeping.com/tools/case-converter` (`200`) |
| `https://nogatekeeping.com/tools/color-palette-generator/` | `307` → `https://www.nogatekeeping.com/tools/color-palette-generator/` | `308` → `https://www.nogatekeeping.com/tools/color-palette-generator` (`200`) |
| `https://nogatekeeping.com/tools/color-picker/` | `307` → `https://www.nogatekeeping.com/tools/color-picker/` | `308` → `https://www.nogatekeeping.com/tools/color-picker` (`200`) |
| `https://nogatekeeping.com/tools/dictate/` | `307` → `https://www.nogatekeeping.com/tools/dictate/` | `308` → `https://www.nogatekeeping.com/tools/dictate` (`200`) |
| `https://nogatekeeping.com/tools/dns-checker/` | `307` → `https://www.nogatekeeping.com/tools/dns-checker/` | `308` → `https://www.nogatekeeping.com/tools/dns-checker` (`200`) |
| `https://nogatekeeping.com/tools/font-converter/` | `307` → `https://www.nogatekeeping.com/tools/font-converter/` | `308` → `https://www.nogatekeeping.com/tools/font-converter` (`200`) |
| `https://nogatekeeping.com/tools/heatmap-tracker/` | `307` → `https://www.nogatekeeping.com/tools/heatmap-tracker/` | `308` → `https://www.nogatekeeping.com/tools/heatmap-tracker` (`200`) |
| `https://nogatekeeping.com/tools/image-compressor/` | `307` → `https://www.nogatekeeping.com/tools/image-compressor/` | `308` → `https://www.nogatekeeping.com/tools/image-compressor` (`200`) |
| `https://nogatekeeping.com/tools/image-converter/` | `307` → `https://www.nogatekeeping.com/tools/image-converter/` | `308` → `https://www.nogatekeeping.com/tools/image-converter` (`200`) |
| `https://nogatekeeping.com/tools/image-extractor/` | `307` → `https://www.nogatekeeping.com/tools/image-extractor/` | `308` → `https://www.nogatekeeping.com/tools/image-extractor` (`200`) |
| `https://nogatekeeping.com/tools/image-to-text/` | `307` → `https://www.nogatekeeping.com/tools/image-to-text/` | `308` → `https://www.nogatekeeping.com/tools/image-to-text` (`200`) |
| `https://nogatekeeping.com/tools/lorem-ipsum-generator/` | `307` → `https://www.nogatekeeping.com/tools/lorem-ipsum-generator/` | `308` → `https://www.nogatekeeping.com/tools/lorem-ipsum-generator` (`200`) |
| `https://nogatekeeping.com/tools/modular-wireframe-generator/` | `307` → `https://www.nogatekeeping.com/tools/modular-wireframe-generator/` | `308` → `https://www.nogatekeeping.com/tools/modular-wireframe-generator` (`200`) |
| `https://nogatekeeping.com/tools/proportion-scaler/` | `307` → `https://www.nogatekeeping.com/tools/proportion-scaler/` | `308` → `https://www.nogatekeeping.com/tools/proportion-scaler` (`200`) |
| `https://nogatekeeping.com/tools/redirect-analyzer/` | `307` → `https://www.nogatekeeping.com/tools/redirect-analyzer/` | `308` → `https://www.nogatekeeping.com/tools/redirect-analyzer` (`200`) |
| `https://nogatekeeping.com/tools/sitemap-robots-explorer/` | `307` → `https://www.nogatekeeping.com/tools/sitemap-robots-explorer/` | `308` → `https://www.nogatekeeping.com/tools/sitemap-robots-explorer` (`200`) |
| `https://nogatekeeping.com/tools/vectorvault/` | `307` → `https://www.nogatekeeping.com/tools/vectorvault/` | `308` → `https://www.nogatekeeping.com/tools/vectorvault` (`200`) |

## Remediation

- `vercel.json` defines an explicit `301` trailing-slash redirect for every
  non-root canonical route and uses `301` for all legacy route aliases.
- The SEO regression suite derives required redirects from the canonical route
  registry and crawls rendered links for redirecting host, protocol,
  trailing-slash, and legacy-path variants.
- Vercel's domain settings must serve `nogatekeeping.com` as Production and
  redirect `www.nogatekeeping.com` to it with `301`. Domain redirects run before
  repository routing, so this setting is required to collapse the current
  two-hop chain.
