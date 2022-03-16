import React, { useEffect, useState } from "react";
import { I18n } from "@aws-amplify/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Button from "react-bootstrap/lib/Button";
import Image from "react-bootstrap/lib/Image";
import Tour from "reactour";
import classNames from "classnames";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { AppBar, Tabs, Tab } from "@mui/material";
import Board from "../components/Board";
import TabPanel from "../components/TabPanel.js";
import { errorToast } from "../libs/toasts";
import question from "../assets/help.png";
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
  const [status, setStatus] = useState("early");
  const [activeSprintId, setActiveSprintId] = useState(0);
  const [day, setDay] = useState(0);
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
        let tempStatus;
        let currentTS = Date.now();
        let newTS = new Date(sprint.startDate);
        let msDifferential = currentTS - newTS.getTime();
        // if ms < 0, then it is early
        // if ms > 0 && < 5 days * ms then its on time
        // if ms > 5 days then its archived and late
        // 86400000 ms in one day
        // 432000000 in 5 days
        if (msDifferential < 0) {
          tempStatus = "early";
          setStatus("early");
        } else if (msDifferential > 0 && msDifferential < 432000000) {
          tempStatus = "active";
          setStatus("active");
        } else if (msDifferential > 432000000) {
          tempStatus = "inactive";
          setStatus("inactive");
        }

        let msDailyDifferential = Math.floor(msDifferential / 86400000);
        if (tempStatus === "active" && msDailyDifferential === 0) {
          setDay(0);
        } else if (tempStatus === "active" && msDailyDifferential === 1) {
          setDay(1);
        } else if (tempStatus === "active" && msDailyDifferential === 2) {
          setDay(2);
        } else if (tempStatus === "active" && msDailyDifferential === 3) {
          setDay(3);
        } else if (tempStatus === "active" && msDailyDifferential === 4) {
          setDay(4);
        } else if (tempStatus === "active" && msDailyDifferential === 5) {
          setDay(5);
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

  return (
    <div>
      {loadingPage === true ? (
        <div>{I18n.get("loading")}</div>
      ) : (
        <>
          <div className="flex">
            <h1>Pareto Arena </h1>
            <Image
              src={question}
              onClick={() => {
                setIsTourOpen(true);
              }}
              height="40"
              width="40"
              circle
              style={{ marginLeft: 4, marginTop: 34, cursor: "pointer" }}
            />
          </div>

          <AppBar
            position="static"
            style={{ backgroundColor: "white", color: "black" }}
          >
            <Tabs value={key} onChange={handleSelect} aria-label="sprint tabs">
              <Tab label="Plan" style={{ fontSize: 18 }} />
              <Tab label="Compete" style={{ fontSize: 18 }} />
              <Tab label="Leaderboard" style={{ fontSize: 18 }} />
            </Tabs>
          </AppBar>
          <TabPanel value={key} index={0} style={{ margin: -30 }}>
            <>
              {props.redux.sprint[activeSprintId].teams[index].planning.map(
                (form, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={i}>
                    <h3>{form.name}</h3>
                    <div className="flex">
                      <textarea
                        id={form.code}
                        value={dynamicForms[i].content}
                        onChange={handleDynamicForms}
                        className="planning-forms"
                      />
                      <button
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
                      </button>
                    </div>
                  </div>
                )
              )}
            </>
          </TabPanel>
          <TabPanel value={key} index={1} style={{ margin: -30 }}>
            <>
              <div>
                <h2>My Stats</h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: 16,
                    flexWrap: "wrap",
                  }}
                  className="first-step-arena"
                >
                  <div className="block">
                    <p>
                      {
                        props.redux.sprint[activeSprintId].teams[index]
                          .missions[day].dailyScore
                      }{" "}
                      {I18n.get("dailyPoints")}
                    </p>
                  </div>
                  <div className="block">
                    <p>
                      {props.redux.sprint[activeSprintId].teams[index].missions[
                        day
                      ].dailyCompletion.toFixed(2)}
                      % {I18n.get("daily")} CP
                    </p>
                  </div>

                  <div className="block">
                    <p>
                      {props.redux.sprint[activeSprintId].teams[index].score}{" "}
                      {I18n.get("weeklyPoints")}{" "}
                    </p>
                  </div>

                  <div className="block">
                    <p>
                      {
                        props.redux.sprint[activeSprintId].teams[index]
                          .percentage
                      }
                      % {I18n.get("weekly")} CP
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2>{I18n.get("upcomingMission")}</h2>
                  <section className="context-cards">
                    {props.redux.sprint[activeSprintId].teams[index].missions[
                      day
                    ].missions.map((mission, i) => {
                      if (mission.completed === false) {
                        return (
                          <div
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
                          </div>
                        );
                      }
                    })}
                  </section>
                </div>

                <div>
                  <h2 className="third-step-arena">
                    {I18n.get("finishedMissions")}
                  </h2>
                  <section className="context-cards">
                    {props.redux.sprint[activeSprintId].teams[index].missions[
                      day
                    ].missions.map((mission, id) => {
                      if (mission.completed === true) {
                        return (
                          <div
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
                          </div>
                        );
                      }
                    })}
                  </section>{" "}
                </div>
              </div>
              <Accordion allowMultipleExpanded allowZeroExpanded>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton>Time Travel</AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div>
                      <p>Currently Day {day + 1}</p>
                      <p>
                        Click a button below to go back to a specific day and
                        add an update you forgot.
                      </p>

                      <div className="flex">
                        {props.redux.sprint[activeSprintId].teams[
                          index
                        ].missions.map((mission, idx) => (
                          <Button
                            onClick={() => {
                              setDay(idx);
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
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
            </>
          </TabPanel>
          <TabPanel value={key} index={2} style={{ margin: -30 }}>
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
            day={day}
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
