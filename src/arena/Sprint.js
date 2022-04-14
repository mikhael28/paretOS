import React, { useEffect, useState } from "react";
import { I18n } from "@aws-amplify/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Button from "react-bootstrap/lib/Button";
import Image from "react-bootstrap/lib/Image";
import Tour from "reactour";
import classNames from "classnames";
import { AppBar, Tabs, Tab, Paper, useTheme } from "@mui/material";
import Board from "../components/Board";
import TabPanel from "../components/TabPanel.js";
import StatsBlock from "../components/StatsBlock";
import { errorToast } from "../libs/toasts";
import question from "../assets/question.svg";
import Analytics from "./Analytics";
import ArenaProofModal from "../components/ArenaProofModal";
import {
  completeSprintTask,
  getActiveSprintData,
  nextDay,
  updatePlanningForms,
} from "../state/sprints";
/**
 * This component handles the logic and UI of the Sprint functionality. It theoretically has multiplayer functionality, and keeps score between multiple competitors.
 * @TODO The indexing in multiplayer games seems to be off - investigate.
 * @TODO Add some sort of toast notification, indicating success/new state updates when sprint updates received.
 * @TODO Change the button UI color to something else, globally. Change wording on button text.
 * @TODO If the sprint is inactive, or pre-active, we need to set the Tab to the Planning or Leaderboard/Review tab - instead of just sending them to the Achievements tab each time.
 * @TODO Add some sort of icon set to each card.
 * @TODO Need to work on updating the language of the sprints to change immediately, when clicking on the text.
 * @TODO Can the 'My Stats' header by updated to look any better? Can the stats tabs look a bit sharper? What does NBA look like?
 * @returns
 */
