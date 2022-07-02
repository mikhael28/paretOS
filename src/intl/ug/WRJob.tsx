import Button from "@mui/material/Button";
import { FaCheck, FaMoneyCheck, FaMapMarkerAlt } from "react-icons/fa";
import classNames from "classnames";

/**
 * This is a visual component, that displays a WR job for any users in the UG market.
 * @TODO change the button at the buttom into an anchor tag, for accessibility purposes.
 * @TODO review UI for this, it's probably pretty ugly. Only spent an hour putting this together.
 */

export interface Job {
  id: string;
  title: string;
  description: string;
  job_location: string;
  type: string;
  rate: string;
}

export default function Job(props: { job: Job }) {
  let splitTitle = props.job.title.split(".");
  let newTitle = splitTitle[splitTitle.length - 1];

  let splitDescription = props.job.description.trim().split(".");
  let newDescription = splitDescription[0];
  return (
    <div
      className={classNames("exp-card", "block", "flex-apart")}
      style={{ flexDirection: "column" }}
    >
      <div className="flex-down">
        {props.job.title.length < 39 ? (
          <>
            <h3>{newTitle}</h3>
          </>
        ) : (
          <h3>{props.job.title.substring(0, 39)}...</h3>
        )}

        {newDescription.length < 49 ? (
          <>
            <p>{newDescription}</p>
          </>
        ) : (
          <p>{props.job.description.substring(0, 49)}...</p>
        )}
      </div>

      <div>
        <div className="flex-between">
          <p>Location</p>
          <p>
            <i className="fa fa-map-marker">
              <FaMapMarkerAlt />
            </i>
            {props.job.job_location.length > 10
              ? props.job.job_location.substring(0, 10)
              : props.job.job_location}
          </p>
        </div>

        <div className="flex-between">
          <p>UGX</p>

          <p>
            <i className="fa c">
              <FaMoneyCheck />
            </i>
            {Number(props.job.rate).toLocaleString()}
          </p>
        </div>

        <div className="flex-between">
          <p>Job Type</p>

          <p>
            <i className="fa fa-check">
              <FaCheck />
            </i>
            {props.job.type}
          </p>
        </div>
        <Button
          className="btn"
          onClick={() => {
            window.open(`https://workandrise.com/jobs/${props.job.id}/details`);
          }}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
}
