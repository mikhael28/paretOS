import React, { useState } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Modal from "react-bootstrap/lib/Modal";
import BlockContent from "@sanity/block-content-to-react";
import { I18n } from "@aws-amplify/core";

/**
 * This component is for a Coach to approve the work of the student, and to leave feedback.
 * @TODO Issue #64
 */

const ConfirmModal = (props) => {
  const [coachNotes, setCoachNotes] = useState("");

  function handleChange(event) {
    setCoachNotes(event.target.value);
  }

  return (
    <React.Fragment>
      <Modal show={props.show} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {I18n.get("reviewFor")} {props.activeExperience.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 style={{ marginTop: -4 }}>{I18n.get("description")}</h3>
          <BlockContent blocks={props.activeExperience.overview} />
          <h3>{I18n.get("notesForCoach")}</h3>
          <p>
            {
              props.mongoExperience[props.activeExperience.priority]
                .athleteNotes
            }
          </p>
          <h3>{I18n.get("submitLink")}</h3>
          <a
            href={props.mongoExperience[props.activeExperience.priority].github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {I18n.get("openLink")}
          </a>
          <h3>{I18n.get("attachment")} (PDF, JPG, MP3, etc)</h3>
          <a
            href={`https://${process.env.REACT_APP_PROOF_BUCKET}-prod.s3.amazonaws.com/public/${props.mongoExperience.id}${props.activeExperience.priority}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {I18n.get("clickToDownload")}
          </a>
          <br />
          {props.mongoExperience[props.activeExperience.priority].coachNotes
            .length > 0 ? (
            <React.Fragment>
              <h3>{I18n.get("coachesNotes")}</h3>
              <p>
                {
                  props.mongoExperience[props.activeExperience.priority]
                    .coachNotes
                }
              </p>
            </React.Fragment>
          ) : (
            <FormGroup bsSize="large" controlId="coachNotes">
              <ControlLabel>{I18n.get("coachesNotes")}</ControlLabel>
              <FormControl
                type="text"
                onChange={handleChange}
                value={coachNotes}
              />
            </FormGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex">
            <Button onClick={props.closeModal}>{I18n.get("close")}</Button>

            {props.mongoExperience[props.activeExperience.priority].approved ===
            true ? null : (
              <React.Fragment>
                {props.mongoExperience[props.activeExperience.priority]
                  .revisionsNeeded === false ? (
                  <Button
                    onClick={() => {
                      props.markRequestRevisions(
                        props.activeExperience,
                        props.mongoExperience,
                        coachNotes
                      );
                    }}
                  >
                    {I18n.get("requestRevisions")}
                  </Button>
                ) : null}
                <Button
                  onClick={() => {
                    props.markComplete(
                      props.activeExperience,
                      props.mongoExperience,
                      coachNotes
                    );
                  }}
                >
                  {I18n.get("confirmAchievement")}
                </Button>
              </React.Fragment>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};
export default ConfirmModal;
