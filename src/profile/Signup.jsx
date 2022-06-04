// hooks import
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import HelpBlock from "react-bootstrap/lib/HelpBlock";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { useTheme } from "@mui/material";
import logo from "../assets/Pareto_Lockup-01.png";
import LoaderButton from "../components/LoaderButton";
import { ToastMsgContext } from "../state/ToastContext";

const Signup = () => {
  const theme = useTheme();
  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newUser, setNewUser] = useState(null);

  // for redirect to new route
  const history = useHistory();

  const validateForm = () =>
    email.length > 0 && password.length > 0 && password === confirmPassword;

  const validateConfirmationForm = () => confirmationCode.length > 0;

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      handleShowSuccess("Sign up complete");
      history.push("/onboarding/user");
    } catch (e) {
      handleShowError(e);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
      });
      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
    }
    setIsLoading(false);
  };

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmationSubmit}>
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
      <FormGroup controlId="confirmationCode" bsSize="large">
        <ControlLabel>{I18n.get("confirmationCode")}</ControlLabel>
        <FormControl
          autoFocus
          type="tel"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <HelpBlock>{I18n.get("checkEmail")}</HelpBlock>
      </FormGroup>
      <LoaderButton
        block
        size="large"
        disabled={!validateConfirmationForm()}
        type="submit"
        isLoading={isLoading}
        text={I18n.get("verify")}
        loadingText={I18n.get("nowVerifying")}
      />
    </form>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
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
      <FormGroup controlId="email" bsSize="large">
        <ControlLabel>{I18n.get("email")}</ControlLabel>
        <FormControl
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="password" bsSize="large">
        <ControlLabel>{I18n.get("password")}</ControlLabel>
        <FormControl
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </FormGroup>
      <FormGroup controlId="confirmPassword" bsSize="large">
        <ControlLabel>{I18n.get("confirm")}</ControlLabel>
        <FormControl
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
        />
      </FormGroup>
      <LoaderButton
        block
        size="large"
        disabled={!validateForm()}
        type="submit"
        isLoading={isLoading}
        text={I18n.get("signup")}
        loadingText={I18n.get("signingUp")}
      />
    </form>
  );
  return (
    <div className="Form">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
};

export default Signup;
