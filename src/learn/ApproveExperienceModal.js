import React from "react";
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
import BlockContent from "@sanity/block-content-to-react";
import { I18n } from "@aws-amplify/core";

/**
 * This component is for a Coach to approve the work of the student, and to leave feedback.
 * @TODO Issue #64
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

const ConfirmModal = ({
  show,
  activeExperience,
  mongoExperience,
  closeModal,
  markRequestRevisions,
  markComplete,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const classes = useStyles();

  const onSubmit = (data) => {
    if (mongoExperience[activeExperience.priority].revisionsNeeded === false) {
      markRequestRevisions(activeExperience, mongoExperience, data.coachNotes);
    } else {
      markComplete(activeExperience, mongoExperience, data.coachNotes);
    }
    reset();
    closeModal();
  };

  return (
    <Dialog
      fullWidth
      open={show}
      onClose={closeModal}
      keepMounted
      hideBackdrop={false}
    >
      <DialogTitle>
        {I18n.get("reviewFor")} {activeExperience.title}
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.root}>
        <h3>{I18n.get("description")}</h3>
        <BlockContent blocks={activeExperience.overview} />
        <h3>{I18n.get("notesForCoach")}</h3>
        <p>{mongoExperience[activeExperience.priority].athleteNotes}</p>
        <h3>{I18n.get("submitLink")}</h3>
        <a
          href={mongoExperience[activeExperience.priority].github}
          target="_blank"
          rel="noopener noreferrer"
        >
          {I18n.get("openLink")}
        </a>
        <br />
        {mongoExperience[activeExperience.priority].coachNotes.length > 0 ? (
          <>
            <h3>{I18n.get("coachesNotes")}</h3>
            <p>{mongoExperience[activeExperience.priority].coachNotes}</p>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={closeModal}
            >
              {I18n.get("close")}
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{I18n.get("coachesNotes")}</h3>
            <TextField
              id="coachNotes"
              variant="filled"
              size="medium"
              autoFocus
              {...register("coachNotes")}
            />
            <DialogActions>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={closeModal}
              >
                {I18n.get("close")}
              </Button>
              {mongoExperience[activeExperience.priority].approved ===
              true ? null : (
                <>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {mongoExperience[activeExperience.priority]
                      .revisionsNeeded === false
                      ? I18n.get("requestRevisions")
                      : I18n.get("confirmAchievement")}
                  </Button>
                </>
              )}
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ConfirmModal;
