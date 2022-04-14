import { StrictMode } from "react";
import ReactDOM from "react-dom";
import Amplify from "@aws-amplify/core";
import API from "@aws-amplify/api";
import Storage from "@aws-amplify/storage";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import awsmobile from "./aws-exports";
import reducer from "./state/index";
import "./index.css";

/**
 * The index file where React is initialized - here we are initializing Sentry (error tracking notification service), our API endpoints (courtesy of API Gateway + AWS Lambda) throught the AWS Amplify library, as well as initializing our Redux store.
 * @TODO Suspense API Issue #18
 * @TODO Service Worker Issue #19
 * @TODO Lazy Loading Issue #20
 */

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    // integrations: [],
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const store = createStore(reducer);

Amplify.configure(awsmobile);
API.configure({
  endpoints: [
    {
      name: "pareto",
      endpoint: process.env.REACT_APP_PARETO_ENDPOINT,
      region: process.env.REACT_APP_PARETO_ENDPOINT,
    },
    {
      name: "util",
      endpoint: process.env.REACT_APP_UTIL_ENDPOINT,
      region: process.env.REACT_APP_UTIL_REGION,
    },
  ],
});

Storage.configure({
  AWSS3: {
    bucket: process.env.REACT_APP_PHOTO_BUCKET,
  },
});

ReactDOM.render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>,
  document.getElementById("root")
);

// @TODO register service worker for full PWA, currently disabled while in alpha
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
