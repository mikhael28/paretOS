import { ComponentProps, FunctionComponent } from "react";
import { Route, Redirect } from "react-router-dom";

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

interface UnauthenticatedRouteProps {
  component: FunctionComponent;
  props: ComponentProps<any>;
}

export default ({ component: C, props: cProps, ...rest }: UnauthenticatedRouteProps) => {
  const redirect = querystring("redirect");
  return (
    <Route
      {...rest}
      render={(props) =>
        !cProps.isAuthenticated ? (
          <C {...props} {...cProps} />
        ) : (
          <Redirect
            to={redirect === "" || redirect === null ? "/" : redirect}
          />
        )
      }
    />
  );
};
