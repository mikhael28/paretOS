import Dashboard from "../arena/ArenaDashboard";
import Landing from "./Landing";
import { useNavigate } from "react-router-dom";
/**
 * Very simple component that loads either the landing page, or the main Dashboard depending on whether the user is logged in or not.
 */

export default function Home(props: any) {
  let navigate = useNavigate();
  return (
    <>
      {props.isAuthenticated ? (
        <Dashboard {...props} />
      ) : (
        <Landing navigate={navigate} />
      )}
    </>
  );
}
