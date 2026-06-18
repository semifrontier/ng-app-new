import React, { useEffect, useMemo, useState } from "react";
import {
  ChartNoAxesColumn,
  FileSearch,
  FileText,
  Grid3X3,
  ImageDown,
  LayoutPanelTop,
  Library,
  Link as LinkIcon,
  Mic,
  Minimize2,
  MousePointerClick,
  Palette,
  Pipette,
  Route,
  Scaling,
  Server,
  Tags,
  Type,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import { TOOL_CATALOG, type ToolCardIcon } from "../tools/catalog";
import { FEATURED_TOOL_LINKS } from "../tools/featuredLinks";
import "./home.css";

type Tool = (typeof TOOL_CATALOG)[number];

const TOOLS: Tool[] = TOOL_CATALOG;
const HERO_CHAIN_COLUMNS = 3;
const HERO_CHAIN_STARTS = [0, 4, 8];
type ChainPhase = "idle" | "animating" | "resetting";

const TOOL_CARD_ICONS: Record<ToolCardIcon, LucideIcon> = {
  chart: ChartNoAxesColumn,
  "file-search": FileSearch,
  "image-down": ImageDown,
  pipette: Pipette,
  type: Type,
  mic: Mic,
  scaling: Scaling,
  file: FileText,
  minimize: Minimize2,
  palette: Palette,
  grid: Grid3X3,
  library: Library,
  link: LinkIcon,
  layout: LayoutPanelTop,
  "mouse-click": MousePointerClick,
  route: Route,
  server: Server,
  tags: Tags,
};

function IconSVG({ kind }: { kind: ToolCardIcon }) {
  const Icon = TOOL_CARD_ICONS[kind] ?? LayoutPanelTop;
  return <Icon aria-hidden="true" strokeWidth={1.8} />;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [chainIndices, setChainIndices] = useState(HERO_CHAIN_STARTS);
  const [chainPhases, setChainPhases] = useState<ChainPhase[]>(["idle", "idle", "idle"]);

  const categories = useMemo(() => {
    return ["All", ...new Set(TOOLS.map((tool) => tool.category).filter(Boolean))];
  }, []);

  const tickerItems = useMemo(() => {
    return [...TOOLS.map((tool) => tool.title), "Open Source Utilities", "No Signups", "Fast Workflows"];
  }, []);

  const heroColumns = useMemo(() => {
    return Array.from({ length: HERO_CHAIN_COLUMNS }, (_, columnIndex) => {
      const currentIndex = chainIndices[columnIndex] ?? columnIndex;

      return {
        current: TOOLS[currentIndex % TOOLS.length],
        next: TOOLS[(currentIndex + 1) % TOOLS.length],
      };
    });
  }, [chainIndices]);

  const visibleTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      const matchesQuery =
        normalized.length === 0 ||
        tool.title.toLowerCase().includes(normalized) ||
        tool.desc.toLowerCase().includes(normalized) ||
        tool.category.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      Array.from({ length: HERO_CHAIN_COLUMNS }, (_, columnIndex) => columnIndex).forEach((columnIndex) => {
        window.setTimeout(() => {
          setChainPhases((current) =>
            current.map((value, index) => (index === columnIndex ? "animating" : value)),
          );

          window.setTimeout(() => {
            setChainIndices((current) =>
              current.map((value, index) =>
                index === columnIndex ? (value + 1) % TOOLS.length : value,
              ),
            );
            setChainPhases((current) =>
              current.map((value, index) => (index === columnIndex ? "resetting" : value)),
            );

            window.setTimeout(() => {
              setChainPhases((current) =>
                current.map((value, index) => (index === columnIndex ? "idle" : value)),
              );
            }, 40);
          }, 540);
        }, columnIndex * 150);
      });
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="ng-home">
      <header className="ng-header">
        <Link className="ng-brand" to="/">
          <span className="ng-brand__mark" aria-hidden="true">
            NG
          </span>
          <span className="ng-brand__text">No Gatekeeping</span>
        </Link>

        <nav className="ng-nav" aria-label="Primary">
          <a href="#tools">Tools</a>
          <a href="#system">System</a>
          {FEATURED_TOOL_LINKS.map((tool) => (
            <Link key={tool.slug} to={`/tools/${tool.slug}`}>
              {tool.label}
            </Link>
          ))}
          <a href="/blog">Blog</a>
        </nav>

        <a className="ng-header__cta" href="#tools">
          Open Tools
        </a>
      </header>

      <main>
        <section className="hero-shell">
          <div className="hero-stack">
            <div className="hero-copy">
              <div className="eyebrow">Utility Artboard / 2026</div>
              <h1 className="hero-title">
                <span>NO</span>
                <span>GATEKEEPING</span>
              </h1>
              <p className="hero-kicker">
                Fast, free browser utilities for image, text, SEO, design, and workflow cleanup.
                Everything is built to get people into a useful tool quickly, without signup gates.
              </p>

              <div className="hero-actions">
                <a className="hero-action hero-action--primary" href="#tools">
                  View All Tools
                </a>
                <a className="hero-action" href="/tools">
                  Tool Index
                </a>
              </div>
              <div className="hero-rail">
                <div className="hero-rail__line hero-rail__line--blue" />
                <div className="hero-rail__line hero-rail__line--yellow" />
                <div className="hero-rail__line hero-rail__line--red" />
              </div>
            </div>

            <section className="hero-chain-board" aria-label="Featured tools">
              <div className="hero-chain__head">
                <div className="panel-label">Tool Chain</div>
                <p>
                  Three rotating shortcuts, each advancing with a slight delay so the whole board
                  moves like an offset conveyor.
                </p>
              </div>

              <div className="hero-chain-columns">
                {heroColumns.map((column, columnIndex) => (
                  <div className="hero-chain-column" key={`column-${columnIndex}`}>
                    <div className="hero-chain-column__label">
                      Queue {columnIndex + 1}
                    </div>

                    <div className="hero-chain__viewport hero-chain__viewport--single">
                      <div
                        className={`hero-chain__track hero-chain__track--single phase-${chainPhases[columnIndex]}`}
                      >
                        {[column.current, column.next].map((tool, toolIndex) => (
                          <Link
                            key={`${tool.id}-${columnIndex}-${toolIndex}`}
                            to={tool.route}
                            className="hero-chain__item hero-chain__item--single"
                            style={
                              {
                                ["--accent" as "--accent"]: tool.bg,
                              } as React.CSSProperties
                            }
                          >
                            <div className="hero-chain__item-top">
                              <span className="hero-chain__category">{tool.category}</span>
                              <span className="hero-chain__arrow" aria-hidden="true">
                                ↗
                              </span>
                            </div>

                            <div className="hero-chain__item-main">
                              <span className="hero-chain__icon">
                                <IconSVG kind={tool.icon} />
                              </span>
                              <div>
                                <strong>{tool.title}</strong>
                                <p>{tool.desc}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="ticker" aria-label="Tool ticker">
          <div className="ticker__track">
            {[0, 1].map((loop) => (
              <div className="ticker__row" key={loop}>
                {tickerItems.map((item, index) => (
                  <span key={`${loop}-${item}-${index}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="tools-shell" id="tools">
          <div className="section-head">
            <div>
              <div className="eyebrow">Filterable Tool Matrix</div>
              <h1>Browse the entire No Gatekeeping stack.</h1>
            </div>

            <p>
              Search by name or category, then jump into workflows for images, text, SEO checks,
              design systems, conversion, extraction, and everyday cleanup.
            </p>
          </div>

          <div className="tool-controls">
            <label className="tool-search">
              <span className="sr-only">Search tools</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tool, keyword, or category"
              />
            </label>

            <div className="tool-filters" role="tablist" aria-label="Tool categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === activeCategory ? "is-active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-grid">
            {visibleTools.map((tool, index) => (
              <Link
                key={tool.id}
                to={tool.route}
                className="tool-card"
                style={
                  {
                    ["--accent" as "--accent"]: tool.bg,
                    ["--card-order" as "--card-order"]: String(index % 6),
                  } as React.CSSProperties
                }
              >
                <div className="tool-card__top">
                  <span className="tool-card__category">{tool.category}</span>
                  <span className="tool-card__arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div className="tool-card__icon">
                  <IconSVG kind={tool.icon} />
                </div>

                <div className="tool-card__body">
                  <h2>{tool.title}</h2>
                  <p>{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {visibleTools.length === 0 ? (
            <div className="tool-empty">
              <p>No tools match that filter yet. Try another keyword or switch back to All.</p>
            </div>
          ) : null}
        </section>

      </main>

      <SiteFooter className="ng-footer" inverted />
    </div>
  );
}
