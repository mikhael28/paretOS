import React, { useState, useEffect } from "react";
import WRJob from "../components/WRJob";

/**
 * This is a proof of concept page to display Work and Rise related jobs/media, if you are in UG.
 * @TODO Issue #67
 */

export default function WorkRise(props) {
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function fetchJobs() {
    try {
      let fetchResult = await fetch(process.env.REACT_APP_WR_PUBLIC_API, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      fetchResult = await fetchResult.json();
      if (fetchResult.code === 200) {
        setJobs(fetchResult.dataset);
        setFetching(false);
      } else {
        setFeedbackMessage(fetchResult.message);
        setFetching(false);
      }
    } catch (e) {
      setFetching(false);
      setFeedbackMessage(
        "Work & Rise servers are not responsive - please refresh to try again, or visit https://workandrise.com to view the jobs directly."
      );
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    !fetching && (
      <div>
        <h1>Work & Rise Jobs</h1>
        <div className="context-cards">
          {feedbackMessage.length > 0 && <h2>{feedbackMessage}</h2>}
          {jobs.map((job, index) => {
            return <WRJob job={job} key={index} />;
          })}
        </div>
      </div>
    )
  );
}
