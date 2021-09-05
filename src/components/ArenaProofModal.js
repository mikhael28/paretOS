import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Modal from "react-bootstrap/lib/Modal";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "./LoaderButton";
import { errorToast, successToast } from "../libs/toasts";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import { uploadToS3 } from "../libs/s3";

/**
 * The Arena Proof Modal is where a player submits the proof of their achievement, and where they/their coach (I believe - review) can review the proof.
 * @TODO How to disable the form, based on inputs - like, for example, a mandatory proof request.
 * @TODO How to integrate different type of proof requests? For example, a 'check-in' that only checks for the time it was submitted?
 * @TODO Replace Modal from react-bootstrap, as it uses out-dated componentWillReceiveProps functionality and that will at some point be a no-go, even in node_modules
 * @TODO Test for whether mp3s/mp4s work.
 * @TODO Render the image/mp3/mp4 inside the modal, instead of going to the S3 bucket URL and exposing its id.
 */

export default class ArenaProofModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			athleteNotes: "",
			github: "https://github.com/",
			isChanging: false,
			isLoading: false,
			experienceId: "",
			key: "",
			trashTalk: "",
		};
	}

	validateForm() {
		return this.state.athleteNotes.length > 0 && this.state.github.length > 0;
	}

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value,
		});
	};

	onChange = async (e) => {
		this.props.setLoading(true);
		let fileType = e.target.files[0].name.split(".");
		const file = e.target.files[0];
		// the name to save is the sprint_id_teamIndex_dayIndex_missionIndex
		try {
			// let pictureKey = await Storage.put(
			//   `${this.props.sprint.id}_0_${this.props.day}_${this.props.activeIndex}.${fileType[1]}`,
			//   file,
			//   {
			//     bucket: process.env.REACT_APP_PROOF_BUCKET,
			//   }
			// );

			const pictureKey = uploadToS3(
				`${this.props.sprint.id}_0_${this.props.day}_${this.props.activeIndex}`,
				file,
				fileType[1]
			);

			this.setState({ key: pictureKey.key });
			successToast("Proof successfully uploaded.");
			this.props.setLoading(false);
		} catch (e) {
			errorToast(e);
			this.props.setLoading(false);
		}
	};

	render() {
		return (
			<div>
				<Modal show={this.props.show} onHide={this.props.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{I18n.get("submitProof")}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.props.view === "submit" ? (
							<React.Fragment>
								<FormGroup bsSize="large" controlId="trashTalk">
									<ControlLabel>{I18n.get("trashTalkPSA")}</ControlLabel>
									<FormControl
										type="text"
										onChange={this.handleChange}
										value={this.state.trashTalk}
									/>
								</FormGroup>
								<h3>{I18n.get("attachment")}</h3>
								<input type="file" onChange={(evt) => this.onChange(evt)} />
								<br />
								<div className="flex">
									<Button onClick={this.props.handleClose}>
										{I18n.get("close")}
									</Button>
									<LoaderButton
										onClick={() => {
											this.props.handleChange(
												this.props.activeMission,
												this.props.activeIndex,
												this.props.day,
												this.state.key,
												this.props.activeSprintId,
												`${this.props.user.fName} just completed ${
													this.props.activeMission.title
												}.${
													this.state.trashTalk.length > 0
														? `They also said: "${this.state.trashTalk}"`
														: ""
												} `
											);
											this.setState({ key: "", trashTalk: "" });
											this.props.handleClose();
										}}
										bsSize="large"
										text={I18n.get("submitProof")}
										loadingText={I18n.get("creating")}
										// disabled={!this.validateForm()}
										isLoading={this.props.loading}
									/>
								</div>
							</React.Fragment>
						) : (
							<div>
								{this.props.activeMission.proofLink !== "" ? (
									<a
										href={`https://${process.env.REACT_APP_PROOF_BUCKET}-prod.s3.amazonaws.com/public/${this.props.activeMission.proofLink}`}
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
}
