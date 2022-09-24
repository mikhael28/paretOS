import { useState, ErrorInfo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ErrorBoundaryCopy(props) {
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [stackTrace, setStackTrace] = useState("");

  let unregisterListener: any;

  // function componentDidMount() {
  //   console.log(props);
  //   Creating an event listener to unmount the ErrorBoundary when navigating away/soft reloading the route
  //   Otherwise, the error boundary will persist in the entire route tree.
  //   If the component/container still has an error after a soft-reload, the ErrorBoundary will catch it again.
  //   unregisterListener = navigate((location: any, action: any) => {
  //     if ((action === "PUSH" || action === "REPLACE") && hasError === true) {
  //       setHasError(false);
  //     }
  //   });
  // }

  useEffect(() => {
    const { navigate } = props;
    console.log(props, navigate);
    // Creating an event listener to unmount the ErrorBoundary when navigating away/soft reloading the route
    // Otherwise, the error boundary will persist in the entire route tree.
    // If the component/container still has an error after a soft-reload, the ErrorBoundary will catch it again.
    unregisterListener = navigate((location: any, action: any) => {
      if ((action === "PUSH" || action === "REPLACE") && hasError === true) {
        setHasError(false);
      }
    });
  }, []);

  function getDerivedStateFromError(_: Error): any {
    // Update state so the next render will show the fallback UI.
    if (window.location.hostname !== "paret0") {
      return { hasError: true, errorText: _.message, stackTrace: "" };
    } else {
      return { hasError: false, errorText: _.message, stackTrace: "" };
    }
  }

  function componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // isolate the stack trace
    // setState({ stackTrace: errorInfo.componentStack.toString() });
    setStackTrace(errorInfo.componentStack.toString());
  }

  if (hasError) {
    return (
      <div>
        <h2>There has been an error</h2>

        <h3>{errorText}</h3>
        <p>{stackTrace}</p>
        <button
          className="btn"
          style={{ color: "white" }}
          onClick={() => window.location.reload()}
        >
          Click here to reload!
        </button>
      </div>
    );
  }
  return props.children;
}

export default ErrorBoundaryCopy;
