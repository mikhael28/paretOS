import { styled } from "@mui/material/styles";
import DataTable, { dataTableClasses } from "./DataTable";

const StyledDataTable = styled(DataTable)(({ theme }) => ({
  [`.${dataTableClasses.root}`]: {
    border: "1px solid #ddd",
    borderColor: "rgb(34,34,34)",
  },
  [`.${dataTableClasses.head}`]: {
    fontSize: "16px",
    fontWeight: 700,
    backgroundColor: "#222",
  },
  [`.${dataTableClasses.row}`]: {
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main} !important`,
      cursor: "pointer",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
  },
  [`.${dataTableClasses.row}-selected`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`.${dataTableClasses.cell}`]: {
    fontSize: "16px",
    padding: "8px",
  },
}));

export default StyledDataTable;
