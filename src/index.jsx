import { createRoot } from "react-dom/client";
import { Amplify } from "@aws-amplify/core";
import { RestAPI } from "@aws-amplify/api-rest";
import { Storage } from "@aws-amplify/storage";
import { BrowserRouter as Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import awsmobile from "./aws-exports";
import reducer from "./state/index";
// import css below
import "./css/index.css";
import "./css/arena.css";
import "./css/cards.css";
import "./css/form.css";
import "./css/leaderboard.css";
import "./css/messaging.css";
import "./css/modal.css";

/**
 * The index file where React is initialized - here we are initializing Sentry (error tracking notification service), our API endpoints (courtesy of API Gateway + AWS Lambda) throught the AWS Amplify library, as well as initializing our Redux store.
 * @TODO Service Worker Issue #19
 * @TODO Issue #262
 */

if (import.meta.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

export const store = configureStore({
  reducer,
});

Amplify.configure(awsmobile);
RestAPI.configure({
  endpoints: [
    {
      name: "pareto",
      endpoint: import.meta.env.VITE_PARETO_ENDPOINT,
      region: import.meta.env.VITE_PARETO_ENDPOINT,
    },
    {
      name: "util",
      endpoint: import.meta.env.VITE_UTIL_ENDPOINT,
      region: import.meta.env.VITE_UTIL_REGION,
    },
  ],
});

Storage.configure({
  AWSS3: {
    bucket: import.meta.env.VITE_PROOF_BUCKET,
    region: import.meta.env.VITE_UTIL_REGION,
  },
});

// eslint-disable-next-line no-undef
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Router>
    {/* This is a wrapper that makes v5 and v6 work together for compatibility */}
    <CompatRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </CompatRouter>
  </Router>
);

serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
