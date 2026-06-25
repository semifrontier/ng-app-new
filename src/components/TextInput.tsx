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
            px: "1rem",
            py: "0.75rem",
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
