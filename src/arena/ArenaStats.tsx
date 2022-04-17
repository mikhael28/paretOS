import { I18n } from "@aws-amplify/core";

import StatsBlock from "../components/StatsBlock";
import { GenMission } from "./interface";

interface ActivePersonMission {
  dailyCompletion: number;
  dailyScore: number;
  missions: GenMission[];
}

interface ActivePersonReview {
  code: string;
  content: string;
  name: string;
}

interface ArenaStatsProps {
  activePerson: {
    email: string;
    fName: string;
    github: string;
    id: string;
    lName: string;
    missions: ActivePersonMission[];
    percentage: string;
    phone: string;
    planning: any[];
    review: ActivePersonReview[];
    score: string;
  };
  displayDay: number;
}

/**
 * This component is used to display the stats of the active person.
 * @param {Object} activePerson logged in user
 * @param {number} displayDay index of the day to display
 */
function ArenaStats({ activePerson, displayDay }: ArenaStatsProps) {
  return (
    <section>
      <h2>My Stats</h2>

      <div className="first-step-arena stats-container flex">
        <StatsBlock
          statName={I18n.get("dailyPoints")}
          // score={
          //   props.redux.sprint[activeSprintId].teams[index].missions[displayDay]
          //     .dailyScore
          // }
          score={activePerson.missions[displayDay].dailyScore}
        />

        <StatsBlock
          statName={`${I18n.get("daily")} CP`}
          // score={`${props.redux.sprint[activeSprintId].teams[index].missions[
          //   displayDay
          // ].dailyCompletion.toFixed(0)}%`}

          score={`${activePerson.missions[displayDay].dailyCompletion.toFixed(
            0
          )}%`}
        />

        <StatsBlock
          statName={I18n.get("weeklyPoints")}
          // score={props.redux.sprint[activeSprintId].teams[index].score}

          score={activePerson.score}
        />

        <StatsBlock
          statName={`${I18n.get("weekly")} CP`}
          // score={`${props.redux.sprint[activeSprintId].teams[
          //   index
          // ].percentage.toFixed(0)}%`}

          score={`${parseInt(activePerson.percentage, 10).toFixed(0)}%`}
        />
      </div>
    </section>
  );
}

export default ArenaStats;
