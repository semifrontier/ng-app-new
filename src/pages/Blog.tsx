import React, { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  FileSearch,
  ImageDown,
  Link as LinkIcon,
  Palette,
  Route,
  Server,
  Sparkles,
  Tags,
  Type,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import SiteTopNav from "../components/SiteTopNav";
import { TOOL_CATALOG } from "../tools/catalog";
import "./blog.css";

type BlogVisualKind =
  | "seo"
  | "workflow"
  | "images"
  | "writing"
  | "design"
  | "links"
  | "dns";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  visual: BlogVisualKind;
  accent: "blue" | "yellow" | "red";
  related: {
    label: string;
    to: string;
  };
};

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "seo-launch-checklist",
    title: "A practical SEO launch checklist for tiny tool sites",
    excerpt:
      "The crawl basics that make a utility site easier to understand: clean canonicals, sitemap coverage, visible page copy, and schema that describes what each tool actually does.",
    category: "SEO Ops",
    date: "Jun 23, 2026",
    readTime: "6 min read",
    visual: "seo",
    accent: "blue",
    related: {
      label: "Open SEO tool",
      to: "/tools/sitemap-robots-explorer",
    },
  },
  {
    slug: "browser-tools-workflow",
    title: "How to turn one-off browser utilities into a repeatable workflow",
    excerpt:
      "A lightweight way to chain conversion, cleanup, extraction, and QA tools without forcing every task through a heavyweight app.",
    category: "Product",
    date: "Jun 18, 2026",
    readTime: "5 min read",
    visual: "workflow",
    accent: "yellow",
    related: {
      label: "Browse tools",
      to: "/tools",
    },
  },
  {
    slug: "clean-image-handoffs",
    title: "Clean image handoffs: compress, convert, extract, repeat",
    excerpt:
      "A practical image workflow for when files need to move from messy downloads to usable assets without a round trip through a design suite.",
    category: "Images",
    date: "Jun 14, 2026",
    readTime: "4 min read",
    visual: "images",
    accent: "red",
    related: {
      label: "Compress images",
      to: "/tools/image-compressor",
    },
  },
  {
    slug: "faster-writing-tools",
    title: "Writing faster without making every page feel generic",
    excerpt:
      "Small text tools are strongest when they remove formatting drag, preserve intent, and keep the writer in control of tone and structure.",
    category: "Text",
    date: "Jun 10, 2026",
    readTime: "4 min read",
    visual: "writing",
    accent: "blue",
    related: {
      label: "Convert case",
      to: "/tools/case-converter",
    },
  },
  {
    slug: "color-workflow",
    title: "Color work that moves from idea to export without tab chaos",
    excerpt:
      "Palette generation gets more useful when exploration, contrast checks, and export formats live close together.",
    category: "Design",
    date: "Jun 6, 2026",
    readTime: "5 min read",
    visual: "design",
    accent: "yellow",
    related: {
      label: "Build palettes",
      to: "/tools/color-palette-generator",
    },
  },
  {
    slug: "utm-links-that-age-well",
    title: "UTM links that marketing teams can actually audit later",
    excerpt:
      "The difference between campaign links that help and campaign links that become a spreadsheet archaeology project.",
    category: "URLs",
    date: "May 30, 2026",
    readTime: "3 min read",
    visual: "links",
    accent: "red",
    related: {
      label: "Build campaign URLs",
      to: "/tools/campaign-url-architect",
    },
  },
  {
    slug: "dns-redirect-preflight",
    title: "DNS and redirects: the quiet checks before a launch",
    excerpt:
      "Before a page goes live, the unglamorous checks often prevent the loudest launch-day problems.",
    category: "SEO Ops",
    date: "May 24, 2026",
    readTime: "4 min read",
    visual: "dns",
    accent: "blue",
    related: {
      label: "Check DNS",
      to: "/tools/dns-checker",
    },
  },
  {
    slug: "responsive-ratio-checks",
    title: "Ratio checks before publishing responsive graphics",
    excerpt:
      "A quick way to keep thumbnails, social crops, and product screenshots from drifting across breakpoints.",
    category: "Design",
    date: "May 18, 2026",
    readTime: "3 min read",
    visual: "design",
    accent: "yellow",
    related: {
      label: "Scale proportions",
      to: "/tools/proportion-scaler",
    },
  },
  {
    slug: "extracting-page-assets",
    title: "Pulling usable image assets from existing pages",
    excerpt:
      "When the source file is missing, a focused extraction pass can still turn a live page into a tidy asset handoff.",
    category: "Images",
    date: "May 12, 2026",
    readTime: "4 min read",
    visual: "images",
    accent: "red",
    related: {
      label: "Extract images",
      to: "/tools/image-extractor",
    },
  },
];

const VISUAL_ICONS: Record<BlogVisualKind, LucideIcon> = {
  seo: FileSearch,
  workflow: Route,
  images: ImageDown,
  writing: Type,
  design: Palette,
  links: LinkIcon,
  dns: Server,
};

