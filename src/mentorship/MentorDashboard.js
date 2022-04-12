import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { I18n } from "@aws-amplify/core";
import { getUser } from "../state/profile";
import Athlete from "./Athlete";

/**
 * A simple, redux connected Sandbox for you play around with. Don't send a PR to update this file, it is perfect the way it is. Unless, you think we can improve it from a staging perspective - in that case, send it in.
 */

function MentorDashboard(props) {
  return (
    <div>
      <h1>Mentorship Dashboard</h1>
      <p>
        This is a work in progress. Our immediate backlog consists of a queue of
        mentorship tasks for you to review, specifically review of completed
        curriculum by your mentees.
      </p>
      {props.athletes.length > 0 ? (
        <>
          <h2>{I18n.get("myMentees")}</h2>
          <div className="exp-cards" style={{ justifyContent: "start" }}>
            {props.athletes.map((athlete) => (
              <Athlete
                athlete={athlete.mentee}
                key={athlete._id}
                history={props.history}
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

const mapStateToProps = (state) => ({
  redux: state.redux,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getUser: () => getUser(),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MentorDashboard);
