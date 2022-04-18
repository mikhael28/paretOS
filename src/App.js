import React, { Component } from "react";
import Auth from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import API from "@aws-amplify/api";
import { withRouter } from "react-router-dom";
import Image from "react-bootstrap/lib/Image";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Tour from "reactour";
import { GrLogout } from "react-icons/gr";
import * as Sentry from "@sentry/react";
import sortby from "lodash.sortby";
import { Slide, Dialog, Box, ThemeProvider } from "@mui/material";
import { strings } from "./libs/strings";
import BottomNav from "./components/BottomNav";
import sanity from "./libs/sanity";
import LanguageContext from "./LanguageContext";
import LoadingModal from "./components/LoadingModal";
import {
  getActiveSprintData,
  getInitialSprintData,
  putUpdatedSprintData,
} from "./state/sprints";
import {
  fetchUser,
  fetchStarterKitSanity,
  fetchStarterKitExperience,
  fetchCoaches,
  fetchCoachingRoster,
  fetchSanitySchemas,
} from "./libs/initialFetch";
import "toasted-notes/src/styles.css";
import LeftNav from "./components/LeftNav";
import { getUser } from "./state/profile";
import { errorToast } from "./libs/toasts";
import Routes from "./Routes";
import question from "./assets/help.png";
import theme from "./libs/theme";
import { availableLanguages } from "./libs/languages";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This is the initial mount of the application, at the least the high level of it (index.js is the first load, excluding the index.html))
 * @TODO GitHub Issue #3
 * @TODO ChildProps Audit - Issue #5
 * @TODO Internalization Rerender - Issue #6
 */