function BlogVisual({
  kind,
  compact = false,
}: {
  kind: BlogVisualKind;
  compact?: boolean;
}) {
  const Icon = VISUAL_ICONS[kind];

  return (
    <div
      className={`blog-visual blog-visual--${kind} ${
        compact ? "blog-visual--compact" : ""
      }`.trim()}
      aria-hidden="true"
    >
      <div className="blog-visual__grid" />
      <div className="blog-visual__icon">
        <Icon strokeWidth={1.8} />
      </div>
      <div className="blog-visual__lines">
        <span />
        <span />
        <span />
      </div>
      <div className="blog-visual__nodes">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="blog-visual__rail" />
    </div>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featuredPost = BLOG_POSTS[0];
  const categoryOptions = useMemo(
    () => ["All", ...new Set(BLOG_POSTS.map((post) => post.category))],
    [],
  );
  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return BLOG_POSTS.slice(4);
    return BLOG_POSTS.filter((post) => post.category === activeCategory);
  }, [activeCategory]);
  const storyRail = BLOG_POSTS.slice(1, 4);

  return (
    <div className="ng-blog">
      <SiteTopNav />

      <main>
        <section className="blog-hero">
          <div className="blog-hero__copy">
            <div className="blog-eyebrow">Editorial / Workflow Notes</div>
            <h1>Blog</h1>
            <p>
              Practical notes for people shipping faster with browser tools:
              SEO preflights, image cleanup, text utilities, design handoffs,
              and the small checks that keep work moving.
            </p>
          </div>

          <div className="blog-hero__stats" aria-label="Blog highlights">
            <div>
              <strong>{BLOG_POSTS.length}</strong>
              <span>Field notes</span>
            </div>
            <div>
              <strong>{TOOL_CATALOG.length}</strong>
              <span>Tools covered</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Signup gates</span>
            </div>
          </div>
        </section>

        <section className="blog-filter" aria-label="Filter blog posts">
          {categoryOptions.map((category) => (
            <button
              aria-pressed={activeCategory === category}
              className={activeCategory === category ? "is-active" : ""}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </section>

        <section className="blog-feature" aria-labelledby="featured-post-title">
          <article className="blog-feature__story">
            <div className="blog-post-meta">
              <span>{featuredPost.category}</span>
              <span>{featuredPost.date}</span>
              <span>
                <Clock3 aria-hidden="true" strokeWidth={1.8} />
                {featuredPost.readTime}
              </span>
            </div>
            <h2 id="featured-post-title">{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <Link className="blog-action blog-action--primary" to={featuredPost.related.to}>
              <span>{featuredPost.related.label}</span>
              <ArrowUpRight aria-hidden="true" strokeWidth={1.8} />
            </Link>
          </article>

          <BlogVisual kind={featuredPost.visual} />
        </section>

        <section className="blog-rail" aria-label="Highlighted stories">
          {storyRail.map((post) => (
            <article className={`blog-rail-card blog-accent-${post.accent}`} key={post.slug}>
              <div className="blog-post-meta">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <Link className="blog-inline-link" to={post.related.to}>
                <span>{post.related.label}</span>
                <ArrowUpRight aria-hidden="true" strokeWidth={1.8} />
              </Link>
            </article>
          ))}
        </section>

        <section className="blog-board" aria-labelledby="latest-posts-title">
          <div className="blog-section-head">
            <div>
              <div className="blog-eyebrow">Latest</div>
              <h2 id="latest-posts-title">Field Notes</h2>
            </div>
            <p>
              Pick a lane or scan the full board. Each note points to a related
              tool so the idea can turn into action right away.
            </p>
          </div>

          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article className={`blog-card blog-accent-${post.accent}`} key={post.slug}>
                <BlogVisual compact kind={post.visual} />
                <div className="blog-card__body">
                  <div className="blog-post-meta">
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link className="blog-inline-link" to={post.related.to}>
                    <span>{post.related.label}</span>
                    <ArrowUpRight aria-hidden="true" strokeWidth={1.8} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blog-playbook" aria-labelledby="playbook-title">
          <div>
            <div className="blog-eyebrow">Start Here</div>
            <h2 id="playbook-title">Build a faster launch check</h2>
            <p>
              A good workflow does not need a giant stack. Start with sitemap
              coverage, verify redirects and DNS, then tighten the page assets.
            </p>
          </div>

          <div className="blog-playbook__actions">
            <Link className="blog-action" to="/tools/sitemap-robots-explorer">
              <Tags aria-hidden="true" strokeWidth={1.8} />
              <span>Sitemap scan</span>
            </Link>
            <Link className="blog-action" to="/tools/redirect-analyzer">
              <Route aria-hidden="true" strokeWidth={1.8} />
              <span>Redirect check</span>
            </Link>
            <Link className="blog-action" to="/tools/image-compressor">
              <Sparkles aria-hidden="true" strokeWidth={1.8} />
              <span>Asset cleanup</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter inverted />
    </div>
  );
}
