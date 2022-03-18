import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Glyphicon from "react-bootstrap/lib/Glyphicon";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiButtonBase-root": {
      marginTop: theme.spacing(1),
      fontSize: 16,
    },
  },
}));

export default function LoaderButton({
  text,
  loadingText,
  isLoading,
  disabled,
  className = "",
  type = "button",
  color = "primary",
  variant = "contained",
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        type={type}
        color={color}
        variant={variant}
      >
        {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
        {!isLoading ? text : loadingText}
      </Button>
    </div>
  );
}
