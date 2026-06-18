import React from "react";
import type { ToolMeta } from "../tools/types";
import { TOOL_LANDING_CONTENT } from "../tools/landingContent";

type ToolLandingContentProps = {
  meta: ToolMeta;
};

export default function ToolLandingContent({ meta }: ToolLandingContentProps) {
  const content = TOOL_LANDING_CONTENT[meta.slug];
  if (!content) return null;

  const headingId = `tool-content-${meta.slug}`;

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
        </div>
      </div>
    </section>
  );
}
