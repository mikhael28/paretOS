import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import uuidv4 from 'uuid';
import { notepadIntro } from "../libs/static";
import { generateEmail } from "../libs/errorEmail";
import { errorToast, successToast } from "../libs/toasts";

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
      uuid: uuidv4(),
      type: "mentee",
      admin: {
        id: "8020",
        fName: "Vilfredo",
        lName: "Pareto",
      },
      susbcription: false,
      defaultLanguage: "en",
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
        this.state.github.length > 0 &&
        this.state.subscription !== undefined
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

  accountCreationEmail = async (email, password, htmlEmail) => {
    let body = {
      recipient: email,
      sender: "mikhael@hey.com",
      subject: "Your new Pareto Account",
      htmlBody: htmlEmail,
      textBody: `You can login at https://paret0.com with the email ${email} and the password password123. Please change your password when you have a moment.`,
    };
    await API.post("pareto", "/email", { body });
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

  createSubscription = async (
    uuid,
    apprenticeshipId,
    productId,
    interviewingId
  ) => {
    let achievement = {
      completed: false,
      approved: false,
      revisionsNeeded: false,
      athleteNotes: "",
      coachNotes: "",
      athleteAttachment: "",
      coachAttachment: "",
      github: "",
      prLink: "",
    };
    try {
      const createApprenticeship = await API.post("pareto", "/experience", {
        body: {
          id: apprenticeshipId,
          xp: 2000,
          xpEarned: 0,
          achievements: 0,
          memberId: uuid,
          type: "Apprenticeship",
          approved: false,
          title: "Apprenticeship",
          description: "The process of becoming a developer.",
          _01: achievement,
          _02: achievement,
          _03: achievement,
          _04: achievement,
          _05: achievement,
          _06: achievement,
          _07: achievement,
          _08: achievement,
          _09: achievement,
          _10: achievement,
          _11: achievement,
          _12: achievement,
          _13: achievement,
          _14: achievement,
          _15: achievement,
        },
      });
      console.log("Created Apprenticeship: ", createApprenticeship);
      const createProduct = await API.post("pareto", "/experience", {
        body: {
          id: productId,
          xp: 2000,
          xpEarned: 0,
          achievements: 0,
          memberId: uuid,
          type: "Product",
          approved: false,
          title: "Please give your product a name",
          description: "Please write a description of your project.",
          github: "Incomplete",
          _01: achievement,
          _02: achievement,
          _03: achievement,
          _04: achievement,
          _05: achievement,
          _06: achievement,
          _07: achievement,
          _08: achievement,
          _09: achievement,
          _10: achievement,
          _11: achievement,
          _12: achievement,
          _13: achievement,
          _14: achievement,
          _15: achievement,
        },
      });
      console.log("Created Product: ", createProduct);
      const createInterviewing = await API.post("pareto", "/experience", {
        body: {
          id: interviewingId,
          xp: 2000,
          xpEarned: 0,
          achievements: 0,
          memberId: uuid,
          type: "Interviewing",
          approved: false,
          title: "Interviewing",
          description:
            "Understand the computer science fundamentals behind the code that runs your products..",
          _01: achievement,
          _02: achievement,
          _03: achievement,
          _04: achievement,
          _05: achievement,
          _06: achievement,
          _07: achievement,
          _08: achievement,
          _09: achievement,
          _10: achievement,
          _11: achievement,
          _12: achievement,
          _13: achievement,
          _14: achievement,
          _15: achievement,
        },
      });
      console.log(createInterviewing);
    } catch (e) {
      console.log("Error creating EXP");
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.props.setLoading();
    // need to auto-generate cognito credentials for the email
    const productId = uuidv4();
    const apprenticeshipId = uuidv4();
    const interviewingId = uuidv4();

    this.setState({ isLoading: true });

    let instructorStatus;
    if (this.state.type === "mentee") {
      instructorStatus = false;
    } else {
      instructorStatus = true;
    }

    try {
      let uuid;
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
      }
      const newUser = await API.post("pareto", "/users", {
        body: {
          id: uuid,
          type: this.state.type,
          fName: this.state.fName,
          lName: this.state.lName,
          email: this.state.email,
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
          masteryId: interviewingId,
          expo: "",
          xp: 0,

          cp: 0,

          learningPurchase: this.state.subscription,
          completionAttempts: 0,
          completions: 0,

          wrMembers: false,
          wrid: "",

          defaultLanguage: this.state.defaultLanguage,

          createdAt: new Date(),
        },
      });

      console.log(newUser);

      const defaultMentor = await API.post("pareto", "/relationship", {
        body: {
          id: `${this.state.admin.id}_${newUser.id}`,
          mentee: newUser,
          mentor: this.state.admin,
          tasks: [],
          coachId: this.state.admin.id,
          athleteId: newUser.id,
          resources: [],
          events: [],
          reminders: [],
          accepted: true,
          completed: false,
          createdAt: new Date(),
        },
      });

      console.log("New mentor: ", defaultMentor);
      console.log(this.state.subscription);
      if (this.state.subscription === "true") {
        await this.createSubscription(
          uuid,
          apprenticeshipId,
          productId,
          interviewingId
        );
      }

      // @TODO: re-activate these emails
      // // toast('Success', { type: toast.TYPE.SUCCESS})
      let string = generateEmail(
        "Your New Pareto Account",
        `Welcome to a new generation of education with Pareto Learning. You are able to log-in to your system at https://paret0.com with the email ${this.state.email} and the credential 'password123' without any quotes.`
      );

      //   const emailSent = await this.accountCreationEmail(
      //     this.state.email,
      //     this.state.uuid,
      //     string
      //   );
      //   console.log(emailSent);

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
                <FormGroup controlId="lName" bsSize="large">
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    value={this.state.lName}
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

                <FormGroup controlId="defaultLanguage" bsSize="large">
                  <ControlLabel>Default Language</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChange}
                    value={this.state.defaultLanguage}
                  >
                    <option value={"en"}>Choose Here</option>
                    <option value={"en"}>English</option>
                    <option value={"lg"}>Luganda</option>
                    <option value={"ac"}>Acholi</option>
                    <option value={"es"}>Spanish</option>
                  </FormControl>
                </FormGroup>
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
                    <option value="FR">France</option>
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
                {this.state.viewMode === "admin" ? (
                  <FormGroup controlId="subscription" bsSize="large">
                    <ControlLabel>Subscription</ControlLabel>
                    <FormControl
                      componentClass="select"
                      onChange={this.handleChange}
                      value={this.state.subscription}
                    >
                      <option value={"false"}>Choose Here</option>
                      <option value={"false"}>Freemium</option>
                      <option value={"true"}>Full-Stack Starter Kit</option>
                    </FormControl>
                  </FormGroup>
                ) : null}
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
          <br />
          <br />
        </div>
      </div>
    );
  }
}
