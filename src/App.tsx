import React, {
  useState,
  useEffect,
  MouseEvent,
  ReactElement,
  KeyboardEvent,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
// import { Auth } from "@aws-amplify/auth";
import { I18n } from "@aws-amplify/core";
// import { RestAPI } from "@aws-amplify/api-rest";
import { useNavigate, useLocation, RouteProps, Location } from "react-router-dom";
import { useDispatch } from "react-redux";
import Tour from "reactour";
import { Slide, Dialog, Box, ThemeProvider, Theme } from "@mui/material";
import strings from "./intl/localization";
import { LanguageContext, LanguageProps } from "./state/LanguageContext";
import LoadingModal from "./components/LoadingModal";
// Replaced with mock services
// import {
//   fetchUser,
//   fetchStarterKitSanity,
//   fetchStarterKitExperience,
//   fetchCoaches,
//   fetchCoachingRoster,
//   fetchSanitySchemas,
// } from "./utils/queries/initialFetchQueries";
import { mockService } from "./services/mockDataService";
import { ToastMsgContext, ToastMsg } from "./state/ToastContext";
import { ChildProps } from "./Routes";
import theme from "./libs/theme";
import { availableLanguages } from "./libs/languages";
// import ws from "./libs/websocket";
import { User } from "./types/ProfileTypes";
import { Sprint } from "./types/ArenaTypes";
import customHistory from "./utils/customHistory";
import { Coach } from "./types/MentorshipTypes";
import UnauthenticatedLayout from "./components/UnauthenticatedLayout";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import { LibraryEntry } from "./types/ContextTypes";

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

  const [userData, setUserData] = useState({
    user: {
      id: 8020,
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
    technicalSchemas: [...(emptyArray as LibraryEntry[])],
    economicSchemas: [...(emptyArray as LibraryEntry[])],
    hubSchemas: [...(emptyArray as LibraryEntry[])],
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
            technicalSchemas: LibraryEntry[];
            hubSchemas: LibraryEntry[];
            economicSchemas: LibraryEntry[];
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
        // Check if user is "logged in" (using mock service)
        const storedUser = mockService.storage.getUser();
        
        if (storedUser || true) { // Always treat as logged in for demo
          const mockSession = await mockService.auth.currentSession();
          const idToken = mockSession.getIdToken();
          
          setAuthData({
            username: idToken.payload.sub,
            session: mockSession,
          });
          setIsAuthenticating(false);
          setIsAuthenticated(true);
          
          // Load mock data
          await initialFetch(idToken.payload.sub);
        } else {
          // Load basic schemas for unauthenticated view
          setSanitySchemas(mockService.data.sanitySchemas);
          setIsAuthenticating(false);
          setLoading(false);
        }
      } catch (e) {
        console.error("Error loading data:", e);
        // Load mock data even on error for demo purposes
        setSanitySchemas(mockService.data.sanitySchemas);
        setIsAuthenticating(false);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  async function initialFetch(username: string) {
    try {
      // Load mock user data
      const userArray = await mockService.api.getUser(username);
      
      if (userArray.length > 0) {
        const currentUser = userArray[0];
        
        // Update Redux store
        dispatch({
          type: "GET_USER",
          payload: currentUser,
        });
        
        // Update local state
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
        
        // Load all mock data
        const [experiences, sprints, coaches] = await Promise.all([
          mockService.api.getExperiences(currentUser.id),
          mockService.api.getSprints(currentUser.id),
          mockService.api.getCoaches(currentUser.id.toString()),
        ]);
        
        // Set experiences
        const product = experiences.find((e: any) => e.type === "Product");
        const training = experiences.find((e: any) => e.type === "Apprenticeship");
        const interviewing = experiences.find((e: any) => e.type === "Interviewing");
        
        setProduct(product || {});
        setTraining(training || {});
        setInterviewing(interviewing || {});
        setExperiences(experiences);
        
        // Set mock Sanity data
        setSanitySchemas(mockService.data.sanitySchemas);
        setSanityTraining(mockService.data.sanityTraining);
        setSanityProduct(mockService.data.sanityProduct);
        setSanityInterview(mockService.data.sanityInterview);
        
        // Set sprints
        setSprints(sprints);
        dispatch({
          type: "GET_INITIAL_SPRINT_DATA",
          payload: sprints,
        });
        
        // Set coaches
        setCoaches(coaches);
        
        // If instructor, load athletes
        if (currentUser.instructor) {
          const athletes = await mockService.api.getAthletes(currentUser.id.toString());
          setAthletes(athletes);
        }
        
        // Store user in mock storage
        mockService.storage.setUser(currentUser);
        
        setIsAuthenticated(true);
        setLoading(false);
      }
    } catch (e: any) {
      console.error("Error in initialFetch:", e);
      // Load mock data anyway for demo
      setSanitySchemas(mockService.data.sanitySchemas);
      setIsAuthenticated(true);
      setLoading(false);
    }
  }

  async function connectSocketToSprint(userID = userData.user.id) {
    // Using mock data instead of WebSocket
    let result = { success: false, sprints: [] as any };
    try {
      const fetchedSprints = await mockService.api.getSprints(userID.toString());
      result.success = true;
      result.sprints = fetchedSprints;

      dispatch({
        type: "GET_INITIAL_SPRINT_DATA",
        payload: fetchedSprints,
      });

      setSprints(fetchedSprints);
    } catch (e) {
      console.error("Error fetching sprints:", e);
    }
    return result;
  }

  async function fetchMenteeSprints(userId: string) {
    try {
      const menteeSprints = await mockService.api.getSprints(userId);
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
      await mockService.auth.signOut();
      mockService.storage.clearUser();
      userHasAuthenticated(false);
      // No need to navigate to login since we're always authenticated for demo
      // (props as AppProps).navigate("/login");
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
  theme: Theme;
  languageProps: LanguageProps;
  toast: { msg: string; open: boolean; type: string; };
  handleCloseToast: () => void;
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
