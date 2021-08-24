import React from "react";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { quotes } from "../libs/quotes";

const randomIndex = Math.floor(Math.random() * Math.floor(quotes.length));

/**
 * This component is responsible for showing some sweet motivational quotes while everything loads.
 * @TODO Add a progressive loading bar, that updates proportionally based on how many of the network requests it completes that it is supposed to.
 * @TODO Optimize the current number of network requests that are being sent out in App.js. I know that this todo should be in that file, but this is such an important feature that I figured it should also be in here - just as extra emphasis.
 * @TODO Review accessibility for the loading modal and dialog text. Review ids.
 */

const LoadingModal = () => {
  return (
    <React.Fragment>
      <DialogContent style={{ overflow: "visible", textAlign: "center" }}>
        <div className="ipl-progress-indicator" id="spinner">
          <h1 id="header">Un Momento</h1>
          <br />
          <div className="lds-dual-ring" />
        </div>{" "}
      </DialogContent>
      <div style={{ marginBottom: 400 }}>
        <DialogContent>
          <DialogContentText
            style={{
              textAlign: "center",
              color: "black",
              fontSize: 24,
              marginRight: "20%",
              marginLeft: "20%",
              textAlign: "center",
            }}
            id="alert-dialog-slide-description"
          >
            {quotes[randomIndex].quote}
          </DialogContentText>
          <DialogContentText
            style={{ textAlign: "center", color: "black", fontSize: 20 }}
          >
            {quotes[randomIndex].author}
          </DialogContentText>
        </DialogContent>
      </div>
    </React.Fragment>
  );
};

export default LoadingModal;
