import { useState } from "react";
import { useTheme } from "@mui/material";
import { I18n } from "@aws-amplify/core";
import Tour from "reactour";
import Sprints from "./Sprints";
import question from "../assets/question.svg";
import logo from "../assets/Pareto_Lockup-01.png";
import { RouteComponentProps } from ".pnpm/@types+react-router@5.1.18/node_modules/@types/react-router";
import { User } from "../types/ProfileTypes";

/**
 * The 'main dashboard' in the UI, that shows different things depending on what level of user you are.
 *
 */
interface HomeDashboardProps extends RouteComponentProps {
  user: User;
  fetchMenteeSprints: (userid: string) => {}
}

function HomeDashboard({ history, user, fetchMenteeSprints }: HomeDashboardProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const theme = useTheme();

  const steps = [
    {
      selector: ".first-step-home",
      content: `${I18n.get("homeFirst")}`,
    },
    {
      selector: ".second-step-home",
      content: `${I18n.get("homeSecond")}`,
    },
    {
      selector: '.third-step-home',
      content: `${I18n.get('homeThird')}`
    }
  ];
  return (
    <div className="flex-down">
      <div className="flex">
        <img
          src={logo}
          alt="Pareto"
          height="45"
          width="180"
          style={{
            marginTop: 33,
            filter:
              theme.palette.mode !== "dark" ? "" : "invert() brightness(150%)",
          }}
        />

        <h1
          style={{
            marginLeft: 0,
            marginBottom: 0,
            marginTop: 33,
            fontSize: 40,
          }}
        >
          &nbsp;Arena
        </h1>
        <img
          src={question}
          onClick={(event) => {
            event.preventDefault();
            setIsTourOpen(true);
          }}
          alt="Arena tour icon"
          height="16"
          width="16"
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            marginTop: 30,
            marginLeft: 6,
            opacity: 0.8,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
        />
      </div>
      <div className="row">
        <div className="col-xs-12">
          <Sprints
            reviewMode={false}
            history={history}
            user={user}
            fetchMenteeSprints={fetchMenteeSprints}
          />
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
}

export default HomeDashboard;
