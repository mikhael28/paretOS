import React, { Component, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function withRouter(Component: any) {
  function ComponentWithRouter(props: any) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouter;
}

export default withRouter;
