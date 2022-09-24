import React, { Component, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function withRouter(Component: any) {
  return (props: JSX.IntrinsicAttributes) => (
    <Component {...props} navigate={useNavigate()} location={useLocation()} />
  );
}

export default withRouter;
