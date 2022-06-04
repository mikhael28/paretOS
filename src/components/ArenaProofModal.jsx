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
import LoaderButton from "./LoaderButton";
import uploadToS3 from "../libs/s3";

/**
 * The Arena Proof Modal is where a player submits the proof of their achievement, and where they/their coach (I believe - review) can review the proof.
 * @TODO #89
 * @TODO #87
 * @TODO #26
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
      marginTop: theme.spacing(1) || 8,
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

export default function ArenaProofModal({
  day,
  view,
  show,
  user,
  sprint,
  handleClose,
  activeIndex,
  activeMission,
  activeSprintId,
  handleChange: propsHandleChange,
  handleToast,
}) {
  const [pictureKey, setPictureKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const classes = useStyles();

  //   const [isChanging, setIsChanging] = useState(false);
  //   const validateForm = () => athleteNotes.length > 0 && github.length > 0;

  const onSubmit = (data) => {
    propsHandleChange(
      activeMission,
      activeIndex,
      day,
      pictureKey,
      activeSprintId,
      `${user.fName} just completed ${activeMission.title}.${
        data.trashTalk.length > 0 ? `They also said: "${data.trashTalk}"` : ""
      } `
    );
    setPictureKey("");
    reset();
    handleClose();
  };

  const onChange = async (e) => {
    setLoading(true);

    let fileType = e.target.files[0].name.split(".");
    const file = e.target.files[0];
    // the name to save is the sprint_id_teamIndex_dayIndex_missionIndex
    try {
      const pictureKey = await uploadToS3(
        `${sprint.id}_0_${day}_${activeIndex}`,
        file,
        fileType[1]
      );

      setPictureKey(pictureKey.key);
      handleToast("success", "Proof successfully uploaded.");
    } catch (e) {
      handleToast("error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {view === "submit" ? (
        <>
          <DialogContent>
            <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
              <h3>{I18n.get("trashTalkPSA")}</h3>
              <TextField
                id="trashTalk"
                variant="filled"
                size="medium"
                autoFocus
                {...register("trashTalk")}
              />
              <br />
              <br />
              <h3>{I18n.get("attachment")}</h3>
              <input type="file" onChange={(evt) => onChange(evt)} />
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
                  loadingText={I18n.get("creating")}
                  // ? Is there a reason this is commented?
                  // disabled={!this.validateForm()}
                  isLoading={loading}
                />
              </DialogActions>
            </form>
          </DialogContent>
        </>
      ) : (
        <DialogContent>
          {activeMission.proofLink !== "" ? (
            <a
              href={`https://${import.meta.env.VITE_PROOF_BUCKET}.s3.amazonaws.com/public/${activeMission.proofLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {I18n.get("viewProof")}
            </a>
          ) : (
            <p>{I18n.get("noProof")}</p>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
