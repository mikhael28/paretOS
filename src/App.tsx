import React, {
  useState,
  useEffect,
  MouseEvent,
  ReactElement,
  KeyboardEvent,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
import { RestAPI } from "@aws-amplify/api-rest";
import { useNavigate, useLocation, RouteProps, Location } from "react-router-dom";
import { useDispatch } from "react-redux";
import Tour from "reactour";
import { Slide, Dialog, Box, ThemeProvider, Theme } from "@mui/material";
import strings from "./intl/localization";
import { LanguageContext, LanguageProps } from "./state/LanguageContext";
import LoadingModal from "./components/LoadingModal";
import {
  fetchUser,
  fetchStarterKitSanity,
  fetchStarterKitExperience,
  fetchCoaches,
  fetchCoachingRoster,
  fetchSanitySchemas,
} from "./utils/queries/initialFetchQueries";
import { ToastMsgContext, ToastMsg } from "./state/ToastContext";
import { ChildProps } from "./Routes";
import theme from "./libs/theme";
import { availableLanguages } from "./libs/languages";
import ws from "./libs/websocket";
import { User } from "./types/ProfileTypes";
import { Sprint } from "./types/ArenaTypes";
import customHistory from "./utils/customHistory";
import { Coach } from "./types/MentorshipTypes";
import UnauthenticatedLayout from "./components/UnauthenticatedLayout";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

const Transition = React.forwardRef(function Transition(
  {
    children,
    ...props
  }: {
    children: ReactElement<any, any>;
    props: any;
  },
  ref
) {
  return <Slide children={children} direction="up" ref={ref} {...props} />;
});

/**
 * This is the initial mount of the application, at the least the high level of it (index.js is the first load, excluding the index.html))
 *
 */

const languageProps: LanguageProps = {
  language: null,
  setLanguage: () => { },
};

interface AppProps {
  children: RouteProps["children"];
  isAuthenticated: boolean;
  history: Array<string>;
  navigate: (path: string) => void;
}

function App(props: AppProps) {
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState({
    username: "",
    session: {},
  });
  const [toast, setToast] = useState({ msg: "", open: false, type: "info" });
  const emptyError: any = {};
  const [userData, setUserData] = useState({
    user: {
      id: "8020",
      _id: "",
      fName: "Vilfredo",
      lName: "Pareto",
      score: 0,
      email: "",
      github: "",
      phone: "",
      percentage: 0,
      admin: false,
      instructor: false,
      learningPurchase: false,
      review: {} as any,
      mentor: "",
      mentors: [],
      country: "",
      bio: "",
      summary: "",
      city: "",
      modules: [],
      experience: "",
      xp: 0,
      cp: 0,
      createdAt: "",
      __v: 0,
      achievements: [],
      missions: [] as any,
      planning: [] as any,
    } as User,
    chosenLanguage: availableLanguages[0],
  });
  const emptyArray: Array<object> = [];
  const emptyObject: object = {};
  const [training, setTraining] = useState({ ...emptyObject });
  const [product, setProduct] = useState({ ...emptyObject });
  const [interviewing, setInterviewing] = useState({ ...emptyObject });
  const [experiences, setExperiences] = useState([...emptyArray]);

  const [sanitySchemas, setSanitySchemas] = useState({
    technicalSchemas: [...emptyArray],
    economicSchemas: [...emptyArray],
    hubSchemas: [...emptyArray],
  });
  const initialSprints: Array<Sprint> = [];
  const [sprints, setSprints] = useState(initialSprints);
  const [athletes, setAthletes] = useState<any>([...emptyArray]);

  const [coaches, setCoaches] = useState([...emptyArray as Coach[]]);
  const [sanityTraining, setSanityTraining] = useState([...emptyArray]);
  const [sanityProduct, setSanityProduct] = useState([...emptyArray]);
  const [sanityInterview, setSanityInterview] = useState([...emptyArray]);
  const [adminData, setAdminData] = useState({
    users: [],
    relationships: [],
  });

  const handleShowError = (err: Error) => {
    setToast({
      msg: err.name ? `${err.name}:${err.message}` : `${err}`,
      open: true,
      type: "error",
    });
  };

  const handleShowSuccess = (msg: string) => {
    setToast({
      msg,
      open: true,
      type: "success",
    });
  };

  const handleCloseToast = () => {
    setToast({
      msg: "",
      open: false,
      type: "",
    });
  };

  const updateState = (property: string, payload: Array<object> | object) => {
    switch (property) {
      case "training":
        setTraining(payload);
        break;
      case "product":
        setProduct(payload);
        break;
      case "interviewing":
        setInterviewing(payload);
        break;
      case "experiences":
        setExperiences(payload as Array<object>);
        break;
      case "sanitySchemas":
        setSanitySchemas(
          payload as {
            technicalSchemas: Array<object>;
            hubSchemas: Array<object>;
            economicSchemas: Array<object>;
          }
        );
        break;
      case "sprints":
        setSprints(payload as Array<Sprint>);
        break;
      case "athletes":
        setAthletes(payload as Array<object>);
        break;
      case "coaches":
        setCoaches(payload as Array<Coach>);
        break;
      case "sanityTraining":
        setSanityTraining(payload as Array<object>);
        break;
      case "sanityProduct":
        setSanityProduct(payload as Array<object>);
        break;
      case "sanityInterview":
        setSanityInterview(payload as Array<object>);
        break;
      default:
        console.error("No property specified!");
    }
  };

  

  useEffect(() => {
    setLoading(true);
    I18n.putVocabularies(strings);

    const loadData = async () => {
      try {
        const session = await Auth.currentSession();
        const idToken = session.getIdToken();
        setAuthData({
          username: idToken.payload.sub,
          session: session,
        });
        setIsAuthenticating(false);
        await initialFetch(idToken.payload.sub);
      } catch (e) {
        if (e === "No current user") {
          const result = await fetchSanitySchemas();
          if (result.success) {
            setSanitySchemas(result.sanitySchemas);
            setLoading(false);
          } else {
            // TODO: If success === false, redirect to a page indicating a app error and to try again later (not the 404 not found page)
            setLoading(false);
          }
        }
        if (e !== "No current user") {
          handleShowError(e as Error);
          setLoading(false);
        }
      }
      setIsAuthenticating(false);
    };
    loadData();
  }, []);

  async function initialFetch(username: string) {
    const path = location.pathname || "";
    // Set up variables to enable fetching only the data needed for your current app view
    const [context, training, arena] = [
      path.includes("context-builder"),
      path.includes("training"),
      !path.includes("context-builder") && !path.includes("training"),
    ];
    const firstFetch: Array<Function> = [];
    const secondFetch: Array<Function> = [];

    const userArray: Array<User> = (await fetchUser(username)) as Array<User>;
    if (userArray.length > 0) {
      const currentUser = userArray[0];
      try {
        dispatch({
          type: "GET_USER",
          payload: currentUser,
        });
        const userStateUpdate = {
          user: currentUser,
          chosenLanguage: userData.chosenLanguage,
        };
        if (currentUser.defaultLanguage) {
          const language = availableLanguages.find(
            (x) => x.code === currentUser.defaultLanguage
          );
          I18n.setLanguage(currentUser.defaultLanguage);
          if (language) userStateUpdate.chosenLanguage = language;
        }
        setUserData(userStateUpdate as any);

        // Sort fetching functions according to whether they should happen before or after the loading overlay goes away
        if (context) {
          firstFetch.push(fetchSanitySchemas);
        } else {
          secondFetch.push(fetchSanitySchemas);
        }
        if (training) {
          firstFetch.push(() => fetchStarterKitExperience(currentUser.id));
          firstFetch.push(fetchStarterKitSanity);
        } else {
          secondFetch.push(() => fetchStarterKitExperience(currentUser.id));
          secondFetch.push(fetchStarterKitSanity);
        }
        if (arena) {
          firstFetch.push(() => connectSocketToSprint(currentUser.id));
        } else {
          secondFetch.push(() => connectSocketToSprint(currentUser.id));
        }
        if (currentUser.instructor) {
          firstFetch.push(() => fetchCoachingRoster(currentUser.id.toString()));
        }
        firstFetch.push(() => fetchCoaches(currentUser.id.toString()));

        // Fetch first set of data
        const results = await Promise.all([...firstFetch.map((x) => x())]);

        results
          .filter((r) => r !== false)
          .forEach((item) => {
            const { success, ...rest } = item;
            if (success === true) {
              const keys = Object.keys(rest);
              keys.forEach((k: string) => {
                updateState(k, rest[k]);
              });
            }
          });
        setIsAuthenticated(true);
        setLoading(false);
      } catch (e: any) {
        console.log(e.toString());
        if (e.toString() === "Error: Network Error") {
          console.log("Successfully identified network error");
        }
      }
    }
    try {
      // Fetch remaining content that will be needed in other areas of the app.
      const afterResults = await Promise.all([...secondFetch.map((x) => x())]);
      afterResults
        .filter((r) => r !== false)
        .forEach((item) => {
          const { success, ...rest } = item;
          if (success === true) {
            const keys = Object.keys(rest);
            keys.forEach((k: string) => {
              updateState(k, rest[k]);
            });
          }
        });
      setLoading(false);
    } catch (e: any) {
      console.log(e.toString());
      if (e.toString() === "Error: Network Error") {
        console.log("Successfully identified network error");
      }
    }
  }

  async function connectSocketToSprint(userID = userData.user.id) {
    let result = { success: false, sprints: [] as any };
    try {
      const fetchedSprints = await RestAPI.get(
        "pareto",
        `/sprints/mentee/${userID}`,
        {}
      );
      result.success = true;
      result.sprints = await fetchedSprints;

      dispatch({
        type: "GET_INITIAL_SPRINT_DATA",
        payload: fetchedSprints,
      });

      setSprints(fetchedSprints);

      if (fetchedSprints.length === 0) {
        return result;
      }
    } catch (e) {
      console.error(e);
    }

    let sprintStrings: Array<string> = [];

    result.sprints.forEach((spr: Sprint, idx: number) => {
      sprintStrings.push(`key${idx}=${spr.id}`);
    });

    let sprintString = sprintStrings.join("&");

    let path = `${import.meta.env.VITE_WSS_ENDPOINT}?${sprintString}`;

    const processMsg = (message: MessageEvent) => {
      // console.log("Received data: ", JSON.parse(message.data));
      let tempSprintData: any = JSON.parse(message.data);
      // this check is to see whether the websocket connection successfully retrieved the latest state.
      // if there are too many extraneous connections, through ping error or otherwise - the function to distribute state across connections will fail
      if (!tempSprintData.message && sprints.length > 0) {
        let newerSprintArray: Array<Sprint> | [] = [...sprints];
        let tempVar = 0;
        for (let i = 0; i < sprints.length; i++) {
          const { id } = sprints[i];
          if (id === tempSprintData.id) {
            tempVar = i;
            break;
          }
        }
        newerSprintArray[tempVar] = tempSprintData;
        try {
          // console.log("Formatted Sprint Array: ", newerSprintArray);
          setSprints(newerSprintArray);
          dispatch({
            type: "PUT_UPDATED_SPRINT_DATA",
            payload: newerSprintArray,
          });
        } catch (e) {
          // console.log("onmessage error", e);
        }
      } else {
        // alert(tempSprintData.message);
      }
    };
    try {
      ws.connect({ path, processMsg });
    } catch (e) {
      alert(e);
    }
    return result;
  }

  async function fetchMenteeSprints(userId: string) {
    try {
      let menteeSprints = await RestAPI.get(
        "pareto",
        `/sprints/mentee/${userId}`,
        {}
      );
      setSprints(menteeSprints);
    } catch (e) {
      handleShowError(e as Error);
    }
  }

  function userHasAuthenticated(authenticated: boolean) {
    setIsAuthenticated(authenticated);
  }

  function handleLogout(event: MouseEvent |  KeyboardEvent) {
    event.preventDefault();
    
    localStorage.removeItem("sanity");
    const signout = async () => {
      await Auth.signOut();
      userHasAuthenticated(false);
      (props as AppProps).navigate("/login");
    };
    signout();
  }

  const handleSetLoading = (bool: boolean) => {
    setLoading(bool);
  };

  function updateLanguage({
    name,
    code,
    image,
  }: {
    name: string;
    code: string;
    image: string;
  }) {
    setUserData((state) => ({
      ...state,
      chosenLanguage: { name, code, image },
    }));
  }

  const childProps: ChildProps = {
    // authentication related state
    isAuthenticated,
    userHasAuthenticated,
    user: userData.user,
    setLoading: handleSetLoading,
    connectSocket: connectSocketToSprint,

    // experience related state
    product,
    interviewing,
    training,
    sanityTraining,
    sanityInterview,
    sanityProduct,
    experiences,

    // sprint related state
    fetchMenteeSprints,
    initialFetch,
    sprints,

    // assorted/unused state
    athletes,
    sanitySchemas,
    coaches,
    reviewMode: false,
    navigate: useNavigate
  };
  languageProps.language = userData.chosenLanguage;
  languageProps.setLanguage = updateLanguage;

  return (
    !isAuthenticating && (
      <ContextProvider
        theme={theme}
        languageProps={languageProps}
        handleShowError={handleShowError}
        handleShowSuccess={handleShowSuccess}
        handleCloseToast={handleCloseToast}
        toast={toast}
      >
        <MainContent
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          childProps={childProps}
          loading={loading}
          location={location}
        />
      </ContextProvider>
    )
  );
}

interface ContextProviderProps extends PropsWithChildren {
  handleShowError: (err: Error) => void;
  handleShowSuccess: (msg: string) => void;
  theme: Theme
  languageProps: LanguageProps
  toast: { msg: string; open: boolean; type: string; }
  handleCloseToast: () => void
}

function ContextProvider({ children, handleShowError, handleShowSuccess, theme, languageProps, toast, handleCloseToast }: ContextProviderProps) {
  return (
    <ThemeProvider theme={theme}>
        <LanguageContext.Provider value={languageProps}>
          <ToastMsgContext.Provider value={{ handleShowError, handleShowSuccess }}>
          { children }
          </ToastMsgContext.Provider>
        <ToastMsg
            msg={toast.msg}
            type={toast.type}
            open={toast.open}
            handleCloseSnackbar={handleCloseToast}
        />
      </LanguageContext.Provider>
    </ThemeProvider>
  )
}

interface MainContentProps {
  isAuthenticated: boolean;
  handleLogout: (event: MouseEvent | KeyboardEvent) => void;
  childProps: ChildProps;
  loading: boolean;
  location: Location
}
function MainContent({ isAuthenticated, handleLogout, childProps, loading, location }: MainContentProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const closeTour = () => {
      setIsTourOpen(false);
  };
  
  const OnboardingWithoutRouter = ({ showCloseButton, location, isTourOpen, closeTour } : {
    showCloseButton: boolean,
    location: Location,
    isTourOpen: boolean,
    closeTour: MouseEventHandler
  }) => {
    let pathname = "";
    if (location) pathname = location.pathname;
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
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        showCloseButton={showCloseButton}
        update={pathname}
      />
    );
  };

  return (
    <Box
      component="div"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        // overflow: "scroll",
        minHeight: "100vh",
      }}
    >
      {isAuthenticated ? (
        <AuthenticatedLayout
          handleLogout={handleLogout}
          customHistory={customHistory}
          childProps={childProps}
          setIsTourOpen={setIsTourOpen}
        />
      ) : <UnauthenticatedLayout childProps={childProps} />}
      <OnboardingWithoutRouter
        showCloseButton
        location={location}
        isTourOpen={isTourOpen}
        closeTour={closeTour}
      />
      <LoadingScreen loading={loading} />
    </Box>
  )
}

function LoadingScreen({ loading }: { loading: boolean }) {
  return (
    <div style={{ margin: "auto" }}>
      <Dialog
        open={loading}
        TransitionComponent={
          Transition as React.JSXElementConstructor<object> | undefined
        }
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
    </div>
  )
}

export default App;
