import { lazy, Suspense } from "react";
import { Route, RouteProps, Switch } from "react-router-dom";
import {CompatRoute, Navigate} from "react-router-dom-v5-compat";
import Spinner from "./components/Spinner";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Sprint as SprintInterface } from "./types/ArenaTypes";
import { User } from "./types/ProfileTypes";

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
  }
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
  <Suspense fallback={<Spinner />}>
    <Switch>
      <CompatRoute path="/" {...rest} exact children={<Home {...childProps}/>}   />
        <CompatRoute path="/order" {...rest} exact children={<Order  {...childProps} />} />
      <CompatRoute
          path="/login"
          exact
          children={<UnauthenticatedRoute ><Login {...childProps} /></UnauthenticatedRoute>}
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
        path="/journal"
        exact
        component={Journal}
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
      {/* Finally, catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);


