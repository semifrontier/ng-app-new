import React from "react";
import Paper, { type PaperProps } from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";

type CardProps = PaperProps & {
  tone?: "default" | "muted";
  padding?: "none" | "sm" | "md" | "lg";
  component?: React.ElementType;
  to?: string;
};

const paddingStyles: Record<NonNullable<CardProps["padding"]>, SxProps<Theme>> = {
  none: {
    p: 0,
  },
  sm: {
    p: "1rem",
  },
  md: {
    p: "1.5rem",
  },
  lg: {
    p: "2rem",
  },
};

function toSxArray(sx?: SxProps<Theme>) {
  return Array.isArray(sx) ? sx : sx ? [sx] : [];
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ tone = "default", padding = "md", sx, ...props }, ref) => {
    return (
      <Paper
        ref={ref}
        square
        elevation={0}
        sx={[
          {
            backgroundColor:
              tone === "muted" ? "var(--ng-panel)" : "var(--ng-bg)",
            border: "2px solid var(--ng-border)",
            borderRadius: 0,
            boxShadow: "none",
            color: "var(--ng-text)",
          },
          paddingStyles[padding],
          ...toSxArray(sx),
        ]}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export default Card;
