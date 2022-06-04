import React, { useState, useContext } from "react";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import { ToastMsgContext } from "../state/ToastContext";

/**
 * Change your password through Cognito
 */

const ChangePassword = (props) => {
  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);

  const [state, setState] = useState({
    password: "",
    oldPassword: "",
    isChanging: false,
    confirmPassword: "",
  });

  const validateForm = () =>
    state.oldPassword.length > 0 &&
    state.password.length > 0 &&
    state.password === state.confirmPassword;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

  const handleChangeClick = async (event) => {
    event.preventDefault();
    setState({
      ...state,
      isChanging: true,
    });

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(currentUser, state.oldPassword, state.password);
      handleShowSuccess("Password successfully changed.");
      props.history.push("/");
    } catch (e) {
      handleShowError(e);
      setState({
        ...state,
        isChanging: false,
      });
    }
  };

  return (
    <div className="Form">
      <form onSubmit={handleChangeClick}>
        <FormGroup bsSize="large" controlId="oldPassword">
          <ControlLabel>{I18n.get("oldPassword")}</ControlLabel>
          <FormControl
            type="password"
            onChange={handleChange}
            value={state.oldPassword}
          />
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
          disabled={!validateForm}
          isLoading={state.isChanging}
        />
      </form>
    </div>
  );
};

export default ChangePassword;
