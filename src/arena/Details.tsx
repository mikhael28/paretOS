/* eslint-disable react/no-array-index-key */
import { Dispatch, SetStateAction } from "react";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";

interface DetailsProps {
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
}: DetailsProps) {
  const theme = useTheme();

  const statues = ["early", "active", "inactive"];

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
              // variant="gradient" // fixme: this is supposed to work but unfortunately it doesn't. This is related to custom typings for variants in the file ./src/types/custom_types/mui.d.ts. It's also related to the fact that the variant="gradient" is not a valid prop for the button component(at the moment).
              variant="text"
              onClick={() => setDisplayDay(idx)}
              key={idx}
              sx={{
                backgroundColor: `${
                  displayDay === idx
                    ? "rgba(255, 255, 255, 0.44)"
                    : "rgba(255, 255, 255, 0.16)"
                }`,
                color: "rgb(242, 243, 243)",
                fontSize: theme.spacing(2),
                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                marginRight: theme.spacing(1.2),
                borderRadius: theme.shape.borderRadius,
                transition: "all 0.2s ease-in-out",

                "&:hover": {
                  backgroundColor: `${
                    displayDay === idx
                      ? "rgba(255, 255, 255, 0.44)"
                      : "rgba(255, 255, 255, 0.16)"
                  }`,
                  color: "rgb(242, 243, 243)",
                  opacity: 0.8,
                },
              }}
            >
              Day {idx + 1}
            </Button>
          ))}
        </div>
        <div className="flex">
          {admin === true ? (
            <div>
              <p>Status: {status}</p>
              {statues.map((s) => (
                <Chip
                  key={s}
                  label={`Set to ${s[0].toUpperCase()}${s.slice(1)}`} // change the first Letter to uppercase
                  variant={`${status === s ? "filled" : "outlined"}`}
                  onClick={() => setStatus(s)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export default Details;
