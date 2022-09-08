import RestAPI from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import { useSelect } from "@mui/base";
import { FormEvent, useCallback, useState } from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import {
  Button,
  TextareaAutosize,
  FormControl,
  TextField,
  useTheme,
  FormLabel,
  FormControlLabel,
} from "@mui/material";

import { BsPencil } from "react-icons/bs";
import { useSelector } from "react-redux";
import LoaderButton from "../../components/LoaderButton";
import { selectProfile } from "../../redux/selectors/profile/select-profile";
import { selectSummary } from "../../redux/selectors/profile/select-summary";
import { useForm } from "react-hook-form";
import { setUserAction } from "../../redux/state/profile";
import { store } from "../../redux/store";

const Summary = () => {
  const summary = useSelector(selectSummary);
  const [state, setState] = useState({
    summaryCheck: false,
    isLoading: false,
  });

  const {
    getValues,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  console.log({ errors });

  const onSubmit = (data: any) => updateBio(data);

  const updateBio = useCallback(async (values: any) => {
    const profile = selectProfile(store.getState());

    console.log({ profile });
    setState((prevState) => ({ ...prevState, isLoading: true }));

    let body = {
      summary: values.summary,
    };
    try {
      const response = await RestAPI.put("pareto", `/users/${profile.id}`, {
        body,
      });

      store.dispatch(setUserAction({ ...response, summary: values.summary }));
      setState((prevState) => ({
        ...prevState,
        //user: response,
        summaryCheck: false,
      }));
    } catch (e) {
      console.log("email send error: ", e);
      // toast(e, { type: toast.TYPE.ERROR})
    }
    setState((prevState) => ({ ...prevState, isLoading: false }));
  }, []);
  return (
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
        <form style={{ margin: 8 }} onSubmit={handleSubmit(onSubmit)}>
          <FormGroup controlId="summary" bsSize="large">
            <ControlLabel>{I18n.get("bio")}</ControlLabel>
            {/*   <FormControl
              defaultValue={summary}
              //onChange={handleChange}
              componentClass="textarea"
            /> */}
            {/*  <TextField className="textarea" /> */}

            {/*   <TextareaAutosize
              className="textarea"
              maxRows={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue={summary}
              style={{ width: 200, height: 100 }}
            /> */}
          </FormGroup>
          <FormControl component="fieldset" variant="filled" fullWidth disabled>
            <FormLabel style={{ fontSize: 17, color: "#fff", fontWeight: 600 }}>
              {I18n.get("bio")}
            </FormLabel>
            <TextareaAutosize
              {...register("summary", {
                required: "Public bio is required",
              })}
              className="textarea"
              maxRows={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue={summary}
              style={{ width: "100%", height: 100, background: "transparent" }}
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
              //onClick={updateBio}
              isLoading={state.isLoading}
              text={I18n.get("save")}
              loadingText={I18n.get("loading")}
              style={{ minWidth: "180px" }}
            />
          </div>
        </form>
      ) : (
        <>
          <div className="block">
            <p>{summary} </p>
          </div>
        </>
      )}
    </div>
  );
};

export { Summary };
