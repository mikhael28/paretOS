import { ComponentPropsWithoutRef } from "react";
import { useSelector } from "react-redux";
import { I18n } from "@aws-amplify/core";
import classNames from "classnames";
import { RestAPI } from "@aws-amplify/api-rest";
import { selectSortedSprints } from "../selectors/select-sorted-sprints";
import { useNavigate } from "react-router-dom";

/**
 * The Arena Dashboard shows you the sprints that you currently have, and let's you enter them by clicking/tapping.
 * @param {Object} props Includes the sprints object, from childProps.
 * @returns {JSX}
 */
interface SprintProps extends ComponentPropsWithoutRef<any> {
  reviewMode: boolean;
}

function Sprints(props: SprintProps) {
  let newClassName = classNames("exp-card");
  const sprints = useSelector(selectSortedSprints);
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: 20 }}>
      {props.reviewMode === true ? null : (
        <div className="flex-down">
          <div>
            {sprints?.length === 0 ? (
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
          {sprints?.length > 0 ? (
            <div className="exp-cards">
              {sprints.map((sprint, index) => (
                <div
                  className={newClassName}
                  key={sprint.id}
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  <div onClick={() => navigate(`/arena/sprints/${sprint.id}`)}>
                    <h3 style={{ fontWeight: "bold" }}>
                      {index === 0
                        ? "Most Recent Sprint"
                        : `Sprint ${sprints.length - index}`}
                    </h3>

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

                  {props.user.admin === true || sprint.teams.length === 1 ? (
                    <button
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        backgroundColor: "black",
                      }}
                      onClick={async () => {
                        try {
                          let response = await RestAPI.del(
                            "pareto",
                            `/sprints/${sprint.id}`,
                            {}
                          );
                          if (response) {
                            alert("Succesfully deleted.");
                            window.location.reload();
                          }
                        } catch (e) {
                          alert(e);
                        }
                        // TODO this is broken, fix this at some point
                        // await props.fetchMenteeSprints(props.user.id);
                      }}
                    >
                      {I18n.get("delete")}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Sprints;
