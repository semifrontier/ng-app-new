import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Gtag = (command: string, target: string | Date, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-GJGS1YXX4F";

const TRACKED_HOSTS = new Set(["nogatekeeping.com", "www.nogatekeeping.com"]);

function shouldTrack() {
  if (!GA_MEASUREMENT_ID) return false;

  return (
    import.meta.env.VITE_ENABLE_GA === "true" ||
    TRACKED_HOSTS.has(window.location.hostname)
  );
}

function loadGoogleTag() {
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => {
    window.dataLayer?.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    GA_MEASUREMENT_ID,
  )}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export default function GoogleAnalytics() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!shouldTrack()) return;

    loadGoogleTag();
  }, []);

  useEffect(() => {
    if (!shouldTrack()) return;

    loadGoogleTag();
    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${pathname}${search}${hash}`,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [hash, pathname, search]);

  return null;
}
