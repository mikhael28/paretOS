import { useTheme } from "@mui/material";
import { EventHandler, SyntheticEvent } from "react";
import { GrLogout } from "react-icons/gr";
import Palette from "../containers/Palette";
import LeftNav from "./LeftNav";
import ErrorBoundary from "./ErrorBoundary";
import Routes, { ChildProps } from "../Routes";
import MusicPlayer from "./MusicPlayer";
import BottomNav from "./BottomNav";
import { BrowserHistory } from "history";
import question from "../assets/help.png";

interface AuthenticatedLayoutProps {
  handleLogout: EventHandler<SyntheticEvent>;
  customHistory: BrowserHistory;
  childProps: ChildProps;
  setIsTourOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthenticatedLayout(props: AuthenticatedLayoutProps)
 {
  const { handleLogout, customHistory, childProps, setIsTourOpen } = props
  const { user, athletes } = childProps;
  const theme = useTheme();

  return (
    <>
      <Palette />
      <LogoutButton handleLogout={handleLogout} mode={theme.palette.mode} />
      <div className="root-padding">
        <LeftNav user={user} athletes={athletes} />
        <RoutesWithErrorBoundary customHistory={customHistory} childProps={childProps} />
      </div>
      <div className="sticky-nav">
        <TourButton setIsTourOpen={setIsTourOpen} />
        <MusicPlayer />
        <BottomNav user={user} />
      </div>
    </>
  )
}

function RoutesWithErrorBoundary({ customHistory, childProps }: { customHistory: BrowserHistory, childProps: ChildProps }) {
  return (
    <ErrorBoundary history={customHistory}>
      <Routes history={customHistory} childProps={childProps} />
    </ErrorBoundary>
  )
}

function TourButton({ setIsTourOpen }: { setIsTourOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div
      className="sticky-chat"
      role="button"
      onClick={(event) => {
        event.preventDefault();
        setIsTourOpen(true);
      }}
      onKeyDown={(event) => {
        event.preventDefault();
        setIsTourOpen(true);
      }}
      tabIndex={0}
    >
      <img
        src={question}
        alt="Home page tour icon"
        height="24"
        width="24"
        className="sticky-btn"
        style={{
          cursor: "pointer",
          filter: "grayscale(100%)",
          outline: "2px solid white",
          border: "2px solid transparent",
          borderRadius: "50%",
        }}
      />
    </div>
  )
}

function LogoutButton({ mode, handleLogout }: { mode: string, handleLogout: EventHandler<SyntheticEvent> }) {
  return (
    <div
      className="sticky-logout"
      role="button"
      style={{
        filter: mode === "dark" ? "invert()" : "",
      }}
      onClick={handleLogout}
      onKeyDown={handleLogout}
      tabIndex={0}
    >
      <GrLogout size={20} />
    </div>
  )
}