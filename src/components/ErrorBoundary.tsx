import React, { Component, ErrorInfo } from "react";

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      hasError: false,
      errorText: "",
      stackTrace: "",
    }

  }
  

  private unregisterListener: any;

  public componentDidMount() {
    // Creating an event listener to unmount the ErrorBoundary when navigating away/soft reloading the route
    // Otherwise, the error boundary will persist in the entire route tree.
    // If the component/container still has an error after a soft-reload, the ErrorBoundary will catch it again.
    this.unregisterListener = this.props.history.listen(
      (location: any, action: any) => {
        if (
          (action === "PUSH" || action === "REPLACE") &&
          this.state.hasError === true
        ) {
          this.setState({
            hasError: false,
          });
        }
      }
    );
  }

  public static getDerivedStateFromError(_: Error): any {
    // Update state so the next render will show the fallback UI.
    console.log('Get derived state from : ', _)
    if (window.location.hostname !== "paret0") {
      return { hasError: true, errorText: _.message, stackTrace: "" };
    } else {
      return { hasError: false, errorText: _.message, stackTrace: "" };
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // isolate the stack trace
    console.log('did catch')
    console.log(this.props);
    console.log(error);
    console.log(errorInfo);
    this.setState({ stackTrace: errorInfo.componentStack.toString() });
  }

  public componentWillUnmount() {
    this.unregisterListener();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>There has been an error</h2>

          <h3>{this.state.errorText}</h3>
          <p>{this.state.stackTrace}</p>
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
    return this.props.children;
  }
}

export default ErrorBoundary;
