import React, { useState } from "react";
import Button from "react-bootstrap/lib/Button";
import Modal from "react-bootstrap/lib/Modal";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "./LoaderButton";
import { errorToast, successToast } from "../libs/toasts";
import { I18n } from "@aws-amplify/core";
import { uploadToS3 } from "../libs/s3";

/**
 * The Arena Proof Modal is where a player submits the proof of their achievement, and where they/their coach (I believe - review) can review the proof.
 * @TODO Can a coach see their students sprints? Lets review, and create this possibility if needed.
 * @TODO How to disable the form, based on inputs - like, for example, a mandatory proof request.
 * @TODO How to integrate different type of proof requests? For example, a 'check-in' that only checks for the time it was submitted?
 * @TODO Replace Modal from react-bootstrap, as it uses out-dated componentWillReceiveProps functionality and that will at some point be a no-go, even in node_modules
 * @TODO Test for whether mp3s/mp4s work.
 * @TODO Render the image/mp3/mp4 inside the modal, instead of going to the S3 bucket URL and exposing its id.
 */

export default function ArenaProofModal({
	day,
	view,
	show,
	sprint,
	loading,
	setLoading,
	handleClose,
	activeIndex,
	activeMission,
	activeSprintId,
	handleChange: propsHandleChange,
}) {
	const [formData, setFormData] = useState({ trashTalk: "" });
	const [athleteNotes, setAthleteNotes] = useState("");
	const [github, setGithub] = useState("");
	const [key, setKey] = useState("");
	const [experienceId, setExperienceId] = useState("");
	const [isChanging, setIsChanging] = useState(false);

	const validateForm = () => {
		return athleteNotes.length > 0 && github.length > 0;
	};

	const handleChange = (event) => {
		setFormData({
			[event.target.id]: event.target.value,
		});
	};

	const onChange = async (e) => {
		setLoading(true);

		let fileType = e.target.files[0].name.split(".");
		const file = e.target.files[0];
		// the name to save is the sprint_id_teamIndex_dayIndex_missionIndex
		try {
			const pictureKey = uploadToS3(
				`${sprint.id}_0_${day}_${activeIndex}`,
				file,
				fileType[1]
			);

			setKey(pictureKey.key);
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
						<React.Fragment>
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
											key,
											activeSprintId,
											`${user.fName} just completed ${activeMission.title}.${
												formData.trashTalk.length > 0
													? `They also said: "${formData.trashTalk}"`
													: ""
											} `
										);
										setFormData({ trashTalk: "" });
										setKey("");
										handleClose();
									}}
									bsSize="large"
									text={I18n.get("submitProof")}
									loadingText={I18n.get("creating")}
									// ! Is there a reason this is commented?
									// disabled={!this.validateForm()}
									isLoading={loading}
								/>
							</div>
						</React.Fragment>
					) : (
						<div>
							{activeMission.proofLink !== "" ? (
								<a
									href={`https://${process.env.REACT_APP_PROOF_BUCKET}-prod.s3.amazonaws.com/public/${activeMission.proofLink}`}
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
