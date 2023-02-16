import { Link } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ParticlesBG } from "./ParticlesBG";

/**
 * This is the Landing page component, that has the testimonials from members of our community.
 */

export default function Landing() {

  return (
    <div>
      <Canvas
          id="landing-page-canvas"
          dpr={window.devicePixelRatio}
          camera={{ position: [100, 100, 100] }}
      >
          <ParticlesBG />
          <OrbitControls />
        </Canvas>
      <AnimationOverlay />
    </div>
  );
}

function AnimationOverlay() {
  return (
    <div style={{ height: "90vh" }} id="animation-container">
      <div id="overlay">
        <h2>Build the future</h2>
        <LandingPageButton location="/signup" text="signup" />
        <LandingPageButton location="/login" text="login" />
      </div>
    </div>
  );
}

function LandingPageButton({ location, text }: { location: string, text: string}) {
  return (
    <Link to={location}>
      <div className="btn" style={{ marginTop: 18, marginRight: 18 }}>
        {I18n.get(text)}
      </div>
    </Link>
  )
}