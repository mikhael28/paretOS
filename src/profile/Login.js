import React, { Component } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { Link } from "react-router-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import logo from "../assets/Pareto_Lockup-01.png";

/**
 * Self explanatory what this component does.
 * @TODO GH Issue #12
 */

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.props.setLoading();

    this.setState({ isLoading: true });

    try {
      const user = await Auth.signIn(this.state.email, this.state.password);
      await this.props.initialFetch(user.username);
      this.props.userHasAuthenticated(true);
      this.props.setCloseLoading();
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
      this.props.setCloseLoading();
    }
  };

  render() {
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

        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>{I18n.get("email")}</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>{I18n.get("password")}</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Link to="/login/reset">{I18n.get("resetPassword")}</Link>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text={I18n.get("login")}
            loadingText={I18n.get("loggingIn")}
          />
        </form>
      </div>
    );
  }
}
