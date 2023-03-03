import { useCallback, useEffect, useState, createContext, ComponentPropsWithoutRef } from "react";
import LoaderButton from "../components/LoaderButton";
import logo from "../assets/Pareto-Red-01.png";
import { Snackbar, Alert, AlertColor } from "@mui/material";


// Leaving toast type as any for now as it is a work in progress
type ShowErrorFunction = (error: Error) => void;
const placeholderShowErrorFunction = (() => { }) as ShowErrorFunction; // skipcq: JS-0321

export const ToastMsgContext = createContext({
  handleShowSuccess: (st: string) => {
    ToastMsg({ msg: st, type: 'success', open: false, handleCloseSnackbar: () => { } }) // skipcq: JS-0321
  },
  handleShowError: placeholderShowErrorFunction, // skipcq: JS-0356
});
type AddToastFunction = (t: object) => void;
const placeholderAddToastFunction = (() => { }) as AddToastFunction; // skipcq: JS-0321


const ToastContext = createContext({ addToast: placeholderAddToastFunction }); // skipcq: JS-0356

interface ToastMessageProps {
  msg: string;
  type: AlertColor | undefined;
  open: boolean;
  handleCloseSnackbar: () => void;
}

export function ToastMsg({ msg, type, open, handleCloseSnackbar }: ToastMessageProps) {
  const handleClose = () => {
    handleCloseSnackbar();
  };

  if (!type) {
    type = "info";
  }
  return (
    <Snackbar
      id="toast-message-snackbar"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert id="toast-message" onClose={handleClose} severity={type} sx={{ width: "100%", p: 3 }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}


export default ToastContext;

export function ToastContextProvider({ children }: ComponentPropsWithoutRef<any>) { // skipcq: JS-0323
  const [toasts, setToasts] = useState([] as object[]);

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
    function (toast: any) { // skipcq: JS-0323
      setToasts((toasts: any[]) => [...toasts, toast]); // skipcq: JS-0323
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toasts-wrapper">
        {toasts.map((toast, index) => (
          <div key={`${index.toString()}-wrapper`}  style={{ display: "flex" }} className="block">
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
                  sx={{
                    backgroundColor: "rgb(220, 66, 45)",
                  }}
                  onClick={() => {
                    //    onClose();
                  }}
                  text="Close"
                />
                <LoaderButton
                  sx={{ backgroundColor: "green" }}
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
