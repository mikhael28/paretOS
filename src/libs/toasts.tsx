import toast from "toasted-notes";
import LoaderButton from "../components/LoaderButton";
import logo from "../assets/Pareto-Red-01.png";

/**
 * Toast notification for errors, and assorted messages.
 */

export function errorToast(err: Error) {
  toast.notify(
    ({ onClose }) => (
      <div style={{ display: "flex" }} className="block">
        <img src={logo} height="80" width="80" alt="Pareto Logo" />
        <div
          style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}
        >
          {err.name ? (
            <h4 style={{ color: "red", marginTop: 10 }}>
              {err.name}: {err.message}
            </h4>
          ) : (
            <h4 style={{ color: "red", marginTop: 10 }}>{JSON.stringify(err)}</h4>
          )}
          <p style={{ marginBottom: 0, marginTop: -10, fontSize: 11 }}>
            Please refresh the page and try again. Click the 'Report' button
            below to send a copy of this error to the developers.
          </p>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <LoaderButton
              style={{
                backgroundColor: "rgb(220, 66, 45)",
              }}
              onClick={() => {
                onClose();
              }}
              text="Close"
            />
            <LoaderButton
              style={{ backgroundColor: "green" }}
              onClick={() => {
                window.location.replace("/");
              }}
              text="Refresh"
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

export function successToast(param: string) {
  toast.notify(
    <div>
      <h3>{param}</h3>
    </div>,
    {
      position: "top-right",
    }
  );
}
