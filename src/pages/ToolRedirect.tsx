import React from "react";
import { Navigate, useParams } from "react-router-dom";

const LEGACY_TOOL_SLUGS: Record<string, string> = {
  "how-to-get-hex-code-from-image": "color-picker",
};

export default function ToolRedirect() {
  const { slug } = useParams<{ slug?: string }>();
  const canonicalSlug = slug ? (LEGACY_TOOL_SLUGS[slug] ?? slug) : undefined;

  return <Navigate to={canonicalSlug ? `/tools/${canonicalSlug}` : "/tools"} replace />;
}
