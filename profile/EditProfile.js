import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Image from "react-bootstrap/lib/Image";
import LoaderButton from "../components/LoaderButton";
import uuidv4 from "uuid";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import generator from "generate-password";
import { errorToast } from "../libs/toasts";
import classNames from "classnames";
import Tour from "reactour";
import question from "../assets/help.png";
import "react-quill/dist/quill.snow.css";

/**
 * These are the forms where you can edit your profile.
 * @TODO we need to remove redundant items here
 * @TODO we need to drastically rework the UI, it looks terrible. This is probably the most neglected container in the entire repository, from a UI perspective. Desktop and mobile.
 */

export default class EditProfile extends Component {
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
      editSchool: false,
      school: "",
      team: [],
      tools: [],
      fName: "",
      lName: "",
      createdBy: "",
      acceptedTOS: false,
      uuid: generator.generate({
        length: 12,
        numbers: true,
      }),
      type: "mentee",
      text: "",
      isTourOpen: false,
      noteLoading: false,
      defaultLanguage: "",
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
        school: this.props.user.school,
        defaultLanguage: this.props.user.defaultLanguage,
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
        school: response[0].school,
        defaultLanguage: response[0].defaultLanguage,
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

  updateSchool = async () => {
    let body = {
      school: this.state.school,
    };
    try {
      const response = await API.put("pareto", `/users/${this.state.id}`, {
        body,
      });
      console.log(response);
      this.setState({ user: response });
    } catch (e) {
      console.log(e);
    }
  };

