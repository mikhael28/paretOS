import React, { useState } from "react";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { Link } from "react-router-dom";
import { Button, TextField, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import logo from "../assets/Pareto_Lockup-01.png";
import LoaderButton from "../components/LoaderButton";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5),
    width: 300,

    "& .css-36njyd-MuiInputBase-root-MuiFilledInput-root": {
      backgroundColor: theme.palette.background.paper,
    },
    "& .MuiTextField-root": {
      width: 300,
    },
    "& .MuiFormLabel-root": {
      fontSize: 16,
      color: theme.palette.primary.main,
    },
    "& .MuiInputBase-input": {
      fontSize: 16,
    },
    "& .MuiButtonBase-root": {
      marginTop: theme.spacing(1),
      fontSize: 16,
    },
    "& .error": {
      fontSize: 14,
      color: "rgb(220, 66, 45)",
    },
  },
}));

interface LoginProps {
  initialFetch: (id: string) => void;
  setLoading: (b: boolean) => void;
  userHasAuthenticated: (b: boolean) => void;
}
const Login = ({
  initialFetch,
  setLoading,
  userHasAuthenticated,
}: LoginProps) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [disabled] = useState(false);
  const classes = useStyles();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setIsLoading(true);

    try {
      const user = await Auth.signIn(data.email, data.password);
      await initialFetch(user.username);
      userHasAuthenticated(true);
      setLoading(false);
    } catch (e) {
      alert((e as Error).message);
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="Form">
      <div className="flex-center">
        <img
          src={logo}
          alt="Pareto"
          height="45"
          width="180"
          style={{
            marginTop: 32,
            filter:
              theme.palette.mode !== "dark" ? "" : "invert() brightness(150%)",
          }}
        />
      </div>

      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField
            id="email"
            variant="filled"
            size="medium"
            autoFocus
            label={I18n.get("email")}
            {...register("email", {
              required: "email is required",
              pattern: {
                value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
                message: "invalid email address",
              },
            })}
          />
          <span className="error">{errors.email && errors.email.message}</span>
        </div>
        <br />
        <div>
          <TextField
            id="password"
            variant="filled"
            size="medium"
            type="password"
            label={I18n.get("password")}
            {...register("password", {
              required: "password is required",
              minLength: {
                value: 8,
                message: "minimum length is 8 characters",
              },
            })}
          />
          <span className="error">
            {errors.password && errors.password.message}
          </span>
        </div>

        <div>
          <Button
            component={Link}
            to="/login/reset"
            color="primary"
            type="button"
          >
            {I18n.get("resetPassword")}
          </Button>
        </div>

        <div>
          <LoaderButton
            text={I18n.get("login")}
            loadingText={I18n.get("loggingIn")}
            isLoading={isLoading}
            disabled={disabled}
            type="submit"
            color="primary"
            variant="contained"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
