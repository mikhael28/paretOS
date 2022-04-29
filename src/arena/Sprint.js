import { useState } from "react";
import { I18n } from "@aws-amplify/core";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Tour from "reactour";
import Board from "../components/Board";
import TabPanel from "../components/TabPanel.js";
import { errorToast } from "../libs/toasts";
import ws from "../libs/websocket";
import question from "../assets/question.svg";
import Analytics from "./Analytics";
import ArenaProofModal from "../components/ArenaProofModal";
import { steps, updateSprintData } from "./utils";
import Missions from "./Missions/Index";
import getFormattedDay from "../utils/getFormattedDay";
import ArenaTabsHeader from "./ArenaTabsHeadr";
import Details from "./Details";
import ArenaStats from "./ArenaStats";
import ArenaDateHeader from "./ArenaDateHeader";
import ArenaDynamicForms from "./ArenaDynamicForms";
/**
 * This component handles the logic and UI of the Sprint functionality. It theoretically has multiplayer functionality, and keeps score between multiple competitors.
 * @TODO Add some sort of toast notification, indicating success/new state updates when sprint updates received.
 * @TODO If the sprint is inactive, or pre-active, we need to set the Tab to the Planning or Leaderboard/Review tab - instead of just sending them to the Achievements tab each time.
 * @TODO Add some sort of icon set to each card.
 * @returns {JSX}
 */

