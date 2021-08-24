import React from "react";
import Image from "react-bootstrap/lib/Image";
import { AiOutlineGithub } from "react-icons/ai";

/**
 *
 * This is a visual component, that displays an Athletes name, picture and link to GitHub.
 * @TODO review the UI - I have a feeling that it's a bit too basic, but it could be okay. The exp-card responsiveness class needs to be broken down a bit more.
 */

function Athlete(props) {
  return (
    <div
      className="exp-card"
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "flex-start",
      }}
      onClick={() => props.history.push(`/mentorship/${props.athlete.id}`)}
    >
      <Image
        src={
          props.athlete.picture ||
          "https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp"
        }
        height="50"
        width="50"
        circle
      />
      <div className="flex-down">
        <p>
          {props.athlete.fName} {props.athlete.lName}
        </p>
        <a
          href={`https://github.com/${props.athlete.github}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black", marginDown: 6 }}
        >
          <AiOutlineGithub /> {props.athlete.github}
        </a>
      </div>
    </div>
  );
}

export default Athlete;
