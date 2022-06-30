import { Link } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
import logo from "../assets/Pareto_Lockup-White.png";
import ParticleField from "react-particles-webgl";

/**
 * This is the Landing page component, that has the testimonials from members of our community.
 */

export default function Landing() {
  const theme = useTheme();

  const config = {
		showCube: false,
		dimension: '3D',
		velocity: 1,
		boundaryType: 'bounce',
		antialias: false,
		direction: {
		  xMin: 0.2,
		  xMax: 1,
		  yMin: 0,
		  yMax: 1,
		  zMin: -1,
		  zMax: 1
		},
		lines: {
		  colorMode: 'solid',
		  color: '#d7ddc8',
		  transparency: 0.5,
		  limitConnections: true,
		  maxConnections: 20,
		  minDistance: 150,
		  visible: true
		},
		particles: {
		  colorMode: 'solid',
		  color: '#7b1fce',
		  transparency: 0.9,
		  shape: 'circle',
		  boundingBox: 'canvas',
		  count: 500,
		  minSize: 10,
		  maxSize: 75,
		  visible: false
		},
		cameraControls: {
		  enabled: true,
		  enableDamping: true,
		  dampingFactor: 0.2,
		  enableZoom: true,
		  autoRotate: true,
		  autoRotateSpeed: 0,
		  resetCameraFlag: false
		}
	  }

  return (
    <div>
      <div className="landing-page-nav" style={{ alignItems: "center", height: '10vh' }}>
        <img
          src={logo}
          alt="Pareto"
          height="40"
          width="178"
          style={{ marginTop: 10, marginLeft: 12 }}
        />
        <div>
          <Link
            to="/signup"
            style={{ color: "white", marginTop: 18, marginRight: 18 }}
          >
            {I18n.get("signup")}
          </Link>
          <Link
            to="/login"
            style={{ color: "white", marginTop: 18, marginRight: 18 }}
          >
            {I18n.get("login")}
          </Link>
        </div>
      </div>
	  <div style={{height: '90vh'}} id="animation-container" >

      <ParticleField config={config} />
	  <div id="overlay"> 
	  <h2>Build the future</h2>
	  <Link
	  className="btn"
            to="/signup"
            style={{ color: "white", marginTop: 18, marginRight: 18 }}
          >
            {I18n.get("signup")}
          </Link>
          <Link
		  className="btn"
            to="/login"
            style={{ color: "white", marginTop: 18, marginRight: 18 }}
          >
            {I18n.get("login")}
          </Link>
	</div>
	  </div>
    </div>
  );
}
