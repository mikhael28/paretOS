import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#DE4665",
      dark: "#DE4665",
    },
    secondary: {
      main: "#DE4665",
      dark: "#DE4665",
    },
    background: {
      paper: "rgb(34, 34, 34)",
      default: "rgb(0, 0, 0)",
    },
    text: {
      secondary: "rgb(255, 255, 255)",
      primary: "rgb(242, 243, 243)",
    },
  },
  typography: {
    fontSize: 14,
    h1: {
      fontSize: "3rem",
      fontWeight: 300,
    },
    button: {
      fontWeight: 800,
    },
  },
});

export default theme;
