import { useState, useEffect, useContext } from "react";
import { nanoid } from "nanoid";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { FormEvent } from "react";
import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { IconButton } from "@mui/material";
import cloneDeep from "lodash.clonedeep";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { ReduxRootState } from "../state";
import { ToastMsgContext } from "../state/ToastContext";;
import LoaderButton from "../components/LoaderButton";
import { MinimalUser, User } from "../types";
import { FullMission, GenMission, Mission, EnMission } from "./types";
import { RouteComponentProps } from "react-router-dom";

/**
 * This is the component where a user creates a new sprint, and selects which players are competing.
 * @TODO Re-integrate 'validateForm' function, to prevent people from selecting days in the past. Rethink what other purposes this could have.
 */
interface SprintCreationProps extends RouteComponentProps {
  user: User;
  connectSocket: () => {};
}

function SprintCreation({ user, connectSocket, history }: SprintCreationProps) {
  const profile = useSelector((state: ReduxRootState) => state.profile);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [missions, setMissions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [chosenMissions, setChosenMissions] = useState({} as { missions?: FullMission[] });
  const [chosenPlayers, setChosenPlayers] = useState([] as MinimalUser[]);

  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);

  useEffect(() => {
    getConfiguration();
  }, []);

  async function getConfiguration() {
    setLoading(true);
    let options = await RestAPI.get("pareto", "/templates", {});
    let userOptions = await RestAPI.get("pareto", "/users", {});
    setMissions(options);
    setPlayers(userOptions.filter((e: HTMLOptionElement) => e.id !== profile.id));
    setLoading(false);
    setLoaded(true);
  }
  async function createSprint() {
    setLoading(true);
    let dbMission;
    let databasedMissions: GenMission[] = [];
    if (chosenMissions.missions) {
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
          description: (element as EnMission).summary,
          esDescription: (element as Mission).esSummary,
          xp: element.xp,
          title: (element as EnMission).title,
          esTitle: (element as Mission).esTitle,
        };
        databasedMissions.push(dbMission);
      });
    }

    let finalDBMission = {
      dailyScore: 0,
      dailyCompletion: 0,
      missions: databasedMissions,
    };
    let databasedTeams: MinimalUser[] = [];
    let dbTeam: MinimalUser;
    let chosenCompetitors = chosenPlayers.slice();
    chosenCompetitors.push(profile);
    chosenCompetitors.forEach((el) => {
      dbTeam = {
        fName: el.fName,
        lName: el.lName,
        email: el.email,
        phone: el.phone,
        github: el.github,
        id: el.id,
        score: 0,
        percentage: '0',
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
      id: nanoid(),
      athleteId: user.id,
      coachId: user.mentor,
      // hopefully the Date type doesn't give us problems, could be a place to debug
      startDate: startDate,
      endDate: new Date(startDate.getTime() + 432000000),
      events: [],
      studySessions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      started: true,
      teams: databasedTeams,
    };
    try {
      await RestAPI.post("pareto", "/sprints", { body });
      await connectSocket();
      handleShowSuccess("Sprint created successfully.");
      history.push("/");
    } catch (e) {
      handleShowError(e as Error);
      setLoading(false);
    }
    setLoading(false);
  }
  // eslint-disable-next-line no-unused-vars
  function validateForm() {
    let result;
    // TODO: Where is this 5000 number coming from? In this context it equals 5 seconds. 
    if ((new Date(startDate)).getTime() - 5000 < Date.now()) {
      result = true;
    } else {
      result = false;
    }
    // console.log(result);
    return result;
  }
  function renderMissionOptions(missions: FullMission[]) {
    return missions.map((mission, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <option key={i} data-value={JSON.stringify(mission)}>
        {mission.title}
      </option>
    ));
  }
  function renderPlayerOptions(data: MinimalUser[]) {
    return data.map((playr, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <option key={index} data-value={JSON.stringify(playr)}>
        {playr.fName} {playr.lName}
      </option>
    ));
  }

  // eslint-disable-next-line no-unused-vars
  function handleChange(value: string) {
    let parsedJSON = JSON.parse(value);
    setChosenMissions(parsedJSON);
  }

  function onInput(e: FormEvent<FormControl>) {
    const nextSibling = (e.target as HTMLOptionElement).nextSibling as HTMLDataListElement;
    if (nextSibling && nextSibling.id === "players-datalist") {
      let input = document.getElementById("players-input") as HTMLInputElement;
      let opts = nextSibling.childNodes as NodeListOf<HTMLOptionElement>;
      for (let i = 0; i < opts.length; i++) {
        if (opts[i].value === input.value) {
          // An item was selected from the list!
          // yourCallbackHere()
          handlePlayrChange(opts[i].dataset.value as string, input);
          break;
        }
      }
    } else if (nextSibling && nextSibling.id === "sprint-options") {
      let input = document.getElementById("sprints-input") as HTMLInputElement;
      let opts = nextSibling.childNodes as NodeListOf<HTMLOptionElement>;
      for (let i = 0; i < opts.length; i++) {
        if (opts[i].value === input.value) {
          handleChange(opts[i].dataset.value as string);
          break;
        }
      }
    }
  }
  function handlePlayrChange(value: string, input: HTMLInputElement) {
    let parsedJSON = JSON.parse(value);
    let newPlayers = chosenPlayers.slice();
    newPlayers.push(parsedJSON);
    setChosenPlayers(newPlayers);
    let idxToBeRemoved = -1;
    let updatedUsers = players.slice();
    updatedUsers.map((pl: MinimalUser, idx) => {
      if (parsedJSON.id === pl.id) {
        idxToBeRemoved = idx;
      }
    });
    if (idxToBeRemoved >= 0) {
      updatedUsers.splice(idxToBeRemoved, 1);
      setPlayers(updatedUsers);
      input.value = "";
    }
  }
  function removeChosenPlayer(chosenPlayer: MinimalUser) {
    setChosenPlayers(chosenPlayers.filter((plyr) => plyr !== chosenPlayer));
  }
  return (
    <div>
      <h1>{I18n.get("startSprint")}</h1>
      <p>{I18n.get("sprintDescription")} </p>
      <FormGroup>
        <ControlLabel>{I18n.get("selectTemplate")}</ControlLabel>
        <FormControl
          onInput={onInput}
          componentClass="input"
          id="sprints-input"
          list="sprint-options"
          placeholder={I18n.get("pleaseChooseAnOption")}
          disabled={loading}
        />
        <datalist id="sprint-options">
          {renderMissionOptions(missions)}
        </datalist>
      </FormGroup>
      <FormGroup>
        <ControlLabel>{I18n.get("selectPlayers")}</ControlLabel>
        <FormControl
          onInput={onInput}
          componentClass="input"
          id="players-input"
          list="players-datalist"
          placeholder={I18n.get("pleaseChooseAnOption")}
          disabled={loading}
        />
        <datalist id="players-datalist">
          {renderPlayerOptions(players)}
        </datalist>
      </FormGroup>
      {chosenPlayers.map((chosen) => (
        <div key={chosen.id} className="block">
          {/* TODO: evaluate if these inline styles should apply to all blocks & move to index.css */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 0,
            }}
          >
            {chosen.fName} {chosen.lName}
            <IconButton
              size="small"
              style={{ padding: 7 }}
              onClick={() => removeChosenPlayer(chosen)}
            >
              <FaTimes style={{ transform: "scale(1.4)" }} />
            </IconButton>
          </div>
        </div>
      ))}
      {/* TODO had to add any, review what's going on */}
      <LocalizationProvider dateAdapter={AdapterDateFns as any}>
        <StaticDatePicker
          orientation="portrait"
          openTo="day"
          value={startDate}
          onChange={(value) => {
            setStartDate(value as Date);
            setReady(true);
          }}
          renderInput={(params) => <TextField {...params} />}
          // minDate={new Date()}
          maxDate={new Date(Date.now() + 2592000000)}
          views={["day"]}
        />
      </LocalizationProvider>
      {/* <h3>Currently Selected Start Date: {startDate.toString()}</h3> */}
      <LoaderButton
        style={{ width: 350 }}
        isLoading={loading}
        loadingText={loaded ? I18n.get("saving") : I18n.get("loading")}
        text={I18n.get("create")}
        disabled={!ready}
        onClick={() => createSprint()}
      />
    </div>
  );
}

export default SprintCreation;
