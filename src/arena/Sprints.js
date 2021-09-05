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
 * @TODO Issue #55
 * @TODO Issue #91
 * @param {Object} props Includes the sprints object, from childProps.
 * @returns {JSX}
 */

function Sprints(props) {
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
                  Click 'Start Sprint' in the side navigation bar to get
                  started. Offseason Training v3 is recommended.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div className={classNames("sprints-top")}>
        <div className={classNames("sprints-container", "sprints-scroller")}>
          {props.sprints.length > 0 ? (
            <div className="exp-cards">
              {props.sprints.map((sprint, index) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Sprints);
