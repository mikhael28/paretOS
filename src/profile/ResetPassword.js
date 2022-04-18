import React, { useState } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  FormLabel,
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

    "& .MuiTextField-root": {
      width: 300,
    },
    "& .MuiFormLabel-root": {
      fontSize: 16,
      color: "#000",
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
    "& .MuiFormHelperText-root": {
      fontSize: 16,
      color: "#808080",
    },
  },
}));

const ResetPassword = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    code: "",
    email: "",
    password: "",
    codeSent: false,
    confirmed: false,
    confirmPassword: "",
    isConfirming: false,
    isSendingCode: false,
  });

  const validateEmailForm = () => state.email.length > 0;

  const validateResetForm = () =>
    state.code.length > 0 &&
    state.password.length > 0 &&
    state.password === state.confirmPassword;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

  const handleSendCodeClick = async (event) => {
    event.preventDefault();

    setState({ ...state, isSendingCode: true });

    try {
      await Auth.forgotPassword(state.email);
      setState({ ...state, codeSent: true });
    } catch (e) {
      alert(e.message);
      setState({ ...state, isSendingCode: false });
    }
  };

  const handleConfirmClick = async (event) => {
    event.preventDefault();

    setState({ ...state, isConfirming: true });

    try {
      await Auth.forgotPasswordSubmit(state.email, state.code, state.password);
      setState({ ...state, confirmed: true });
    } catch (e) {
      alert(e.message);
      setState({ ...state, isConfirming: false });
    }
  };

  const renderRequestCodeForm = () => (
    <div className="Form">
      <form className={classes.root} onSubmit={handleSendCodeClick}>
        <FormLabel>{I18n.get("email")}</FormLabel>
        <div style={{ backgroundColor: "#ccc" }}>
          <TextField
            id="email"
            variant="filled"
            size="medium"
            autoFocus
            label={I18n.get("email")}
            value={state.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <LoaderButton
            loadingText={I18n.get("sending")} //
            text={I18n.get("sendConfirmation")} //
            isLoading={state.isSendingCode} //
            disabled={!validateEmailForm()} //
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
        <form className={classes.root} onSubmit={handleConfirmClick}>
          <div style={{ backgroundColor: "#ccc" }}>
            <TextField
              id="code"
              variant="filled"
              size="medium"
              autoFocus
              label={I18n.get("confirmationCode")}
              type="tel"
              value={state.code}
              onChange={handleChange}
            />
          </div>
          <FormHelperText>{I18n.get("checkEmail")}</FormHelperText>
          <hr />
          <div style={{ backgroundColor: "#ccc" }}>
            <TextField
              id="password"
              variant="filled"
              size="medium"
              autoFocus
              label={I18n.get("newPassword")}
              type="password"
              value={state.password}
              onChange={handleChange}
            />
          </div>
          <br />
          <div style={{ backgroundColor: "#ccc" }}>
            <TextField
              id="confirmPassword"
              variant="filled"
              size="medium"
              autoFocus
              label={I18n.get("confirm")}
              type="password"
              value={state.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <LoaderButton
            block
            type="submit"
            size="large"
            text={I18n.get("confirm")}
            loadingText={I18n.get("confirming")}
            isLoading={state.isConfirming}
            disabled={!validateResetForm()}
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
      {!state.codeSent
        ? renderRequestCodeForm()
        : !state.confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
};

export default ResetPassword;
