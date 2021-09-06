import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import uuidv4 from "uuid";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import generator from "generate-password";
import { errorToast } from "../libs/toasts";
import "react-quill/dist/quill.snow.css";

class Project extends Component {
    constructor(props) {
      super(props);
      this.state = {
        users: [],
        user: {
          projects: [],
        },
        id: "",
        github: "https://github.com/",
        githubProfile: "",
        name: "",
        editName: false,
        description: "",
        addProject: false,
        team: [],
        tools: [],
        fName: "",
        lName: "",
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
//where functions go

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
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
      );
    }
  }
  export default Project;