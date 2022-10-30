import { useEffect } from "react";
import { I18n } from "@aws-amplify/core";
import { Button, TextField } from "@mui/material";
import { Storage } from "@aws-amplify/storage";
import { FormEvent, useContext, useState } from "react";
import { BsPencil } from "react-icons/bs";
import RestAPI from "@aws-amplify/api-rest";
import { ToastMsgContext } from "../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "../../redux/state/profile";
import { selectProfile } from "../../redux/selectors/profile/select-profile";
import { useForm } from "react-hook-form";

const EditName = () => {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const user: any = useSelector(selectProfile);
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

  const initializeUser = async () => {
    const path = window.location.pathname.split("/");
    let userId = path[path.length - 1];
    // what we did above, was the get the user id from the navigation bar
    const response = await RestAPI.get("pareto", `/users/${userId}`, {});
    // here we are populating our initial state. In the future, we will likely just pass stuff in via props, instead of running a fresh network request. That was a legacy decision, don't worry about it @antonio-b
    setState((prevState) => ({
      ...prevState,
      user: response[0],
      id: userId,
    }));

    dispatch(setUserAction(response[0]));
  };
  // This function below handles the changes in state, based on the forms. All of the information stored in the forms, is stored in state. Each form has an `id`, which is accessed by the event.target.id.
  // The actual updated value, is represented by the event.target.value. I recommend you console.log both of the values, above the setState, so you understand.

  useEffect(() => {
    if (!user.id) {
      initializeUser();
    }
    // eslint-disable-next-line
  }, []);

  const { handleShowError } = useContext(ToastMsgContext);

  const editName = async (data: any) => {
    let body = {
      fName: data.fName,
      lName: data.lName,
    };
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    try {
      await RestAPI.put("pareto", `/users/${user.id}`, {
        body,
      });

      dispatch(
        setUserAction({ ...user, fName: data.fName, lName: data.lName })
      );
    } catch (e) {
      console.log(e);
    } finally {
      setState((prevState) => ({
        ...prevState,
        editName: false,
        isLoading: false,
      }));
    }
  };
  // This function updates the user profile object with a PUT, and updates with a new project

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
      dispatch(setUserAction(updatedProfile));
      // need to save the key
    } catch (e) {
      handleShowError(e as Error);
    }
  };

  return (
    <div className="flex-down">
      <div className="flex">
        <div className="first-step-home">
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
                        required: "Fist name is required",
                      })}
                      name="fName"
                      label={I18n.get("firstName")}
                      defaultValue={user.fName}
                      sx={{ m: 1, minWidth: "180px" }}
                    />
                    <TextField
                      {...register("lName", {
                        required: "Last name is required",
                      })}
                      name="lName"
                      label={I18n.get("lastName")}
                      defaultValue={user.lName}
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
                      disabled={state.isLoading}
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
    </div>
  );
};

export { EditName };
