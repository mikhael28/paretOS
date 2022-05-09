import { Button, Theme, ButtonProps } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { MdAutorenew } from "react-icons/md";

// Custom sub-component to access theme and build/export useStyles
// Prevents React from generating a new useStyles function each time the component is rendered
// TODO: Remove conditional on spacing once toast notifications have been migrated to a library
//       that can consume theme. See issue #171.

const UseStyles = () => {
  const theme: Theme = useTheme();

  const useStyles = makeStyles({
    root: {
      "& .MuiButtonBase-root": {
        marginTop: theme?.spacing(1) || 8,
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
}: CustomButtonProps | any) {
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
        {isLoading && <MdAutorenew className="spinning" />}
        {!isLoading ? text : loadingText}
      </Button>
    </div>
  );
}
