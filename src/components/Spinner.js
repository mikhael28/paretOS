import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

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
      <CircularProgress style={{ color: "#339c51" }} />
    </div>
  );
}
