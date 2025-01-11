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
      text: string;
      background: string;
      hoverBackground: string;
      placeholder: string;
      dropdownBackground: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1e40af",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    searchBar: {
      text: "#ffffff",
      background: "rgba(37, 99, 235, 0.9)",
      hoverBackground: "rgba(37, 99, 235, 1)",
      placeholder: "rgba(255, 255, 255, 0.8)",
      dropdownBackground: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
        },
      },
    },
  },
});
