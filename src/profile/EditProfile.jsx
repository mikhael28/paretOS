import { useState, useEffect, SyntheticEvent, FormEvent } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { BsPencil, BsPlusLg } from "react-icons/bs";
import { nanoid } from "nanoid";
import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import { Storage } from "@aws-amplify/storage";
import { Button, TextField, useTheme } from "@mui/material";
import { errorToast } from "../libs/toasts";
import LoaderButton from "../components/LoaderButton";
import LanguageSelector from "./LanguageSelector";
// import { initialize } from "workbox-google-analytics";

/**
 * These are the forms where you can edit your profile.
 * @TODO GH Issue #26
 */

const EditProfile = (props) => {
  const theme = useTheme();
  const currentUser = "user" in props ? props.user : {
      projects: [],
    }
  const [user, setUser] = useState(currentUser);
  const [state, setState] = useState({
    isLoading: false,
    summaryCheck: false,
    id: "",
    github: "https://github.com/",
    name: "",
    editName: false,
    description: "",
    addProject: false,
    fName: "",
    lName: "",
    summary: "",
    // isTourOpen: false,
    picture:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  });

  useEffect(() => {
    if (!props.user.id) {
      initializeUser();
    }
    // eslint-disable-next-line
  }, []);

  const initializeUser = async () => {
    const path = window.location.pathname.split("/");
    let userId;
    userId = path[path.length - 1];
    // what we did above, was the get the user id from the navigation bar
    const response = await RestAPI.get("pareto", `/users/${userId}`);
    // here we are populating our initial state. In the future, we will likely just pass stuff in via props, instead of running a fresh network request. That was a legacy decision, don't worry about it @antonio-b
    console.log('u', response);
    setState((prevState) => ({
      ...prevState,
      user: response[0],
      id: userId,
    }));
  };
  // This function below handles the changes in state, based on the forms. All of the information stored in the forms, is stored in state. Each form has an `id`, which is accessed by the event.target.id.
  // The actual updated value, is represented by the event.target.value. I recommend you console.log both of the values, above the setState, so you understand.

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const updateBio = async (event) => {
    event.preventDefault();

    setState((prevState) => ({ ...prevState, isLoading: true }));

    let body = {
      summary: state.summary,
    };
    try {
      const response = await RestAPI.put("pareto", `/users/${state.id}`, {
        body,
      });
      setState((prevState) => ({
        ...prevState,
        user: response,
        summaryCheck: false,
      }));
    } catch (e) {
      console.log("email send error: ", e);
      // toast(e, { type: toast.TYPE.ERROR})
    }
    setState((prevState) => ({ ...prevState, isLoading: false }));
  };

  const editName = async (e) => {
    e.preventDefault();
    let body = {
      fName: state.fName,
      lName: state.lName,
    };
    try {
      const newName = await RestAPI.put("pareto", `/users/${state.id}`, {
        body,
      });
      setUser(newName);
      setState((prevState) => ({
        ...prevState,
        editName: false,
      }));
    } catch (e) {
      console.log(e);
    }
  };
  // This function updates the user profile object with a PUT, and updates with a new project

  const addProject = async () => {
    let projects = user.projects.slice();

    let newProject = {
      id: nanoid(),
      description: state.description,
      github: state.github,
      name: state.name,
      team: [],
      tools: [],
    };
    projects.push(newProject);

    let body = {
      projects: projects,
    };
    try {
      const response = await RestAPI.put("pareto", `/users/${user.id}`, {
        body,
      });
      setState((prevState) => ({
        ...prevState,
        user: response,
        description: "",
        github: "",
        name: "",
        addProject: false,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const uploadToS3 = async (e) => {
    const file = e.target.files[0];
    let fileType = e.target.files[0].name.split(".");

    try {
      // @TODO: check to see whether this works for video, and what safeguards may not to be added.
      // @TODO: update this manual id for a dynamically generated one
      let pictureKey = await Storage.put(
        `${user.id}.${fileType[1]}`,
        file,
        {
          contentType: "image/*",
          bucket: import.meta.env.VITE_PHOTO_BUCKET,
        }
      );
      console.log("Key: ", pictureKey);
      let updatedProfile = await RestAPI.put(
        "pareto",
        `/users/${user.id}`,
        {
          body: {
            picture: `https://${import.meta.env.VITE_PHOTO_BUCKET}.s3.amazonaws.com/public/${pictureKey.key}`,
          },
        }
      );
      console.log(updatedProfile);
      setUser(updatedProfile);
      // need to save the key
    } catch (e) {
      errorToast(e);
    }
  };

  return (
    <div className="flex-down">
      <div className="flex">
        <div className="first-step-home">
          {/* Here we should the name, and Glyphicon to trigger the edit name forms. */}
          {state.editName === false ? (
            <div className="flex" style={{ marginBottom: 79 }}>
              <img
                src={user.picture || state.picture || ""}
                height="60"
                width="60"
                alt="Profile"
                style={{ margin: "16px 16px 16px 0px", borderRadius: 50 }}
              />

              <h1>{user.fName}</h1>
              <BsPencil
                onClick={() =>
                  setState((prevState) => ({ ...prevState, editName: true }))
                }
                height="33"
                width="33"
                style={{ marginTop: 0, marginLeft: 20, cursor: "pointer" }}
              />
            </div>
          ) : (
            <div className="flex" style={{ alignItems: "flex-start" }}>
              {/* Here we are actually editing our names/choosing a photo to upload to s3. */}
                <img
                  src={user.picture || state.picture || ""}
                height="60"
                width="60"
                alt="Profile"
                style={{ margin: "16px 16px 16px 0px", borderRadius: 50 }}
              />
              <div className="flex-down" style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>{I18n.get("changePicture")}</h3>
                <div className="flex">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(evt) => uploadToS3(evt)}
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>
                <div className="flex-down" style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>{I18n.get("editName")}</h3>
                <form onSubmit={editName}>
                  <div className="flex">
                    <TextField
                      name="fName"
                      label={I18n.get("firstName")}
                      defaultValue={user.fName}
                      onChange={handleChange}
                      sx={{ m: 1, minWidth: "180px" }}
                    />
                    <TextField
                      name="lName"
                      label={I18n.get("lastName")}
                      defaultValue={user.lName}
                      onChange={handleChange}
                      sx={{ m: 1, minWidth: "180px"  }}
                    />
                  </div>
                    <div style={{ width: "100%" }}>
                      <Button
                        sx={{ m: 1 }}
                        onClick={() =>
                          setState((prevState) => ({ ...prevState, editName: false }))
                        }
                      >
                        {I18n.get("cancel")}
                      </Button>
                      <Button variant="gradient" sx={{ m: 1 }} style={{ width: `calc(100% - 102px)` }}>
                      {I18n.get("save")}
                    </Button>

                  </div>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
      <div>
        <h2 style={{ display: "inline-block", marginLeft: 8 }}>About you</h2>{" "}
        {state.summaryCheck == false && (<BsPencil
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              summaryCheck: true,
            }))
          }
          style={{ marginLeft: 8, width: "18px", height: "18px", cursor: "pointer" }}
        />)}
        {state.summaryCheck ? (
          <div style={{ margin: 8 }}>
            <FormGroup controlId="summary" bsSize="large">
              <ControlLabel>{I18n.get("bio")}</ControlLabel>
              <FormControl
                defaultValue={user.summary}
                onChange={handleChange}
                componentClass="textarea"
              />
            </FormGroup>
            <div className="flex" style={{ justifyContent: "flex-end" }}>
              <Button
                size="large"
                sx={{ mt: 1, mx: 2 }}
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    summaryCheck: false,
                  }))
                }
              >
                {I18n.get("cancel")}
              </Button>

              <LoaderButton
                type="submit"
                // disabled={!validateForm()}
                onClick={updateBio}
                isLoading={state.isLoading}
                text={I18n.get("save")}
                loadingText={I18n.get("loading")}
                style={{ minWidth: "180px" }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="block">
              <p>
                {user.summary}{" "}
              </p>
            </div>
          </>
        )}
      </div>

      {/* This is where we are adding projects to your profile */}
      <div>
        <h2 style={{ display: "inline-block", marginLeft: 8, marginTop: 24 }} className="third-step-home">
          {I18n.get("projects")}{" "}
          {state.addProject == false && (<BsPlusLg
            width="30"
            height="30"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                addProject: true,
              }))
            }
            style={{ height: "18px", width: "18px", marginLeft: 8, cursor: "pointer" }}
          />)}
        </h2>
        {user.projects.length < 1 && state.addProject == false ? (
          <p className="block">{I18n.get("noProjectsYet")}</p>
        ) : (
          <>
            {user.projects.map((project) => (
              <div className="block">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Link Here
                </a>
              </div>
            ))}
          </>
        )}
        {state.addProject ? (
          <>
          <div className="block">
            <FormGroup controlId="name" bsSize="large">
              <ControlLabel>{I18n.get("projectName")}</ControlLabel>
              <FormControl value={state.name} onChange={handleChange} />
            </FormGroup>
            <FormGroup controlId="description" bsSize="large">
              <ControlLabel>{I18n.get("description")}</ControlLabel>
              <FormControl value={state.description} onChange={handleChange} />
            </FormGroup>
            <FormGroup controlId="github" bsSize="large">
              <ControlLabel>{I18n.get("githubRepository")}</ControlLabel>
              <FormControl value={state.github} onChange={handleChange} />
            </FormGroup>
          </div>
          <div className="flex" style={{ justifyContent: "flex-end", marginRight: 8}}>
              <Button
                onClick={() =>
                  setState((prevState) => ({ ...prevState, addProject: false }))
                }
                sx={{ my: 1, mx: 2 }}
              >
                {I18n.get("cancel")}
              </Button>

              <LoaderButton
                type="submit"
                onClick={addProject}
                isLoading={state.isLoading}
                text={I18n.get("save")}
                loadingText="Loading"
                style={{ minWidth: "180px"}}
              />
            </div>
            </>
        ) : null}
      </div>
      <br />
      <div style={{ marginLeft: 8, marginRight: 8 }}>
        <LanguageSelector user={user} />
      </div>
    </div>
  );
};

export default EditProfile;
