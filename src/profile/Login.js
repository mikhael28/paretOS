import React, { useState } from "react";
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

const Login = ({
  initialFetch,
  setCloseLoading,
  setLoading,
  userHasAuthenticated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    return values.email.length > 0 && values.password.length > 0;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.id]: [event.target.value] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading();

    setIsLoading(true);

    try {
      const user = await Auth.signIn(values.email, values.password);
      await initialFetch(user.username);
      userHasAuthenticated(true);
      setCloseLoading();
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
      setCloseLoading();
    }
  };

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

      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>{I18n.get("email")}</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>{I18n.get("password")}</ControlLabel>
          <FormControl
            value={values.password}
            onChange={handleChange}
            type="password"
          />
        </FormGroup>
        <Link to="/login/reset">{I18n.get("resetPassword")}</Link>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text={I18n.get("login")}
          loadingText={I18n.get("loggingIn")}
        />
      </form>
    </div>
  );
};

export default Login;
