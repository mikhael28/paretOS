import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";
import { BrowserHistory } from "history";
import customHistory from "../utils/customHistory";

export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

interface Props extends BrowserRouterProps {
  history: BrowserHistory;
}
export const CustomRouter = ({ basename, history, children }: Props) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      navigator={customHistory}
      location={state.location}
      navigationType={state.action}
      children={children}
      basename={basename}
    />
  );
};
