import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Spinner from "./components/Spinner";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

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
const PomodoroDashboard = lazy(() =>
  import("./containers/PomodoroDashboard/PomodoroDashboard")
);
const WorkRise = lazy(() => import("./intl/ug/WorkRise"));
const MentorDashboard = lazy(() => import("./mentorship/MentorDashboard"));

export default ({ childProps }) => (
  <Suspense fallback={<Spinner />}>
    <Switch>
      <AppliedRoute path="/" exact component={Home} props={childProps} />
      <AppliedRoute path="/order" exact component={Order} props={childProps} />
      <UnauthenticatedRoute
        path="/login"
        exact
        component={Login}
        props={childProps}
      />
      <UnauthenticatedRoute
        path="/login/reset"
        exact
        component={ResetPassword}
        props={childProps}
      />
      <UnauthenticatedRoute
        path="/signup"
        exact
        component={Signup}
        props={childProps}
      />
      <AppliedRoute
        path="/context-builder"
        exact
        component={ContextBuilder}
        props={childProps}
      />
      <AppliedRoute
        path="/context/:id"
        exact
        component={ContextPage}
        props={childProps}
      />
      <AppliedRoute
        path="/hubs/:id"
        exact
        component={ContextPage}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/arena"
        exact
        component={ArenaDashboard}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/arena/create/sprints"
        exact
        component={SprintCreation}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/arena/create/template"
        exact
        component={CreateSprintTemplate}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/arena/sprints/:id"
        exact
        component={Sprint}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/training"
        exact
        component={LearnDashboard}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/training/:id"
        exact
        component={ExperienceModule}
        props={childProps}
      />
      <AppliedRoute
        path="/chat/:id"
        exact
        component={Room}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/settings/password"
        exact
        component={ChangePassword}
        props={childProps}
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
      <AuthenticatedRoute
        path="/pomodoro-dashboard"
        exact
        component={PomodoroDashboard}
        props={childProps}
      />

      {/* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);
