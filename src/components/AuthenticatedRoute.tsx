import { ComponentProps, FunctionComponent, LazyExoticComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface AuthenticatedRouteProps extends RouteProps {
  component: FunctionComponent | LazyExoticComponent<any>;
  props: ComponentProps<any>;
}

export default ({ component: C, props: cProps, ...rest }: AuthenticatedRouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      cProps.isAuthenticated ? (
        <C {...props} {...cProps} />
      ) : (
        <Redirect
          to={`/login?redirect=${props.location.pathname}${props.location.search}`}
        />
      )
    }
  />
);
