import React, { useState } from "react";
import Image from "react-bootstrap/lib/Image";
import { I18n } from "@aws-amplify/core";
import ArenaDashboard from "./Sprints";
import Messaging from "../components/Messaging";
import Tour from "reactour";
import question from "../assets/help.png";
import logo from "../assets/Pareto_Lockup-01.png";

/**
 * The 'main dashboard' in the UI, that shows different things depending on what level of user you are.
 *
 */

<<<<<<< HEAD
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
              {props.sprints
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((sprint, index) => {
                  // debugger;
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
                        <h4 style={{ fontWeight: "bold" }}>
                          {index === 0
                            ? "Most Recent Sprint"
                            : "Sprint" + " " + (index + 1)}
                        </h4>

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
                        {tempStatus === "active" ||
                        tempStatus === "inactive" ? (
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
=======
const HomeDashboard = ({
  sprints,
  history,
  user,
  fetchMenteeSprints,
  messages,
  updateMessages,
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const steps = [
    {
      selector: ".first-step-home",
      content: `${I18n.get("homeFirst")}`,
    },
    {
      selector: ".second-step-home",
      content: `${I18n.get("homeSecond")}`,
    },
    // {
    // 	selector: '.third-step-home',
    // 	content: `${I18n.get('homeThird')}`
    // }
  ];
  return (
    <div className="flex-down">
      <div className="flex">
        <img
          src={logo}
          alt="Pareto"
          height="45"
          width="180"
          style={{ marginTop: 33 }}
        />

        <h1
          style={{
            marginLeft: 0,
            marginBottom: 0,
            marginTop: 33,
            fontSize: 40,
          }}
        >
          Arena
        </h1>
        <Image
          src={question}
          onClick={(event) => {
            event.preventDefault();
            setIsTourOpen(true);
          }}
          height="40"
          width="40"
          circle
          style={{
            cursor: "pointer",
            marginTop: 30,
            marginLeft: 6,
          }}
        />
      </div>
      <div className="row">
        <div className="col-xs-12 col-sm-5">
          <ArenaDashboard
            sprints={sprints}
            history={history}
            user={user}
            fetchMenteeSprints={fetchMenteeSprints}
          />
        </div>
        <div className="hidden-xs col-sm-7">
          <Messaging
            user={user}
            messages={messages}
            updateMessages={updateMessages}
            history={history}
          />
>>>>>>> 11d705a9491dd092530b4716195a229fd87cb93b
        </div>
      </div>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        // showCloseButton={true}
        // rewindOnClose={false}
      />
    </div>
  );
};

export default HomeDashboard;
