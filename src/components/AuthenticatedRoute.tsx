import { ComponentProps, FunctionComponent } from "react";
import { Route, Redirect } from "react-router-dom";

interface AuthenticatedRouteProps {
  component: FunctionComponent;
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
