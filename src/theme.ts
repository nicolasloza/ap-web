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
    mode: "light",
    primary: {
      main: "#e4b61a",
      light: "#fbe134",
      dark: "#b18a14",
      contrastText: "#0b0c0c",
    },
    secondary: {
      main: "#2a2e34",
      light: "#3a3f46",
      dark: "#0b0c0c",
      contrastText: "#e9eaec",
    },
    background: {
      default: "#e9eaec",
      paper: "#ffffff",
    },
    text: {
      primary: "#2a2e34",
      secondary: "rgba(42, 46, 52, 0.8)",
    },
    divider: "rgba(42, 46, 52, 0.18)",
    action: {
      hover: "rgba(228, 182, 26, 0.12)",
      selected: "rgba(228, 182, 26, 0.2)",
      focus: "rgba(228, 182, 26, 0.24)",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 800, lineHeight: 1.1 },
    h2: { fontWeight: 700, lineHeight: 1.15 },
    h3: { fontWeight: 700, lineHeight: 1.2 },
    h4: { fontWeight: 700, lineHeight: 1.2 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0b0c0c",
          color: "#e9eaec",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
