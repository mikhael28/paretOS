import { Dispatch, SetStateAction } from "react";
import Button from "react-bootstrap/lib/Button";

interface Props {
  displayDay: number;
  missions: any[];
  admin: boolean;
  status: string;
  setDisplayDay: Dispatch<SetStateAction<number>>;
  setStatus: Dispatch<SetStateAction<string>>;
}

/**
 * The details component is used to display the details days of the missions.
 * @param displayDay index of the day to display
 * @param {Array} missions array of missions
 * @param admin whether the user is an admin
 * @param status current status
 * @function setDisplayDay
 * @function setStatus
 */
function Details({
  displayDay,
  missions,
  admin,
  status,
  setDisplayDay,
  setStatus,
}: Props) {
  return (
    <details>
      <summary>Time Travel</summary>
      <div className="options">
        <p>
          <b>Currently Day {displayDay + 1}</b>
        </p>
        <p>
          Click a button below to go back to a specific day and add an update
          you forgot.
        </p>

        <div className="options-buttons">
          {missions.map((mission, idx) => (
            <Button
              onClick={() => {
                setDisplayDay(idx);
              }}
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
            >
              Day {idx + 1}
            </Button>
          ))}
        </div>
        <div className="flex">
          {admin === true ? (
            <div>
              <p>Status: {status}</p>
              <div className="flex-apart">
                <Button onClick={() => setStatus("early")}>Set to Early</Button>
                <Button onClick={() => setStatus("active")}>
                  Set to Active
                </Button>
                <Button onClick={() => setStatus("inactive")}>
                  Set to Inactive
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export default Details;
