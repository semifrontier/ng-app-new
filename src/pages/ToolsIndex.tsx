import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import Card from "../components/Card";
import SiteFooter from "../components/SiteFooter";
import SiteTopNav from "../components/SiteTopNav";
import { TOOL_CATALOG } from "../tools/catalog";

export default function ToolsIndex() {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background:
          "linear-gradient(90deg, rgba(25,130,196,0.08) 1px, transparent 1px), linear-gradient(rgba(25,130,196,0.08) 1px, transparent 1px), var(--ng-bg)",
        backgroundSize: "80px 80px",
      }}
    >
      <SiteTopNav />

      <main className="py-8 sm:py-12">
        <div className="ng-page-shell space-y-8">
          <Card
            component="section"
            padding="none"
            className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]"
          >
            <div className="space-y-5">
              <div className="ng-eyebrow">Tool Directory / All Utilities</div>
              <h1 className="max-w-[10ch] text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.08em] text-primary sm:text-7xl">
                Browse Every Tool
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--ng-text-muted)] sm:text-lg">
                Browse every No Gatekeeping utility for image conversion, text cleanup, SEO checks, design systems, URL work, and local productivity.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button href="#all-tools">
                  Jump To Tools
                </Button>
                <Button component={Link} to="/" variant="outline">
                  Back Home
                </Button>
              </div>
            </div>

            <div className="grid gap-4 self-start">
              <div className="ng-panel">
                <div className="ng-eyebrow text-[var(--ng-text)]">Count</div>
                <p className="mt-3 text-4xl font-extrabold tracking-[-0.06em]">
                  {TOOL_CATALOG.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ng-text-muted)]">
                  Production tool pages available right now.
                </p>
              </div>

              <div className="ng-panel bg-[var(--ng-accent-yellow)]">
                <div className="ng-eyebrow text-[var(--ng-text)]">Coverage</div>
                <p className="mt-3 text-sm leading-6">
                  Text, images, SEO, design systems, conversion, extraction, and utility workflows.
                </p>
              </div>
            </div>
          </Card>

          <section className="space-y-5" id="all-tools">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="ng-eyebrow">Index</div>
                <h2 className="mt-2 text-3xl font-extrabold uppercase tracking-[-0.06em] sm:text-4xl">
                  All Tools
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[var(--ng-text-muted)] sm:text-base">
                Every card links directly to a working browser tool with a short description, category, and route.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {TOOL_CATALOG.map((tool) => (
                <Card
                  component={Link}
                  key={tool.id}
                  padding="none"
                  to={tool.route}
                  className="group grid min-h-[220px] gap-5 p-5 transition-colors"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      backgroundColor: "var(--ng-panel)",
                    },
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="ng-eyebrow">{tool.category}</span>
                    <span
                      aria-hidden="true"
                      className="text-lg font-bold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </div>

                  <div className="mt-auto space-y-3">
                    <h3 className="text-2xl font-extrabold leading-none tracking-[-0.05em]">
                      {tool.title}
                    </h3>
                    <p className="text-sm leading-6 text-[var(--ng-text-muted)]">
                      {tool.desc}
                    </p>
                    <div
                      className="h-3 w-full border-2 border-[var(--ng-border)]"
                      style={{ backgroundColor: tool.bg }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
