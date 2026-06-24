# AI Search Readiness Action Plan

This plan maps the AI-search changes into practical No Gatekeeping work. The site is a free tools and editorial site, so product feeds, local booking, and inventory actions are tracked as future-fit items rather than forced into the current app.

## 1. Multi-Modal Inputs

Goal: make page media understandable when search systems evaluate text, images, and files together.

- Keep using specific, original, task-relevant images for blog posts and tool pages.
- Maintain descriptive image `alt` text and visible captions where images carry meaning.
- Add `ImageObject` structured data for real article imagery.
- Add `VideoObject` only when the site actually embeds videos; do not publish empty or fake video schema.
- Audit future uploaded imagery for generic stock-photo use before publishing.

Started:

- Blog article images already have explicit alt text, captions, credits, and optimized WebP assets.
- Article schema now exposes real article images as `ImageObject` nodes.

## 2. Real-Time Information Agents

Goal: keep crawlable facts current and easy to reconcile.

- Keep sitemap and prerender automation as the canonical indexable-route source.
- Preserve accurate `datePublished` and `dateModified` values on blog posts.
- Publish smaller field notes when tools, workflows, or SEO guidance change.
- Add public machine-readable data exports for tool and blog catalogs.
- If ecommerce, subscriptions, booking, or local services are added later, add Merchant Center / Business Profile / booking-feed maintenance to launch criteria.

Started:

- Blog posts already carry publish and modified dates.
- Sitemap generation already runs during build.
- Tool and blog catalogs now generate public JSON and CSV exports during build.

## 3. Generative UI and Mini-App Data

Goal: expose clean structured data that can become tables, comparisons, workflows, or mini dashboards.

- Generate `/data/tools.json` and `/data/tools.csv` from the actual tool catalog.
- Generate `/data/blog-posts.json` and `/data/blog-posts.csv` from the blog post source.
- Prefer semantic lists, headings, and short factual blocks on landing content.
- Add future benchmark or comparison data as tables first, prose second.

Started:

- Tool metadata and blog metadata already live in reusable TypeScript registries.
- Public data exports are generated from those registries instead of maintained by hand.

## 4. Agentic Booking Hand-Offs

Goal: avoid dead-end action flows if the site later adds services or transactions.

- Current state: not applicable. No Gatekeeping does not sell appointments, inventory, local services, or reservations.
- If a paid service, consulting offer, or booking flow is added, expose a crawlable pricing/availability page.
- If local services are added, maintain Google Business Profile fields, phone number, service attributes, and service-area details.
- If checkout is added, keep product data and availability consistent across page content, structured data, and merchant feeds.

Started:

- No code action needed for the current site.

## 5. Long-Tail Conversational Queries

Goal: answer the way people ask assistants, not only short keyword fragments.

- Add visible FAQ-style Q&A blocks to tool landing content.
- Keep answers concise and directly tied to the tool's visible behavior.
- Build future blog posts around specific problem statements and decision points.
- Avoid generic AI-generated content at scale; keep posts original and useful.

Started:

- Tool pages already have unique visible "what it does / when to use it" copy.
- Tool pages now add reusable "Questions people ask" content below each tool.
