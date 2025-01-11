import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    searchBar: {
      text: string;
      background: string;
      hoverBackground: string;
      placeholder: string;
      dropdownBackground: string;
    };
  }
  interface PaletteOptions {
    searchBar: {
      background: string;
      hoverBackground: string;
      placeholder: string;
      text: string;
      dropdownBackground: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
    searchBar: {
      background: "rgba(255, 255, 255, 0.12)",
      hoverBackground: "rgba(255, 255, 255, 0.18)",
      placeholder: "rgba(255, 255, 255, 0.7)",
      text: "#ffffff",
      dropdownBackground: "rgba(255, 255, 255, 0.95)",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
