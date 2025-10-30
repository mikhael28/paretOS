import { ComponentProps, FunctionComponent, LazyExoticComponent } from "react";
import { Navigate, useLocation } from "react-router-dom";
interface AuthenticatedRouteProps {
  children: any;
}

const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  // Always return children for demo mode - no authentication required
  return children;
  
  // Original authentication logic commented out:
  // const location = useLocation();
  // const { props } = children;
  // return props.isAuthenticated ? (
  //   children
  // ) : (
  //   <Navigate to={`/login?redirect=${location.pathname}${location.search}`} />
  // );
};

export default AuthenticatedRoute;
