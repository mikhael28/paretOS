import classNames from "classnames";
import { GrAchievement } from "react-icons/gr";
import { GiCoins } from "react-icons/gi";
import { useTheme } from "@mui/material";
import { RouterHistory } from "@sentry/react/types/reactrouter";
import { useNavigate } from "react-router-dom";

/**
 * The Experience summary component is shown as a shortcut to enter a particular training module by ID. The coach can see this when viewing his/her students, and the students see this in the learning dashboard.
 * @TODO Issue #48
 */

export default function ExperienceSummary(props: {
  type: string;
  history: RouterHistory;
  id: string;
  xp: number;
  xpEarned: number;
  achievements: number;
}) {
  const theme = useTheme();
  let blockClass = classNames("exp-card");
  let name;
  const navigate = useNavigate();
  if (props.type === "Apprenticeship") {
    name = "Onboarding";
  } else if (props.type === "Product") {
    name = "Portfolio";
  } else if (props.type === "Interviewing") {
    name = "Interviewing";
  }
  return (
    <div
      className={blockClass}
      style={{
        textAlign: "center",
        cursor: "pointer",
        flexDirection: "column",
      }}
      onClick={() => navigate(`/training/${props.id}`)}
    >
      <p>
        <b>{name}</b>
      </p>
      <p>
        <GrAchievement
          style={{ filter: theme.palette.mode === "dark" ? "invert()" : "" }}
        />{" "}
        {props.achievements} / 15
      </p>
      <p>
        <GiCoins /> {props.xpEarned} / {props.xp}
      </p>
    </div>
  );
}
