import { Auth } from "@aws-amplify/auth";
import { RestAPI } from "@aws-amplify/api-rest";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import { errorToast, successToast } from "../libs/toasts";
import { notepadIntro, countries } from "../libs/static";
import TermsOfService from "./TermsOfService";
/**
 * Functionality for new user signup, creating their profile.
 * @TODO Onboarding emails Issue #24
 * @TODO <form> Issue #21
 */

const CreateUser = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    fName: "",
    lName: "",
    city: "",
    state: "US",
    github: "",
    // @TODO: Update terms of service, have the modal be meaningful
    // acceptedTOS: false,
    type: "mentee",
    showTermsOfService: false,
  });

  const validateForm = () =>
    state.fName.length > 0 &&
    state.lName.length > 0 &&
    state.city.length > 0 &&
    state.state.length > 0 &&
    state.github.length > 0;

  const accountCreationEmail = async (email) => {
    let body = {
      recipient: email,
      sender: "michael@pareto.education",
      subject: "Your ParetOS Login",
      htmlBody: `<p>Welcome to the ParetOS - an experimental, high-level operating system that lives in the browser to maximize your human performance and growth. You can login at https://paret0.com with the email ${email} and the password you created.</p>`,
      textBody: `Welcome to the ParetOS - an experimental, high-level operating system that lives in the browser to maximize your human performance and growth. You can login at https://paret0.com with the email ${email} and the password you created.`,
    };
    try {
      await RestAPI.post("util", "/email", { body });
    } catch (e) {
      console.log("Email send error: ", e);
    }
  };

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    props.setLoading(true);
    // need to auto-generate cognito credentials for the email
    const productId = uuidv4();
    const apprenticeshipId = uuidv4();
    const interviewingId = uuidv4();
    const beginId = uuidv4();
    setState((prevState) => ({ ...prevState, isLoading: true }));
    let instructorStatus;
    if (state.type === "mentee") {
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
      await RestAPI.post("pareto", "/users", {
        body: {
          id: uuid,
          type: state.type,
          fName: state.fName,
          lName: state.lName,
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
          city: state.city,
          state: state.state,
          phone: "",
          github: state.github,
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
      await accountCreationEmail(tempEmail);
      successToast("Account created!");
      await props.initialFetch(uuid);
      props.history.push("/");
    } catch (e) {
      errorToast(e);
      props.setLoading(false);
    }
  };

  return (
    <div style={{ margin: 16 }}>
      {/* Terms of service Modal/Popup */}
      <TermsOfService
        open={state.showTermsOfService}
        isLoading={state.isLoading}
        onClickAgree={handleSubmit}
        onClose={() =>
          setState((prevState) => ({ ...prevState, showTermsOfService: false }))
        }
      />
      <div className="profile-view-box">
        <div className="basic-info">
          <h1>New Student Onboarding</h1>
          <div className="row">
            <div className="col-md-6">
              <FormGroup controlId="fName" bsSize="large">
                <ControlLabel>First Name</ControlLabel>
                <FormControl value={state.fName} onChange={handleChange} />
              </FormGroup>
              <FormGroup controlId="lName" bsSize="large">
                <ControlLabel>Last Name</ControlLabel>
                <FormControl value={state.lName} onChange={handleChange} />
              </FormGroup>
              <FormGroup controlId="type" bsSize="large">
                <ControlLabel>User Type</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={handleChange}
                  value={state.type}
                >
                  <option value="mentee">Mentee</option>
                  <option value="mentor">Mentor</option>
                </FormControl>
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup controlId="city" bsSize="large">
                <ControlLabel>City</ControlLabel>
                <FormControl value={state.city} onChange={handleChange} />
              </FormGroup>
              <FormGroup controlId="state" bsSize="large">
                <ControlLabel>Country</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={handleChange}
                  value={state.state}
                >
                  {countries.map((country, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={index} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup controlId="github" bsSize="large">
                <ControlLabel>GitHub Username</ControlLabel>
                <FormControl value={state.github} onChange={handleChange} />
              </FormGroup>
            </div>
          </div>
        </div>
        <LoaderButton
          align="center"
          block
          size="small"
          type="submit"
          disabled={!validateForm()}
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              showTermsOfService: true,
            }))
          }
          text="Create Account"
          loadingText="Creation"
        />
      </div>
    </div>
  );
};

export default CreateUser;
