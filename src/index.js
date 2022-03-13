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

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

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
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// @TODO register service worker for full PWA, currently disabled while in alpha
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
