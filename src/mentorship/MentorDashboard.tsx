import { useSelector, useDispatch } from "react-redux";
import { I18n } from "@aws-amplify/core";
import Athlete from "./Athlete";
import { useNavigate } from "react-router-dom";

/**
 * The 'dashboard' where a mentor can see a list of their mentees, and where in the future they can see a backlog of tasks.
 */

function MentorDashboard(props: any) {
  // redux and dispatch replace the old connect/bind functions
  const redux = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Coaching Dashboard</h1>
      {props.athletes.length > 0 ? (
        <>
          <h2>{I18n.get("myMentees")}</h2>
          <div className="exp-cards" style={{ justifyContent: "start" }}>
            {props.athletes.map((athlete: any) => (
              <Athlete
                athlete={athlete.mentee}
                key={athlete._id}
                history={navigate}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <h2>{I18n.get("myMentees")}</h2>
          <p>You don't currently have any mentees.</p>
        </div>
      )}
    </div>
  );
}

export default MentorDashboard;
