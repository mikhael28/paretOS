import { Box } from "@mui/material";

interface TabPanelProps {
  children: any;
  value: number;
  index: number | string;
  className?: string;
}

export default function TabPanel({ children, value, index, ...other }: TabPanelProps) {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
