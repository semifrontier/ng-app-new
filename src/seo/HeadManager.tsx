import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  absoluteUrl,
  DEFAULT_SITE_URL,
  getSeoDescriptor,
  normalizeSiteUrl,
  SITE_NAME,
  type JsonLdDocument,
  type SeoDescriptor,
} from "./seoData";

const SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL,
);

function upsertMeta(
  attribute: "name" | "property",
  attributeValue: string,
  content: string,
) {
  const selector = `meta[${attribute}="${attributeValue}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, attributeValue);
    element.dataset.ngSeo = "true";
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    element.dataset.ngSeo = "true";
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function upsertJsonLd(schema?: JsonLdDocument) {
  const scriptId = "ng-json-ld";
  const existing = document.getElementById(scriptId);

  if (!schema) {
    existing?.remove();
    return;
  }

  const script =
    existing instanceof HTMLScriptElement
      ? existing
      : document.createElement("script");

  script.id = scriptId;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");

  if (!script.parentElement) {
    document.head.appendChild(script);
  }
}

function applySeo(descriptor: SeoDescriptor) {
  const canonicalUrl = absoluteUrl(descriptor.canonicalPath, SITE_URL);
  const robots = descriptor.robots ?? "index,follow";

  document.title = descriptor.title;
  upsertCanonical(canonicalUrl);

  upsertMeta("name", "description", descriptor.description);
  upsertMeta("name", "robots", robots);
  upsertMeta("name", "application-name", SITE_NAME);
  upsertMeta("name", "twitter:card", "summary");
  upsertMeta("name", "twitter:title", descriptor.title);
  upsertMeta("name", "twitter:description", descriptor.description);

  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", canonicalUrl);
  upsertMeta("property", "og:title", descriptor.title);
  upsertMeta("property", "og:description", descriptor.description);

  upsertJsonLd(descriptor.schema);
}

export default function HeadManager() {
  const { pathname } = useLocation();
  const descriptor = useMemo(
    () => getSeoDescriptor(pathname, SITE_URL),
    [pathname],
  );

  useEffect(() => {
    applySeo(descriptor);
  }, [descriptor]);

  return null;
}
