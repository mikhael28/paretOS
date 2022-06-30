import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { I18n } from "@aws-amplify/core";
import LoaderButton from "../components/LoaderButton";
import { ActiveExperience, MongoExperience } from "../types";

/**
 * This is the modal where a player submits the proof for their Arena event
 */

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiInputBase-input": {
      fontSize: 16,
      color: "#000",
    },
    "& .MuiButtonBase-root": {
      marginTop: theme?.spacing(1) || 8,
      marginRight: 6,
      fontSize: 16,
      padding: "6px 32px",
      textTransform: "none",
    },
    "& .MuiDialogActions-root": {
      padding: 0,
      display: "inline-flex",
      alignItems: "end",
    },
  },
}));

export interface SubmitProofProps {
  show: boolean;
  handleClose: () => void;
  markSubmitted: (
    activeExperience: ActiveExperience,
    github: string,
    athleteNotes: string
  ) => void;
  activeExperience: ActiveExperience;
}

export default function SubmitProof({
  show,
  handleClose,
  markSubmitted,
  activeExperience,
}: SubmitProofProps) {
  const classes = useStyles();
  const [isChanging, setChanging] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<{
    github: string;
    athleteNotes: string;
  }>({ mode: "onChange" });

  const onSubmit = handleSubmit((data) => {
    setChanging(true);
    markSubmitted(activeExperience, data.github, data.athleteNotes);
    setChanging(false);
    reset();
    handleClose();
  });

  return (
    <div>
      <Dialog
        fullWidth
        open={show}
        onClose={handleClose}
        keepMounted
        hideBackdrop={false}
      >
        <DialogTitle>
          {I18n.get("submitProof")}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form className={classes.root} onSubmit={onSubmit}>
            <h3>{I18n.get("notesForCoach")}</h3>
            <TextField
              id="athleteNotes"
              variant="filled"
              size="medium"
              autoFocus
              {...register("athleteNotes", { required: true })}
            />
            <br />
            <br />
            <h3>{I18n.get("submitLink")}</h3>
            <TextField
              id="github"
              variant="filled"
              size="medium"
              autoFocus
              {...register("github", { required: true })}
            />
            <br />
            <DialogActions>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleClose}
              >
                {I18n.get("close")}
              </Button>
              <LoaderButton
                type="submit"
                size="medium"
                text={I18n.get("submitProof")}
                loadingText={I18n.get("saving")}
                disabled={!formState.isValid}
                isLoading={isChanging}
              />
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
