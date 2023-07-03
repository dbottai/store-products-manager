import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7527",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
});