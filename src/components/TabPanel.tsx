import { Box } from "@mui/material";
import { CSSProperties, ReactElement } from "react";

interface TabPanelProps {
  children: ReactElement[] | ReactElement;
  value: number;
  index: number | string;
  className?: string;
  sx: CSSProperties
}

export default function TabPanel({ children, value, index, sx, ...other }: TabPanelProps) {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      style={sx}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
