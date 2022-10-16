import React, { useState, useContext } from "react";
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
import uploadToS3 from "../utils/s3";
import { User } from "../types/ProfileTypes";
import { ActiveMission, Sprint } from "../types/ArenaTypes";
import { ToastMsgContext } from "@src/context/ToastContext";

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

export interface ArenaProofModalProps {
  day: number;
  view: string;
  show: boolean;
  user: User;
  activeIndex: number;
  sprint: { id: number } | Sprint;
  activeMission: ActiveMission;
  handleClose: () => void;
  handleChange: (
    activeMission: ActiveMission,
    activeIndex: number,
    day: number,
    pictureKey: string,
    message: string
  ) => void;
}

export default function ArenaProofModal({
  day,
  view,
  show,
  user,
  sprint,
  handleClose,
  activeIndex,
  activeMission,
  handleChange,
}: ArenaProofModalProps) {
  const { register, handleSubmit, reset } = useForm<{ trashTalk: string }>();
  const [pictureKey, setPictureKey] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);

  //   const [isChanging, setIsChanging] = useState(false);
  //   const validateForm = () => athleteNotes.length > 0 && github.length > 0;

  const onSubmit = handleSubmit((data) => {
    handleChange(
      activeMission,
      activeIndex,
      day,
      pictureKey,
      `${user.fName} just completed ${activeMission.title}.${
        data.trashTalk.length > 0 ? `They also said: "${data.trashTalk}"` : ""
      } `
    );
    setPictureKey("");
    reset();
    handleClose();
  });

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length) {
      return;
    }

    setLoading(true);

    const file = e.target.files[0];
    const fileType = file.name.split(".");
    // the name to save is the sprint_id_teamIndex_dayIndex_missionIndex
    try {
      const pictureKey = await uploadToS3(
        `${sprint.id}_0_${day}_${activeIndex}`,
        file,
        fileType[1]
      );

      setPictureKey(pictureKey.key);
      handleShowSuccess("Proof successfully uploaded.");
    } catch (e) {
      handleShowError(e as Error);
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
            <form className={classes.root} onSubmit={onSubmit}>
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
              href={`https://${
                import.meta.env.VITE_PROOF_BUCKET
              }.s3.amazonaws.com/public/${activeMission.proofLink}`}
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
