import React, { Component } from "react";
import AboutYou from "/home/antonio/paretOS/src/profile/AboutYou";// need to change path
import Project from "/home/antonio/paretOS/src/profile/Project";// need to change path
import ProfileId from "/home/antonio/paretOS/src/profile/ProfileId";// need to change path
import Languages from "/home/antonio/paretOS/src/profile/Languages";// need to change path
import Button from "react-bootstrap/lib/Button";
import uuidv4 from "uuid";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import generator from "generate-password";
import { errorToast } from "../libs/toasts";
import Tour from "reactour";
import "react-quill/dist/quill.snow.css";


/**
 * These are the forms where you can edit your profile.
 * @TODO GH Issue #13
 * @TODO GH Issue #26
 */

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      summary: "",
      summaryCheck: false,
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

  // updateSchool = async () => {
  //   let body = {
  //     school: this.state.school,
  //   };
  //   try {
  //     const response = await API.put("pareto", `/users/${this.state.id}`, {
  //       body,
  //     });
  //     console.log(response);
  //     this.setState({ user: response });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
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

  // onChange = async (e) => {
  //   const file = e.target.files[0];
  //   let fileType = e.target.files[0].name.split(".");

  //   try {
  //     // @TODO: check to see whether this works for video, and what safeguards may not to be added.
  //     // @TODO: update this manual id for a dynamically generated one
  //     let pictureKey = await Storage.put(
  //       `48150f13-679a-40fc-9f23-b4ebe4af6f08.${fileType[1]}`,
  //       file,
  //       {
  //         contentType: "image/*",
  //         bucket: process.env.REACT_APP_PHOTO_BUCKET,
  //       }
  //     );
  //     console.log("Key: ", pictureKey);
  //     let updatedProfile = await API.put(
  //       "pareto",
  //       `/users/${this.state.user.id}`,
  //       {
  //         body: {
  //           picture: `https://${process.env.REACT_APP_PHOTO_BUCKET}.s3.amazonaws.com/public/${pictureKey.key}`,
  //         },
  //       }
  //     );
  //     console.log(updatedProfile);
  //     this.setState({
  //       user: updatedProfile,
  //     });
  //     // need to save the key
  //   } catch (e) {
  //     errorToast(e);
  //   }
  // };

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
    
      <ProfileId />
      
        {/* Hiding the below for now, not sure it makes sense for users to update. More so for admin? Is this feature even relevant anymore? could be for organizations, but not on a user-level */}

        {/* {this.state.editSchool === false ? (
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
        )} */}
        <div>
          <AboutYou />
        </div>
        <div>
          <Project />
        </div>
          <br />
        <div>
          <Languages />
        </div>
       <Button onClick={() => this.props.history.push("/settings/password")}>
          Change Password
        </Button>

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
