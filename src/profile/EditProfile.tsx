import { useState, useEffect, FormEvent, ChangeEvent, useContext } from "react";
import { BsPencil } from "react-icons/bs";
import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import { Storage } from "@aws-amplify/storage";
import {
  Button,
  TextField,
  useTheme,
  FormControl,
  FormLabel,
  TextareaAutosize,
} from "@mui/material";
import LoaderButton from "../components/LoaderButton";
import LanguageSelector from "./LanguageSelector";
import { ToastMsgContext } from "../state/ToastContext";
import { useForm } from "react-hook-form";

// import { initialize } from "workbox-google-analytics";

/**
 * These are the forms where you can edit your profile.
 * @TODO GH Issue #26
 */

const EditProfile = (props: any) => {
  const currentUser =
    "user" in props
      ? props.user
      : {
          projects: [],
        };

  const { register, handleSubmit } = useForm();

  const [user, setUser] = useState(currentUser);

  const [state, setState] = useState({
    isLoading: false,
    summaryCheck: false,
    id: props.user.id ?? "",
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

  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);

  useEffect(() => {
    if (!props.user.id) {
      initializeUser();
    }
    // eslint-disable-next-line
  }, []);

  const initializeUser = async () => {
    const path = window.location.pathname.split("/");
    let userId = path[path.length - 1];
    // what we did above, was the get the user id from the navigation bar
    const response = await RestAPI.get("pareto", `/users/${userId}`, {});
    // here we are populating our initial state. In the future, we will likely just pass stuff in via props, instead of running a fresh network request. That was a legacy decision, don't worry about it @antonio-b
    console.log("u", response);
    setState((prevState) => ({
      ...prevState,
      user: response[0],
      id: userId,
    }));
  };
  // This function below handles the changes in state, based on the forms. All of the information stored in the forms, is stored in state. Each form has an `id`, which is accessed by the event.target.id.
  // The actual updated value, is represented by the event.target.value. I recommend you console.log both of the values, above the setState, so you understand.

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | FormEvent<any>
  ) => {
    setState((prevState) => ({
      ...prevState,
      summary: (event.target as HTMLInputElement).value,
    }));
  };

  const updateBio = async (event: FormEvent<HTMLFormElement>) => {
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

  const editName = async (data: any) => {
    try {
      const newName = await RestAPI.put("pareto", `/users/${state.id}`, {
        body: data,
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

  const uploadToS3 = async (e: FormEvent<HTMLInputElement>) => {
    const targetElement = e.target as HTMLInputElement;
    let file: File = {} as File;
    let fileType: string[] = [];
    if (targetElement && targetElement.files) {
      const files = targetElement.files;
      file = files[0];
      fileType = files[0].name.split(".");
    }

    try {
      // @TODO: check to see whether this works for video, and what safeguards may not to be added.
      // @TODO: update this manual id for a dynamically generated one
      let pictureKey = await Storage.put(`${user.id}.${fileType[1]}`, file, {
        contentType: "image/*",
        bucket: import.meta.env.VITE_PHOTO_BUCKET,
      });
      console.log("Key: ", pictureKey);
      let updatedProfile = await RestAPI.put("pareto", `/users/${user.id}`, {
        body: {
          picture: `https://${
            import.meta.env.VITE_PHOTO_BUCKET
          }.s3.amazonaws.com/public/${pictureKey.key}`,
        },
      });
      console.log(updatedProfile);
      setUser(updatedProfile);
      // need to save the key
    } catch (e) {
      handleShowError(e as Error);
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
                src={state.picture || ""}
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
                src={state.picture || ""}
                height="60"
                width="60"
                alt="Profile"
                style={{ margin: "16px 16px 16px 0px", borderRadius: 50 }}
              />
              <div className="flex-down" style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>
                  {I18n.get("changePicture")}
                </h3>
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
                <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>
                  {I18n.get("editName")}
                </h3>
                <form onSubmit={handleSubmit(editName)}>
                  <div className="flex">
                    <TextField
                      {...register("fName", {
                        required: "fName is required",
                      })}
                      name="fName"
                      label={I18n.get("firstName")}
                      defaultValue={user.fName}
                      onChange={handleChange}
                      sx={{ m: 1, minWidth: "180px" }}
                    />
                    <TextField
                      {...register("lName", {
                        required: "lName is required",
                      })}
                      name="lName"
                      label={I18n.get("lastName")}
                      defaultValue={user.lName}
                      onChange={handleChange}
                      sx={{ m: 1, minWidth: "180px" }}
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <Button
                      sx={{ m: 1 }}
                      onClick={() =>
                        setState((prevState) => ({
                          ...prevState,
                          editName: false,
                        }))
                      }
                    >
                      {I18n.get("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      variant="gradient"
                      sx={{ m: 1 }}
                      style={{ width: `calc(100% - 102px)` }}
                    >
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
        {state.summaryCheck == false && (
          <BsPencil
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                summaryCheck: true,
              }))
            }
            style={{
              marginLeft: 8,
              width: "18px",
              height: "18px",
              cursor: "pointer",
            }}
          />
        )}
        {state.summaryCheck ? (
          <div style={{ margin: 8 }}>
            <FormControl
              component="fieldset"
              variant="filled"
              fullWidth
              disabled
            >
              <FormLabel
                style={{ fontSize: 18, color: "#fff", fontWeight: 600 }}
              >
                {I18n.get("bio")}
              </FormLabel>

              <TextareaAutosize
                defaultValue={user.summary}
                onChange={handleChange}
                className="textarea"
                maxRows={4}
                aria-label="Public Bio"
                style={{
                  padding: "10px 16px",
                  width: "100%",
                  height: 70,
                  borderRadius: "6px",
                  background: "var(--navigation-bgColor)",
                }}
              />
            </FormControl>
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
              <p>{user.summary}</p>
            </div>
          </>
        )}
      </div>
      <br />
      <div style={{ marginLeft: 8, marginRight: 8 }}>
        <LanguageSelector user={user} />
      </div>
    </div>
  );
};

export default EditProfile;
