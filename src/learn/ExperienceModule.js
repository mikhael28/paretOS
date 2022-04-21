import React, { Component } from "react";
import { ImCheckmark } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import Button from "react-bootstrap/lib/Button";
import Image from "react-bootstrap/lib/Image";
import API from "@aws-amplify/api";
import BlockContent from "@sanity/block-content-to-react";
import { Slide, Dialog } from "@mui/material";
import { I18n } from "@aws-amplify/core";
import Tour from "reactour";
import classNames from "classnames";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import PaywallModal from "./PaywallModal";
import question from "../assets/help.png";
import { generateEmail } from "../libs/errorEmail";
import { successToast, errorToast } from "../libs/toasts";
import ApproveExperienceModal from "./ApproveExperienceModal";
import NewSubmitModal from "./NewSubmitProofModal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This module is where the bulk of the experience module system lies.
 * @TODO Issue #48
 * @TODO Issue #6
 * @TODO Issue #27
 * @TODO Issue #53
 */

class ExperienceModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isTourOpen: false,
      user: {
        fName: "",
        lName: "",
        id: "8020",
      },
      activeExperience: {
        title: "",
        amount: 0,
        overview: [],
        completed: false,
        priority: "_01",
        _type: "interviewSchema",
        github: "",
        athleteNotes: "",
      },
      experience: [],
      mongoExperience: {
        id: "",
      },
      openReviewModal: false,
      showPaywallDialog: this.props.user.learningPurchase === false,
      experienceId: "",
      // this shows the proof submission modal, which needs work
      showSubmitModal: false,
      language: "en",
    };
  }

  closeTour = () => {
    this.setState({
      isTourOpen: false,
    });
  };

  async componentDidMount() {
    let lengua;
    let str = I18n.get("close");
    if (str === "Cerrar") {
      lengua = "es";
    } else {
      lengua = "en";
    }

    I18n.setLanguage(lengua);
    this.setState({ language: lengua });
    if (this.props.user.learningPurchase === true) {
      await this.dataFetch();
    }
  }

  async UNSAFE_componentWillReceiveProps() {
    let lengua;
    let str = I18n.get("close");
    if (str === "Close") {
      lengua = "en";
    } else {
      lengua = "es";
    }
    I18n.setLanguage(lengua);
    this.setState({ language: lengua });
    this.setState({ isLoading: true });
    if (this.props.user.learningPurchase === true) {
      await this.dataFetch();
    }
  }

  async dataFetch() {
    // we need to have a admin-related fetch option, as working here
    // we also need to have a faster option to fetch data

    let pathArray = window.location.pathname.split("/");
    let path = pathArray[2];
    let expType;

    let comparisonData = await API.get("pareto", `/experience/${path}`);

    if (comparisonData[0].type === "Apprenticeship") {
      expType = this.props.sanityTraining;
    } else if (comparisonData[0].type === "Product") {
      expType = this.props.sanityProduct;
    } else if (comparisonData[0].type === "Interviewing") {
      expType = this.props.sanityInterview;
    }

    this.setState({
      experience: expType,
      mongoExperience: comparisonData[0],
      experienceId: comparisonData[0].id,
      activeExperience: expType[0],
      isLoading: false,
    });

    let athleteProfile = await API.get(
      "pareto",
      `/users/${comparisonData[0].memberId}`
    );
    this.setState({ user: athleteProfile[0] });
  }

  markSubmitted = async (milestone, githubLink, athleteNotes) => {
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
        `Your athlete ${this.state.user.fName} ${this.state.user.lName} has submitted the work submitted for the milestone called '${this.state.activeExperience.title}. There is ${milestoneXP} XP at stake - you are doing a great job providing mentorship and guidance!'`
      );
      const updatedExperienceModule = await API.put(
        "pareto",
        `/experience/${this.state.experienceId}`,
        { body }
      );
      this.setState({
        showSubmitModal: false,
        mongoExperience: updatedExperienceModule,
      });
      await API.post("util", "/email", {
        body: {
          recipient: this.props.user.email,
          sender: "michael@fsa.community",
          subject: "Pareto Achievement For Review",
          htmlBody: email,
          textBody: "Pareto Achievement For Review.",
        },
      });
      successToast("Achievement submitted successfully!");
    } catch (e) {
      errorToast(e);
    }
  };

  markRequestRevisions = async (milestone, mongoExperience, coachNotes) => {
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
        `Your coach has requested that the work submitted for the milestone called '${this.state.activeExperience.title}' be revised according to their feedback. Please log-in to https://arena.pareto.education for their details. There is ${milestoneXP} XP at stake - you are doing a great job learning and growing every day!'`
      );
      const updatedExperienceModule = await API.put(
        "pareto",
        `/experience/${this.state.experienceId}`,
        { body }
      );
      this.setState({
        showSubmitModal: false,
        mongoExperience: updatedExperienceModule,
      });
      await API.post("util", "/email", {
        body: {
          recipient: this.state.user.email,
          sender: "michael@fsa.community",
          subject: "Pareto Achievement For Review",
          htmlBody: email,
          textBody: "Pareto Achievement For Review.",
        },
      });
      successToast("Achievement sent back for further review.");
    } catch (e) {
      errorToast(e);
    }
  };

  markComplete = async (milestone, mongoExperience, coachNotes) => {
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
      xpEarned: this.state.mongoExperience.xpEarned + milestoneXP,
      achievements: this.state.mongoExperience.achievements + 1,
    };
    try {
      let email = generateEmail(
        `Pareto Achievement Unlocked!`,
        `Congratulations! Your coach has approved the work submitted for the milestone called '${this.state.activeExperience.title}'. You have earned ${milestoneXP} XP - you are doing a great job!'`
      );

      const updatedExperienceModule = await API.put(
        "pareto",
        `/experience/${this.state.experienceId}`,
        { body }
      );
      this.setState({
        showSubmitModal: false,
        mongoExperience: updatedExperienceModule,
        openReviewModal: false,
      });
      await API.post("util", "/email", {
        body: {
          recipient: "mikhael@hey.com",
          sender: "michael@fsa.community",
          subject: "Pareto Achievement Unlocked",
          htmlBody: email,
          textBody: "Pareto Achievement Unlocked.",
        },
      });
      successToast("Achievement submitted successfully!");
    } catch (e) {
      errorToast(e);
    }
  };

  renderExperienceList = (topics, activeExperience, mongoExperience) => {
    let inactiveBlock = classNames("block", "first-step-exp");
    let activeBlock = "highlight-block";

    return topics.map((topic, i) => {
      let title;
      let activeClass = false;
      if (this.state.language === "en") {
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
            this.setState({
              activeExperience: topic,
            });
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

  renderExperienceInfo(activeExperience, mongoExperience) {
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
                onClick={() => this.setState({ showSubmitModal: true })}
                style={{ marginTop: 16, marginRight: 10, fontSize: 16 }}
              >
                <HiOutlineClipboardCheck /> {I18n.get("markAsComplete")}
              </Button>
            )}
            {this.props.user.instructor === true &&
            mongoExperience[activeExperience.priority].completed === true ? (
              <Button onClick={() => this.setState({ openReviewModal: true })}>
                <HiOutlineClipboardCheck /> {I18n.get("reviewWork")}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  handleCloseSubmit = () => {
    this.setState({
      showSubmitModal: false,
    });
  };

  render() {
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
          <Image
            src={question}
            onClick={(event) => {
              event.preventDefault();
              this.setState({ isTourOpen: true });
            }}
            height="40"
            width="40"
            circle
            style={{ marginLeft: 20, cursor: "pointer" }}
          />
        </h1>
        <div className="experience-container flex">
          <div style={{ flexBasis: "30%" }} className="overflow">
            {this.state.isLoading === true ? (
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
                {this.renderExperienceList(
                  this.state.experience,
                  this.state.activeExperience,
                  this.state.mongoExperience
                )}
              </div>
            )}
          </div>
          {this.state.isLoading === true ? (
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
                  {this.state.language === "en"
                    ? this.state.activeExperience.title
                    : this.state.activeExperience.esTitle}
                </h3>
                {this.renderExperienceInfo(
                  this.state.activeExperience,
                  this.state.mongoExperience
                )}
              </div>
              <h4>{this.state.activeExperience.amount} EXP</h4>
              <div className="fourth-step-exp">
                {this.state.language === "en" ? (
                  <BlockContent blocks={this.state.activeExperience.overview} />
                ) : (
                  <BlockContent
                    blocks={this.state.activeExperience.esOverview}
                  />
                )}
              </div>
            </div>
          )}
          <Dialog
            style={{
              margin: "auto",
            }}
            open={this.state.showPaywallDialog}
            TransitionComponent={Transition}
            keepMounted
            hideBackdrop={false}
            aria-labelledby="loading"
            aria-describedby="Please wait while the page loads"
            onClose={(event, reason) => {
              if (
                reason !== "backdropClick" &&
                reason !== "escapeKeyDown" &&
                this.props.user.learningPurchase === false
              ) {
                this.setState({ ...this.state, showPaywallDialog: false });
                history.push("/");
              }
            }}
          >
            <PaywallModal {...this.props} open={this.state.showPaywallDialog} />
          </Dialog>
        </div>
        {this.state.isLoading === true ? (
          <></>
        ) : (
          <>
            <NewSubmitModal
              show={this.state.showSubmitModal}
              handleClose={this.handleCloseSubmit}
              activeExperience={this.state.activeExperience}
              markComplete={this.markComplete}
              markSubmitted={this.markSubmitted}
              mongoExperience={this.state.mongoExperience}
            />
            <ApproveExperienceModal
              show={this.state.openReviewModal}
              activeExperience={this.state.activeExperience}
              markComplete={this.markComplete}
              markRequestRevisions={this.markRequestRevisions}
              mongoExperience={this.state.mongoExperience}
              closeModal={() => this.setState({ openReviewModal: false })}
            />
            <Tour
              steps={steps}
              isOpen={this.state.isTourOpen}
              onRequestClose={this.closeTour}
              showCloseButton
              rewindOnClose={false}
            />
          </>
        )}
      </div>
    );
  }
}

export default ExperienceModule;
