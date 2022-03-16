import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    transform: "translate(50%, 50%)",
  },
}));

export default function Spinner() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress sx={{ color: "#339c51" }} />
    </div>
  );
}
