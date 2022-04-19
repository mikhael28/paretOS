import { styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "border: 1px solid #ddd",
  borderColor: "rgb(34,34,34)",

  [`& .${gridClasses.columnHeaderTitle}`]: {
    fontWeight: 700,
    fontSize: "16px",
  },
  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: "#222",
    "-webkit-touch-callout": "none" /* iOS Safari */,
    "-webkit-user-select": "none" /* Safari */,
    "-khtml-user-select": "none" /* Konqueror HTML */,
    "-moz-user-select": "none" /* Firefox */,
    "-ms-user-select": "none" /* Internet Explorer/Edge */,
    "user-select": "none" /* Non-prefixed version, currently
                      supported by Chrome and Opera */,
  },
  [`& .${gridClasses.columnHeader}:focus, .${gridClasses.columnHeader}:focus-within`]:
    {
      outline: "none",
    },
  [`& .${gridClasses.row}`]: {
    fontSize: "16px",
    "&:hover, &.Mui-hovered": {
      backgroundColor: theme.palette.primary.main,
      cursor: "pointer",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
  },
  [`& .${gridClasses.row}-selected`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${gridClasses.cell}:focus-within, .${gridClasses.cell}:focus`]: {
    outline: "none",
  },
}));

export default StyledDataGrid;
