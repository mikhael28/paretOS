import { ChangeEvent, SyntheticEvent, useCallback, useState, useContext } from "react";
import { I18n } from "@aws-amplify/core";
import { RouteComponentProps, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastMsgContext } from "../state/ToastContext";
import Tour from "reactour";
import Board from "../components/Board";
import TabPanel from "../components/TabPanel.js";
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
import { GenMission, ActivePersonMissionsOnDay } from "./types";
import { ReduxRootState } from "../state";
import { ActiveMission, User } from "../types";
import { store } from "..";

/**
 * This component handles the logic and UI of the Sprint functionality. It theoretically has multiplayer functionality, and keeps score between multiple competitors.
 * @TODO Add some sort of toast notification, indicating success/new state updates when sprint updates received.
 * @TODO If the sprint is inactive, or pre-active, we need to set the Tab to the Planning or Leaderboard/Review tab - instead of just sending them to the Achievements tab each time.
 * @TODO Add some sort of icon set to each card.
 * @returns {JSX}
 */
interface SprintProps extends RouteComponentProps {
  user: User;
}

function Sprint({ user, history }: SprintProps) {
  const sprints = useSelector((state: ReduxRootState) => state.sprint);
  const dispatch = useDispatch();
  // Identify the sprint index
  const location = useLocation();
  let path = location.pathname.split("/");
  let sprintId = path[3];
  const SPRINT_INDEX = sprints.findIndex((spr) => spr.id === sprintId);

  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);

  // Identify the language
  let str = I18n.get("close");
  const LENGUA = str === "Close" ? "en" : "es";
  I18n.setLanguage(LENGUA);

  // Identify the user's index in the team
  let sprint = sprints[SPRINT_INDEX];
  const TEAM_INDEX = sprint.teams.findIndex((team) => team.id === user.id);

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
  const [activeMission, setActiveMission] = useState({} as ActiveMission);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProofModal, setShowProofModal] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("submit");
  const [key, setKey] = useState(1);
  const [dynamicForms, setDynamicForms] = useState(
    sprints[SPRINT_INDEX].teams[TEAM_INDEX].planning
  );

  function handleDynamicForms(
    event: SyntheticEvent<HTMLInputElement, ChangeEvent>
  ) {
    let tempObj = { ...dynamicForms };

    for (const obj in tempObj) {
      let element = event.target as HTMLInputElement;
      if (tempObj[obj].code === element.id) {
        tempObj[obj].content = element.value;
      }
    }
    setDynamicForms(tempObj);
  }

  const handleChange = useCallback(
    async (
      mission: ActiveMission,
      idx: number,
      day: number,
      key: number | string
    ) => {
      setLoading(true);
      dispatch({
        type: "COMPLETE_SPRINT_TASK",
        payload: {
          mission,
          idx,
          day,
          key,
          index: TEAM_INDEX,
          activeSprintIndex: SPRINT_INDEX,
        },
      });
      const { sprint } = store.getState();
      try {
        await updateSprintData(sprint[SPRINT_INDEX], ws);
      } catch (error: any) {
        errorToast(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, SPRINT_INDEX, TEAM_INDEX]
  );

  const savePlanning = useCallback(
    async (
      activeSprintIndex: number,
      teamIndex: number,
      planningIndex: number,
      content: string
    ) => {
      setLoading(true);


      dispatch({
        type: "PLANNING_FORMS",
        payload: {
          activeSprintIndex,
          teamIndex,
          planningIndex,
          content,
        },
      });
      const { sprint } = store.getState();

      try {
        await updateSprintData(sprint[SPRINT_INDEX], ws);
      } catch (error) {
        errorToast(error as Error);
      } finally {
        setLoading(false);
      }

      /*   try {
        await updateSprintData(sprint[SPRINT_INDEX], ws);
        setLoading(false);
      } catch (error) {
        alert(error);
      } */
    },
    [dispatch, SPRINT_INDEX]
  );

  function closeModal() {
    setShowProofModal(false);
    setView("submit");
  }

  function closeTour() {
    setIsTourOpen(false);
  }

  let allMissions = [];
  let finishedMissions: [GenMission, number][] = []; // completed daily missions
  let upcomingMissions: [GenMission, number][] = []; // uncompleted daily missions

  allMissions =
    (
      sprints[SPRINT_INDEX].teams[TEAM_INDEX].missions[
        displayDay
      ] as ActivePersonMissionsOnDay
    ).missions || []; // default to empty array

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
              emptyMissionsMessage="You have completed all the available achievements for today."
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
              emptyMissionsMessage="You have not reported any achievements yet today."
              lengua={LENGUA}
              missionBtnText="seeTheProof"
              setActiveIndex={setActiveIndex}
              setActiveMission={setActiveMission}
              setView={setView}
              setShowProofModal={setShowProofModal}
            />

            <Details
              displayDay={displayDay}
              admin={user.admin}
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
                currentUser={user}
                history={history}
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
          user={user}
        />
        <Tour steps={steps} isOpen={isTourOpen} onRequestClose={closeTour} />
      </>
    </div>
  );
}

export default Sprint;
