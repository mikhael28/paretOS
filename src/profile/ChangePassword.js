import React, { useState } from "react";
import { useHistory } from "react-router";
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

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useHistory();

  const validateForm = () =>
    oldPassword.length > 0 &&
    password.length > 0 &&
    password === confirmPassword;

  const handleChangeClick = async (event) => {
    event.preventDefault();

    setIsChanging(true);

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(currentUser, oldPassword, password);
      history.push("/settings");
    } catch (e) {
      setIsChanging(false);
      alert(e);
    }
  };

  return (
    <div className="Form">
      <form onSubmit={handleChangeClick}>
        <FormGroup bsSize="large" controlId="oldPassword">
          <ControlLabel>{I18n.get("oldPassword")}</ControlLabel>
          <FormControl
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>{I18n.get("newPassword")}</ControlLabel>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <ControlLabel>{I18n.get("confirm")}</ControlLabel>
          <FormControl
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text={I18n.get("confirm")}
          loadingText={I18n.get("confirming")}
          disabled={!validateForm()}
          isLoading={isChanging}
        />
      </form>
    </div>
  );
}

export default ChangePassword;
