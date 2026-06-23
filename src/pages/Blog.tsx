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
import { BLOG_POSTS, getBlogPostPath, type BlogPost, type BlogVisualKind } from "../blog/posts";
import SiteFooter from "../components/SiteFooter";
import SiteTopNav from "../components/SiteTopNav";
import { TOOL_CATALOG } from "../tools/catalog";
import "./blog.css";

const VISUAL_ICONS: Record<BlogVisualKind, LucideIcon> = {
  seo: FileSearch,
  workflow: Route,
  images: ImageDown,
  writing: Type,
  design: Palette,
  links: LinkIcon,
  dns: Server,
};

function getPostHref(post: BlogPost) {
  return post.article ? getBlogPostPath(post) : post.related.to;
}

function getPostCta(post: BlogPost) {
  return post.article ? "Read article" : post.related.label;
}

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
              <strong>1</strong>
              <span>Full article</span>
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
            <Link className="blog-action blog-action--primary" to={getPostHref(featuredPost)}>
              <span>{getPostCta(featuredPost)}</span>
              <ArrowUpRight aria-hidden="true" strokeWidth={1.8} />
            </Link>
          </article>

          {featuredPost.article ? (
            <img
              alt={featuredPost.article.heroImage.alt}
              className="blog-feature__image"
              src={featuredPost.article.heroImage.src}
            />
          ) : (
            <BlogVisual kind={featuredPost.visual} />
          )}
        </section>

        <section className="blog-rail" aria-label="Highlighted stories">
          {storyRail.map((post) => (
            <article className={`blog-rail-card blog-accent-${post.accent}`} key={post.slug}>
              <div className="blog-post-meta">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <Link className="blog-inline-link" to={getPostHref(post)}>
                <span>{getPostCta(post)}</span>
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
              tool or article so the idea can turn into action right away.
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
                  <Link className="blog-inline-link" to={getPostHref(post)}>
                    <span>{getPostCta(post)}</span>
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
