import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import API from "@aws-amplify/api";

import sortBy from "lodash.sortby";
import LoaderButton from "../components/LoaderButton";
import { errorToast, successToast } from "../libs/toasts";

export default class Matching extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			users: [],
			mentors: [],
			email: "",
			firstName: "",
			lastName: "",
			phone: "",
			city: "",
			state: "",
			zip: "",
			mentor: {
				id: "1",
				fName: "Select",
				lName: "here",
			},
			mentee: {
				id: "2",
				fName: "Select",
				lName: "here",
			},
			date: new Date(Date.now() + 86400000),
		};
	}

	async componentDidMount() {
		this.setState({ isLoading: true });
		try {
			const users = await API.get("pareto", "/users");
			const mentors = await API.get("pareto", "/mentors");
			this.setState({ users: users, mentors: mentors });
		} catch (e) {
			console.log("Admin fetching error: ", e);
		}
		this.setState({ isLoading: false });
	}

	onChange = (date) => this.setState({ date });

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value,
		});
	};

	handleMentorChange = (event) => {
		this.setState({
			[event.target.id]: JSON.parse(event.target.value),
		});
	};

	validateForm() {
		return this.state.mentee.id.length > 3 && this.state.mentor.id.length > 3;
	}

	sendMentorMatchEmail = async (email, name) => {
		let body = {
			recipient: email,
			sender: "mikhael@hey.com",
			subject: "Pareto has matched you with a Mentee",
			//   TODO replace with generate email
			textBody: `Congratulations, you have been paired with ${name} to help her program. Login to your account on our mobile application called The Full-Stack Apprenticeship, available on the google play store.`,
			htmlBody: `<p>Congratulations, you have been paired with ${name} to help her program. Login to your account on our mobile application called The Full-Stack Apprenticeship, available on the google play store.</p>`,
		};
		await API.post("pareto", "/email", { body });
	};

	sendMenteeMatchEmail = async (email, name) => {
		let body = {
			sender: "mikhael@hey.com",
			recipient: email,
			subject: "Pareto has matched you with a Mentor",
			textBody: `Congratulations, you have been paired with ${name} to help her program. Login to your account on our mobile application called The Full-Stack Apprenticeship, available on the google play store.`,
			htmlBody: `<p>Congratulations, you have been paired with ${name} to help her program. Login to your account on our mobile application called The Full-Stack Apprenticeship, available on the google play store.</p>`,
		};
		await API.post("pareto", "/email", { body });
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		this.setState({ isLoading: true });

		// const initialTasks = [{
		//     title: 'Action Step 0',
		//     details: 'This is where your mentor describes what they want you to do.',
		//     dueDate: 'TBD',
		//     complete: false,
		//     editorHtml: '<p>This is where your mentor describes what they want you to do</p>',
		//     // createdAt: new Date(),
		//     updatedAt: new Date()
		// }]

		const body = {
			id: `${this.state.mentor.id}_${this.state.mentee.id}`,
			mentee: this.state.mentee,
			mentor: this.state.mentor,
			tasks: [],
			coachId: this.state.mentor.id,
			athleteId: this.state.mentee.id,
			resources: [],
			events: [],
			reminders: [],
			accepted: true,
			completed: false,
			createdAt: new Date(),
		};

		try {
			console.log(body);
			await API.post("pareto", "/relationship", { body });
			// await this.sendMentorMatchEmail(
			// 	this.state.mentor.email,
			// 	`${this.state.mentee.fName} ${this.state.mentee.lName}`
			// );
			// await this.sendMenteeMatchEmail(
			// 	this.state.mentee.email,
			// 	`${this.state.mentor.fName} ${this.state.mentor.lName}`
			// );
			successToast("Relationship successfully created.");
		} catch (e) {
			errorToast(e);
		}
		this.setState({ isLoading: false });
		this.props.history.push("/admin");
	};

	renderMentorOptions = (mentors) => {
		let list = sortBy(mentors, function (o) {
			return o.fName;
		});
		return list.map((mentor, i) => (
			<option key={i} value={JSON.stringify(mentor)}>
				{mentor.fName} {mentor.lName}
			</option>
		));
	};

	renderMenteeOptions = (mentees) => {
		let list = sortBy(mentees, function (o) {
			return o.fName;
		});
		return list.map((mentee, i) => (
			<option key={i} value={JSON.stringify(mentee)}>
				{mentee.fName} {mentee.lName}
			</option>
		));
	};

	render() {
		return (
			<div style={{ marginTop: 10 }}>
				<div
					className="profile-view-box"
					style={{ marginLeft: 20, marginRight: 20 }}
				>
					<div className="profile-header-box">
						<h1>Create Match</h1>
						<FormGroup controlId="mentor">
							<ControlLabel>Choose Your Mentor</ControlLabel>
							<FormControl
								componentClass="select"
								onChange={this.handleMentorChange}
								value={this.state.mentor}
							>
								<option value="select">
									{`${this.state.mentor.fName} ${this.state.mentor.lName}`}
								</option>
								{this.renderMentorOptions(this.state.mentors)}
							</FormControl>
						</FormGroup>

						<h6>Mentor Information: </h6>
						<h2>
							{this.state.mentor.occupation} {this.state.mentor.city}
						</h2>
						<br />

						<FormGroup controlId="mentee">
							<ControlLabel>Choose Your Mentee</ControlLabel>
							<FormControl
								componentClass="select"
								onChange={this.handleMentorChange}
								value={this.state.mentee}
							>
								<option value="select">
									{`${this.state.mentee.fName} ${this.state.mentee.lName}`}
								</option>
								{this.renderMenteeOptions(this.state.users)}
							</FormControl>
						</FormGroup>

						<h6>Mentee Information</h6>
						<h2>
							{this.state.mentee.city} {this.state.mentee.state}
						</h2>
						<br />
						<div style={{ display: "flex", flexDirection: "column" }}>
							<br />
							<LoaderButton
								align="center"
								block
								disabled={!this.validateForm()}
								bsSize="small"
								type="submit"
								onClick={this.handleSubmit}
								isLoading={this.state.isLoading}
								text="Create Match"
								loadingText="Creating..."
							/>
							<br />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
