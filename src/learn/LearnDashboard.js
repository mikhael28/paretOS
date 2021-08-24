import React, { useState, useEffect } from "react";
import ExperienceSummary from "./ExperienceSummary";
import API from "@aws-amplify/api";
import classNames from "classnames";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import { errorToast, successToast } from "../libs/toasts";
import PaywallModal from "./PaywallModal";
import ReactQuill from "react-quill";
import { I18n } from "@aws-amplify/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This is the Learning Dashboard page, where the student sees their experience summaries (for navigation in mobile view) and the notepad, which they can use to take down notes and which will one day be expanded into a Roam-like daily notes system, into the ParetOS family of services.
 * @TODO how can we create a 'daily notes', Roam like experience here?
 * @TODO how can we more effectively allow navigation of users to their educational modules? This whole dashboard feels a big chunky.
 * @TODO create a simpler, home navigation system for mobile. Have a bunch of small cards, that go to routes.
 */

function LearnDashboard(props) {
  const [note, setNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    setNote(props.user.notes[0]);
  }, []);

  function handleRichChange(value) {
    setNote(value);
  }

  async function editNote() {
    setNoteLoading(true);

    try {
      await API.put("pareto", `/users/${props.user.id}`, {
        body: {
          notes: [note],
        },
      });
      setNoteLoading(false);
      successToast("Your journal was saved.");
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
            {props.coaches.map((coach, index) => {
              return (
                <div
                  className="exp-card"
                  style={{ display: "flex", justifyContent: "flex-start" }}
                  key={index}
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
              );
            })}
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
          <FormGroup controlId="note" bsSize="large" className="overflow">
            <ReactQuill
              value={note}
              onChange={handleRichChange}
              style={{ font: 20 }}
              onBlur={editNote}
            />
          </FormGroup>
        </div>
      </div>
      <Dialog
        style={{
          margin: "auto",
        }}
        open={props.user.learningPurchase === false}
        TransitionComponent={Transition}
        keepMounted
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
        hideBackdrop={false}
        aria-labelledby="loading"
        aria-describedby="Please wait while the page loads"
      >
        <PaywallModal {...props} />
      </Dialog>
    </div>
  );
}

export default LearnDashboard;
