import { lazy, Suspense } from "react";
import { PathRouteProps, Route, Routes, useNavigate } from "react-router-dom";
import Spinner from "./components/Spinner";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Sprint as SprintInterface } from "./types/ArenaTypes";
import { User } from "./types/ProfileTypes";
import { Coach } from "./types/MentorshipTypes";
import Logout from "./components/Logout";
import MenteeProfile from "./mentorship/MenteeProfile";
import { getSprintTemplateOptionsFromSanity, getSprintTemplates, setSprintTemplate } from "./utils/queries/createSprintTemplateQueries";
import { CreateSprintTemplateProps } from "./arena/CreateSprintTemplate";
import { BrowserHistory } from "history";

const Home = lazy(() => import("./containers/Home"));
const Login = lazy(() => import("./profile/Login"));
const Signup = lazy(() => import("./profile/Signup"));
const ResetPassword = lazy(() => import("./profile/ResetPassword"));
const ChangePassword = lazy(() => import("./profile/ChangePassword"));
// eslint-ignore import/no-cycle
const Sandbox = lazy(() => import("./containers/Sandbox"));
const Order = lazy(() => import("./learn/Order"));
const Profile = lazy(() => import("./mentorship/MenteeProfile"));
const ExperienceModule = lazy(() => import("./learn/ExperienceModule"));
const SprintCreation = lazy(() => import("./arena/SprintCreation"));
const NotFound = lazy(() => import("./containers/NotFound"));
const EditProfile = lazy(() => import("./profile/EditProfile"));
const LanguageSelector = lazy(() => import("./profile/LanguageSelector"));
const ArenaDashboard = lazy(() => import("./arena/Sprints"));
const ContextBuilder = lazy(() => import("./context/ContextBuilder"));
const ContextPage = lazy(() => import("./context/ContextPage"));
const CreateUser = lazy(() => import("./profile/CreateUser"));
const Sprint = lazy(() => import("./arena/Sprint"));
const CreateSprintTemplate = lazy(() => import("./arena/CreateSprintTemplate"));
const LearnDashboard = lazy(() => import("./learn/LearnDashboard"));
const Room = lazy(() => import("./containers/Room"));
const Journal = lazy(() => import("./containers/Journal"));
const WorkRise = lazy(() => import("./intl/ug/WorkRise"));
const MentorDashboard = lazy(() => import("./mentorship/MentorDashboard"));


export interface ChildProps {
  navigate: ReturnType<typeof useNavigate>
  reviewMode: boolean;
  isAuthenticated: boolean;
  userHasAuthenticated: (b: boolean) => void;
  user: User;
  setLoading: (b: boolean) => void;
  connectSocket: (id?: string) => Promise<{
    success: boolean;
    sprints: [];
  }>;
  product: {};
  interviewing: {};
  training: {};
  sanityTraining: {};
  sanityInterview: {};
  sanityProduct: {};
  experiences: {};
  fetchMenteeSprints: (id: string) => void;
  initialFetch: (id: string) => void;
  sprints: SprintInterface[];
  athletes: any[];
  sanitySchemas: {
    technicalSchemas: object[];
    economicSchemas: object[];
    hubSchemas: object[];
  };
  coaches: Coach[];
}

interface OrderProps extends ChildProps {
  stripeKey: string
}

export interface RouteWithChildProps extends PathRouteProps {
  childProps: ChildProps | CreateSprintTemplateProps | OrderProps;
  history: BrowserHistory;
}

function RoutesComponent({ childProps, history, ...rest }: RouteWithChildProps) {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" {...rest} element={<Home {...childProps} />} />
        <Route path="/order" {...rest} element={<Order {...childProps as OrderProps} />} />
        <Route
          path="/login"
          {...rest}
          element={
            <UnauthenticatedRoute>
              <Login {...childProps as ChildProps} />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path="/login/reset"
          {...rest}
          element={
            <UnauthenticatedRoute>
              <ResetPassword {...childProps as ChildProps} />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path="/signup"
          {...rest}
          element={
            <UnauthenticatedRoute>
              <Signup {...childProps} />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path="/context-builder"
          {...rest}
          element={<ContextBuilder {...childProps} />}
        />
        <Route
          path="/context/:id"
          {...rest}
          element={<ContextPage {...childProps} />}
        />
        <Route
          path="/hubs/:id"
          {...rest}
          element={<ContextPage {...childProps} />}
        />
        <Route
          path="/journal"
          {...rest}
          element={
            <AuthenticatedRoute>
              <Journal {...childProps as ChildProps} />
            </AuthenticatedRoute>
          }
        // props={childProps}
        />
        <Route
          path="/arena"
          {...rest}
          element={
            <AuthenticatedRoute>
              <ArenaDashboard {...childProps as ChildProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/arena/create/sprints"
          {...rest}
          element={
            <AuthenticatedRoute>
              <SprintCreation {...childProps as ChildProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/arena/create/template"
          {...rest}
          element={
            <AuthenticatedRoute>
              <CreateSprintTemplate {...{
                ...childProps,
                navigate: useNavigate,
                getTemplates: getSprintTemplates,
                setTemplate: setSprintTemplate,
                getTemplateOptionsFromSanity: getSprintTemplateOptionsFromSanity
              }} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/arena/sprints/:id"
          {...rest}
          element={
            <AuthenticatedRoute>
              <Sprint {...childProps as ChildProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/training"
          {...rest}
          element={
            <AuthenticatedRoute>
              <LearnDashboard {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/training/:id"
          {...rest}
          element={
            <AuthenticatedRoute>
              <ExperienceModule {...childProps} history={history} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/chat/:id"
          {...rest}
          /* @ts-ignore */
          element={<Room {...childProps} />}
        // props={childProps}
        />
        <Route
          path="/settings/password"
          {...rest}
          element={
            <AuthenticatedRoute>
              <ChangePassword />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/profile/:id"
          {...rest}
          element={
            <AuthenticatedRoute>
              <Profile />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/profile/edit/:id"
          {...rest}
          element={
            <AuthenticatedRoute>
              <EditProfile {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/profile/languages/:id"
          {...rest}
          element={
            <AuthenticatedRoute>
              <LanguageSelector {...childProps as ChildProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/onboarding/user"
          {...rest}
          element={<CreateUser {...childProps as ChildProps} />}
        />
        <Route
          path="/sandbox"
          {...rest}
          element={
            <AuthenticatedRoute>
              <Sandbox />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/mentorship"
          {...rest}
          element={
            <AuthenticatedRoute>
              <MentorDashboard {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/mentorship/:id"
          {...rest}
          element={
            <AuthenticatedRoute>
              <MenteeProfile {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <Route path="/logout" {...rest} element={<Logout />} />

        <Route path="/workandrise" {...rest} element={<WorkRise />} />
        {/* Finally, catch all unmatched routes */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
};

export default RoutesComponent