import { lazy, Suspense } from "react";
import { Route, RouteProps, Routes, useNavigate } from "react-router-dom";
import Spinner from "./components/Spinner";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Sprint as SprintInterface } from "./types/ArenaTypes";
import { User } from "./types/ProfileTypes";
import ExperienceSummary from "./learn/ExperienceSummary";
import { Coach } from "./types/MentorshipTypes";
import Logout from "./components/Logout";

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
const LanguageSelector = lazy(
  () => import("./profile/EditProfile/LanguageSelector")
);
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
  stripeKey: string;
  navigate: ReturnType<typeof useNavigate>;
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
  history: Array<string>;
}

export default ({ childProps, history, ...rest }: RouteWithChildProps) => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/" {...rest} element={<Home {...childProps} />} />
      <Route path="/order" {...rest} element={<Order {...childProps} />} />
      <Route
        path="/login"
        {...rest}
        element={
          <UnauthenticatedRoute>
            <Login {...childProps} />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/login/reset"
        {...rest}
        element={
          <UnauthenticatedRoute>
            <ResetPassword {...childProps} />
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
            <Journal {...childProps} />
          </AuthenticatedRoute>
        }
      // props={childProps}
      />
      <Route
        path="/arena"
        {...rest}
        element={
          <AuthenticatedRoute>
            <ArenaDashboard {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/arena/create/sprints"
        {...rest}
        element={
          <AuthenticatedRoute>
            <SprintCreation {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/arena/create/template"
        {...rest}
        element={
          <AuthenticatedRoute>
            <CreateSprintTemplate {...childProps} />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/arena/sprints/:id"
        {...rest}
        element={
          <AuthenticatedRoute>
            <Sprint {...childProps} />
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
            <ChangePassword {...childProps} />
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
            <EditProfile />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile/languages/:id"
        {...rest}
        element={
          <AuthenticatedRoute>
            <LanguageSelector />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/onboarding/user"
        {...rest}
        element={<CreateUser {...childProps} />}
      />
      <Route
        path="/sandbox"
        {...rest}
        element={
          <AuthenticatedRoute>
            <Sandbox {...childProps} />
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
            <Profile />
          </AuthenticatedRoute>
        }
      />
      <Route path="/logout" {...rest} element={<Logout />} />

      <Route path="/workandrise" {...rest} element={<WorkRise />} />
      {/* Finally, catch all unmatched routes */}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
