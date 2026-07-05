import { createTheme } from "@mui/material";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1536,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#e4b61a",
      light: "#fbe134",
      dark: "#b18a14",
      contrastText: "#0e0e0e",
    },
    secondary: {
      main: "#2a2e34",
      light: "#3a3f46",
      dark: "#0b0c0c",
      contrastText: "#f5f5f5",
    },
    background: {
      default: "#131313",
      paper: "#1c1b1b",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "rgba(245, 245, 245, 0.7)",
    },
    divider: "rgba(245, 245, 245, 0.12)",
    action: {
      hover: "rgba(228, 182, 26, 0.12)",
      selected: "rgba(228, 182, 26, 0.2)",
      focus: "rgba(228, 182, 26, 0.24)",
    },
  },
  typography: {
    fontFamily: "'Hanken Grotesk', Helvetica, Arial, sans-serif",
    h1: { fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: "none" },
    overline: { letterSpacing: "0.12em", fontWeight: 600 },
    caption: { letterSpacing: "0.04em" },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(19, 19, 19, 0.85)",
          backdropFilter: "blur(12px)",
          color: "#f5f5f5",
          borderBottom: "1px solid rgba(245, 245, 245, 0.12)",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          paddingInline: 18,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          "@media (min-width:600px)": {
            paddingLeft: 24,
            paddingRight: 24,
          },
          "@media (min-width:1280px)": {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(245, 245, 245, 0.12)",
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e4b61a",
          },
        },
      },
    },
  },
});

export default theme;
