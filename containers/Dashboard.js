import React, { Component } from "react";
import Image from "react-bootstrap/lib/Image";
import uuidv4 from "uuid";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import ArenaDashboard from "../arena/ArenaDashboard";
import Storage from "@aws-amplify/storage";
import generator from "generate-password";
import { errorToast } from "../libs/toasts";
import Messaging from "../components/Messaging";
import Tour from "reactour";
import question from "../assets/help.png";
import Athlete from "../components/Athlete";
import logo from "../assets/Pareto_Lockup-01.png";

/**
 * This is a pretty important component - it is the 'main dashboard' in the UI, that shows different things depending on what level of user you are.
 * @TODO Review where to put the 'edit project' and other function components. Perhaps they belong in the profile?
 * @TODO onChange function for saving profile picture is either repetitive, or needs to be moved. This whole component in general has lots of code that may need to be moved.
 * @TODO should the logo image be added back in?
 * @TODO review whether the this.state object is really necessary here - perhaps convert into hook at some point.
 *
 */

export default class MainDashboard extends Component {
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
      uuid: generator.generate({
        length: 12,
        numbers: true,
      }),
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

  updateSchool = async () => {
    let body = {
      school: this.state.school,
    };
    try {
      const response = await API.put("pareto", `/users/${this.state.id}`, {
        body,
      });
      this.setState({ user: response });
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
      let pictureKey = await Storage.put(
        `48150f13-679a-40fc-9f23-b4ebe4af6f08.${fileType[1]}`,
        file,
        {
          contentType: "image/*",
          bucket: process.env.REACT_APP_PHOTO_BUCKET,
        }
      );
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
        selector: ".second-step-home",
        content: `${I18n.get("homeSecond")}`,
      },
      // {
      // 	selector: '.third-step-home',
      // 	content: `${I18n.get('homeThird')}`
      // }
    ];
    return (
      <div className="flex-down">
        <div className="flex">
          {/* <img src={logo} alt="Pareto" height="45" width="180" style={{ marginTop: 33 }} /> */}

          <h1 style={{ marginLeft: 0, marginBottom: -5, marginTop: 32 }}>
            {I18n.get("dashboard")}
          </h1>
          <Image
            src={question}
            onClick={(event) => {
              event.preventDefault();
              this.setState({ isTourOpen: true });
            }}
            height="40"
            width="40"
            circle
            style={{
              cursor: "pointer",
              marginTop: 30,
              marginLeft: 6,
            }}
          />
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-5">
            {this.props.user.instructor === true &&
            this.props.athletes.length > 0 ? (
              <React.Fragment>
                <h2>{I18n.get("myMentees")}</h2>
                <div className="exp-cards" style={{ justifyContent: "start" }}>
                  {this.props.athletes.map((athlete, idx) => {
                    return (
                      <Athlete
                        athlete={athlete.mentee}
                        key={idx}
                        history={this.props.history}
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            ) : null}
            <ArenaDashboard
              sprints={this.props.sprints}
              history={this.props.history}
              user={this.props.user}
              fetchMenteeSprints={this.props.fetchMenteeSprints}
            />
          </div>
          <div className="hidden-xs col-sm-7">
            <Messaging
              user={this.props.user}
              messages={this.props.messages}
              updateMessages={this.props.updateMessages}
              history={this.props.history}
            />
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
    );
  }
}
