import React from "react";
import { Link } from "react-router-dom";
import type { ToolMeta } from "../tools/types";
import { TOOL_CATALOG, type ToolPresentation } from "../tools/catalog";
import { TOOL_LANDING_CONTENT } from "../tools/landingContent";

type ToolLandingContentProps = {
  meta: ToolMeta;
};

const RELATED_TOOL_SLUGS: Record<string, string[]> = {
  "color-picker": [
    "color-palette-generator",
    "image-extractor",
    "image-compressor",
  ],
  "image-extractor": [
    "image-compressor",
    "image-converter",
    "color-picker",
  ],
  "proportion-scaler": [
    "image-converter",
    "image-compressor",
    "modular-wireframe-generator",
  ],
  "redirect-analyzer": [
    "sitemap-robots-explorer",
    "dns-checker",
    "campaign-url-architect",
  ],
  "sitemap-robots-explorer": [
    "redirect-analyzer",
    "dns-checker",
    "campaign-url-architect",
  ],
  "dns-checker": [
    "redirect-analyzer",
    "sitemap-robots-explorer",
    "campaign-url-architect",
  ],
};

function getRelatedTools(meta: ToolMeta) {
  const explicitSlugs = RELATED_TOOL_SLUGS[meta.slug] ?? [];
  const byId = new Map(TOOL_CATALOG.map((tool) => [tool.id, tool]));
  const explicitTools = explicitSlugs
    .map((slug) => byId.get(slug))
    .filter(
      (tool): tool is ToolPresentation =>
        Boolean(tool) && tool?.id !== meta.slug,
    );

  const categoryTools = TOOL_CATALOG.filter(
    (tool) =>
      tool.id !== meta.slug &&
      tool.category === meta.category &&
      !explicitSlugs.includes(tool.id),
  );

  return [...explicitTools, ...categoryTools].slice(0, 3);
}

export default function ToolLandingContent({ meta }: ToolLandingContentProps) {
  const content = TOOL_LANDING_CONTENT[meta.slug];
  if (!content) return null;

  const headingId = `tool-content-${meta.slug}`;
  const relatedTools = getRelatedTools(meta);
  const faqItems = [
    {
      question: `What does ${meta.title} do?`,
      answer: content.summary,
    },
    {
      question: `When should I use ${meta.title}?`,
      answer: content.useCases.join(" "),
    },
    {
      question: `Who is ${meta.title} for?`,
      answer: `${meta.title} is for people who need a focused ${meta.category.toLowerCase()} workflow in the browser without opening a heavier app.`,
    },
  ];

  return (
    <section
      aria-labelledby={headingId}
      className="border-t-2 border-[var(--ng-border)] bg-[var(--ng-panel)] px-4 py-10 text-[var(--ng-text)] sm:px-6 sm:py-12 lg:px-8"
      data-seo-content-for={meta.slug}
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="space-y-4">
          <div className="ng-eyebrow">{meta.category} workflow notes</div>
          <h2
            id={headingId}
            className="max-w-3xl text-3xl font-black uppercase leading-none tracking-tight text-[var(--ng-primary)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="max-w-3xl text-base font-medium leading-7 text-[var(--ng-text-muted)]">
            {content.summary}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em]">
            When to use {meta.title}
          </h3>
          <ul className="divide-y-2 divide-[var(--ng-border)] border-y-2 border-[var(--ng-border)]">
            {content.useCases.map((useCase) => (
              <li
                key={useCase}
                className="grid gap-3 py-4 text-sm font-semibold leading-6 text-[var(--ng-text-muted)] sm:grid-cols-[1.25rem_minmax(0,1fr)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 hidden h-2 w-2 bg-[var(--ng-accent-yellow)] sm:block"
                />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t-2 border-[var(--ng-border)] pt-6">
            <h3 className="text-sm font-black uppercase tracking-[0.18em]">
              Questions people ask
            </h3>
            <div className="grid gap-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="border-2 border-[var(--ng-border)] bg-white p-4"
                >
                  <summary className="cursor-pointer text-sm font-black uppercase leading-5 tracking-[0.08em] text-[var(--ng-primary)]">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-6 text-[var(--ng-text-muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {relatedTools.length > 0 ? (
            <div className="space-y-3 border-t-2 border-[var(--ng-border)] pt-6">
              <h3 className="text-sm font-black uppercase tracking-[0.18em]">
                Related tools
              </h3>
              <nav
                aria-label={`Related tools for ${meta.title}`}
                className="grid gap-3"
              >
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    className="group grid gap-2 border-2 border-[var(--ng-border)] bg-white p-4 text-left transition-colors hover:bg-[var(--ng-accent-yellow)]"
                    to={tool.route}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ng-text-muted)]">
                      {tool.category}
                    </span>
                    <span className="text-base font-black uppercase leading-5 text-[var(--ng-primary)] group-hover:text-[var(--ng-text)]">
                      {tool.title}
                    </span>
                    <span className="text-sm font-medium leading-6 text-[var(--ng-text-muted)]">
                      {tool.desc}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
