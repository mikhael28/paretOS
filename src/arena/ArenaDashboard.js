import React from "react";
import { bindActionCreators } from "redux";
import Button from "react-bootstrap/lib/Button";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getActiveSprintData } from "../state/sprints";
import { I18n } from "@aws-amplify/core";
import { BiRun } from "react-icons/bi";
import classNames from "classnames";
import API from "@aws-amplify/api";

/**
 * The Arena Dashboard shows you the sprints that you currently have, and let's you enter them by clicking/tapping.
 * @TODO Move the  'Create Template' and 'Start Sprint' into a different form. Buttons. In the desktop nav-bar? Mobile TBD?
 * @TODO Move the 'Delete Sprint' functionality into the admin repository.
 * @TODO Show the most recent sprint, and have a separate page/some other UI element to show the historical sprints. Perhaps we can show simplified analytics/statistics below the current sprint?
 * @TODO Remove the 'active'checking here, it's not necessary - we want people to review the sprints either way. Unless we want to add some UI element to demonstrate
 * @param {Object} props Includes the sprints object, from childProps.
 * @returns {JSX}
 */

function ArenaDashboard(props) {
  let newClassName = classNames("exp-card");
  return (
    <div style={{ marginTop: 20 }}>
      {props.reviewMode === true ? null : (
        <div className="flex-down">
          <div>
            {props.sprints.length === 0 ? (
              <div>
                <p>
                  Welcome - this is a competitive, single or multi-player
                  experience to help you sharpen your habits, work ethic and
                  daily routing towards optimization for peak performance.
                </p>
                <p>
                  Click the button below to start a new sprint. Offseason
                  Training v3 is recommended.
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex-between">
            <Button onClick={() => props.history.push("/arena/create/sprints")}>
              {I18n.get("startSprint")}
            </Button>
            <br />
            <Button
              onClick={() => props.history.push("/arena/create/template")}
            >
              Beta: Create Template
            </Button>
          </div>
        </div>
      )}
      <div className={classNames("sprints-top")}>
        <div className={classNames("sprints-container", "sprints-scroller")}>
          {props.sprints.length > 0 ? (
            <div className="exp-cards">
              {props.sprints.map((sprint, index) => {
                // likely need to do sprint calculations here, whether it's early or whatnot - not in the useEffect
                let tempStatus;
                let currentTS = Date.now();
                let newTS = new Date(sprint.startDate);
                let msDifferential = currentTS - newTS.getTime();

                if (msDifferential < 0) {
                  tempStatus = "early";
                } else if (msDifferential > 0 && msDifferential < 432000000) {
                  tempStatus = "active";
                } else if (msDifferential > 432000000) {
                  tempStatus = "inactive";
                }
                return (
                  <div
                    className={newClassName}
                    key={index}
                    style={{ cursor: "pointer", textAlign: "center" }}
                    onClick={() =>
                      props.history.push(`/arena/sprints/${sprint.id}`)
                    }
                  >
                    <div>
                      <h4 style={{ fontWeight: "bold" }}>Sprint {index + 1}</h4>

                      <p>
                        {I18n.get("starts")}:{" "}
                        {new Date(sprint.startDate).getUTCMonth() + 1}/
                        {new Date(sprint.startDate).getUTCDate()}/
                        {new Date(sprint.startDate).getUTCFullYear()}
                        <br />
                        {I18n.get("finishes")}:{" "}
                        {new Date(sprint.endDate).getUTCMonth() + 1}/
                        {new Date(sprint.endDate).getUTCDate()}/
                        {new Date(sprint.endDate).getUTCFullYear()}
                      </p>
                    </div>
                    <div>
                      {tempStatus === "active" || tempStatus === "inactive" ? (
                        <Link to={`/arena/sprints/${sprint.id}`}>
                          <BiRun /> {I18n.get("viewSprint")}
                        </Link>
                      ) : null}
                    </div>

                    {props.user.admin === true ? (
                      <button
                        onClick={async () => {
                          await API.del("pareto", `/sprints/${sprint.id}`);
                          await props.fetchMenteeSprints(props.user.id);
                        }}
                      >
                        {I18n.get("delete")}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    redux: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getActiveSprintData: (data) => getActiveSprintData(data),
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ArenaDashboard);
