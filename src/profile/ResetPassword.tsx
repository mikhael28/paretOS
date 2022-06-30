import React, { useState } from "react";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { Typography, TextField, Link } from "@mui/material";
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

const ResetPassword = ({ setLoading }: {setLoading: (b: boolean) => void}) => {
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
  let email1 = getValues("email");

  const handleSendCodeClick = async (data: any) => {
    setLoading(true);

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(data.email);

      setCodeSent(true);
      setLoading(false);
    } catch (e) {
      alert((e as Error).message);
      setIsSendingCode(false);
      setLoading(false);
    }
  };

  const handleConfirmClick = async (data: any) => {
    setLoading(true);

    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(email1, data.code, data.password);
      setConfirmed(true);
      setLoading(false);
    } catch (e) {
      alert((e as Error).message);
      setIsConfirming(false);
      setLoading(false);
    }
  };

  const renderRequestCodeForm = () => (
    <div className="Form">
      <form
        className={classes.root}
        onSubmit={handleSubmit(handleSendCodeClick)}
      >
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

        <LoaderButton
          loadingText={I18n.get("sending")} //
          text={I18n.get("sendConfirmation")} //
          isLoading={isSendingCode} //
          disabled={disabled} //
          type="submit"
          color="primary"
          variant="contained"
        />
      </form>
    </div>
  );

  const renderConfirmationForm = () => (
    <div className="Form">
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

          <span className="error">{errors2.code && errors2.code.message}</span>
          <hr />
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
          <span className="error">
            {errors2.password && errors2.password.message}
          </span>

          <br />
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
          <span className="error">
            {errors2.confirmPassword && errors2.confirmPassword.message}
          </span>
        </div>
        <LoaderButton
          type="submit"
          size="large"
          text={I18n.get("confirm")}
          loadingText={I18n.get("confirming")}
          isLoading={isConfirming}
          disabled={disabled}
        />
      </form>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="success">
      <Typography variant="h1">{I18n.get("Success!")}</Typography>

      <p>Your password has been reset.</p>
      <Link href="/login">Click here to login with your new credentials.</Link>
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
