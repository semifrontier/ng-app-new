import React from "react";
import MuiButton, {
  type ButtonProps as MuiButtonProps,
} from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  component?: React.ElementType;
  to?: string;
}

const muiVariants: Record<
  NonNullable<ButtonProps["variant"]>,
  MuiButtonProps["variant"]
> = {
  primary: "contained",
  secondary: "contained",
  outline: "outlined",
  ghost: "text",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, SxProps<Theme>> = {
  sm: {
    px: "0.75rem",
    py: "0.375rem",
    fontSize: "0.75rem",
  },
  md: {
    px: "1rem",
    py: "0.5rem",
    fontSize: "0.875rem",
  },
  lg: {
    px: "1.5rem",
    py: "0.75rem",
    fontSize: "1rem",
  },
};

const variantStyles: Record<
  NonNullable<ButtonProps["variant"]>,
  SxProps<Theme>
> = {
  primary: {
    backgroundColor: "var(--ng-primary)",
    borderColor: "var(--ng-border)",
    color: "var(--ng-bg)",
    "&:hover": {
      backgroundColor: "var(--ng-primary-strong)",
    },
  },
  secondary: {
    backgroundColor: "var(--ng-accent-yellow)",
    borderColor: "var(--ng-border)",
    color: "var(--ng-text)",
    "&:hover": {
      backgroundColor: "var(--ng-accent-yellow-strong)",
    },
  },
  outline: {
    backgroundColor: "var(--ng-bg)",
    borderColor: "var(--ng-border)",
    color: "var(--ng-text)",
    "&:hover": {
      backgroundColor: "var(--ng-panel)",
      borderColor: "var(--ng-border)",
    },
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "var(--ng-text-muted)",
    "&:hover": {
      backgroundColor: "var(--ng-panel)",
      borderColor: "transparent",
      color: "var(--ng-text)",
    },
  },
};

function toSxArray(sx?: SxProps<Theme>) {
  return Array.isArray(sx) ? sx : sx ? [sx] : [];
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isActive = false,
      disabled,
      type,
      sx,
      ...props
    },
    ref,
  ) => {
    const activeStyles: SxProps<Theme> =
      isActive && !disabled
        ? {
            backgroundColor: "var(--ng-primary)",
            borderColor: "var(--ng-primary)",
            color: "var(--ng-bg)",
            "&:hover": {
              backgroundColor: "var(--ng-primary-strong)",
              borderColor: "var(--ng-primary-strong)",
            },
          }
        : {};

    return (
      <MuiButton
        ref={ref}
        type={type ?? "button"}
        variant={muiVariants[variant]}
        disabled={disabled}
        sx={[
          {
            alignItems: "center",
            border: "2px solid",
            borderRadius: 0,
            boxShadow: "none",
            display: "inline-flex",
            fontFamily: "inherit",
            fontWeight: 800,
            gap: "0.5rem",
            justifyContent: "center",
            lineHeight: 1.2,
            minWidth: 0,
            textTransform: "uppercase",
            transition:
              "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
            "&.Mui-disabled": {
              borderColor: "var(--ng-border)",
              opacity: 0.5,
            },
          },
          sizeStyles[size],
          variantStyles[variant],
          activeStyles,
          ...toSxArray(sx),
        ]}
        {...props}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = "Button";
