import { createTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";

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
    MuiButton: {
      variants: [
        {
          props: { variant: "gradient" },
          style: ({ theme }) => ({
            background: "linear-gradient(70deg, #D95B35, #DE4665)",
            "&:hover": { background: "linear-gradient(70deg,#db6e4d,#e0526e)" },
            border: 0,
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            marginRight: "10px",
            minWidth: "180px",
            [theme.breakpoints.down(768)]: {
              minWidth: "80px",
            },
            padding: "8px 16px",
            transition: "background .3s",
            lineHeight: 1.4,
          }),
        },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: "options" },
          style: ({ theme }) => ({
            fontSize: "16px",
            padding: "22px 8px",
            marginRight: "8px",
            marginBottom: "8px",
            fontWeight: 600,
            textTransform: "uppercase",
            minWidth: "80px",
            [theme.breakpoints.down(768)]: {
              width: "100%",
            },
          }),
        },
        {
          props: { variant: "options-selected" },
          style: {
            background: "rgba(255, 255, 255, 0.44)",
            "&:hover": { background: "rgba(255, 255, 255, 0.44)" },
          },
        },
      ],
    },
  },
});

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    filled: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    options: true;
    "options-selected": true;
  }
}

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

export default theme;
