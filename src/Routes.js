import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./profile/Login";
import Signup from "./profile/Signup";
import ResetPassword from "./profile/ResetPassword";
import ChangePassword from "./profile/ChangePassword";
import Sandbox from "./containers/Sandbox";
import Order from "./learn/Order";
import Profile from "./profile/Profile";
import ExperienceModule from "./learn/ExperienceModule";
import SprintCreation from "./arena/SprintCreation";
import NotFound from "./containers/NotFound";
import EditProfile from "./profile/EditProfile";
import ArenaDashboard from "./arena/ArenaDashboard";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import ContextBuilder from "./context/ContextBuilder";
import ContextPage from "./context/ContextPage";
import CreateUser from "./profile/CreateUser";
import Sprint from "./arena/Sprint";
import CreateSprintTemplate from "./arena/CreateSprintTemplate";
import LearnDashboard from "./learn/LearnDashboard";
import Messaging from "./components/Messaging";
import Room from "./containers/Room";
import WorkRise from "./containers/WorkRise";

export default ({ childProps }) => (
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
    <AuthenticatedRoute
      path="/chat"
      exact
      component={Messaging}
      props={childProps}
    />
    <AppliedRoute path="/chat/:id" exact component={Room} props={childProps} />
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
);
