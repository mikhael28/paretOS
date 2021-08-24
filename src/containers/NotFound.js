import { I18n } from "@aws-amplify/core";
import React from "react";
import { Link } from "react-router-dom";

/**
 * NotFound component is just a 404 not found.
 * @TODO add a logo, joke - something to make this page pop.
 */

export default () => (
  <div className="NotFound">
    <h3>{I18n.get("pageNoExist")}</h3>
    <p>
      Click <Link to="/">here</Link> {I18n.get("returnToHome")}
    </p>
  </div>
);
