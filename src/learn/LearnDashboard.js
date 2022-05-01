import React, { useState, useEffect } from "react";
import { init } from "pell";
import { RestAPI } from "@aws-amplify/api-rest";
import classNames from "classnames";
import { Slide, Dialog } from "@mui/material";
import { I18n } from "@aws-amplify/core";
import { errorToast, successToast } from "../libs/toasts";
import PaywallModal from "./PaywallModal";
import ExperienceSummary from "./ExperienceSummary";
import "pell/dist/pell.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This is the Learning Dashboard page, where the student sees their experience summaries (for navigation in mobile view) and the notepad, which they can use to take down notes and which will one day be expanded into a Roam-like daily notes system, into the ParetOS family of services.
 * @TODO Issue #32
 * @TODO Issue #55
 */

function LearnDashboard(props) {
  const [html, setHtml] = useState(null);
  const [showPaywallDialog, setShowPaywallDialog] = useState(
    props.user.learningPurchase === false
  );

  useEffect(() => {
    if (html === null) {
      const editor = init({
        element: document.getElementById("editor"),
        onChange: (html) => {
          console.log(html);
          setHtml(html);
        },
        actions: ["bold", "underline", "italic"],
      });
      setHtml(props.user.notes[0] ?? []);
      editor.content.innerHTML = props.user.notes[0];
    }
  }, []);

  async function editNote() {
    try {
      await RestAPI.put("pareto", `/users/${props.user.id}`, {
        body: {
          notes: [html],
        },
      });
      successToast("Journal saved 👍");
    } catch (e) {
      errorToast(e, props.user);
    }
  }
  return (
    <div>
      <h1>{I18n.get("apprenticeship")}</h1>
      <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
        <div
          className="col-xs-12 col-sm-4"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h2>{I18n.get("myMentors")}</h2>
          <div className="exp-cards" style={{ justifyContent: "start" }}>
            {props.coaches.map((coach) => (
              <div
                className="exp-card"
                style={{ display: "flex", justifyContent: "flex-start" }}
                key={coach._id}
              >
                <img
                  src={coach.mentor.picture}
                  height="50"
                  width="50"
                  alt="Profile"
                />
                <p style={{ marginTop: 14, paddingLeft: 10 }}>
                  {" "}
                  {coach.mentor.fName} {coach.mentor.lName}
                </p>
              </div>
            ))}
          </div>
          <div>
            <h2>{I18n.get("myCareer")}</h2>

            <div
              style={{ marginLeft: -4 }}
              className={classNames("context-cards-start")}
            >
              <ExperienceSummary {...props.training} history={props.history} />
              <ExperienceSummary {...props.product} history={props.history} />
              <ExperienceSummary
                {...props.interviewing}
                history={props.history}
              />
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-8" style={{ marginTop: 20 }}>
          <h3>Journal</h3>
          <div id="editor" className="pell" onBlur={editNote} />
        </div>
      </div>
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
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setShowPaywallDialog(false);
            history.push("/");
          }
        }}
      >
        <PaywallModal {...props} open={showPaywallDialog} />
      </Dialog>
    </div>
  );
}

export default LearnDashboard;
