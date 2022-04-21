import React, { useEffect, useState } from "react";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Image from "react-bootstrap/lib/Image";
import { Link } from "react-router-dom";
import { AiOutlineGithub } from "react-icons/ai";
import classNames from "classnames";
import { errorToast } from "../libs/toasts";

/**
 * This is the profile component, that is seen by the coaches of their students.
 * @TODO UI work - GH Issue #9 https://github.com/mikhael28/paretOS/issues/9
 * @TODO GH Issue #10 https://github.com/mikhael28/paretOS/issues/10
 */

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    setLoading(true);
    let userId = window.location.pathname.split("/");
    let userStrings = userId[2].split("_");
    if (userStrings.length === 1) {
      getUser(userId[2]);
    } else if (userStrings.length > 1) {
      getUser(userStrings[1]);
    }
  }, [window.location.pathname]);

  const getUser = async (id) => {
    let user = await API.get("pareto", `/users/${id}`);
    if (user.length > 0) {
      setProfile(user[0]);
    }
    await getExperienceByUser(user[0].id);
    await getSprintsByUser(user[0].id);
  };

  const getExperienceByUser = async (id) => {
    try {
      let experiences = await API.get("pareto", `/experience/user/${id}`);
      setExperiences(experiences);
    } catch (e) {
      errorToast(e);
    }
  };

  const getSprintsByUser = async (id) => {
    try {
      let sprints = await API.get("pareto", `/sprints/mentee/${id}`);
      setSprints(sprints);
      setLoading(false);
    } catch (e) {
      errorToast(e);
    }
  };

  let blockCardClass = classNames("context-cards");

  return (
    <div style={{ marginTop: 28 }}>
      {loading === true ? (
        <section style={{ marginTop: -12 }}>
          {/* <h2 className="section-title">
            <Skeleton height={60} width="100%" />
          </h2>
          <h2 className="section-title">
            <Skeleton height={120} width="100%" />
          </h2>
          <h2 className="section-title">
            <Skeleton height={200} width="100%" />
          </h2> */}
        </section>
      ) : (
        <>
          <div className="flex">
            <Image
              src={
                profile.picture ||
                "https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp"
              }
              height="50"
              width="50"
              circle
              style={{ marginTop: 8 }}
            />
            <h2>
              {profile.fName} {profile.lName}
            </h2>
            <div style={{ marginLeft: 12, marginTop: 26 }}>
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
              >
                <AiOutlineGithub /> {profile.github}
              </a>
            </div>
          </div>

          <div
            className={blockCardClass}
            style={{ marginLeft: 10, justifyContent: "flex-start" }}
          >
            {experiences.map((experience) => (
              <div
                style={{ textAlign: "center", marginLeft: 20 }}
                key={experience._id}
                className="exp-card"
              >
                <h3>{experience.type}</h3>
                <p>
                  {I18n.get("achievements")}: {experience.achievements} / 15
                </p>
                <p>
                  {I18n.get("points")}: {experience.xpEarned} / {experience.xp}
                </p>
                <Link to={`/training/${experience.id}`}>
                  {I18n.get("viewExperience")}
                </Link>
              </div>
            ))}
          </div>

          {sprints.length > 0 ? (
            <div>
              <h2>Mentee Sprints</h2>
              <p>
                Note: UI needs work, refer to this{" "}
                <a
                  href="https://github.com/mikhael28/paretOS/issues/9"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GH Issue
                </a>
              </p>
              {sprints.map((sprint) => {
                let activeTeam;
                sprint.teams.forEach((team) => {
                  if (profile.id === team.id) {
                    activeTeam = team;
                  }
                });
                return (
                  <div className="block">
                    <p>
                      {activeTeam.fName}'s Completion: {activeTeam.percentage}%
                    </p>
                    <p>
                      {I18n.get("starts")}:{" "}
                      {new Date(sprint.startDate).getUTCMonth() + 1}/
                      {new Date(sprint.startDate).getUTCDate()}/
                      {new Date(sprint.startDate).getUTCFullYear()}
                      <br />
                      {I18n.get("finishes")}:{" "}
                      {new Date(sprint.endDate).getUTCMonth() + 1}/
                      {new Date(sprint.endDate).getUTCDate()}/
                      {new Date(sprint.endDate).getUTCFullYear()}
                    </p>
                    <details>
                      <summary>See Planning Entries</summary>
                      {activeTeam.planning.map((plan, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={idx}>
                          <h3>{plan.name}</h3>
                          <p>{plan.content}</p>
                        </div>
                      ))}
                    </details>

                    <details>
                      <summary>See Review Entries</summary>
                      {activeTeam.review.map((plan, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={idx}>
                          <h3>{plan.name}</h3>
                          <p>{plan.content}</p>
                        </div>
                      ))}
                    </details>
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Profile;
