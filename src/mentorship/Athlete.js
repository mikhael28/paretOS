import Image from "react-bootstrap/lib/Image";

/**
 *
 * This is a visual component, that displays an Athletes name and picture in Mentorship Dashboard. Basic.
 *
 */

function Athlete(props) {
  return (
    <div
      className="exp-card"
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
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
      <p style={{ marginLeft: 10, fontSize: 24, marginTop: 8 }}>
        {props.athlete.fName} {props.athlete.lName}
      </p>
    </div>
  );
}

export default Athlete;
