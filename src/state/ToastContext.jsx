import React, { useCallback, useEffect, useState, createContext } from "react";
import LoaderButton from "../components/LoaderButton";
import logo from "../assets/Pareto-Red-01.png";

// Temporary context to remove toasted-notes
export const ToastMsgContext = createContext({
  handleShowSuccess: (string) => {},
  handleShowError: (error) => {},
});

const ToastContext = createContext();

export default ToastContext;

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(
        () => setToasts((toasts) => toasts.slice(1)),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addToast = useCallback(
    function (toast) {
      setToasts((toasts) => [...toasts, toast]);
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toasts-wrapper">
        {toasts.map((toast) => (
          <div style={{ display: "flex" }} className="block">
            <img src={logo} height="80" width="80" alt="Pareto Logo" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 10,
              }}
            >
              <h4 style={{ color: "red", marginTop: 10 }}>
                {/* {err.name}: {err.message} */}
                Test
              </h4>

              <p style={{ marginBottom: 0, marginTop: -10, fontSize: 11 }}>
                Please refresh the page and try again.
              </p>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <LoaderButton
                  style={{
                    backgroundColor: "rgb(220, 66, 45)",
                  }}
                  onClick={() => {
                    //    onClose();
                  }}
                  text="Close"
                />
                <LoaderButton
                  style={{ backgroundColor: "green" }}
                  onClick={() => {
                    // eslint-disable-next-line no-undef
                    window.location.replace("/");
                  }}
                  text="Refresh"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