  updateLanguage = async () => {
    let body = {
      defaultLanguage: this.state.defaultLanguage,
    };
    try {
      const response = await API.put("pareto", `/users/${this.state.id}`, {
        body,
      });
      console.log(response);
      this.setState({ user: response });
    } catch (e) {
      console.log(e);
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

  addProject = async () => {
    let projects = this.state.user.projects.slice();

    let newProject = {
      id: uuidv4(),
      description: this.state.description,
      github: this.state.github,
      name: this.state.name,
      team: this.state.team,
      tools: this.state.tools,
    };
    projects.push(newProject);

    let body = {
      projects: projects,
    };
    try {
      const response = await API.put("pareto", `/users/${this.state.user.id}`, {
        body,
      });
      this.setState({
        user: response,
        description: "",
        github: "",
        name: "",
        team: [],
        tools: [],
        addProject: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  onChange = async (e) => {
    const file = e.target.files[0];
    let fileType = e.target.files[0].name.split(".");

    try {
      // @TODO: check to see whether this works for video, and what safeguards may not to be added.
      // @TODO: update this manual id for a dynamically generated one
      let pictureKey = await Storage.put(
        `48150f13-679a-40fc-9f23-b4ebe4af6f08.${fileType[1]}`,
        file,
        {
          contentType: "image/*",
          bucket: process.env.REACT_APP_PHOTO_BUCKET,
        }
      );
      console.log("Key: ", pictureKey);
      let updatedProfile = await API.put(
        "pareto",
        `/users/${this.state.user.id}`,
        {
          body: {
            picture: `https://${process.env.REACT_APP_PHOTO_BUCKET}.s3.amazonaws.com/public/${pictureKey.key}`,
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
        selector: ".third-step-home",
        content: `${I18n.get("homeThird")}`,
      },
    ];
    return (
      <div className="flex-down">
        <div className="flex">
          <div className="first-step-home">
            {this.state.editName === false ? (
              <div className="flex">
                <img
                  src={this.state.user.picture || this.state.picture}
                  height="50"
                  width="50"
                  alt="Profile"
                  style={{ marginTop: 26 }}
                />

                <h1>{this.state.user.fName}</h1>
                <Glyphicon
                  onClick={() => this.setState({ editName: true })}
                  glyph="glyphicon glyphicon-pencil"
                  height="33"
                  width="33"
                  style={{ marginTop: 54, marginLeft: 6, cursor: "pointer" }}
                />
                <Image
                  src={question}
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({ isTourOpen: true });
                  }}
                  height="50"
                  width="50"
                  circle
                  style={{
                    cursor: "pointer",
                    marginTop: 30,
                    marginLeft: 6,
                  }}
                />
              </div>
            ) : (
              <div className="flex">
                <div className="flex-down" style={{ marginTop: 20 }}>
                  <div className="flex">
                    <FormGroup controlId="fName" bsSize="large">
                      <ControlLabel>{I18n.get("firstName")}</ControlLabel>
                      <FormControl
                        value={this.state.fName}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="lName" bsSize="large">
                      <ControlLabel>{I18n.get("lastName")}</ControlLabel>
                      <FormControl
                        value={this.state.lName}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                  </div>
                  <Button onClick={this.editName}>
                    {I18n.get("editName")}
                  </Button>
                </div>
                <div className="flex-down" style={{ marginTop: 28 }}>
                  <h3>{I18n.get("changePicture")}</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(evt) => this.onChange(evt)}
                  />
                  <Button onClick={() => this.setState({ editName: false })}>
                    {I18n.get("cancel")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {this.state.editSchool === false ? (
          <p>
            {I18n.get("organization")}: {this.state.user.school}{" "}
            <Glyphicon
              onClick={() => this.setState({ editSchool: true })}
              glyph="glyphicon glyphicon-pencil"
              height="33"
              width="33"
              style={{ marginLeft: 6, cursor: "pointer" }}
            />
          </p>
        ) : (
          <div className="block">
            <FormGroup controlId="school" bsSize="large">
              <ControlLabel>{I18n.get("school")}</ControlLabel>
              <FormControl
                componentClass="select"
                onChange={this.handleChange}
                value={this.state.school}
              >
                <option value="No School">
                  {I18n.get("pleaseChooseAnOption")}
                </option>
                <option value="LCF">Latino Community Fund</option>
                <option value="PARETO">Pareto</option>
                <option value="JDSB">Junior Dev Struggle Bus</option>
              </FormControl>
            </FormGroup>
            <div className="button-space">
              <Button onClick={() => this.setState({ editSchool: false })}>
                {I18n.get("cancel")}
              </Button>
              <Button onClick={this.updateSchool}>
                {I18n.get("confirmation")}
              </Button>
            </div>
          </div>
        )}

        <FormGroup controlId="defaultLanguage" bsSize="large">
          <ControlLabel>Default Language</ControlLabel>
          <FormControl
            componentClass="select"
            onChange={this.handleChange}
            value={this.state.defaultLanguage}
          >
            <option value="en">Choose Here</option>
            <option value="en">English</option>
            <option value="lg">Luganda</option>
            <option value="ac">Acholi</option>
            <option value="es">Spanish</option>
          </FormControl>
        </FormGroup>

        <LoaderButton
          align="center"
          block
          bsSize="small"
          type="submit"
          // disabled={!this.validateForm()}
          onClick={this.updateLanguage}
          isLoading={this.state.isLoading}
          text="Update Language"
          loadingText="Updating..."
        />

        <div>
          {this.state.summaryCheck ? (
            <React.Fragment>
              <FormGroup controlId="summary" bsSize="large">
                <ControlLabel>{I18n.get("bio")}</ControlLabel>
                <FormControl
                  value={this.state.summary}
                  onChange={this.handleChange}
                  componentClass="textarea"
                />
              </FormGroup>
              <div className="flex">
                <Button onClick={() => this.setState({ summaryCheck: false })}>
                  {I18n.get("cancel")}
                </Button>

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
                {this.state.user.summary}{" "}
                <Glyphicon
                  onClick={() => this.setState({ summaryCheck: true })}
                  glyph="glyphicon glyphicon-pencil"
                  height="33"
                  width="33"
                  style={{ marginLeft: 6, cursor: "pointer" }}
                />
              </p>
            </React.Fragment>
          )}
        </div>
        <Button onClick={() => this.props.history.push("/settings/password")}>
          Edit Password
        </Button>

        <div className={classNames("row")}>
          <div className={classNames("col-xs-12 col-sm-6", "block")}>
            <h3>{I18n.get("projectIdeas")}</h3>
            {this.state.user.ideas.length < 1 ? (
              <p>{I18n.get("noIdeasYet")}</p>
            ) : (
              <React.Fragment>
                {this.state.user.ideas.map((idea, i) => {
                  return <h5>{idea}</h5>;
                })}
              </React.Fragment>
            )}

            {this.state.addIdea ? (
              <React.Fragment>
                <FormGroup controlId="idea" bsSize="large">
                  <ControlLabel>{I18n.get("enterNewProjectIdea")}</ControlLabel>
                  <FormControl
                    value={this.state.idea}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <button onClick={this.addIdea}>{I18n.get("save")}</button>
              </React.Fragment>
            ) : (
              <LoaderButton
                align="center"
                block
                bsSize="small"
                type="submit"
                // disabled={!this.validateForm()}
                onClick={() => this.setState({ addIdea: true })}
                isLoading={this.state.isLoading}
                text={I18n.get("save")}
                loadingText={I18n.get("saving")}
              />
            )}
          </div>

          <div className={classNames("block", "col-xs-12 col-sm-5")}>
            <h2 className="third-step-home">
              {I18n.get("projects")}{" "}
              <Glyphicon
                onClick={() => this.setState({ addProject: true })}
                glyph="glyphicon glyphicon-plus"
                height="33"
                width="33"
                style={{ marginLeft: 4, cursor: "pointer", marginTop: 2 }}
              />
            </h2>
            {this.state.user.projects.length < 1 ? (
              <p>{I18n.get("noProjectsYet")}</p>
            ) : (
              <React.Fragment>
                {this.state.user.projects.map((project, i) => {
                  return (
                    <div className="block">
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                      <h4>{project.github}</h4>
                    </div>
                  );
                })}
              </React.Fragment>
            )}
            {this.state.addProject ? (
              <div className="block">
                <FormGroup controlId="name" bsSize="large">
                  <ControlLabel>{I18n.get("projectName")}</ControlLabel>
                  <FormControl
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup controlId="description" bsSize="large">
                  <ControlLabel>{I18n.get("description")}</ControlLabel>
                  <FormControl
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="github" bsSize="large">
                  <ControlLabel>{I18n.get("githubRepository")}</ControlLabel>
                  <FormControl
                    value={this.state.github}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <div className="flex">
                  <Button onClick={() => this.setState({ addProject: false })}>
                    {I18n.get("cancel")}
                  </Button>

                  <Button onClick={this.addProject}>{I18n.get("save")}</Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* @TODO: Need to add GitHub editing functionality soon */}

        {/* <div>
					<FormGroup controlId="githubProfile" bsSize="large">
						<ControlLabel>GitHub Profile</ControlLabel>
						<FormControl value={this.state.githubProfile} onChange={this.handleChange} />
					</FormGroup>
				</div> */}

        <Tour
          steps={steps}
          isOpen={this.state.isTourOpen}
          onRequestClose={this.closeTour}
          // showCloseButton={true}
          // rewindOnClose={false}
        />
      </div>
    );
  }
}
