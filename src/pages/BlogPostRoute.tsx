import React from "react";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BLOG_POSTS, getBlogPostBySlug, getBlogPostPath } from "../blog/posts";
import SiteFooter from "../components/SiteFooter";
import SiteTopNav from "../components/SiteTopNav";
import "./blog.css";

export default function BlogPostRoute() {
  const { slug = "" } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post?.article) {
    return (
      <div className="ng-blog ng-blog-post">
        <SiteTopNav />
        <main className="blog-article-shell">
          <section className="blog-article-missing">
            <div className="blog-eyebrow">Blog / Missing</div>
            <h1>Article not found</h1>
            <p>This note is not published yet. Head back to the blog index.</p>
            <Link className="blog-action blog-action--primary" to="/blog">
              <ArrowLeft aria-hidden="true" strokeWidth={1.8} />
              <span>Back to blog</span>
            </Link>
          </section>
        </main>
        <SiteFooter inverted />
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="ng-blog ng-blog-post">
      <SiteTopNav />

      <main className="blog-article-shell">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/blog">Blog</Link>
          <span>/</span>
          <span>{post.category}</span>
        </nav>

        <article>
          <header className="blog-article-hero">
            <div className="blog-article-hero__copy">
              <div className="blog-post-meta">
                <span>{post.category}</span>
                <span>{post.date}</span>
                <span>
                  <Clock3 aria-hidden="true" strokeWidth={1.8} />
                  {post.readTime}
                </span>
              </div>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
            </div>

            <figure className="blog-article-hero__media">
              <img alt={post.article.heroImage.alt} src={post.article.heroImage.src} />
              <figcaption>{post.article.heroImage.credit}</figcaption>
            </figure>
          </header>

          <div className="blog-article-layout">
            <aside className="blog-article-sidebar">
              <div>
                <div className="blog-eyebrow">In This Article</div>
                <nav aria-label="Article sections">
                  {post.article.sections.map((section) => (
                    <a href={`#${section.id}`} key={section.id}>
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="blog-article-sidebar__note">
                <strong>By {post.article.author}</strong>
                <span>Published {post.date}</span>
              </div>
            </aside>

            <div className="blog-article-body">
              {post.article.sections.map((section) => (
                <section className="blog-article-section" id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.image ? (
                    <figure className="blog-article-figure">
                      <img alt={section.image.alt} loading="lazy" src={section.image.src} />
                      <figcaption>
                        {section.image.caption ? `${section.image.caption} ` : ""}
                        <span>{section.image.credit}</span>
                      </figcaption>
                    </figure>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </article>

        <section className="blog-related" aria-labelledby="related-posts-title">
          <div>
            <div className="blog-eyebrow">Keep Reading</div>
            <h2 id="related-posts-title">More field notes</h2>
          </div>
          <div className="blog-related__grid">
            {relatedPosts.map((relatedPost) => (
              <Link
                className={`blog-related-card blog-accent-${relatedPost.accent}`}
                key={relatedPost.slug}
                to={relatedPost.article ? getBlogPostPath(relatedPost) : relatedPost.related.to}
              >
                <span>{relatedPost.category}</span>
                <strong>{relatedPost.title}</strong>
                <ArrowUpRight aria-hidden="true" strokeWidth={1.8} />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter inverted />
    </div>
  );
}
