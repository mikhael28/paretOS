import { Auth } from "@aws-amplify/auth";
import { RestAPI } from "@aws-amplify/api-rest";
import { nanoid } from "nanoid";
import { SyntheticEvent, useState, useContext } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import LoaderButton from "../components/LoaderButton";
import { ToastMsgContext } from "../state/ToastContext";
import { notepadIntro, countries } from "../libs/static";
import TermsOfService from "./TermsOfService";
import { useNavigate } from "react-router-dom";
import { generateEmail } from "../utils/generateErrorEmail";

/**
 * Functionality for new user signup, creating their profile.
 * @TODO Onboarding emails Issue #24
 * @TODO <form> Issue #21
 */

interface CreateUserProps {
  setLoading: Function;
  initialFetch: Function;
}

const CreateUser = ({ setLoading, initialFetch }: CreateUserProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);

  const email = generateEmail("Welcome to the ParetOS", "You have joined an experimental, high-level operating system that lives in the browser to maximize your human performance and growth. You can login at https://paret0.com with the email ${email} and the password you created.")

  const accountCreationEmail = async (email: string) => {
    let body = {
      recipient: email,
      sender: "mikhael@hey.com",
      subject: "Your ParetOS Login",
      htmlBody: email,
      textBody: `Welcome to the ParetOS - an experimental, high-level operating system that lives in the browser to maximize your human performance and growth. You can login at https://paret0.com with the email ${email} and the password you created.`,
    };
    try {
      await RestAPI.post("pareto", "/email", { body });
    } catch (e) {
      console.log("Email send error: ", e);
    }
  };

  const onsubmit = async (event: SyntheticEvent) => {
    setLoading(true);
    const formData = getValues();
    // need to auto-generate cognito credentials for the email
    setIsLoading(true);
    let instructorStatus;
    if (formData.type === "mentee") {
      instructorStatus = false;
    } else {
      instructorStatus = true;
    }
    try {
      let uuid;
      let tempEmail;
      const session = await Auth.currentSession();
      const idToken = session.getIdToken();
      uuid = idToken.payload.sub;
      tempEmail = idToken.payload.email;
      await RestAPI.post("pareto", "/users", {
        body: {
          id: uuid,
          fName: formData.fName,
          lName: formData.lName,
          email: tempEmail,
          country: "",
          mentors: [],
          summary:
            "This is the space for you to write your bio, so people can learn more about you and your interests.",
          city: formData.city,
          notes: [],
          groups: [],
          connections: [],
          modules: [],
          permissions: [],
          achievements: [],
          phone: "",
          github: formData.github,
          instructor: instructorStatus,
          admin: false,
          xp: 0,
          learningPurchase: false,
          cp: 0,
          defaultLanguage: "en",
          createdAt: new Date(),
        },
      });
      await accountCreationEmail(tempEmail);
      handleShowSuccess("Account created!");
      await initialFetch(uuid);
      navigate("/");
    } catch (e) {
      handleShowError(e as Error);
      setLoading(false);
    }
  };

  const formStyle = {
    width: "50vw",
    minWidth: 200,
    maxWidth: 600,
    marginBottom: 16,
  };
  console.log(errors);
  return (
    <div style={{ padding: 24 }}>
      <div className="profile-view-box">
        <form
          onSubmit={handleSubmit(() => {
            setShowTOS(true);
          })}
        >
          <div className="basic-info">
            <h1 style={{ paddingBottom: 16 }}>New Student Onboarding</h1>
            <div>
              <div>
                <Controller
                  control={control}
                  name="fName"
                  rules={{ required: true, minLength: 1 }}
                  render={({
                    field: { onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <TextField
                      onBlur={onBlur} // notify when input is touched
                      onChange={onChange} // send value to hook form
                      inputRef={ref}
                      style={formStyle}
                      label="First Name"
                      error={invalid}
                      helperText={error ? "Required field" : ""}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="lName"
                  rules={{ required: true, minLength: 1 }}
                  render={({
                    field: { onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <TextField
                      onBlur={onBlur} // notify when input is touched
                      onChange={onChange} // send value to hook form
                      inputRef={ref}
                      style={formStyle}
                      label="Last Name"
                      error={invalid}
                      helperText={error ? "Required field" : ""}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="type"
                  rules={{ required: true, minLength: 1 }}
                  render={({ fieldState: { invalid, error } }) => (
                    <FormControl error={invalid} style={formStyle}>
                      <InputLabel id="user-type">User Type</InputLabel>
                      <Select
                        defaultValue={""}
                        labelId="user-type"
                        id="user-type"
                        label="User Type"
                        {...register("type", { required: true })}
                      >
                        <MenuItem value="mentee">Mentee</MenuItem>
                        <MenuItem value="mentor">Mentor</MenuItem>
                      </Select>
                      <FormHelperText>
                        {error?.message ? "Required field" : ""}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: true, minLength: 1 }}
                  render={({
                    field: { onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <TextField
                      onBlur={onBlur} // notify when input is touched
                      onChange={onChange} // send value to hook form
                      inputRef={ref}
                      style={formStyle}
                      label="City"
                      error={invalid}
                      helperText={error ? "Required field" : ""}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="type"
                  rules={{ required: true, minLength: 1 }}
                  render={({ fieldState: { invalid, error } }) => (
                    <FormControl style={formStyle} error={invalid}>
                      <InputLabel id="country">Country</InputLabel>
                      <Select
                        labelId="country"
                        id="country"
                        label="Country"
                        defaultValue={""}
                        {...register("country", { required: true })}
                      >
                        {countries.map((country, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <MenuItem key={index} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {error ? "Please select your country of residence" : ""}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="github"
                  render={({
                    field: { onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <TextField
                      onBlur={onBlur} // notify when input is touched
                      onChange={onChange} // send value to hook form
                      inputRef={ref}
                      style={formStyle}
                      label="GitHub Username"
                      error={invalid}
                      helperText={error ? "Required field" : ""}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <LoaderButton
            style={{ textAlign: "center", ...formStyle }}
            size="large"
            type="submit"
            disabled={!isValid}
            text="Create Account"
            loadingText="Creating User Account"
            props={{}}
            isLoading={isLoading}
          />
        </form>
      </div>
      {/* Terms of service Modal/Popup */}
      <TermsOfService
        open={showTOS}
        isLoading={isLoading}
        onClickAgree={onsubmit}
        onClose={() => setShowTOS(false)}
      />
    </div>
  );
};

export default CreateUser;
