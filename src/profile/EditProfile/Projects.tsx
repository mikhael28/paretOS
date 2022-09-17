import { I18n } from "@aws-amplify/core";
import LoaderButton from "@src/components/LoaderButton";
import { selectProfile } from "@src/redux/selectors/profile/select-profile";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsPlusLg } from "react-icons/bs";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";

import {
  Button,
  FormControl,
  FormLabel,
  InputBase,
  FormGroup,
} from "@mui/material";
import RestAPI from "@aws-amplify/api-rest";
import { Project } from "@src/types/ProfileTypes";
const Projects = () => {
  const user = useSelector(selectProfile);
  const [state, setState] = useState({
    addProject: false,
    isLoading: false,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const addProject = async (project: any) => {
    let projects = user.projects?.slice();

    let newProject = {
      id: nanoid(),
      description: project.description,
      github: project.github,
      name: project.name,
      team: [],
      tools: [],
    };
    projects?.push(newProject);

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

  const onSubmit = (data: any) => {
    addProject(data);
  };

  return (
    <div>
      <h2
        style={{ display: "inline-block", marginLeft: 8, marginTop: 24 }}
        className="third-step-home"
      >
        {I18n.get("projects")}{" "}
        {state.addProject == false && (
          <BsPlusLg
            width="30"
            height="30"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                addProject: true,
              }))
            }
            style={{
              height: "18px",
              width: "18px",
              marginLeft: 8,
              cursor: "pointer",
            }}
          />
        )}
      </h2>
      {user.projects &&
      user.projects?.length < 1 &&
      state.addProject == false ? (
        <p className="block">{I18n.get("noProjectsYet")}</p>
      ) : (
        <>
          {user.projects &&
            user.projects.map((project: any) => (
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="block">
            <FormGroup>
              <FormControl component="fieldset" variant="outlined" fullWidth>
                <FormLabel
                  style={{
                    fontSize: 17,
                    color: "var(--navigation-color)",
                    fontWeight: 600,
                  }}
                >
                  {I18n.get("projectName")}
                </FormLabel>

                <InputBase
                  size="medium"
                  fullWidth
                  margin="dense"
                  style={{
                    border: "1px solid white",
                    borderRadius: 4,
                    padding: "8px 10px",
                  }}
                  {...register("name", {
                    required: "Project name is required",
                  })}
                />
              </FormControl>
            </FormGroup>

            <FormGroup>
              <FormControl component="fieldset" variant="outlined" fullWidth>
                <FormLabel
                  style={{
                    fontSize: 17,
                    color: "var(--navigation-color)",
                    fontWeight: 600,
                  }}
                >
                  {I18n.get("description")}
                </FormLabel>

                <InputBase
                  size="medium"
                  fullWidth
                  margin="dense"
                  style={{
                    border: "1px solid white",
                    borderRadius: 4,
                    padding: "8px 10px",
                  }}
                  {...register("description", {
                    required: "Project description is required",
                  })}
                />
              </FormControl>
            </FormGroup>

            <FormGroup>
              <FormControl component="fieldset" variant="outlined" fullWidth>
                <FormLabel
                  style={{
                    fontSize: 17,
                    color: "var(--navigation-color)",
                    fontWeight: 600,
                  }}
                >
                  {I18n.get("githubRepository")}
                </FormLabel>

                <InputBase
                  size="medium"
                  fullWidth
                  margin="dense"
                  style={{
                    border: "1px solid white",
                    borderRadius: 4,
                    padding: "8px 10px",
                  }}
                  {...register("github", {
                    required: "Github Respository is required",
                  })}
                />
              </FormControl>
            </FormGroup>
          </div>
          <div
            className="flex"
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Button
              onClick={() =>
                setState((prevState) => ({ ...prevState, addProject: false }))
              }
              size="large"
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
              style={{ minWidth: "180px" }}
            />
          </div>
        </form>
      ) : null}
    </div>
  );
};

export { Projects };
