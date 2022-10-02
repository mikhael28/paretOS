import { lazy, Suspense } from "react";
import { Route, RouteProps, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Sprint as SprintInterface } from "./types/ArenaTypes";
import { User } from "./types/ProfileTypes";
import ExperienceSummary from "./learn/ExperienceSummary";
import { Coach } from "./types/MentorshipTypes";

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

export interface RouteWithChildProps extends RouteProps {
  childProps: ChildProps;
  history;
}

export default ({ childProps, history, ...rest }: RouteWithChildProps) => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/" {...rest} exact element={<Home {...childProps} />} />
      <Route
        path="/order"
        {...rest}
        exact
        element={<Order {...childProps} />}
      />
      <Route
        path="/login"
        {...rest}
        exact
        element={
          <UnauthenticatedRoute>
            <Login {...childProps} />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/login/reset"
        {...rest}
        exact
        element={
          <UnauthenticatedRoute>
            <ResetPassword {...childProps} />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/signup"
        {...rest}
        exact
        element={
          <UnauthenticatedRoute>
            <Signup {...childProps} />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/context-builder"
        {...rest}
        exact
        element={<ContextBuilder {...childProps} />}
      />
      <Route
        path="/context/:id"
        {...rest}
        exact
        element={<ContextPage {...childProps} />}
      />
      <Route
        path="/hubs/:id"
        {...rest}
        exact
        element={<ContextPage {...childProps} />}
        props={childProps}
      />
      <Route
        path="/journal"
        {...rest}
        exact
        element={
          <AuthenticatedRoute>
            <Journal {...childProps} />
          </AuthenticatedRoute>
        }
        // props={childProps}
      />
      <Route
        path="/arena"
        {...rest}
        exact
        element={
          <AuthenticatedRoute>
            <ArenaDashboard {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/arena/create/sprints"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <SprintCreation {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/arena/create/template"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <CreateSprintTemplate {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/arena/sprints/:id"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <Sprint {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/training"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <LearnDashboard {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/training/:id"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <ExperienceModule {...childProps} history={history} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/chat/:id"
        exact
        {...rest}
        /* @ts-ignore */
        element={<Room {...childProps} />}
        // props={childProps}
      />
      <Route
        path="/settings/password"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <ChangePassword {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile/:id"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <Profile {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile/edit/:id"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <EditProfile {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile/languages/:id"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <LanguageSelector {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/onboarding/user"
        exact
        {...rest}
        element={<CreateUser {...childProps} />}
      />
      <Route
        path="/sandbox"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <Sandbox {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/mentorship"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <MentorDashboard {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/mentorship/:id"
        exact
        {...rest}
        element={
          <AuthenticatedRoute>
            <Profile {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/workandrise"
        exact
        {...rest}
        // @ts-ignore
        element={<WorkRise {...childProps} />}
      />
      {/* Finally, catch all unmatched routes */}
      <Route element={<NotFound />} />
    </Routes>
  </Suspense>
);
