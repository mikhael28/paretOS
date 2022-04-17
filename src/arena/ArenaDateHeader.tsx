import { Dispatch, SetStateAction } from "react";
import { Paper, useTheme, Button, Box } from "@mui/material";

import getDateRange from "../utils/getDateRange";

interface ArenaDateHeaderProps {
  startDate: Date;
  question: string;
  setIsTourOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * This is the top header component
 */
function ArenaDateHeader({
  startDate,
  question,
  setIsTourOpen,
}: ArenaDateHeaderProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        mt: -1,
        pl: 2,
        borderRadius: 0,
      }}
      elevation={8}
      className="flex"
      style={{
        backgroundImage: "linear-gradient(70deg, #DE4665, #D95B35)",
      }}
    >
      <h1>
        <b>Sprint</b>&nbsp;&nbsp;{getDateRange(startDate)}
      </h1>
      <Button
        variant="text"
        onClick={() => {
          setIsTourOpen(true);
        }}
        style={{
          marginLeft: theme.spacing(0),
          marginBottom: theme.spacing(2),
          cursor: "pointer",
          minWidth: "fit-content",
        }}
      >
        <Box
          component="img"
          src={question}
          height={theme.spacing(2)}
          width={theme.spacing(2)}
          style={{
            opacity: 0.8,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
        />
      </Button>
      {/* <Image
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
      /> */}
    </Paper>
  );
}

export default ArenaDateHeader;
