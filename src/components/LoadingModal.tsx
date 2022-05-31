import { DialogContent, useTheme } from "@mui/material";
import getRandomQuote from "../libs/quotes";

const { quote, author } = getRandomQuote();
/**
 * This component is responsible for showing some sweet motivational quotes while everything loads.
 */

const LoadingModal = () => {
  const theme = useTheme();
  return (
    <>
      <DialogContent
        style={{
          backgroundColor: theme.palette.background.default,
          overflow: "visible",
          textAlign: "center",
        }}
      >
        <div className="ipl-progress-indicator" id="spinner">
          <h1 id="header">Un Momento</h1>
          <div className="lds-dual-ring" />
        </div>{" "}
        <div style={{ marginBottom: 400, marginTop: 20 }}>
          <div
            style={{
              textAlign: "center",
              color: theme.palette.text.primary,
              fontSize: 24,
              marginRight: "20%",
              marginLeft: "20%",
            }}
            id="now-loading"
          >
            {quote}
          </div>
          <div
            style={{
              textAlign: "center",
              color: theme.palette.text.primary,
              fontSize: 20,
            }}
          >
            {author}
          </div>
        </div>
      </DialogContent>
    </>
  );
};

export default LoadingModal;
