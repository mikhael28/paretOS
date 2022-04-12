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
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
          backgroundColor: "transparent",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottomSize: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: theme.palette.grey[900],
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          alignItems: "space-between",
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "filled" },
          style: ({ theme }) => ({
            borderRadius: 0,
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(-2),
            marginRight: theme.spacing(-2),
            marginBottom: theme.spacing(1),
            backgroundImage: "linear-gradient(70deg, #DE4665, #D95B35)",
          }),
        },
        {
          props: { variant: "filled", className: "flex" },
          style: ({ theme }) => ({
            borderRadius: 0,
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(-2),
            marginRight: theme.spacing(-2),
            marginBottom: theme.spacing(1),
            alignItems: "center",
            backgroundImage: "linear-gradient(70deg, #DE4665, #D95B35)",
          }),
        },
      ],
    },
  },
});

export default theme;
