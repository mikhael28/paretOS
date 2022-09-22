import { ComponentProps, FunctionComponent, LazyExoticComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom-v5-compat";

interface AuthenticatedRouteProps {
  children: any;
}

const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  const location = useLocation();
  const { props } = children;
  // console.log(props, "children", location);
  return props.isAuthenticated ? (
    children
  ) : (
    <Navigate to={`/login?redirect=${location.pathname}${location.search}`} />
  );
};

export default AuthenticatedRoute;
