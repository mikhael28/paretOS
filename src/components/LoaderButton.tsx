import { Button, Theme, ButtonProps } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import Glyphicon from "react-bootstrap/lib/Glyphicon";

// Custom sub-component to access theme and build/export useStyles
// Prevents React from generating a new useStyles function each time the component is rendered
const UseStyles = () => {
  const theme: Theme = useTheme();

  const useStyles = makeStyles({
    root: {
      "& .MuiButtonBase-root": {
        marginTop: theme.spacing(1),
        fontSize: 16,
      },
    },
  });

  return useStyles;
};

// Extend existing ButtonProps type to allow for our custom props
interface CustomButtonProps extends ButtonProps {
  props: ButtonProps;
  text: string;
  loadingText: string;
  isLoading: boolean;
  disabled: boolean;
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
  ...props
}: CustomButtonProps) {
  const classes = UseStyles()();

  return (
    <div className={classes.root}>
      <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        type={type}
        color={color}
        variant={variant}
        {...props}
      >
        {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
        {!isLoading ? text : loadingText}
      </Button>
    </div>
  );
}