const languageProps = {
  language: null,
  setLanguage: () => {},
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      username: "",
      user: { id: "8020", fName: "Vilfredo", lName: "Pareto" },
      training: {},
      product: {},
      interviewing: {},
      sprints: [],
      session: {},
      athletes: [],
      coaches: [],
      // admin state
      users: [],
      relationships: [],
      isTourOpen: false,
      loading: false,
      initialLoadComplete: false,
      sanitySchemas: {
        technicalSchemas: [],
        economicSchemas: [],
        hubSchemas: [],
      },
      ws: "",
      experiences: [],
      messages: [],
      chosenLanguage: availableLanguages[0],
      sanityTraining: [],
      sanityProduct: [],
      sanityInterview: [],
    };
    // this.wsClient = "";
  }

  // initial websocket timeout duration as a class variable
  // eslint-disable-next-line react/no-unused-class-component-methods
  timeout = 5000;

  closeTour = () => {
    this.setState({
      isTourOpen: false,
    });
  };

  async componentDidMount() {
    this.setLoading();

    I18n.putVocabularies(strings);

    try {
      const session = await Auth.currentSession();
      this.setState({
        username: session.idToken.payload.sub,
        session: session,
      });
      this.setState({ isAuthenticating: false });

      await this.initialFetch(session.idToken.payload.sub);
    } catch (e) {
      if (e === "No current user") {
        this.setCloseLoading();
      }
      if (e !== "No current user") {
        errorToast(e, this.state.user);
      }
      this.setState({ loading: false });
    }
    this.setState({ isAuthenticating: false });
  }

  initialFetch = async (username) => {
    let newState = {};
    const path = this.props.location.pathname;

    // Fetch only the data needed for that page
    const [context, training, arena] = [
      path.includes("context-builder"),
      path.includes("training"),
      !path.includes("context-builder") && !path.includes("training"),
    ];
    const socketOptions = { updateState: false };
    if (this.state.initialLoadComplete === false) {
      const user = await fetchUser(username);
      if (user.length > 0) {
        const currentUser = user[0];
        try {
          this.props.getUser(currentUser);
          newState.user = currentUser;
          if (currentUser.defaultLanguage) {
            const language = availableLanguages.find(
              (x) => x.code === currentUser.defaultLanguage
            );
            newState.chosenLanguage = language || "en";
            I18n.setLanguage(currentUser.defaultLanguage);
          }
          socketOptions.user = currentUser;
          const results = await Promise.all(
            [
              context && fetchStarterKitSanity(),
              context && fetchSanitySchemas(),
              training && fetchStarterKitExperience(currentUser.id),
              arena && this.connectSocketToSprint(socketOptions),
              fetchCoaches(currentUser.id),
              currentUser.instructor === true &&
                fetchCoachingRoster(currentUser.id),
            ].filter((x) => x !== false)
          );

          results
            .filter((r) => r !== false)
            .forEach((item) => {
              const { success, ...rest } = item;
              if (success === true) {
                newState = { ...newState, ...rest };
              }
            });
          newState.isAuthenticated = true;
          this.setState({ ...newState }, () => this.setCloseLoading());
        } catch (e) {
          console.log(e.toString());
          if (e.toString() === "Error: Network Error") {
            console.log("Successfully identified network error");
          }
        }
      }
      try {
        // Load content that will be needed in other areas.
        let afterState = {};
        afterState.loading = false;
        const afterResults = await Promise.all([
          !context && fetchStarterKitSanity(),
          !context && fetchSanitySchemas(),
          !training && fetchStarterKitExperience(this.state.user.id),
          !arena && this.connectSocketToSprint(socketOptions),
        ]);
        afterResults
          .filter((r) => r !== false)
          .forEach((item) => {
            const { success, ...rest } = item;
            if (success === true) {
              afterState = { ...afterState, ...rest };
            }
          });
        this.setState({ ...afterState }, () =>
          this.setState({ initialLoadComplete: true })
        );
      } catch (e) {
        console.log(e.toString());
        if (e.toString() === "Error: Network Error") {
          console.log("Successfully identified network error");
        }
      }
    }
  };

  connectSocketToSprint = async ({ user, updateState }) => {
    let result = { success: false, sprints: null };
    try {
      const sprints = await API.get("pareto", `/sprints/mentee/${user.id}`);
      result.success = true;
      result.sprints = sprints;

      if (updateState === true) {
        this.props.getInitialSprintData(sprints);
        this.setState({ sprints: sprints });
      }
      if (sprints.length === 0) {
        return result;
      }
    } catch (e) {
      console.error(e);
    }

    let sprintStrings = [];

    result.sprints.map((spr, idx) => {
      sprintStrings.push(`key${idx}=${spr.id}`);
    });

    let sprintString = sprintStrings.join("&");

    let wsClient = new WebSocket(
      `${process.env.REACT_APP_WSS_ENDPOINT}?${sprintString}`
    );

    // console.log(wsClient);

    let that = this; // caching 'this'
    let connectInterval;

    wsClient.onopen = () => {
      // console.log("Connected");
      this.setState({ ws: wsClient });
      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear interval on onOpen of websocket connection

      // console.log(wsClient);

      setInterval(() => {
        // console.log("Firing Ping");
        wsClient.send(`{"action":"sendmessage", "data":"ping" }`);
      }, 400000);
    };

    wsClient.onmessage = (message) => {
      // console.log("Received data: ", JSON.parse(message.data));
      let tempSprintData = JSON.parse(message.data);
      // this check is to see whether the websocket connection successfully retrieved the latest state.
      // if there are too many extraneous connections, through ping error or otherwise - the function to distribute state across connections will fail
      if (!tempSprintData.message) {
        let newerSprintArray = this.state.sprints.slice();
        let tempVar = 0;
        for (let i = 0; i < this.state.sprints.length; i++) {
          if (this.state.sprints[i].id === tempSprintData.id) {
            tempVar = i;
            break;
          }
        }
        newerSprintArray[tempVar] = tempSprintData;
        try {
          // console.log("Formatted Sprint Array: ", newerSprintArray);
          this.setState({ sprints: newerSprintArray });
          this.props.putUpdatedSprintData(newerSprintArray);
        } catch (e) {
          // console.log("onmessage error", e);
        }
      } else {
        // alert(tempSprintData.message);
      }
    };

    wsClient.onclose = (e) => {
      // we are trying to reconnect again if offline, with a limited backoff period
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout += that.timeout; // increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); // call check function after timeout
    };

    wsClient.onerror = (err) => {
      alert("Socket encountered error: ", err.message);
      console.log("Closing Socket");

      wsClient.close();
    };
    return result;
  };

  // potential way of closing a particular connectionID
  // componentWillUnmount() {
  //   this.state.ws.close(88, "uuid");
  // }

  check = () => {
    const { ws } = this.state;
    console.log("Websocket status: ", ws);
    if (
      !ws ||
      ws.readyState === WebSocket.CLOSED ||
      ws.readyState === WebSocket.CLOSING
    ) {
      this.connectSocketToSprint({
        user: this.state.user,
        updateState: true,
      }); // check if ws instance is closed - if so, reconnect
    }
  };

  fetchMenteeSprints = async (userId) => {
    try {
      let menteeSprints = await API.get("pareto", `/sprints/mentee/${userId}`);
      this.setState({ sprints: menteeSprints });
    } catch (e) {
      errorToast(e);
    }
  };

  userHasAuthenticated = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  };

  refreshExperience = (type, updatedObject) => {
    if (type === "training") {
      this.setState({ training: updatedObject });
    } else if (type === "product") {
      this.setState({ product: updatedObject });
    } else if (type === "interviewing") {
      this.setState({ interviewing: updatedObject });
    }
  };

  handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem("sanity");
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  };

  setLoading = () => {
    this.setState({ loading: true });
  };

  setCloseLoading = () => {
    this.setState({ loading: false });
  };

  updateLanguage = ({ name, code, image }) => {
    this.setState({ chosenLanguage: { name, code, image } });
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const Onboarding = withRouter(({ location: { pathname }, history }) => {
      const steps = [
        {
          selector: ".first-step",
          content: `${I18n.get("appFirst")}`,
        },
        {
          selector: ".second-step",
          content: `${I18n.get("appSecond")}`,
        },
        {
          selector: ".third-step",
          content: `${I18n.get("appThird")}`,
        },
        // {
        //   selector: ".fourth-step",
        //   content: `${I18n.get("appFourth")}`,
        // },
        {
          selector: ".fifth-step",
          content: `${I18n.get("appFifth")}`,
        },
        {
          selector: ".sixth-step",
          content: `${I18n.get("appSixth")}`,
        },
      ];
      return (
        <Tour
          steps={steps}
          isOpen={this.state.isTourOpen}
          onRequestClose={this.closeTour}
          showCloseButton
          update={pathname}
          rewindOnClose={false}
        />
      );
    });
    const childProps = {
      // authentication related state
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      username: this.state.username,
      user: this.state.user,
      session: this.state.session,
      setLoading: this.setLoading,
      setCloseLoading: this.setCloseLoading,
      chosenLanguage: this.state.chosenLanguage,
      connectSocket: this.connectSocketToSprint,
      ws: this.state.ws,

      // experience related state
      product: this.state.product,
      interviewing: this.state.interviewing,
      training: this.state.training,
      refreshExperience: this.refreshExperience,
      sanityTraining: this.state.sanityTraining,
      sanityInterview: this.state.sanityInterview,
      sanityProduct: this.state.sanityProduct,
      experiences: this.state.experiences,

      // sprint related state
      fetchMenteeSprints: this.fetchMenteeSprints,
      initialFetch: this.initialFetch,
      sprints: this.state.sprints,
      messages: this.state.messages,

      // assorted/unused state
      users: this.state.users,
      relationships: this.state.relationships,
      athletes: this.state.athletes,
      sanitySchemas: this.state.sanitySchemas,
      coaches: this.state.coaches,
    };
    languageProps.language = this.state.chosenLanguage;
    languageProps.setLanguage = this.updateLanguage;

    return (
      !this.state.isAuthenticating && (
        <ThemeProvider theme={theme}>
          <LanguageContext.Provider value={languageProps}>
            <Sentry.ErrorBoundary
              // eslint-disable-next-line no-unused-vars
              fallback={({ error, componentStack, resetError }) => (
                <>
                  <div>
                    Dear user, you have (sadly) encountered an error. The error
                    is written out for you below, but it's probably useless to
                    you. If you are just interested in moving past this
                    unfortunate incident, click the button below to reload the
                    page and start fresh.
                  </div>
                  <div>{error.toString()}</div>
                  <div>{componentStack}</div>
                  <button onClick={() => window.location.replace("/")}>
                    Click here to reset!
                  </button>
                </>
              )}
            >
              <Box
                sx={{
                  width: "100vw",
                  height: "100vh",
                  bgcolor: "background.default",
                  color: "text.primary",
                  overflow: "scroll",
                }}
              >
                {this.state.isAuthenticated ? (
                  <>
                    <div
                      className="sticky-logout"
                      style={{
                        filter: theme.palette.mode === "dark" ? "invert()" : "",
                      }}
                      onClick={this.handleLogout}
                    >
                      <GrLogout style={{ height: "20px" }} />
                    </div>

                    <div className="root-padding">
                      <LeftNav
                        chosenLanguage={this.state.chosenLanguage}
                        updateState={this.setState.bind(this)}
                        user={this.state.user}
                        athletes={this.state.athletes}
                      />

                      <Routes childProps={childProps} />
                    </div>
                    <div className="sticky-nav">
                      <div className="sticky-chat">
                        <Image
                          src={question}
                          onClick={(event) => {
                            event.preventDefault();
                            this.setState({ isTourOpen: true });
                          }}
                          height="40"
                          width="40"
                          circle
                          className="sticky-btn"
                          style={{
                            marginRight: 12,
                            cursor: "pointer",
                            filter: "grayscale(100%)",
                            outline: "2px solid white",
                            border: "2px solid transparent",
                          }}
                        />
                      </div>
                      <div id="myBottomNav" className="bottom-nav">
                        <BottomNav user={this.state.user} />
                      </div>
                    </div>
                  </>
                ) : (
                  <Routes childProps={childProps} />
                )}
                <Onboarding
                  isOpen={this.state.isTourOpen}
                  onRequestClose={this.closeTour}
                  showCloseButton
                />
                <Dialog
                  style={{
                    margin: "auto",
                  }}
                  open={this.state.loading}
                  TransitionComponent={Transition}
                  keepMounted
                  disableEscapeKeyDown
                  fullScreen
                  fullWidth
                  hideBackdrop={false}
                  aria-labelledby="loading"
                  aria-describedby="Please wait while the page loads"
                >
                  <LoadingModal />
                </Dialog>
              </Box>
            </Sentry.ErrorBoundary>
          </LanguageContext.Provider>
        </ThemeProvider>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  redux: state.redux,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getActiveSprintData: (data) => getActiveSprintData(data),
      getInitialSprintData: (data) => getInitialSprintData(data),
      putUpdatedSprintData: (data) => putUpdatedSprintData(data),
      getUser: (data) => getUser(data),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
