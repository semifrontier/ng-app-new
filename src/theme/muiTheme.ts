import { createTheme } from "@mui/material/styles";

export const ngMuiTheme = createTheme({
  palette: {
    primary: {
      main: "#1982c4",
      dark: "#156a9e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffca3a",
      dark: "#e6b42f",
      contrastText: "#111111",
    },
    error: {
      main: "#ff595e",
      dark: "#e14e53",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
      secondary: "rgba(17, 17, 17, 0.72)",
    },
    divider: "#111111",
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: '"Syne", sans-serif',
    button: {
      fontWeight: 800,
      letterSpacing: 0,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          alignItems: "center",
          border: "2px solid",
          borderRadius: 0,
          boxShadow: "none",
          display: "inline-flex",
          fontFamily: "inherit",
          fontWeight: 800,
          gap: "0.5rem",
          justifyContent: "center",
          letterSpacing: 0,
          lineHeight: 1.2,
          minWidth: 0,
          textTransform: "uppercase",
          transition:
            "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
          "&.Mui-disabled": {
            borderColor: "var(--ng-border)",
            opacity: 0.5,
          },
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          color: "var(--ng-text)",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition:
            "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
          width: "100%",
        },
        input: {
          font: "inherit",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 0,
          boxShadow: "none",
          color: "var(--ng-text)",
        },
      },
    },
  },
});
