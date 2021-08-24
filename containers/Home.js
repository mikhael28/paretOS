import React from "react";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

/**
 * Very simple component that loads either the landing page, or the main Dashboard depending on whether the user is logged in or not.
 */

export default function Home(props) {
  return (
    <React.Fragment>
      {props.isAuthenticated ? (
        <Dashboard {...props} />
      ) : (
        <Landing history={props.history} />
      )}
    </React.Fragment>
  );
}
