import React, { useState } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { Link } from "react-router-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import HelpBlock from "react-bootstrap/lib/HelpBlock";
// import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { BsCheckLg } from "react-icons/bs";
import LoaderButton from "../components/LoaderButton";

const ResetPassword = () => {
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
    <form onSubmit={handleSendCodeClick}>
      <FormGroup bsSize="large" controlId="email">
        <ControlLabel>{I18n.get("email")}</ControlLabel>
        <FormControl
          autoFocus
          type="email"
          value={state.email}
          onChange={handleChange}
        />
      </FormGroup>
      <LoaderButton
        block
        type="submit"
        size="large"
        loadingText={I18n.get("sending")}
        text={I18n.get("sendConfirmation")}
        isLoading={state.isSendingCode}
        disabled={!validateEmailForm()}
      />
    </form>
  );

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmClick}>
      <FormGroup bsSize="large" controlId="code">
        <ControlLabel>{I18n.get("confirmationCode")}</ControlLabel>
        <FormControl
          autoFocus
          type="tel"
          value={state.code}
          onChange={handleChange}
        />
        <HelpBlock>{I18n.get("checkEmail")}</HelpBlock>
      </FormGroup>
      <hr />
      <FormGroup bsSize="large" controlId="password">
        <ControlLabel>{I18n.get("newPassword")}</ControlLabel>
        <FormControl
          type="password"
          value={state.password}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup bsSize="large" controlId="confirmPassword">
        <ControlLabel>{I18n.get("confirm")}</ControlLabel>
        <FormControl
          type="password"
          onChange={handleChange}
          value={state.confirmPassword}
        />
      </FormGroup>
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
  );

  const renderSuccessMessage = () => (
    <div className="success">
      <BsCheckLg />
      <p>Your password has been reset.</p>
      <p>
        <Link to="/login">Click here to login with your new credentials.</Link>
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
