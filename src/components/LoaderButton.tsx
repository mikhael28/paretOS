import { Button, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { buttonType, buttonVariant, color } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiButtonBase-root": {
      marginTop: theme.spacing(1),
      fontSize: 16,
    },
  },
}));

interface ButtonProps {
  text: string;
  loadingText: string;
  isLoading: boolean;
  disabled: boolean;
  className?: string;
  type: buttonType;
  color: color;
  variant: buttonVariant;
}

export default function LoaderButton({
  text,
  loadingText,
  isLoading,
  disabled,
  className,
  type = "button",
  color = "primary",
  variant = "contained",
}: ButtonProps) {
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
