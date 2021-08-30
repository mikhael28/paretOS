import React, { Component } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";

/**
 * Change your password through Cognito
 * @TODO Issue #28
 */

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      oldPassword: "",
      isChanging: false,
      confirmPassword: "",
    };
  }

  validateForm() {
    return (
      this.state.oldPassword.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleChangeClick = async (event) => {
    event.preventDefault();

    this.setState({ isChanging: true });

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        this.state.oldPassword,
        this.state.password
      );
      this.props.history.push("/settings");
    } catch (e) {
      alert(e);
      this.setState({ isChanging: false });
    }
  };

  render() {
    return (
      <div className="Form">
        <form onSubmit={this.handleChangeClick}>
          <FormGroup bsSize="large" controlId="oldPassword">
            <ControlLabel>{I18n.get("oldPassword")}</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.oldPassword}
            />
          </FormGroup>
          <hr />
          <FormGroup bsSize="large" controlId="password">
            <ControlLabel>{I18n.get("newPassword")}</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup bsSize="large" controlId="confirmPassword">
            <ControlLabel>{I18n.get("confirm")}</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            text={I18n.get("confirm")}
            loadingText={I18n.get("confirming")}
            disabled={!this.validateForm()}
            isLoading={this.state.isChanging}
          />
        </form>
      </div>
    );
  }
}
