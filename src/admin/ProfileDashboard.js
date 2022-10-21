import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Image from "react-bootstrap/lib/Image";
import uuidv4 from "uuid";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import classNames from "classnames";
import Tour from "reactour";
import { errorToast } from "../libs/toasts";
import ArenaDashboard from "../containers/ArenaDashboard";
import LoaderButton from "../components/LoaderButton";
import question from "../assets/help.png";
import ExperienceSummary from "../components/ExperienceSummary";
import Athlete from "../components/Athlete";
import logo from "../assets/Pareto_Lockup-01.png";

export default class ProfileDashboard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			users: [],
			providers: [],
			summary: "",
			user: {
				notes: [],
				ideas: [],
				projects: [],
			},
			id: "",
			idea: "",
			note: "",
			github: "https://github.com/",
			githubProfile: "",
			name: "",
			description: "",
			summaryCheck: false,
			editName: false,
			addNote: false,
			addIdea: false,
			addProject: false,
			school: "",
			team: [],
			tools: [],
			fName: "",
			lName: "",
			createdBy: "",
			acceptedTOS: false,
			uuid: uuidv4(),
			type: "mentee",
			text: "",
			isTourOpen: false,
			noteLoading: false,
			picture:
				"https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp",
		};
	}

	async componentDidMount() {
		const path = window.location.pathname.split("/");
		let userId;
		if (window.location.pathname === "/") {
			userId = this.props.username;
			this.setState({
				user: this.props.user,
				id: userId,
				summary: this.props.user.summary,
				fName: this.props.user.fName,
				lName: this.props.user.lName,
				note: this.props.user.notes[0],
			});
		} else {
			userId = path[path.length - 1];
			const response = await API.get("pareto", `/users/${userId}`);
			this.setState({
				user: response[0],
				id: userId,
				summary: response[0].summary,
				fName: response[0].fName,
				lName: response[0].lName,
				note: response[0].notes[0],
			});
		}
	}

	closeTour = () => {
		this.setState({
			isTourOpen: false,
		});
	};

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value,
		});
	};

	handleRichChange = (value) => {
		this.setState({
			note: value,
		});
	};

	handleDescription = (value) => {
		this.setState({
			description: value,
		});
	};

	handleProviderChange = (event) => {
		this.setState({
			[event.target.id]: JSON.parse(event.target.value),
		});
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ isLoading: true });

		let body = {
			summary: this.state.summary,
		};
		try {
			const response = await API.put("pareto", `/users/${this.state.id}`, {
				body,
			});
			this.setState({ user: response, summaryCheck: false });
		} catch (e) {
			console.log("email send error: ", e);
			// toast(e, { type: toast.TYPE.ERROR})
		}
		this.setState({ isLoading: false });
	};

	editName = async () => {
		let body = {
			fName: this.state.fName,
			lName: this.state.lName,
		};
		try {
			const newName = await API.put("pareto", `/users/${this.state.id}`, {
				body,
			});
			this.setState({ user: newName, editName: false });
		} catch (e) {
			console.log(e);
		}
	};

	addIdea = async () => {
		let ideas = this.state.user.ideas.slice();
		ideas.push(this.state.idea);
		let body = {
			ideas: ideas,
		};
		try {
			let response = await API.put("pareto", `/users/${this.state.user.id}`, {
				body,
			});
			this.setState({ user: response, idea: "", addIdea: false });
		} catch (e) {
			console.log(e);
		}
	};

	addNote = async () => {
		this.setState({ noteLoading: true });
		let notes = this.state.user.notes.slice();
		notes.push(this.state.text);
		let body = {
			notes: notes,
		};
		try {
			const response = await API.put("pareto", `/users/${this.state.user.id}`, {
				body,
			});
			this.setState({
				user: response,
				note: "",
				addNote: false,
				noteLoading: false,
			});
		} catch (e) {
			errorToast(e, this.props.user);
			this.setState({ noteLoading: false });
		}
	};

	editNote = async () => {
		this.setState({ noteLoading: true });

		try {
			const updatedJournal = await API.put(
				"pareto",
				`/users/${this.state.user.id}`,
				{
					body: {
						notes: [this.state.note],
					},
				}
			);
			this.setState({
				user: updatedJournal,
				addNote: false,
				noteLoading: false,
			});
		} catch (e) {
			errorToast(e, this.props.user);
		}
	};

	deleteNote = async (event, note) => {
		event.preventDefault();
		let newNotes = this.state.user.notes.map((note) => note);
		delete newNotes[note];
		let body = {
			notes: newNotes,
		};
		try {
			const updated = await API.put("pareto", `/users/${this.state.id}`, {
				body,
			});
			this.setState({ user: updated });
		} catch (e) {
			console.log(e);
		}
	};

	onChange = async (e) => {
		const file = e.target.files[0];
		let fileType = e.target.files[0].name.split(".");

		try {
			let pictureKey = await Storage.put(
				`48150f13-679a-40fc-9f23-b4ebe4af6f08.${fileType[1]}`,
				file,
				{
					contentType: "image/*",
					bucket: "paretophotos",
				}
			);
			console.log("Key: ", pictureKey);
			let updatedProfile = await API.put(
				"pareto",
				`/users/${this.state.user.id}`,
				{
					body: {
						picture: `https://paretophotos.s3.amazonaws.com/public/${pictureKey.key}`,
					},
				}
			);
			console.log(updatedProfile);
			this.setState({
				user: updatedProfile,
			});
			// need to save the key
		} catch (e) {
			errorToast(e);
		}
	};

	render() {
		const steps = [
			{
				selector: ".first-step-home",
				content: `${I18n.get("homeFirst")}`,
			},
			{
				selector: ".second-step-home",
				content: `${I18n.get("homeSecond")}`,
			},
			// {
			// 	selector: '.third-step-home',
			// 	content: `${I18n.get('homeThird')}`
			// }
		];
		const blockContextClass = classNames("context-cards");
		return (
			<div className="flex-down">
				{/* <div className="flex">
					<div className="first-step-home">
						{this.state.editName === false ? (
							<div className="flex">
								<img
									src={this.state.user.picture || this.state.picture}
									height="50"
									width="50"
									alt="Profile"
									style={{ marginTop: 26, marginLeft: 15 }}
								/>

								<h1>
									{this.state.user.fName} {this.state.user.lName}
								</h1>
								<Glyphicon
									onClick={() => this.setState({ editName: true })}
									glyph="glyphicon glyphicon-pencil"
									height="33"
									width="33"
									style={{ marginTop: 54, marginLeft: 6, cursor: 'pointer' }}
								/>
							</div>
						) : (
							<div className="flex">
								<div className="flex-down" style={{ marginTop: 20 }}>
									<div className="flex">
										<FormGroup controlId="fName" bsSize="large">
											<ControlLabel>First Name</ControlLabel>
											<FormControl value={this.state.fName} onChange={this.handleChange} />
										</FormGroup>
										<FormGroup controlId="lName" bsSize="large">
											<ControlLabel>Last Name</ControlLabel>
											<FormControl value={this.state.lName} onChange={this.handleChange} />
										</FormGroup>
									</div>
									<Button onClick={this.editName}>Edit Name</Button>
								</div>
								<div className="flex-down" style={{ marginTop: 28 }}>
									<h3>Change Profile Picture</h3>
									<input type="file" accept="image/*" onChange={(evt) => this.onChange(evt)} />
									<Button onClick={() => this.setState({ editName: false })}>Cancel</Button>
								</div>
							</div>
						)}
					</div>
				</div> */}

				{/* <div>
					{this.state.summaryCheck ? (
						<React.Fragment>
							<FormGroup controlId="summary" bsSize="large">
								<ControlLabel>Public Bio</ControlLabel>
								<FormControl
									value={this.state.summary}
									onChange={this.handleChange}
									componentClass="textarea"
								/>
							</FormGroup>
							<div className="flex">
								<Button onClick={() => this.setState({ summaryCheck: false })}>Cancel</Button>

								<LoaderButton
									align="center"
									block
									bsSize="small"
									type="submit"
									// disabled={!this.validateForm()}
									onClick={this.handleSubmit}
									isLoading={this.state.isLoading}
									text="Update Summary"
									loadingText="Creation"
								/>
							</div>
						</React.Fragment>
					) : (
						<React.Fragment>
							<p>
								{this.state.user.summary}{' '}
								<Glyphicon
									onClick={() => this.setState({ summaryCheck: true })}
									glyph="glyphicon glyphicon-pencil"
									height="33"
									width="33"
									style={{ marginLeft: 6, cursor: 'pointer' }}
								/>
							</p>
						</React.Fragment>
					)}
				</div> */}

				<div className="flex">
					<h1 style={{ marginLeft: 0, marginBottom: -5, marginTop: 32 }}>
						User Profile
					</h1>
				</div>

				<div className="row">
					{/* style below */}

					<div className="col-xs-12 col-sm-5">
						<ArenaDashboard
							sprints={this.props.sprints}
							history={this.props.history}
							user={this.props.user}
							fetchMenteeSprints={this.props.fetchMenteeSprints}
						/>

						<div
							style={{ display: "flex", flexGrow: 1, flexDirection: "column" }}
						>
							{this.props.user.instructor === true &&
								this.props.athletes.length > 0 ? (
								<div className={blockContextClass}>
									{this.props.athletes.map((athlete, idx) => (
										<Athlete
											athlete={athlete.mentee}
											key={idx}
											history={this.props.history}
										/>
									))}
								</div>
							) : null}
						</div>
					</div>
					<Tour
						steps={steps}
						isOpen={this.state.isTourOpen}
						onRequestClose={this.closeTour}
					// showCloseButton={true}
					// rewindOnClose={false}
					/>
				</div>
			</div>
		);
	}
}
