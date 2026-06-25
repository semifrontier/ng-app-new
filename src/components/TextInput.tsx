import React from "react";
import InputBase, {
  type InputBaseProps,
} from "@mui/material/InputBase";
import type { SxProps, Theme } from "@mui/material/styles";

type TextInputProps = InputBaseProps & {
  tone?: "default" | "muted";
};

function toSxArray(sx?: SxProps<Theme>) {
  return Array.isArray(sx) ? sx : sx ? [sx] : [];
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ tone = "default", sx, ...props }, ref) => {
    const isMuted = tone === "muted";

    return (
      <InputBase
        fullWidth
        inputRef={ref}
        sx={[
          {
            backgroundColor: isMuted ? "var(--ng-panel)" : "var(--ng-bg)",
            border: "2px solid",
            borderColor: isMuted
              ? "var(--ng-border-subtle)"
              : "var(--ng-border)",
            borderRadius: 0,
            boxShadow: "none",
            color: "var(--ng-text)",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            fontWeight: 600,
            px: "1rem",
            py: "0.75rem",
            transition:
              "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
            width: "100%",
            "&.Mui-focused": {
              outline: "2px solid var(--ng-primary)",
              outlineOffset: "2px",
            },
            ".MuiInputBase-input": {
              p: 0,
              "&::placeholder": {
                color: "var(--ng-text-muted)",
                opacity: 1,
              },
            },
          },
          ...toSxArray(sx),
        ]}
        {...props}
      />
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
