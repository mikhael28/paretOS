import React, { useState, useContext, useEffect } from "react";
import { ImCheckmark } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RestAPI } from "@aws-amplify/api-rest";
import { Slide, Dialog, Button } from "@mui/material";
import { PortableText } from "@portabletext/react";
import { I18n } from "@aws-amplify/core";
import Tour from "reactour";
import classNames from "classnames";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import PaywallModal from "./PaywallModal";
import question from "../assets/help.png";
import { generateEmail } from "../libs/errorEmail";
import { ToastMsgContext } from "../state/ToastContext";
import ApproveExperienceModal from "./ApproveExperienceModal";
import NewSubmitModal from "./NewSubmitProofModal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This module is where the bulk of the experience module system lies.
 * @TODO Issue #48
 * @TODO Issue #27
 */

function ExperienceModule(props) {
  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [user, setUser] = useState({
    fName: "",
    lName: "",
    id: "8020",
  });
  const [activeExperience, setActiveExperience] = useState({
    title: "",
    amount: 0,
    overview: [],
    completed: false,
    priority: "_01",
    _type: "interviewSchema",
    github: "",
    athleteNotes: "",
  });
  const [experience, setExperience] = useState([]);
  const [mongoExperience, setMongoExperience] = useState({
    id: "",
  });
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [showPaywallDialog, setShowPaywallDialog] = useState(false);
  const [experienceID, setExperienceID] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [language, setLanguage] = useState("en");

  const closeTour = () => {
    setIsTourOpen(false);
  };

  useEffect(() => {
    let lengua;
    let str = I18n.get("close");
    if (str === "Cerrar") {
      lengua = "es";
    } else {
      lengua = "en";
    }

    const handleDataFetch = async () => {
      const res = await dataFetch();
      return res;
    };

    I18n.setLanguage(lengua);
    setLanguage(lengua);
    if (props.user.learningPurchase === true) {
      handleDataFetch();
    }
  });

  async function dataFetch() {
    // we need to have a admin-related fetch option, as working here
    // we also need to have a faster option to fetch data

    // eslint-disable-next-line no-undef
    let pathArray = window.location.pathname.split("/");
    let path = pathArray[2];
    let expType;

    let comparisonData = await RestAPI.get("pareto", `/experience/${path}`);

    if (comparisonData[0].type === "Apprenticeship") {
      expType = props.sanityTraining;
    } else if (comparisonData[0].type === "Product") {
      expType = props.sanityProduct;
    } else if (comparisonData[0].type === "Interviewing") {
      expType = props.sanityInterview;
    }

    setExperience((prevState) => expType);
    setMongoExperience((prevState) => comparisonData[0]);
    setExperienceID((prevState) => comparisonData[0].id);
    setActiveExperience((prevState) => expType[0]);
    setIsLoading((prevState) => false);

    let athleteProfile = await RestAPI.get(
      "pareto",
      `/users/${comparisonData[0].memberId}`
    );
    setUser(athleteProfile[0]);
  }

  const markSubmitted = async (milestone, githubLink, athleteNotes) => {
    let milestoneXP = parseInt(milestone.amount, 10);

    let body = {
      [milestone.priority]: {
        completed: true,
        approved: false,
        github: githubLink,
        revisionsNeeded: false,
        athleteNotes: athleteNotes,
        coachNotes: "",
      },
    };
    try {
      let email = generateEmail(
        `Pareto Achievement for Review!`,
        `Your athlete ${user.fName} ${user.lName} has submitted the work submitted for the milestone called '${activeExperience.title}. There is ${milestoneXP} XP at stake - you are doing a great job providing mentorship and guidance!'`
      );
      const updatedExperienceModule = await RestAPI.put(
        "pareto",
        `/experience/${experienceID}`,
        { body }
      );
      setShowSubmitModal(false);
      setMongoExperience(updatedExperienceModule);
      await RestAPI.post("util", "/email", {
        body: {
          recipient: user.email,
          sender: "michael@fsa.community",
          subject: "Pareto Achievement For Review",
          htmlBody: email,
          textBody: "Pareto Achievement For Review.",
        },
      });
      handleShowSuccess("Achievement submitted successfully!");
    } catch (e) {
      handleShowError(e);
    }
  };

  const markRequestRevisions = async (
    milestone,
    mongoExperience,
    coachNotes
  ) => {
    let milestoneXP = parseInt(milestone.amount, 10);

    let body = {
      [milestone.priority]: {
        completed: false,
        approved: false,
        github: mongoExperience[milestone.priority].github,
        athleteNotes: mongoExperience[milestone.priority].athleteNotes,
        revisionsNeeded: true,
        coachNotes: coachNotes,
      },
    };
    try {
      let email = generateEmail(
        `Pareto Achievement Sent Back for Review!`,
        `Your coach has requested that the work submitted for the milestone called '${activeExperience.title}' be revised according to their feedback. Please log-in to https://arena.pareto.education for their details. There is ${milestoneXP} XP at stake - you are doing a great job learning and growing every day!'`
      );
      const updatedExperienceModule = await RestAPI.put(
        "pareto",
        `/experience/${experienceID}`,
        { body }
      );
      setShowSubmitModal(false);
      setMongoExperience(updatedExperienceModule);

      await RestAPI.post("util", "/email", {
        body: {
          recipient: user.email,
          sender: "michael@fsa.community",
          subject: "Pareto Achievement For Review",
          htmlBody: email,
          textBody: "Pareto Achievement For Review.",
        },
      });
      handleShowSuccess("Achievement sent back for further review.");
    } catch (e) {
      handleShowError(e);
    }
  };

  const markComplete = async (milestone, mongoExperience, coachNotes) => {
    let milestoneXP = parseInt(milestone.amount, 10);

    let body = {
      [milestone.priority]: {
        completed: true,
        approved: true,
        github: mongoExperience[milestone.priority].github,
        athleteNotes: mongoExperience[milestone.priority].athleteNotes,
        revisionsNeeded: false,
        coachNotes: coachNotes,
      },
      xpEarned: mongoExperience.xpEarned + milestoneXP,
      achievements: mongoExperience.achievements + 1,
    };
    try {
      let email = generateEmail(
        `Pareto Achievement Unlocked!`,
        `Congratulations! Your coach has approved the work submitted for the milestone called '${activeExperience.title}'. You have earned ${milestoneXP} XP - you are doing a great job!'`
      );

      const updatedExperienceModule = await RestAPI.put(
        "pareto",
        `/experience/${experienceID}`,
        { body }
      );
      setShowSubmitModal(false);
      setMongoExperience(updatedExperienceModule);
      setOpenReviewModal(false);

      await RestAPI.post("util", "/email", {
        body: {
          recipient: "mikhael@hey.com",
          sender: "michael@fsa.community",
          subject: "Pareto Achievement Unlocked",
          htmlBody: email,
          textBody: "Pareto Achievement Unlocked.",
        },
      });
      handleShowSuccess("Achievement submitted successfully!");
    } catch (e) {
      handleShowError(e);
    }
  };

  const renderExperienceList = (topics, activeExperience, mongoExperience) => {
    let inactiveBlock = classNames("block", "first-step-exp");
    let activeBlock = "highlight-block";

    return topics.map((topic, i) => {
      let title;
      let activeClass = false;
      if (language === "en") {
        title = topic.title;
      } else {
        title = topic.esTitle;
      }
      if (activeExperience.priority === topic.priority) {
        activeClass = true;
      }

      return (
        <div
          className={activeClass === true ? activeBlock : inactiveBlock}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          onClick={() => {
            setActiveExperience(topic);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="flex-apart">
            <h4>{title}</h4>
            {mongoExperience._01 ? (
              <div className="second-step-exp">
                {mongoExperience[topic.priority].approved === true &&
                mongoExperience[topic.priority].completed === true ? (
                  <ImCheckmark />
                ) : null}
                {mongoExperience[topic.priority].completed === true &&
                mongoExperience[topic.priority].approved === false ? (
                  <FaSearch />
                ) : null}
                {mongoExperience[topic.priority].completed === false ? (
                  <MdCheckBoxOutlineBlank />
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="third-step-exp">
            <p>{topic.amount} EXP</p>
          </div>
        </div>
      );
    });
  };

  function renderExperienceInfo(activeExperience, mongoExperience) {
    let newClassname = classNames("flex", "fifth-step-exp");
    if (mongoExperience === undefined) {
      return <>Nothing</>;
    }
    return (
      <div style={{ cursor: "pointer" }} className="hover-class">
        {mongoExperience._01 ? (
          <div className={newClassname}>
            {mongoExperience[activeExperience.priority].completed ? (
              <></>
            ) : (
              <Button
                onClick={() => setShowSubmitModal(true)}
                className="btn"
                style={{ marginTop: 16, marginRight: 10, fontSize: 16 }}
              >
                <HiOutlineClipboardCheck /> {I18n.get("markAsComplete")}
              </Button>
            )}
            {user.instructor === true &&
            mongoExperience[activeExperience.priority].completed === true ? (
              <Button onClick={() => setOpenReviewModal(true)} className="btn">
                <HiOutlineClipboardCheck /> {I18n.get("reviewWork")}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  const handleCloseSubmit = () => {
    setShowSubmitModal(false);
  };

  const steps = [
    {
      selector: ".first-step-exp",
      content: `${I18n.get("expFirst")}`,
    },
    {
      selector: ".second-step-exp",
      content: `${I18n.get("expSecond")}`,
    },
    {
      selector: ".third-step-exp",
      content: `${I18n.get("expThird")}`,
    },
    {
      selector: ".fourth-step-exp",
      content: `${I18n.get("expFourth")}`,
    },
    {
      selector: ".fifth-step-exp",
      content: `${I18n.get("expFifth")}`,
    },
    {
      selector: ".sixth-step-exp",
      content: `${I18n.get("expSixth")}`,
    },
  ];
  let blockOverflow = classNames("block", "overflow");
  return (
    <div style={{ width: "100%" }}>
      <h1>
        {I18n.get("experienceModule")}{" "}
        <img
          src={question}
          onClick={(event) => {
            event.preventDefault();
            setIsTourOpen(true);
          }}
          alt="Tour for Experience Module"
          height="40"
          width="40"
          circle
          style={{ marginLeft: 20, cursor: "pointer" }}
        />
      </h1>
      <div className="experience-container flex">
        <div style={{ flexBasis: "30%" }} className="overflow">
          {isLoading === true ? (
            <section style={{ marginTop: -12, marginLeft: -4 }}>
              {/* <h2 className="section-title">
                  <Skeleton height={100} width={860} />
                </h2>

                <h2 className="section-title">
                  <Skeleton height={100} width={520} />
                </h2>
                <h2 className="section-title">
                  <Skeleton height={100} width={520} />
                </h2>
                <h2 className="section-title">
                  <Skeleton height={100} width={520} />
                </h2>
                <h2 className="section-title">
                  <Skeleton height={100} width={520} />
                </h2>
                <h2 className="section-title">
                  <Skeleton height={100} width={520} />
                </h2>
                <h2 className="section-title">
                  <Skeleton height={100} width={520} />
                </h2> */}
            </section>
          ) : (
            <div>
              {renderExperienceList(
                experience,
                activeExperience,
                mongoExperience
              )}
            </div>
          )}
        </div>
        {isLoading === true ? (
          <div
            style={{
              marginLeft: 10,
              marginTop: 2,
              marginRight: 8,
              width: "100%",
            }}
          >
            {/* <Skeleton height="100%" width="100%" /> */}
          </div>
        ) : (
          <div className={blockOverflow} style={{ flexBasis: "70%" }}>
            <div className="flex-apart">
              <h3>
                {language === "en"
                  ? activeExperience.title
                  : activeExperience.esTitle}
              </h3>
              {renderExperienceInfo(activeExperience, mongoExperience)}
            </div>
            <h4>{activeExperience.amount} EXP</h4>
            <div className="fourth-step-exp">
              {language === "en" ? (
                <PortableText value={activeExperience.overview} />
              ) : (
                <PortableText value={activeExperience.esOverview} />
              )}
            </div>
          </div>
        )}
        <Dialog
          style={{
            margin: "auto",
          }}
          open={showPaywallDialog}
          TransitionComponent={Transition}
          keepMounted
          hideBackdrop={false}
          aria-labelledby="loading"
          aria-describedby="Please wait while the page loads"
          onClose={(event, reason) => {
            if (
              reason !== "backdropClick" &&
              reason !== "escapeKeyDown" &&
              props.user.learningPurchase === false
            ) {
              setShowPaywallDialog(false);
              props.history.push("/");
            }
          }}
        >
          <PaywallModal {...props} open={showPaywallDialog} />
        </Dialog>
      </div>
      {isLoading === true ? (
        <></>
      ) : (
        <>
          <NewSubmitModal
            show={showSubmitModal}
            handleClose={handleCloseSubmit}
            activeExperience={activeExperience}
            markComplete={markComplete}
            markSubmitted={markSubmitted}
            mongoExperience={mongoExperience}
          />
          <ApproveExperienceModal
            show={openReviewModal}
            activeExperience={activeExperience}
            markComplete={markComplete}
            markRequestRevisions={markRequestRevisions}
            mongoExperience={mongoExperience}
            closeModal={() => setOpenReviewModal(false)}
          />
          <Tour
            steps={steps}
            isOpen={isTourOpen}
            onRequestClose={closeTour}
            showCloseButton
            rewindOnClose={false}
          />
        </>
      )}
    </div>
  );
}

export default ExperienceModule;
