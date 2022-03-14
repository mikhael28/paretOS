import { useState } from "react";
import Button from "react-bootstrap/lib/Button";
import Modal from "react-bootstrap/lib/Modal";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { I18n } from "@aws-amplify/core";
import LoaderButton from "./LoaderButton";
import { errorToast, successToast } from "../libs/toasts";
import uploadToS3 from "../libs/s3";

/**
 * The Arena Proof Modal is where a player submits the proof of their achievement, and where they/their coach (I believe - review) can review the proof.
 * @TODO #89
 * @TODO #87
 * @TODO #26
 */

export default function ArenaProofModal({
  day,
  view,
  show,
  user,
  sprint,
  handleClose,
  activeIndex,
  activeMission,
  activeSprintId,
  handleChange: propsHandleChange,
}) {
  const [formData, setFormData] = useState({
    trashTalk: "",
    athleteNotes: "",
    key: "",
    github: "",
    experienceId: "",
  });
  //   const [isChanging, setIsChanging] = useState(false);
  const [loading, setLoading] = useState(false);

  //   const validateForm = () => athleteNotes.length > 0 && github.length > 0;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const onChange = async (e) => {
    setLoading(true);

    let fileType = e.target.files[0].name.split(".");
    const file = e.target.files[0];
    // the name to save is the sprint_id_teamIndex_dayIndex_missionIndex
    try {
      const pictureKey = await uploadToS3(
        `${sprint.id}_0_${day}_${activeIndex}`,
        file,
        fileType[1]
      );

      setFormData({ ...formData, key: pictureKey.key });
      successToast("Proof successfully uploaded.");
      setLoading(false);
    } catch (e) {
      errorToast(e);
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{I18n.get("submitProof")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {view === "submit" ? (
            <>
              <FormGroup bsSize="large" controlId="trashTalk">
                <ControlLabel>{I18n.get("trashTalkPSA")}</ControlLabel>
                <FormControl
                  type="text"
                  onChange={handleChange}
                  value={formData.trashTalk}
                />
              </FormGroup>
              <h3>{I18n.get("attachment")}</h3>
              <input type="file" onChange={(evt) => onChange(evt)} />
              <br />
              <div className="flex">
                <Button onClick={handleClose}>{I18n.get("close")}</Button>
                <LoaderButton
                  onClick={() => {
                    propsHandleChange(
                      activeMission,
                      activeIndex,
                      day,
                      formData.key,
                      activeSprintId,
                      `${user.fName} just completed ${activeMission.title}.${
                        formData.trashTalk.length > 0
                          ? `They also said: "${formData.trashTalk}"`
                          : ""
                      } `
                    );
                    setFormData({ trashTalk: "" });
                    setFormData({ ...formData, key: "" });
                    handleClose();
                  }}
                  bsSize="large"
                  text={I18n.get("submitProof")}
                  loadingText={I18n.get("creating")}
                  // ? Is there a reason this is commented?
                  // disabled={!this.validateForm()}
                  isLoading={loading}
                />
              </div>
            </>
          ) : (
            <div>
              {activeMission.proofLink !== "" ? (
                <a
                  href={`https://${process.env.REACT_APP_PROOF_BUCKET}.s3.amazonaws.com/public/${activeMission.proofLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {I18n.get("viewProof")}
                </a>
              ) : (
                <p>{I18n.get("noProof")}</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </div>
  );
}
