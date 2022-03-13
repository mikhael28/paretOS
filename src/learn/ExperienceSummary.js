import classNames from "classnames";
import { GrAchievement } from "react-icons/gr";
import { GiCoins } from "react-icons/gi";

/**
 * The Experience summary component is shown as a shortcut to enter a particular training module by ID. The coach can see this when viewing his/her students, and the students see this in the learning dashboard.
 * @TODO Issue #54
 * @TODO Issue #48
 */

export default function ExperienceSummary(props) {
  let blockClass = classNames("exp-card");
  let name;
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
      onClick={() => props.history.push(`/training/${props.id}`)}
    >
      <p>
        <b>{name}</b>
      </p>
      <p>
        <GrAchievement /> {props.achievements} / 15
      </p>
      <p>
        <GiCoins /> {props.xpEarned} / {props.xp}
      </p>
    </div>
  );
}
