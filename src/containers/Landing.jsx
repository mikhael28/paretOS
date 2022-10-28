import { Link } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import { useTheme } from "@mui/material";
import logo from "../assets/Pareto_Lockup-White.png";
import { Canvas } from "@react-three/fiber";
import { ParticlesBG } from "./ParticlesBG";
import { OrbitControls } from "@react-three/drei";
// import { RouterHistory } from "@sentry/react/types/reactrouter";

/**
 * This is the Landing page component, that has the testimonials from members of our community.
 */

export default function Landing({ navigate }) {
  const theme = useTheme();



  return (
    <div>
      <Canvas
        style={{ height: "100vh" }}
        dpr={window.devicePixelRatio}
        camera={{ position: [100, 100, 100] }}
      >
        <ParticlesBG />
        <OrbitControls />
      </Canvas>

      <div style={{ height: "90vh" }} id="animation-container">
        <div id="overlay">
          <h2>Build the future</h2>
          <Link
            className="btn"
            to="/signup"
            style={{ marginTop: 18, marginRight: 18, }}
          >
            {I18n.get("signup")}
          </Link>
          <Link
            className="btn"
            to="/login"
            style={{ marginTop: 18, marginRight: 18 }}
          >
            {I18n.get("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
