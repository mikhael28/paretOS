import React from "react";
import toast from "toasted-notes";
import LoaderButton from "../components/LoaderButton";
import logo from "../assets/Pareto-Red-01.png";
import { generateErrorEmail } from "./errorEmail";

/**
 * Toast notification for errors, and assorted messages.
 * @TODO font should be smaller for regular messages.
 * @TODO check if the report functionality is still working. Do I even need it? Theoretically, Sentry is handling this ish.
 */

export function errorToast(err, user) {
  toast.notify(
    ({ onClose }) => (
      <div style={{ display: "flex" }} className="block">
        <img src={logo} height="80" width="80" alt="Pareto Logo" />
        <div
          style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}
        >
          <h2 style={{ color: "red", marginTop: 10 }}>
            {err.name}: {err.message}
          </h2>
          <p style={{ marginBottom: 0, marginTop: -10, fontSize: 12 }}>
            Please refresh the page and try again. Click the 'Report' button
            below to send a copy of this error to the developers.
          </p>
          <div className="flex-evenly">
            <LoaderButton
              style={{ backgroundColor: "green" }}
              onClick={() => {
                generateErrorEmail(
                  user.fName,
                  user.lName,
                  new Date().toString(),
                  err.name,
                  err.message
                );
                onClose();
              }}
              // isLoading={this.state.isLoading}
              text="Report Bug"
              loadingText="Reporting..."
            />
            <LoaderButton
              style={{ backgroundColor: "rgb(220, 66, 45)" }}
              onClick={() => {
                onClose();
              }}
              // isLoading={this.state.isLoading}
              text="Close Notification"
              loadingText="Closing..."
            />
            <LoaderButton
              style={{ backgroundColor: "rgb(220, 66, 45)" }}
              onClick={() => {
                window.location.reload();
              }}
              // isLoading={this.state.isLoading}
              text="Reload Page"
              loadingText="Reloading..."
            />
          </div>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: null,
    }
  );
}

export function successToast(param) {
  toast.notify(
    <div>
      <h3>{param}</h3>
    </div>,
    {
      position: "top-right",
    }
  );
}
