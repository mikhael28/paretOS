import React, { useState } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";

/**
 * Change your password through Cognito
 * @TODO refactor into React Hooks
 */

const ChangePassword = (props) => {

  const [state, setstate] = useState({
    password: "",
    oldPassword: "",
    isChanging: false,
    confirmPassword: "",
  });

  const validateForm = () => {
    return (
      state.oldPassword.length > 0 &&
      state.password.length > 0 &&
      state.password === state.confirmPassword
    );
  };

  const handleChange = (event) => {
    setstate({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const handleChangeClick = async (event) => {
    event.preventDefault();
    setstate({
      ...state,
      isChanging: true
    });

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(currentUser,state.oldPassword,state.password);
      props.history.push("/settings");
    } 
    catch(e) {
      alert(e);
      setstate({
        ...state,
        isChanging : false
      });
    }
  };

  return(
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
          bsSize="large"
          text={I18n.get("confirm")}
          loadingText={I18n.get("confirming")}
          disabled={!validateForm}
          isLoading={state.isChanging}
        />
      </form>
    </div>
  );
}

export default ChangePassword;
