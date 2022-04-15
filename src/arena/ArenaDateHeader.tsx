import { Paper, useTheme } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Image from "react-bootstrap/lib/Image";
import getDateRange from "../utils/getDateRange";

interface Props {
  startDate: Date;
  question: string;
  setIsTourOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * This is the top header component
 */
function ArenaDateHeader({ startDate, question, setIsTourOpen }: Props) {
  const theme = useTheme();

  return (
    <Paper sx={{ mt: -1 }} variant="outlined" className="flex">
      <h1>
        <b>Sprint</b>&nbsp;&nbsp;{getDateRange(startDate)}
      </h1>
      <Image
        src={question}
        onClick={() => {
          setIsTourOpen(true);
        }}
        height={theme.spacing(2)}
        width={theme.spacing(2)}
        circle
        style={{
          opacity: 0.8,
          filter: theme.palette.mode === "dark" ? "invert()" : "",
          marginLeft: theme.spacing(1),
          marginBottom: theme.spacing(2),
          cursor: "pointer",
        }}
      />
    </Paper>
  );
}

export default ArenaDateHeader;
