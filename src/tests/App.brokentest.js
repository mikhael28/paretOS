import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "../Appp";
import reducer from "../state/indexx";

// TODO: Fix test failure, rename, move to tests folder

it("renders without crashing", async () => {
  jest.useFakeTimers();
  const div = document.createElement("div");
  const store = createStore(reducer);

  render(
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
