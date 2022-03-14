import React, { useState } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { Link } from "react-router-dom";
import { Button, InputLabel, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import logo from "../assets/Pareto_Lockup-01.png";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5),
    width: 300,

    "& .MuiTextField-root": {
      width: 300,
    },
    "& .MuiFormLabel-root": {
      marginTop: theme.spacing(3),
      fontSize: 18,
      color: "#000",
      fontWeight: "bold",
    },
    "& .MuiInputBase-input": {
      fontSize: 16,
      color: "#000",
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

const Login = ({
  initialFetch,
  setCloseLoading,
  setLoading,
  userHasAuthenticated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading();

    setIsLoading(true);

    try {
      const user = await Auth.signIn(data.email, data.password);
      await initialFetch(user.username);
      userHasAuthenticated(true);
      setCloseLoading();
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
      setCloseLoading();
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
          style={{ marginTop: 32 }}
        />
      </div>

      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputLabel>{I18n.get("email")}</InputLabel>
          <TextField
            id="email"
            variant="outlined"
            size="medium"
            autoFocus
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

        <div>
          <InputLabel>{I18n.get("password")}</InputLabel>
          <TextField
            id="password"
            variant="outlined"
            size="medium"
            type="password"
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
          <Button variant="contained" color="primary" type="submit">
            {isLoading ? I18n.get("loggingIn") : I18n.get("login")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
