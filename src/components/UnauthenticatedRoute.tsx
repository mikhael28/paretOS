import { FunctionComponent, LazyExoticComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { Navigate } from "react-router-dom-v5-compat";
import { ChildProps } from "../Routes";

function querystring(name: string, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

interface UnauthenticatedRouteProps extends RouteProps {
  props: ChildProps;
  children: any;
}

const UnauthenticatedRoute = ({ children }:UnauthenticatedRouteProps) => {
  const redirect = querystring("redirect");
  const { props } = children;
  return (
    !props.isAuthenticated ?
      children : (
        <Navigate
          to={redirect === "" || redirect === null ? "/" : redirect}
        />
      )
  )

}

export default UnauthenticatedRoute;