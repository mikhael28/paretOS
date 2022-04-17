import React, { useEffect, useState } from "react";
import { I18n } from "@aws-amplify/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import Image from "react-bootstrap/lib/Image";
import Tour from "reactour";
// import classNames from "classnames";
import { useTheme } from "@mui/material";
import Board from "../components/Board";
import TabPanel from "../components/TabPanel.js";
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

    try {
      await updateSprintData(props.redux.sprint[activeSprintId], props.ws);
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

    props.updatePlanningForms({
      activeSprintIndex,
      teamIndex,
      planningIndex,
      content,
    });

    try {
      await updateSprintData(props.redux.sprint[activeSprintId], props.ws);
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
          <ArenaDateHeader
            startDate={startDate}
            question={question}
            setIsTourOpen={setIsTourOpen}
          />

          <ArenaTabsHeader setValue={setKey} value={key} />

          <TabPanel value={key} index={0}>
            <ArenaDynamicForms
              index={index}
              activeSprintId={activeSprintId}
              plannings={
                props.redux.sprint[activeSprintId].teams[index].planning
              }
              dynamicForms={dynamicForms}
              handleDynamicForms={handleDynamicForms}
              savePlanning={savePlanning}
            />
          </TabPanel>

          <TabPanel value={key} index={1}>
            <>
              <section>
                <h5>{getFormattedDay(startDate)}</h5>
              </section>

              <ArenaStats
                activePerson={props.redux.sprint[activeSprintId].teams[index]}
                displayDay={displayDay}
              />

              <Missions
                headText="upcomingMission"
                missions={upcomingMissions}
                emptyMisionsMessage="You have completed all the available achievements for today."
                lengua={lengua}
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
                lengua={lengua}
                missionBtnText="seeTheProof"
                setActiveIndex={setActiveIndex}
                setActiveMission={setActiveMission}
                setView={setView}
                setShowProofModal={setShowProofModal}
              />

              <Details
                displayDay={displayDay}
                admin={props.user.admin}
                missions={
                  props.redux.sprint[activeSprintId].teams[index].missions
                }
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
