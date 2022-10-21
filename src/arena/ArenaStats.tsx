import { I18n } from "@aws-amplify/core";

import StatsBlock from "../components/StatsBlock";
import { User } from "../types/ProfileTypes";

interface ArenaStatsProps {
  activePerson: User;
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

          score={`${parseInt(activePerson.percentage.toString(), 10).toFixed(0)}%`}
        />
      </div>
    </section>
  );
}

export default ArenaStats;
