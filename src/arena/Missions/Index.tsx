import { I18n } from "@aws-amplify/core";

import { Missions as MissionsProps } from "../interface";
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
          {missions.map((mission, index) => (
            <Mission mission={mission} id={index} {...props} />
          ))}
        </ul>
      ) : (
        <p>{props.emptyMisionsMessage}</p>
      )}
    </section>
  );
}

export default Missions;
