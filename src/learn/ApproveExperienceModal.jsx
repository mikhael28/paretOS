import { useState } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Modal from "react-bootstrap/lib/Modal";
import { Button } from "@mui/material";
import { PortableText } from "@portabletext/react";
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
    <>
      <Modal show={props.show} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {I18n.get("reviewFor")} {props.activeExperience.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 style={{ marginTop: -4 }}>{I18n.get("description")}</h3>
          <PortableText value={props.activeExperience.overview} />
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
          {/* <h3>{I18n.get("attachment")} (PDF, JPG, MP3, etc)</h3>
          <a
            href={`https://${import.meta.env.VITE_PROOF_BUCKET}.s3.amazonaws.com/public/${props.mongoExperience.id}${props.activeExperience.priority}.png`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {I18n.get("clickToDownload")}
          </a> */}
          <br />
          {props.mongoExperience[props.activeExperience.priority].coachNotes
            .length > 0 ? (
            <>
              <h3>{I18n.get("coachesNotes")}</h3>
              <p>
                {
                  props.mongoExperience[props.activeExperience.priority]
                    .coachNotes
                }
              </p>
            </>
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
            <Button className="btn-cancel" onClick={props.closeModal}>
              {I18n.get("close")}
            </Button>

            {props.mongoExperience[props.activeExperience.priority].approved ===
            true ? null : (
              <>
                {props.mongoExperience[props.activeExperience.priority]
                  .revisionsNeeded === false ? (
                  <Button
                    className="btn"
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
                  className="btn"
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
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ConfirmModal;
