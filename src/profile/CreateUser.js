import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import uuidv4 from "uuid";
import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import { errorToast, successToast } from "../libs/toasts";
import { notepadIntro } from "../libs/static";
import TermsOfService from "./TermsOfService";
import { countries } from "../libs/static";
/**
 * Functionality for new user signup, creating their profile.
 * @TODO Onboarding emails Issue #24
 * @TODO Country picker Issue #23
 * @TODO Terms of Service Acceptance Issue #22
 * @TODO <form> Issue #21
 */

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      fName: "",
      lName: "",
      phone: 1,
      city: "",
      state: "US",
      github: "",
      acceptedTOS: false,
      type: "mentee",
      showTermsOfService: false,
    };
  }

  validateForm() {
    return (
      this.state.fName.length > 0 &&
      this.state.lName.length > 0 &&
      this.state.city.length > 0 &&
      this.state.state.length > 0 &&
      this.state.github.length > 0
    );
  }

  accountCreationEmail = async (email) => {
    let body = {
      recipient: email,
      sender: "michael@pareto.education",
      subject: "Your ParetOS Login",
      htmlBody: `<p>Welcome to the ParetOS - an experimental, high-level operating system that lives in the browser to maximize your human performance and growth. You can login at https://paret0.com with the email ${email} and the password you created.</p>`,
      textBody: `Welcome to the ParetOS - an experimental, high-level operating system that lives in the browser to maximize your human performance and growth. You can login at https://paret0.com with the email ${email} and the password you created.`,
    };

    try {
      await API.post("util", "/email", { body });
    } catch (e) {
      console.log("Email send error: ", e);
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
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

      const session = await Auth.currentSession();
      uuid = session.idToken.payload.sub;
      tempEmail = session.idToken.payload.email;

      await API.post("pareto", "/users", {
        body: {
          id: uuid,
          type: this.state.type,
          fName: this.state.fName,
          lName: this.state.lName,
          email: tempEmail,
          country: "",
          mentor: "",
          mentors: [],
          projects: [],
          ideas: [],
          bio: "",
          summary:
            "This is the space for you to write your bio, so people can learn more about you and your interests.",
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

      await this.accountCreationEmail(tempEmail);
      successToast("Account created!");
      await this.props.initialFetch(uuid);
      this.props.history.push("/");
    } catch (e) {
      errorToast(e);
      this.props.setCloseLoading();
    }
  };

  render() {
    return (
      <div style={{ margin: 16 }}>
        {/* Terms of service Modal/Popup */}
        <TermsOfService
          open={this.state.showTermsOfService}
          isLoading={this.state.isLoading}
          onClickAgree={this.handleSubmit}
          onClose={() => this.setState({ showTermsOfService: false })}
        />

        <div className="profile-view-box">
          <div className="basic-info">
            <h1>New Student Onboarding</h1>
            <div className="row">
              <div className="col-md-6">
                <FormGroup controlId="fName" bsSize="large">
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    value={this.state.fName}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="lName" bsSize="large">
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    value={this.state.lName}
                    onChange={this.handleChange}
                  />
                </FormGroup>
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
              </div>
              <div className="col-md-6">
                <FormGroup controlId="city" bsSize="large">
                  <ControlLabel>City</ControlLabel>
                  <FormControl
                    value={this.state.city}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="state" bsSize="large">
                  <ControlLabel>Country</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChange}
                    value={this.state.state}
                  >
                    {countries.map((country, index) => {
                      return <option key={index} value={country.code}>{country.name}</option>
                    })}
                  </FormControl>
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
            onClick={() => this.setState({ showTermsOfService: true })}
            text="Create Account"
            loadingText="Creation"
          />
        </div>
      </div>
    );
  }
}
