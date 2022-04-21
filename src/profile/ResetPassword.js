import React, { useState } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Container,
  FormHelperText,
  TextField,
  Link,
} from "@mui/material";
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
    "& .MuiFormHelperText-root": {
      fontSize: 16,
      color: "#808080",
    },
  },
}));

const ResetPassword = ({ initialFetch, setCloseLoading, setLoading }) => {
  const classes = useStyles();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [disabled] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    watch,
  } = useForm();

  let password1 = watch("password");
  let password2 = watch("confirmPassword");
  let email1 = getValues("email");

  const handleSendCodeClick = async (data) => {
    setLoading();

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(data.email);

      setCodeSent(true);
      setCloseLoading();
    } catch (e) {
      alert(e.message);
      setIsSendingCode(false);
      setCloseLoading();
    }
  };

  const handleConfirmClick = async (data) => {
    setLoading();

    setIsConfirming(true);

    try {
      console.log(email1);

      await Auth.forgotPasswordSubmit(email1, data.code, data.password);
      setConfirmed(true);
      setCloseLoading();
    } catch (e) {
      alert(e.message);
      setIsConfirming(false);
      setCloseLoading();
    }
  };

  const renderRequestCodeForm = () => (
    <div className="Form">
      <form
        className={classes.root}
        onSubmit={handleSubmit(handleSendCodeClick)}
      >
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
        </div>
        <span className="error">{errors.email && errors.email.message}</span>
        <div>
          <LoaderButton
            loadingText={I18n.get("sending")} //
            text={I18n.get("sendConfirmation")} //
            isLoading={isSendingCode} //
            disabled={disabled} //
            type="submit"
            color="primary"
            variant="contained"
          />
        </div>
      </form>
    </div>
  );

  const renderConfirmationForm = () => (
    <div className="Form">
      <Container>
        <form
          className={classes.root}
          onSubmit={handleSubmit2(handleConfirmClick)}
        >
          <div>
            <TextField
              id="code"
              variant="filled"
              size="medium"
              autoFocus
              label={I18n.get("confirmationCode")}
              type="tel"
              {...register2("code", {
                required: "code is required",
                minLength: {
                  value: 6,
                  message: "codes are 6 digits long",
                },
                maxLength: {
                  value: 6,
                  message: "codes are 6 digits long",
                },
              })}
            />
          </div>

          <span className="error">{errors2.code && errors2.code.message}</span>
          <hr />
          <div>
            <TextField
              id="password"
              variant="filled"
              size="medium"
              autoFocus
              label={I18n.get("newPassword")}
              type="password"
              {...register2("password", {
                required: "password is required",
                minLength: {
                  value: 8,
                  message: "minimum length is 8 characters",
                },
              })}
            />
          </div>
          <span className="error">
            {errors2.password && errors2.password.message}
          </span>
          <br />
          <div>
            <TextField
              id="confirmPassword"
              variant="filled"
              size="medium"
              autoFocus
              label={I18n.get("confirm")}
              type="password"
              {...register2("confirmPassword", {
                required: "password needs to be confirmed",
                validate: {
                  passEqual: (password2) =>
                    password2 === password1 || "passwords need to match",
                },
              })}
            />
          </div>
          <span className="error">
            {errors2.confirmPassword && errors2.confirmPassword.message}
          </span>
          <LoaderButton
            type="submit"
            size="large"
            text={I18n.get("confirm")}
            loadingText={I18n.get("confirming")}
            isLoading={isConfirming}
            disabled={disabled}
          />
        </form>
      </Container>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="success">
      <Typography variant="h1">{I18n.get("Success!")}</Typography>
      <p>Your password has been reset.</p>
      <p>
        <Link href="/login">
          Click here to login with your new credentials.
        </Link>
      </p>
    </div>
  );

  return (
    <div className="Form">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
};

export default ResetPassword;
