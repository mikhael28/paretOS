import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Image from "react-bootstrap/lib/Image";
import LoaderButton from "../components/LoaderButton";
import { v4 as uuidv4 } from 'uuid';
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import { errorToast } from "../libs/toasts";
import Tour from "reactour";
import question from "../assets/help.png";
// import "react-quill/dist/quill.snow.css";
import Languages from "../profile/Languages";

/**
 * These are the forms where you can edit your profile.
 * @TODO GH Issue #13
 * @TODO GH Issue #26
 */

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      providers: [],
      summary: "",
      summaryCheck: false,
      user: {
        projects: [],
      },
      id: "",
      github: "https://github.com/",
      name: "",
      editName: false,
      description: "",
      addProject: false,
      fName: "",
      lName: "",
      isTourOpen: false,
      defaultLanguage: "",
      picture:
        "https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp",
    };
  }

  async componentDidMount() {
    const path = window.location.pathname.split("/");
    let userId;
    userId = path[path.length - 1];
    // what we did above, was the get the user id from the navigation bar
    const response = await API.get("pareto", `/users/${userId}`);
    // here we are populating our initial state. In the future, we will likely just pass stuff in via props, instead of running a fresh network request. That was a legacy decision, don't worry about it @antonio-b
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

  // This function below handles the changes in state, based on the forms. All of the information stored in the forms, is stored in state. Each form has an `id`, which is accessed by the event.target.id.
  // The actual updated value, is represented by the event.target.value. I recommend you console.log both of the values, above the setState, so you understand.

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  updateBio = async (event) => {
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
  // This function updates the user profile object with a PUT, and updates with a new project

  addProject = async () => {
    let projects = this.state.user.projects.slice();

    let newProject = {
      id: uuidv4(),
      description: this.state.description,
      github: this.state.github,
      name: this.state.name,
      team: [],
      tools: [],
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
        addProject: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  uploadToS3 = async (e) => {
    const file = e.target.files[0];
    let fileType = e.target.files[0].name.split(".");

    try {
      // @TODO: check to see whether this works for video, and what safeguards may not to be added.
      // @TODO: update this manual id for a dynamically generated one
      let pictureKey = await Storage.put(
        `${this.state.user.id}.${fileType[1]}`,
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
            {/* Here we should the name, and Glyphicon to trigger the edit name forms. */}
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
                    marginLeft: 40,
                  }}
                />
              </div>
            ) : (
              <div className="flex">
                {/* Here we are actuall editing our names/choosing a photo to upload to s3. */}
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
                    onChange={(evt) => this.uploadToS3(evt)}
                  />
                  <Button onClick={() => this.setState({ editName: false })}>
                    {I18n.get("cancel")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2>About you</h2>
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
                  onClick={this.updateBio}
                  isLoading={this.state.isLoading}
                  text="Update Summary"
                  loadingText="Creation"
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="block">
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
              </div>
            </React.Fragment>
          )}
        </div>

        {/* This is where we are adding projects to your profile */}
        <div>
          <h2 className="third-step-home">
            {I18n.get("projects")}{" "}
            <Glyphicon
              onClick={() =>
                this.setState({ addProject: !this.state.addProject })
              }
              glyph="glyphicon glyphicon-plus"
              height="33"
              width="33"
              style={{ marginLeft: 4, cursor: "pointer", marginTop: 2 }}
            />
          </h2>
          {this.state.user.projects.length < 1 ? (
            <p className="block">{I18n.get("noProjectsYet")}</p>
          ) : (
            <React.Fragment>
              {this.state.user.projects.map((project, i) => {
                return (
                  <div className="block">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <a href={project.github} target="_blank" rel="noopener">
                      GitHub Link Here
                    </a>
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
        <br />
           <Languages  
             id = {this.state.id}
             user = {this.state.user}
           />  
      </div>
    );
  }
}