function Sprint(props) {
  const sprints = useSelector((state) => state.sprint);
  const dispatch = useDispatch();
  // Identify the sprint index
  const location = useLocation();
  let path = location.pathname.split("/");
  let sprintId = path[3];
  const SPRINT_INDEX = sprints.findIndex((spr) => spr.id === sprintId);

  // Identify the language
  let str = I18n.get("close");
  const LENGUA = str === "Close" ? "en" : "es";
  I18n.setLanguage(LENGUA);

  // Identify the user's index in the team
  let sprint = sprints[SPRINT_INDEX];
  const TEAM_INDEX = sprint.teams.findIndex(
    (team) => team.id === props.user.id
  );

  // Identify the start date of the sprint
  let currentTS = Date.now();
  let newTS = new Date(sprint.startDate);
  const START_DATE = newTS;

  let initialStatus;
  let msDifferential = currentTS - newTS.getTime();
  // if ms < 0, then it is early
  // if ms > 0 && < 5 days * ms then its on time
  // if ms > 5 days then its archived and late
  // 86400000 ms in one day
  // 432000000 in 5 days
  if (msDifferential < 0) {
    initialStatus = "early";
  } else if (msDifferential > 0 && msDifferential < 432000000) {
    initialStatus = "active";
  } else if (msDifferential > 432000000) {
    initialStatus = "inactive";
  }

  let msDailyDifferential = Math.floor(msDifferential / 86400000);
  let initialDisplayDay = 0;
  if (msDailyDifferential > 0 && msDailyDifferential < 5) {
    initialDisplayDay = msDailyDifferential;
  }
  if (msDailyDifferential >= 5) initialDisplayDay = 4;

  const [status, setStatus] = useState(initialStatus);
  const [displayDay, setDisplayDay] = useState(initialDisplayDay);
  const [activeMission, setActiveMission] = useState({
    title: "",
    description: "",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProofModal, setShowProofModal] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("submit");
  const [key, setKey] = useState(1);
  const [dynamicForms, setDynamicForms] = useState(
    sprints[SPRINT_INDEX].teams[TEAM_INDEX].planning
  );

  function handleDynamicForms(event) {
    let tempObj = { ...dynamicForms };

    for (const obj in tempObj) {
      if (tempObj[obj].code === event.target.id) {
        tempObj[obj].content = event.target.value;
      }
    }
    setDynamicForms(tempObj);
  }

  async function handleChange(mission, idx, day, key) {
    setLoading(true);
    dispatch({
      task: "COMPLETE_SPRINT_TASK",
      payload: {
        mission,
        idx,
        day,
        key,
        index: TEAM_INDEX,
        activeSprintIndex: SPRINT_INDEX,
      },
    });

    try {
      await updateSprintData(sprints[SPRINT_INDEX], ws);
    } catch (error) {
      errorToast(error);
    } finally {
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

    dispatch({
      task: "PLANNING_FORMS",
      payload: {
        activeSprintIndex,
        teamIndex,
        planningIndex,
        content,
      },
    });

    try {
      await updateSprintData(sprints[SPRINT_INDEX], ws);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  }

  function closeModal() {
    setShowProofModal(false);
    setView("submit");
  }

  function closeTour() {
    setIsTourOpen(false);
  }

  let allMissions = [];
  let finishedMissions = []; // completed daily missions
  let upcomingMissions = []; // uncompleted daily missions

  allMissions =
    sprints[SPRINT_INDEX].teams[TEAM_INDEX].missions[displayDay].missions || []; // default to empty array

  [...allMissions].forEach((mission, i) =>
    mission.completed
      ? finishedMissions.push([mission, i])
      : upcomingMissions.push([mission, i])
  );

  return (
    <div>
      <>
        <ArenaDateHeader
          startDate={START_DATE}
          question={question}
          setIsTourOpen={setIsTourOpen}
        />

        <ArenaTabsHeader setValue={setKey} value={key} />

        <TabPanel value={key} index={0}>
          <ArenaDynamicForms
            index={TEAM_INDEX}
            activeSprintId={SPRINT_INDEX}
            plannings={sprints[SPRINT_INDEX].teams[TEAM_INDEX].planning}
            dynamicForms={dynamicForms}
            handleDynamicForms={handleDynamicForms}
            savePlanning={savePlanning}
          />
        </TabPanel>

        <TabPanel value={key} index={1}>
          <>
            <section>
              <h5>{getFormattedDay(START_DATE, displayDay)}</h5>
            </section>

            <ArenaStats
              activePerson={sprints[SPRINT_INDEX].teams[TEAM_INDEX]}
              displayDay={displayDay}
            />

            <Missions
              headText="upcomingMission"
              missions={upcomingMissions}
              emptyMisionsMessage="You have completed all the available achievements for today."
              lengua={LENGUA}
              missionBtnText="markAsComplete"
              setShowProofModal={setShowProofModal}
              setActiveIndex={setActiveIndex}
              setActiveMission={setActiveMission}
            />

            <Missions
              headClassName="third-step-arena"
              headText="finishedMissions"
              missions={finishedMissions}
              emptyMisionsMessage="You have not reported any achievements yet today."
              lengua={LENGUA}
              missionBtnText="seeTheProof"
              setActiveIndex={setActiveIndex}
              setActiveMission={setActiveMission}
              setView={setView}
              setShowProofModal={setShowProofModal}
            />

            <Details
              displayDay={displayDay}
              admin={props.user.admin}
              missions={sprints[SPRINT_INDEX].teams[TEAM_INDEX].missions}
              setDisplayDay={setDisplayDay}
              setStatus={setStatus}
              status={status}
            />
          </>
        </TabPanel>

        <TabPanel value={key} index={2}>
          <div className="row">
            <div className="col-xs-12 col-sm-7">
              <Board
                users={sprints[SPRINT_INDEX].teams}
                itemsPerPage={10}
                currentUser={props.user}
                history={props.history}
              />
            </div>
            <div className="col-xs-12 col-sm-5" style={{ marginTop: "20px" }}>
              <Analytics
                missions={sprints[SPRINT_INDEX].teams[TEAM_INDEX].missions}
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
          sprint={sprints[SPRINT_INDEX]}
          view={view}
          user={props.user}
        />
        <Tour steps={steps} isOpen={isTourOpen} onRequestClose={closeTour} />
      </>
    </div>
  );
}

export default Sprint;
