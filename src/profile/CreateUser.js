import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import uuidv4 from "uuid";
import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import generator from "generate-password";
import { errorToast, successToast } from "../libs/toasts";
import { notepadIntro } from "../libs/static";

/**
 * Functionality for new user signup, creating their profile.
 * @TODO re-enable onboarding emails, redesign those.
 * @TODO create a single-page, almost 'Formly' or whatever that app is, where it only asks you a single question per prompt, and gives you details at the end before confirming.
 * @TODO add back in functionality to create educational accounts, for some circumstance? Think through this.
 */

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      // below is either 'admin' or 'non-admin'
      viewMode: "non-admin",
      // can be create or edit
      editMode: "create",
      users: [],
      providers: [],
      email: "",
      fName: "",
      lName: "",
      phone: 1,
      city: "",
      state: "US",
      github: "",
      provider: {},
      id: "",
      createdBy: "",
      acceptedTOS: false,
      uuid: generator.generate({
        length: 12,
        numbers: true,
      }),
      type: "mentee",
      admin: {
        id: "8020",
        fName: "Vilfredo",
        lName: "Pareto",
      },
    };
  }

  async componentDidMount() {
    if (window.location.pathname === "/admin/user") {
      this.setState({
        viewMode: "admin",
      });
    } else {
      this.setState({
        viewMode: "non-admin",
      });
    }
    let admin = await API.get(
      "pareto",
      `/users/48150f13-679a-40fc-9f23-b4ebe4af6f08`
    );
    this.setState({ admin: admin[0] });
  }

  validateForm() {
    if (this.state.viewMode === "admin") {
      return (
        this.state.email.length > 0 &&
        this.state.fName.length > 0 &&
        this.state.lName.length > 0 &&
        this.state.city.length > 0 &&
        this.state.state.length > 0 &&
        this.state.github.length > 0
      );
    } else {
      return (
        this.state.fName.length > 0 &&
        this.state.lName.length > 0 &&
        this.state.city.length > 0 &&
        this.state.state.length > 0 &&
        this.state.github.length > 0
      );
    }
  }

  accountCreationEmail = (email, password) => {
    let body = {
      recipient: email,
      sender: "michael@fsa.community",
      subject: "Your new Pareto Account",
      htmlBody: `<p>Congratulations on starting your journey. You can now download the Full Stack Apprenticeship application on the Google Play Store and login with the email ${email} and the password ${password}.</p>`,
      textBody: `Congratulations on starting your journey. You can now download the Full Stack Apprenticeship application on the Google Play Store and login with the email ${email} and the password ${password}.`,
    };
    API.post("pareto", "/email", { body });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleProviderChange = (event) => {
    this.setState({
      [event.target.id]: JSON.parse(event.target.value),
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.props.setLoading();
    // need to auto-generate cognito credentials for the email
    const productId = uuidv4();
    const apprenticeshipId = uuidv4();
    const interviewingId = uuidv4();
    const beginId = uuidv4();

    this.setState({ isLoading: true });

    let instructorStatus;
    if (this.state.type === "mentee") {
      instructorStatus = false;
    } else {
      instructorStatus = true;
    }

    try {
      let uuid;
      let tempEmail;
      if (this.state.viewMode === "admin") {
        const user = await this.createUser();
        console.log("User: ", user);
        uuid = user.message.User.Username;
        // this.setState({id: user.message.User.Username })
        const confirm = await API.post("util", "/confirm", {
          body: {
            uuid: uuid,
            email: this.state.email,
            password: "password123",
          },
        });
        console.log("Confirmed: ", confirm);
      } else {
        const session = await Auth.currentSession();
        console.log("Cognito sessionL: ", session);
        uuid = session.idToken.payload.sub;
        tempEmail = session.idToken.payload.email;
      }
      const newUser = await API.post("pareto", "/users", {
        body: {
          id: uuid,
          type: this.state.type,
          fName: this.state.fName,
          lName: this.state.lName,
          email: tempEmail,
          country: "",
          mentor: "48150f13-679a-40fc-9f23-b4ebe4af6f08",
          mentors: [],
          projects: [],
          ideas: [],
          bio: "",
          summary: "Write a bio.",
          notes: [notepadIntro],
          actions: [],
          city: this.state.city,
          state: this.state.state,
          phone: "",
          github: this.state.github,
          communityRank: "",
          technicalRank: "",
          experience: "Incomplete",
          linkedIn: "Incomplete",
          stripe: "",
          paypal: "",
          instructor: instructorStatus,
          admin: false,
          productId: productId,
          apprenticeshipId: apprenticeshipId,
          beginId: beginId,
          masteryId: interviewingId,
          expo: "",
          xp: 0,
          learningPurchase: false,

          completionPercentage: 0,
          completionAttempts: 0,
          completions: 0,

          wrMembers: false,
          wrid: "",

          defaultLanguage: "en",

          createdAt: new Date(),
        },
      });
      console.log(newUser);

      //

      // @TODO: re-activate these emails
      // // toast('Success', { type: toast.TYPE.SUCCESS})
      // this.accountCreationEmail(this.state.email)
      // const emailSent = this.accountCreationEmail(
      //   this.state.email,
      //   this.state.uuid
      // );
      // console.log(emailSent);

      successToast("User successfully created");
      if (this.state.viewMode === "non-admin") {
        await this.props.initialFetch(uuid);
        this.props.history.push("/");
      } else {
        this.props.setCloseLoading();
        this.props.history.push("/");
      }
    } catch (e) {
      errorToast(e);
      this.props.setCloseLoading();
    }
  };

  createUser = async () => {
    let body = {
      email: this.state.email,
    };
    return await API.post("util", "/auth", { body });
  };

  render() {
    return (
      <div style={{ margin: 16 }}>
        <div className="profile-view-box">
          <div className="basic-info">
            <h1>New Student Onboarding</h1>
            <div className="row">
              {this.state.viewMode === "admin" ? (
                <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                  <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>
              ) : null}
              <div className="col-md-6">
                <FormGroup controlId="fName" bsSize="large">
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    value={this.state.fName}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                {this.state.viewMode === "admin" ? (
                  <FormGroup controlId="type" bsSize="large">
                    <ControlLabel>User Type</ControlLabel>
                    <FormControl
                      componentClass="select"
                      onChange={this.handleChange}
                      value={this.state.type}
                    >
                      <option value="mentee">Mentee</option>
                      <option value="mentor">Mentor</option>
                    </FormControl>
                  </FormGroup>
                ) : null}
                <FormGroup controlId="state" bsSize="large">
                  <ControlLabel>Country</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChange}
                    value={this.state.state}
                  >
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="TT">Trinidad & Tobago</option>
                    <option value="CR">Costa Rica</option>
                    <option value="UG">Uganda</option>
                  </FormControl>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup controlId="lName" bsSize="large">
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    value={this.state.lName}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="city" bsSize="large">
                  <ControlLabel>City</ControlLabel>
                  <FormControl
                    value={this.state.city}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="github" bsSize="large">
                  <ControlLabel>GitHub Username</ControlLabel>
                  <FormControl
                    value={this.state.github}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          <LoaderButton
            align="center"
            block
            bsSize="small"
            type="submit"
            disabled={!this.validateForm()}
            onClick={this.handleSubmit}
            isLoading={this.state.isLoading}
            text="Create User"
            loadingText="Creation"
          />
        </div>
      </div>
    );
  }
}
