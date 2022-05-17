import { Route } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }: any) => (
  <Route {...rest} render={(props) => <C {...props} {...cProps} />} />
);
