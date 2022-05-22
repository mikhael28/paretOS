import { useTheme } from "@mui/material";
import { strings } from "../libs/strings";
import Modal from "../components/Modal";
import LoaderButton from "../components/LoaderButton";

export default function TermsOfService({
  isLoading,
  open,
  onClickAgree,
  onClose,
}) {
  const theme = useTheme();
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div
          style={{
            margin: -24,
            padding: 24,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <h2>Terms of Service</h2>
          <br />
          <p>{strings.en.termsOfService}</p>
          <div>
            <LoaderButton
              style={{ marginLeft: "auto" }}
              block
              size="small"
              isLoading={isLoading}
              onClick={onClickAgree}
              text="I Agree"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
