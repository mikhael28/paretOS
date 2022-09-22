import { lazy, Suspense } from "react";
import { Route, RouteProps, Switch } from "react-router-dom";
import { CompatRoute, Navigate } from "react-router-dom-v5-compat";
import Spinner from "./components/Spinner";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Sprint as SprintInterface } from "./types/ArenaTypes";
import { User } from "./types/ProfileTypes";
import ExperienceSummary from "./learn/ExperienceSummary";

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
  // history: any;
  // location: any;
  // match: any;
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
  coaches: any[];
}

export interface RouteWithChildProps extends RouteProps {
  childProps: ChildProps;
}

// function RequireAuth({ childProps, redirectTo }) {
//   const redirect = querystring("redirect");

//   console.log(childProps, "isAuthenticated");
//   return isAuthenticated ? childProps : <Navigate to={redirect === "" || redirect === null ? "/" : redirect} />;
// }

export default ({ childProps, ...rest }: RouteWithChildProps) => (
  console.log("Routes", childProps),
  (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <CompatRoute
          path="/"
          {...rest}
          exact
          children={<Home {...childProps} />}
        />
        <CompatRoute
          path="/order"
          {...rest}
          exact
          children={<Order {...childProps} />}
        />
        <CompatRoute
          path="/login"
          {...rest}
          exact
          children={
            <UnauthenticatedRoute>
              <Login {...childProps} />
            </UnauthenticatedRoute>
          }
        />
        <CompatRoute
          path="/login/reset"
          {...rest}
          exact
          children={
            <UnauthenticatedRoute>
              <ResetPassword {...childProps} />
            </UnauthenticatedRoute>
          }
        />
        <CompatRoute
          path="/signup"
          {...rest}
          exact
          children={
            <UnauthenticatedRoute>
              <Signup {...childProps} />
            </UnauthenticatedRoute>
          }
        />
        <CompatRoute
          path="/context-builder"
          {...rest}
          exact
          children={<ContextBuilder {...childProps} />}
        />
        <CompatRoute
          path="/context/:id"
          {...rest}
          exact
          children={<ContextPage {...childProps} />}
        />
        <CompatRoute
          path="/hubs/:id"
          {...rest}
          exact
          children={<ContextPage {...childProps} />}
          props={childProps}
        />
        <CompatRoute
          path="/journal"
          {...rest}
          exact
          children={
            <AuthenticatedRoute>
              <Journal {...childProps} />
            </AuthenticatedRoute>
          }
          // props={childProps}
        />
        <CompatRoute
          path="/arena"
          {...rest}
          exact
          children={
            <AuthenticatedRoute>
              <ArenaDashboard {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <CompatRoute
          path="/arena/create/sprints"
          exact
          {...rest}
          children={
            <AuthenticatedRoute>
              <SprintCreation {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <CompatRoute
          path="/arena/create/template"
          exact
          {...rest}
          children={
            <AuthenticatedRoute>
              <CreateSprintTemplate {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <CompatRoute
          path="/arena/sprints/:id"
          exact
          children={
            <AuthenticatedRoute>
              <Sprint {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <CompatRoute
          path="/training"
          exact
          {...rest}
          props={childProps}
          children={
            <AuthenticatedRoute>
              <LearnDashboard {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <CompatRoute
          path="/training/:id"
          exact
          children={
            <AuthenticatedRoute>
              <ExperienceModule {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <CompatRoute
          path="/chat/:id"
          exact
          /* @ts-ignore */
          children={<Room {...childProps} />}
          // props={childProps}
        />
        <CompatRoute
          path="/settings/password"
          exact
          children={
            <AuthenticatedRoute>
              <ChangePassword {...childProps} />
            </AuthenticatedRoute>
          }
        />
        <AuthenticatedRoute
          path="/profile/:id"
          exact
          component={Profile}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/profile/edit/:id"
          exact
          component={EditProfile}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/profile/languages/:id"
          exact
          component={LanguageSelector}
          props={childProps}
        />
        <AppliedRoute
          path="/onboarding/user"
          exact
          component={CreateUser}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/sandbox"
          exact
          component={Sandbox}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/mentorship"
          exact
          component={MentorDashboard}
          props={childProps}
        />
        <AuthenticatedRoute
          path="/mentorship/:id"
          exact
          component={Profile}
          props={childProps}
        />
        <AppliedRoute
          path="/workandrise"
          exact
          component={WorkRise}
          props={childProps}
        />
        {/* Finally, catch all unmatched routes */}
        <Route children={<NotFound />} />
      </Switch>
    </Suspense>
  )
);
