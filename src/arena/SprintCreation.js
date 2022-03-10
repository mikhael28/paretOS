import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import LoaderButton from "../components/LoaderButton";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Calendar from "react-calendar";
import { getActiveSprintData } from "../state/sprints";
import cloneDeep from "lodash.clonedeep";
import "react-calendar/dist/Calendar.css";
import { errorToast, successToast } from "../libs/toasts";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Button from "react-bootstrap/lib/Button";
/**
 * This is the component where a user creates a new sprint, and selects which players are competing.
 * @TODO Re-integrate 'validateForm' functtion, to prevent people from selecting days in the past. Rethink what other purposes this could have.
 */
function SprintCreation(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [missions, setMissions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [chosenMissions, setChosenMissions] = useState(null);
  const [chosenPlayers, setChosenPlayers] = useState([]);

  useEffect(() => {
    getConfiguration();
  }, []);

  async function getConfiguration() {
    setLoading(true);
    let options = await API.get("pareto", "/templates");
    let userOptions = await API.get("pareto", "/users");
    setMissions(options);
    setPlayers(userOptions.filter((e) => e.id !== props.profile.id));
    setLoading(false);
  }

  async function createSprint() {
    setLoading(true);
    let dbMission;
    let databasedMissions = [];
    chosenMissions.missions.forEach((element) => {
      dbMission = {
        ...element,
        questions: [],
        key: "",
        img: "",
        completedAt: Date.now(),
        proof: [],
        confirmed: false,
        completed: false,
        description: element.summary,
        esDescription: element.esSummary,
        xp: element.xp,
        title: element.title,
        esTitle: element.esTitle,
      };
      databasedMissions.push(dbMission);
    });
    let finalDBMission = {
      dailyScore: 0,
      dailyCompletion: 0,
      missions: databasedMissions,
    };
    let databasedTeams = [];
    let dbTeam;
    let chosenCompetitors = chosenPlayers.slice();
    chosenCompetitors.push(props.profile);
    chosenCompetitors.forEach((el) => {
      dbTeam = {
        fName: el.fName,
        lName: el.lName,
        email: el.email,
        phone: el.phone,
        github: el.github,
        id: el.id,
        score: 0,
        percentage: 0,
        planning: [
          {
            name: "Personal",
            code: "personal",
            content: "",
          },
          {
            name: "Professional",
            code: "professional",
            content: "",
          },
          {
            name: "Health & Fitness",
            code: "health",
            content: "",
          },
          {
            name: "Relationship",
            code: "relationship",
            content: "",
          },
          {
            name: "Financial",
            code: "financial",
            content: "",
          },
          {
            name: "Mental",
            code: "mental",
            content: "",
          },
          {
            name: "Social",
            code: "social",
            content: "",
          },
        ],
        review: [
          {
            name: "Personal",
            code: "personal",
            content: "",
          },
          {
            name: "Professional",
            code: "professional",
            content: "",
          },
          {
            name: "Health & Fitness",
            code: "health",
            content: "",
          },
          {
            name: "Relationship",
            code: "relationship",
            content: "",
          },
          {
            name: "Financial",
            code: "financial",
            content: "",
          },
          {
            name: "Mental",
            code: "mental",
            content: "",
          },
          {
            name: "Social",
            code: "social",
            content: "",
          },
        ],
        missions: [
          cloneDeep(finalDBMission),
          cloneDeep(finalDBMission),
          cloneDeep(finalDBMission),
          cloneDeep(finalDBMission),
          cloneDeep(finalDBMission),
        ],
      };
    
      databasedTeams.push(dbTeam);
    });
    let body = {
      id: uuidv4(),
      athleteId: props.user.id,
      coachId: props.user.mentor,
      // hopefully the Date type doesn't give us problems, could be a place to debug
      startDate: startDate,
      endDate: new Date(Date.now(startDate) + 432000000),
      events: [],
      studySessions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      started: true,
      teams: databasedTeams,
    };
    try {
      await API.post("pareto", "/sprints", { body });
      await props.connectSocket();
      successToast("Sprint created successfully.");
      props.history.push("/");
    } catch (e) {
      errorToast(e);
      setLoading(false);
    }
    setLoading(false);
  }
  function validateForm() {
    let result;
    console.log(Date.now(startDate) - 5000 < Date.now(new Date()) + 4000000);
    if (Date.now(startDate) - 5000 < Date.now(new Date())) {
      result = true;
    } else {
      result = false;
    }
    console.log(result);
    return result;
  }
  function renderMissionOptions(missions) {
    return missions.map((mission, i) => {
      return (
        <option key={i} data-value={JSON.stringify(mission)}>
          {mission.title}
        </option>
      );
    });
  }
  function renderPlayerOptions(data) {
    return data.map((playr, index) => {
      return (
        <option key={index} data-value={JSON.stringify(playr)}>
          {playr.fName} {playr.lName}
        </option>
      );
    });
  }

  function handleChange(value, input) {
    let parsedJSON = JSON.parse(value);
    setChosenMissions(parsedJSON);
  }

  function onInput(e) {
    if (e.target.nextSibling.id === "players-datalist") {
      var input = document.getElementById("players-input");
      var opts = document.getElementById(e.target.nextSibling.id).childNodes;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === input.value) {
          // An item was selected from the list!
          // yourCallbackHere()
          handlePlayrChange(opts[i].dataset.value, input);
          break;
        }
      }
    } else if (e.target.nextSibling.id === "sprint-options") {
      var input = document.getElementById("sprints-input");
      var opts = document.getElementById(e.target.nextSibling.id).childNodes;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === input.value) {
          // An item was selected from the list!
          // yourCallbackHere()
          handleChange(opts[i].dataset.value, input);
          break;
        }
      }
    }
  }
  function handlePlayrChange(value, input) {
    let parsedJSON = JSON.parse(value);
    let newPlayers = chosenPlayers.slice();
    newPlayers.push(parsedJSON);
    setChosenPlayers(newPlayers);
    let idxToBeRemoved;
    let updatedUsers = players.slice();
    updatedUsers.map((pl, idx) => {
      if (parsedJSON.id === pl.id) {
        idxToBeRemoved = idx;
      }
    });
    updatedUsers.splice(idxToBeRemoved, 1);
    setPlayers(updatedUsers);
    input.value = "";
  }
  function removeChosenPlayer(chosenPlayer) {
    setChosenPlayers(chosenPlayers.filter((plyr) => plyr !== chosenPlayer));
  }
  return (
    <div>
      <h1>{I18n.get("startSprint")}</h1>
      <p>{I18n.get("sprintDescription")} </p>
      <FormGroup controlId="chosenMissions">
        <ControlLabel>{I18n.get("selectTemplate")}</ControlLabel>

        <FormControl
          onInput={onInput}
          componentClass="input"
          id="sprints-input"
          list="sprint-options"
          placeholder={I18n.get("pleaseChooseAnOption")}
          disabled={loading}
        ></FormControl>
        <datalist id="sprint-options">
          {renderMissionOptions(missions)}
        </datalist>
        {/* <FormControl componentClass="select" onChange={handleChange}>
          <option value="select">{I18n.get("pleaseChooseAnOption")}</option>
          {renderMissionOptions(missions)}
        </FormControl> */}
      </FormGroup>

      <FormGroup controlId="players">
        <ControlLabel>{I18n.get("selectPlayers")}</ControlLabel>
        <FormControl
          onInput={onInput}
          componentClass="input"
          id="players-input"
          list="players-datalist"
          placeholder={I18n.get("pleaseChooseAnOption")}
          disabled={loading}
        ></FormControl>
        <datalist id="players-datalist">
          {renderPlayerOptions(players)}
        </datalist>
      </FormGroup>
      {chosenPlayers.map((chosen, idx) => {
        return (
          <div key={idx} className="block">
            <p>
              {chosen.fName} {chosen.lName}
              <Button
                onClick={() => removeChosenPlayer(chosen)}
                bsSize="large"
                style={{
                  float: "right",
                  marginTop: "-5px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "white",
                  color: "red",
                }}
              >
                <Glyphicon glyph="glyphicon glyphicon-remove" />
              </Button>
            </p>
          </div>
        );
      })}
      <Calendar
        onChange={(value, event) => {
          setStartDate(value);
          setReady(true);
        }}
        value={startDate}
        maxDetail="month"
        minDetail="month"
        // minDate={new Date()}
        maxDate={new Date(Date.now() + 2592000000)}
        tileDisabled={({ date, view }) => date.getDay() !== 1}
        showNeighboringMonth={true}
      />
      {/* <h3>Currently Selected Start Date: {startDate.toString()}</h3> */}
      <LoaderButton
        style={{ width: 350 }}
        onClick={() => createSprint()}
        isLoading={loading}
        loadingText={I18n.get("saving")}
        text={I18n.get("create")}
        disabled={!ready}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    redux: state,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getActiveSprintData: (sprint) => getActiveSprintData(),
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(SprintCreation);
