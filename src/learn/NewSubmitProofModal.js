import { useState } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";
import { I18n } from "@aws-amplify/core";
import LoaderButton from "../components/LoaderButton";
// import { errorToast, successToast } from "../libs/toasts";
// import uploadToS3 from "../libs/s3";

/**
 * This is the modal where a player submits the proof for their Arena event
 * @TODO Issue #26
 */

export default function SubmitProof({
  show,
  handleClose,
  markSubmitted,
  activeExperience,
  // mongoExperience,
}) {
  const [isChanging, setChanging] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [experienceId, setExperienceId] = useState("");
  const [formData, setFormData] = useState({ github: "", athleteNotes: "" });

  const validateForm = () =>
    formData.athleteNotes.length > 0 && formData.github.length > 0;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  // const onChange = async (e) => {
  //   const file = e.target.files[0];
  //   let fileType = e.target.files[0].name.split(".");

  //   // the name to save is the id of the experience_01 or whatever the number is.
  //   try {
  //     await uploadToS3(
  //       `${mongoExperience.id}${activeExperience.priority}`,
  //       file,
  //       fileType[1]
  //     );

  //     successToast("Proof successfully uploaded.");
  //   } catch (err) {
  //     errorToast(err);
  //   }
  // };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{I18n.get("submitProof")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup bsSize="large" controlId="athleteNotes">
            <ControlLabel>{I18n.get("notesForCoach")}</ControlLabel>
            <FormControl
              type="text"
              onChange={handleChange}
              value={formData.athleteNotes}
            />
          </FormGroup>
          <FormGroup bsSize="large" controlId="github">
            <ControlLabel>{I18n.get("submitLink")}</ControlLabel>
            <FormControl
              type="text"
              onChange={handleChange}
              value={formData.github}
            />
          </FormGroup>
          {/* <h3>{I18n.get("attachment")}</h3>
          <input
            type="file"
            accept="image/png"
            onChange={(evt) => onChange(evt)}
          /> */}
          <br />
          <div className="flex">
            <Button onClick={handleClose}>{I18n.get("close")}</Button>
            <LoaderButton
              block
              onClick={() => {
                setChanging(true);
                markSubmitted(
                  activeExperience,
                  formData.github,
                  formData.athleteNotes
                );
                setFormData({
                  athleteNotes: "",
                  github: "",
                });
                setChanging(false);
              }}
              size="large"
              text={I18n.get("submitProof")}
              loadingText={I18n.get("saving")}
              disabled={!validateForm()}
              isLoading={isChanging}
            />
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </div>
  );
}
