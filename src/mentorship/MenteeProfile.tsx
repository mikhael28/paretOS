import { useEffect, useState, useContext } from "react";
import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import { Link } from "react-router-dom";
import { AiOutlineGithub } from "react-icons/ai";
import classNames from "classnames";
import { ToastMsgContext } from "../context/ToastContext";
import Skeleton from "@mui/material/Skeleton/Skeleton";
import { MongoExperience } from "../types/LearnTypes";
import { Sprint } from "../types/ArenaTypes";
import { User } from "../types/ProfileTypes";

/**
 * This is the profile component, that is seen by the coaches of their students.
 */

function Profile(props: any) {
  const [profile, setProfile] = useState({} as User);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([] as MongoExperience[]);
  const [sprints, setSprints] = useState([] as Sprint[]);
  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);

  useEffect(() => {
    console.log('HELLO');
    console.log(window.location.pathname.split('/'));
    let userId = window.location.pathname.split("/");
    let userStrings = userId[2].split("_");
    console.log(userStrings);
    getUser(userStrings[0]);
    
  }, []);

  const getUser = async (id: string) => {
    let user = await RestAPI.get("pareto", `/users/${id}`, {});
    if (user.length > 0) {
      
      let experiences = await getExperienceByUser(user[0].id);
      let sprints = await getSprintsByUser(user[0].id);
      setProfile(user[0]);
      setExperiences(experiences);
      setSprints(sprints);
      setLoading(false);
    }
  };

  const getExperienceByUser = async (id: string) => {
    try {
      let experiences = await RestAPI.get("pareto", `/experience/user/${id}`, {});
      return experiences;
    } catch (e) {
      handleShowError(e as Error);
    }
  };

  const getSprintsByUser = async (id: string) => {
    try {
      let sprints = await RestAPI.get("pareto", `/sprints/mentee/${id}`, {});
      return sprints;
    } catch (e) {
      handleShowError(e as Error);
    }
  };

  let blockCardClass = classNames("context-cards");
  let blockOverflow = classNames("block");

  return (
    <div style={{ marginTop: 28 }}>
      {loading === true ? (
        <div className={blockOverflow}>
          <Skeleton height={720} width="100%" />
        </div>
      ) : (
        <>
          <div className="flex">
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
              {sprints.map((sprint) => {
                let activeTeam = {} as User;
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
