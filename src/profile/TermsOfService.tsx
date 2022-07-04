import { useTheme } from "@mui/material";
import { strings } from "../libs/strings";
import Modal from "../components/Modal";
import LoaderButton from "../components/LoaderButton";

interface TermsOfServiceProps {
  isLoading: boolean;
  open: boolean;
  onClickAgree: () => {};
  onClose: () => {};
  childProps: any;
}

export default function TermsOfService({
  isLoading,
  open,
  onClickAgree,
  onClose,
  childProps,
}: TermsOfServiceProps) {
  const theme = useTheme();
  return (
    <>
      <Modal open={open} onClose={onClose} childProps={childProps}>
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
