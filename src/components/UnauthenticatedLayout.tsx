import { BrowserHistory } from "history";
import Routes, { ChildProps } from "../Routes";

interface UnauthenticatedLayoutProps {
  childProps: ChildProps;
}

export default function UnauthenticatedLayout({ childProps }: UnauthenticatedLayoutProps) {
  return (
    <Routes childProps={childProps} history={{} as BrowserHistory} />
  )
}