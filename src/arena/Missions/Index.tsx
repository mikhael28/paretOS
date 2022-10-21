import { I18n } from "@aws-amplify/core";

import { Missions as MissionsProps } from "../../types/ArenaTypes";
import Mission from "./Mission";

/**
 * This component is used for a missions' section
 */
function Missions(props: MissionsProps) {
  const { missions } = props;
  return (
    <section>
      <h2 className={`${props.headClassName ?? ""}`}>
        {I18n.get(props.headText)}
      </h2>
      {missions.length > 0 ? (
        <ul className="context-cards">
          {missions.map((mission: any) => (
            <Mission mission={mission[0]} id={mission[1]} {...props} />
          ))}
        </ul>
      ) : (
        <p>{props.emptyMissionsMessage}</p>
      )}
    </section>
  );
}

export default Missions;
