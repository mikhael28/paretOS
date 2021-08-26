import React, { useEffect, useState } from "react";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import { bindActionCreators } from "redux";
import Image from "react-bootstrap/lib/Image";
import { connect } from "react-redux";
import { getUser } from "../state/profile";
import { errorToast } from "../libs/toasts";
import { Link } from "react-router-dom";
import ArenaDashboard from "../arena/ArenaDashboard";
import { AiOutlineGithub } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames";

/**
 * This is the profile component, that is seen by the coaches of their students.
 * @TODO need to rework this UI
 * @TODO can i simplify this page? Through props, meaning if I get the coaches athletes in the initial fetch?
 */

function Profile(props) {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [reviewMode, setReviewMode] = useState(true);

  useEffect(() => {
    setLoading(true);
    let userId = window.location.pathname.split("/");
    let userStrings = userId[2].split("_");
    if (userStrings.length === 1) {
      getUser(userId[2]);
    } else if (userStrings.length > 1) {
      // @TODO: review if I can simplify this in any way, or it needs to be changed.
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
      {/* <h1>{I18n.get("neuroProfile")}</h1> */}
      {loading === true ? (
        <section style={{ marginTop: -12 }}>
          <h2 className="section-title">
            <Skeleton height={60} width={"100%"} />
          </h2>
          <h2 className="section-title">
            <Skeleton height={120} width={"100%"} />
          </h2>
          <h2 className="section-title">
            <Skeleton height={200} width={"100%"} />
          </h2>
        </section>
      ) : (
        <React.Fragment>
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
          </div>
          <div className="flex">
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "black" }}
            >
              <AiOutlineGithub /> {profile.github}
            </a>
          </div>

          <div
            className={blockCardClass}
            style={{ marginLeft: 10, justifyContent: "flex-start" }}
          >
            {experiences.map((experience, index) => {
              return (
                <div
                  style={{ textAlign: "center", marginLeft: 20 }}
                  key={index}
                  className="exp-card"
                >
                  <h3>{experience.type}</h3>
                  <p>
                    {I18n.get("achievements")}: {experience.achievements} / 15
                  </p>
                  <p>
                    {I18n.get("points")}: {experience.xpEarned} /{" "}
                    {experience.xp}
                  </p>
                  <Link to={`/training/${experience.id}`}>
                    {I18n.get("viewExperience")}
                  </Link>
                </div>
              );
            })}
          </div>

          <ArenaDashboard
            sprints={sprints}
            reviewMode={reviewMode}
            history={props.history}
            user={props.user}
            fetchMenteeSprints={props.fetchMenteeSprints}
          />
        </React.Fragment>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUser: () => getUser(),
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