function Sprint(props) {
  const theme = useTheme();
  const [status, setStatus] = useState("early");
  const [activeSprintId, setActiveSprintId] = useState(0);
  const [startDate, setStartDate] = useState(0);
  const [displayDay, setDisplayDay] = useState(0);
  const [activeMission, setActiveMission] = useState({
    title: "",
    description: "",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProofModal, setShowProofModal] = useState(false);
  const [lengua, setLengua] = useState("en");
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("submit");
  const [index, setIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [paginate, setPaginate] = useState(10);
  const [key, setKey] = useState(1);
  const [dynamicForms, setDynamicForms] = useState([]);

  function getFormattedDay() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const month = startDate.getMonth();
    const dayOfWeek = startDate.getDay();
    const date = startDate.getDate();
    return `${days[dayOfWeek]}, ${month + 1}/${date + 1}`;
  }

  function getDateRange() {
    const beginMonth = startDate.getMonth();
    const beginDate = startDate.getDate();
    const end = new Date(startDate);
    end.setDate(end.getDate() + 5);
    const endMonth = end.getMonth();
    const endDate = end.getDate();
    return `${beginMonth + 1}/${beginDate + 1} - ${endMonth + 1}/${
      endDate + 1
    }`;
  }

  function handleSelect(event, newValue) {
    setKey(newValue);
  }

  function handleDynamicForms(event) {
    let tempObj = { ...dynamicForms };

    for (const obj in tempObj) {
      if (tempObj[obj].code === event.target.id) {
        tempObj[obj].content = event.target.value;
      }
    }
    setDynamicForms(tempObj);
  }

  useEffect(() => {
    setDynamicForms(props.redux.sprint[activeSprintId].teams[index].planning);
  }, []);

  async function handleChange(mission, idx, day, key, activeSprintIndex) {
    setLoading(true);
    props.completeSprintTask({
      mission,
      idx,
      day,
      key,
      index,
      activeSprintIndex,
    });
    let updatedSprintData = `{"action":"sendmessage", "data":${JSON.stringify(
      props.redux.sprint[activeSprintId]
    )}, "sprintId": "${props.redux.sprint[activeSprintId].id}" }`;
    try {
      props.ws.send(updatedSprintData);
      setLoading(false);
    } catch (e) {
      errorToast(e);
      setLoading(false);
    }
  }

  async function savePlanning(
    activeSprintIndex,
    teamIndex,
    planningIndex,
    content
  ) {
    setLoading(true);

    props.updatePlanningForms({
      activeSprintIndex,
      teamIndex,
      planningIndex,
      content,
    });

    let updatedSprintData = `{"action":"sendmessage", "data":${JSON.stringify(
      props.redux.sprint[activeSprintId]
    )}, "sprintId": "${props.redux.sprint[activeSprintId].id}" }`;

    try {
      props.ws.send(updatedSprintData);
      setLoading(false);
    } catch (e) {
      alert(e);
    }
  }

  function closeModal() {
    setShowProofModal(false);
    setView("submit");
  }

  function closeTour() {
    setIsTourOpen(false);
  }

  useEffect(() => {
    async function fetchSprint() {
      let lengua;
      let str = I18n.get("close");
      if (str === "Close") {
        lengua = "en";
      } else {
        lengua = "es";
      }
      I18n.setLanguage(lengua);
      setLengua(lengua);
      try {
        let sprint = props.redux.sprint[activeSprintId];
        // let sprint = await API.get('pareto', `/sprints/${id}`);
        // props.getActiveSprintData(sprint[0]);
        let teamIndex;
        sprint.teams.map((team, i) => {
          if (team.id === props.user.id) {
            teamIndex = i;
          }
        });
        setIndex(teamIndex);
        let currentTS = Date.now();
        let newTS = new Date(sprint.startDate);
        setStartDate(newTS);
        let msDifferential = currentTS - newTS.getTime();
        // if ms < 0, then it is early
        // if ms > 0 && < 5 days * ms then its on time
        // if ms > 5 days then its archived and late
        // 86400000 ms in one day
        // 432000000 in 5 days
        if (msDifferential < 0) {
          setStatus("early");
        } else if (msDifferential > 0 && msDifferential < 432000000) {
          setStatus("active");
        } else if (msDifferential > 432000000) {
          setStatus("inactive");
        }

        let msDailyDifferential = Math.floor(msDifferential / 86400000);
        if (msDailyDifferential >= 0 && msDailyDifferential < 5) {
          setDisplayDay(msDailyDifferential);
        }
      } catch (e) {
        errorToast(e, props.user);
      }
      setLoadingPage(false);
    }
    let path = window.location.pathname.split("/");
    let sprintId = path[3];
    let activeSprintId;
    props.redux.sprint.map((spr, idx) => {
      if (spr.id === sprintId) {
        activeSprintId = idx;
      }
    });
    setActiveSprintId(activeSprintId);
    fetchSprint(sprintId);
  }, []);

  const steps = [
    {
      selector: ".first-step-arena",
      content: `${I18n.get("arenaFirst")}`,
    },
    {
      selector: ".second-step-arena",
      content: `${I18n.get("arenaSecond")}`,
    },
    {
      selector: ".third-step-arena",
      content: `${I18n.get("arenaThird")}`,
    },
  ];
  let flexCardClass = classNames("context-card", "block", "second-step-arena");

  let allMissions = [];
  let finishedMissions = []; // completed daily missions
  let upcomingMissions = []; // uncompleted daily missions

  // wait till the page is done loading
  if (loadingPage !== true) {
    allMissions =
      props.redux.sprint[activeSprintId].teams[index].missions[displayDay]
        .missions || []; // default to empty array

    [...allMissions].forEach((mission) =>
      mission.completed
        ? finishedMissions.push(mission)
        : upcomingMissions.push(mission)
    );
  }

  return (
    <div>
      {loadingPage === true ? (
        <div>{I18n.get("loading")}</div>
      ) : (
        <>
          <Paper sx={{ mt: -1 }} variant="filled" className="flex">
            <h1>
              <b>Sprint</b>&nbsp;&nbsp;{getDateRange()}
            </h1>
            <Image
              src={question}
              onClick={() => {
                setIsTourOpen(true);
              }}
              height={theme.spacing(2)}
              width={theme.spacing(2)}
              circle
              style={{
                opacity: 0.8,
                filter: theme.palette.mode === "dark" ? "invert()" : "",
                marginLeft: theme.spacing(1),
                marginBottom: theme.spacing(2),
                cursor: "pointer",
              }}
            />
          </Paper>

          <AppBar
            position="static"
            style={{
              boxShadow: "none",
              backgroundImage: "none",
              backgroundColor: "transparent",
            }}
          >
            <Tabs value={key} onChange={handleSelect} aria-label="sprint tabs">
              <Tab label="Plan" style={{ fontSize: 16, letterSpacing: 3 }} />
              <Tab label="Compete" style={{ fontSize: 16, letterSpacing: 3 }} />
              <Tab
                label="Leaderboard"
                style={{ fontSize: 16, letterSpacing: 3 }}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={key} index={0}>
            <>
              {props.redux.sprint[activeSprintId].teams[index].planning.map(
                (form, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="input-group" key={i}>
                    <h3>{form.name}</h3>
                    <div className="flex">
                      <textarea
                        id={form.code}
                        value={dynamicForms[i].content}
                        onChange={handleDynamicForms}
                        className="planning-forms"
                      />
                      <Button
                        onClick={() =>
                          savePlanning(
                            activeSprintId,
                            index,
                            i,
                            dynamicForms[i].content
                          )
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )
              )}
            </>
          </TabPanel>
          <TabPanel value={key} index={1}>
            <>
              <section>
                <h5>{getFormattedDay()}</h5>
              </section>
              <section>
                <h2>My Stats</h2>

                <div className="first-step-arena stats-container flex">
                  <StatsBlock
                    statName={I18n.get("dailyPoints")}
                    score={
                      props.redux.sprint[activeSprintId].teams[index].missions[
                        displayDay
                      ].dailyScore
                    }
                  />
                  <StatsBlock
                    statName={`${I18n.get("daily")} CP`}
                    score={`${props.redux.sprint[activeSprintId].teams[
                      index
                    ].missions[displayDay].dailyCompletion.toFixed(0)}%`}
                  />
                  <StatsBlock
                    statName={I18n.get("weeklyPoints")}
                    score={
                      props.redux.sprint[activeSprintId].teams[index].score
                    }
                  />
                  <StatsBlock
                    statName={`${I18n.get("weekly")} CP`}
                    score={`${props.redux.sprint[activeSprintId].teams[
                      index
                    ].percentage.toFixed(0)}%`}
                  />
                </div>
              </section>

              <section>
                <h2>{I18n.get("upcomingMission")}</h2>
                {upcomingMissions.length > 0 ? (
                  <ul className="context-cards">
                    {upcomingMissions.map((mission, i) => (
                      <li
                        className={flexCardClass}
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          {lengua !== "en" ? (
                            <>
                              <h3>{mission.esTitle}</h3>
                              <p>{mission.esDescription}</p>
                            </>
                          ) : (
                            <>
                              <h3>{mission.title}</h3>
                              <p>{mission.description}</p>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            setShowProofModal(true);
                            setActiveIndex(i);
                            setActiveMission(mission);
                          }}
                          disabled={status !== "active"}
                        >
                          {I18n.get("markAsComplete")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    You have completed all the available achievements for today.
                  </p>
                )}
              </section>

              <section>
                <h2 className="third-step-arena">
                  {I18n.get("finishedMissions")}
                </h2>
                {finishedMissions.length > 0 ? (
                  <ul className="context-cards">
                    {finishedMissions.map((mission, id) => (
                      <li
                        className={flexCardClass}
                        // eslint-disable-next-line react/no-array-index-key
                        key={id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          {lengua !== "en" ? (
                            <>
                              <h3>{mission.esTitle}</h3>
                              <p>{mission.esDescription}</p>
                            </>
                          ) : (
                            <>
                              <h3>{mission.title}</h3>
                              <p>{mission.description}</p>
                            </>
                          )}
                        </div>

                        <Button
                          onClick={() => {
                            setActiveIndex(id);
                            setActiveMission(mission);
                            setView("review");
                            setShowProofModal(true);
                          }}
                        >
                          {I18n.get("seeTheProof")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>You have not reported any achievements yet today.</p>
                )}
              </section>

              <details>
                <summary>Time Travel</summary>
                <div className="options">
                  <p>
                    <b>Currently Day {displayDay + 1}</b>
                  </p>
                  <p>
                    Click a button below to go back to a specific day and add an
                    update you forgot.
                  </p>

                  <div className="options-buttons">
                    {props.redux.sprint[activeSprintId].teams[
                      index
                    ].missions.map((mission, idx) => (
                      <Button
                        onClick={() => {
                          setDisplayDay(idx);
                        }}
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                      >
                        Day {idx + 1}
                      </Button>
                    ))}
                  </div>
                  <div className="flex">
                    {props.user.admin === true ? (
                      <div>
                        <p>Status: {status}</p>
                        <div className="flex-apart">
                          <Button onClick={() => setStatus("early")}>
                            Set to Early
                          </Button>
                          <Button onClick={() => setStatus("active")}>
                            Set to Active
                          </Button>
                          <Button onClick={() => setStatus("inactive")}>
                            Set to Inactive
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </details>
            </>
          </TabPanel>
          <TabPanel value={key} index={2}>
            <div className="row">
              <div className="col-xs-12 col-sm-7">
                <Board
                  users={props.redux.sprint[activeSprintId].teams}
                  itemsPerPage={paginate}
                  currentUser={props.user}
                  history={props.history}
                />
              </div>
              <div className="col-xs-12 col-sm-5" style={{ marginTop: "20px" }}>
                <Analytics
                  missions={
                    props.redux.sprint[activeSprintId].teams[index].missions
                  }
                />
              </div>
            </div>
          </TabPanel>

          <ArenaProofModal
            show={showProofModal}
            day={displayDay}
            activeMission={activeMission}
            activeIndex={activeIndex}
            handleChange={handleChange}
            handleClose={closeModal}
            sprint={props.redux.sprint[activeSprintId]}
            loading={loading}
            setLoading={setLoading}
            view={view}
            setView={setView}
            activeSprintId={activeSprintId}
            user={props.user}
          />
          <Tour steps={steps} isOpen={isTourOpen} onRequestClose={closeTour} />
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  redux: state,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      completeSprintTask: (task) => completeSprintTask(task),
      nextDay: () => nextDay(),
      getActiveSprintData: (data) => getActiveSprintData(data),
      updatePlanningForms: (data) => updatePlanningForms(data),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sprint);
