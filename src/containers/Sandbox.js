/* eslint-disable react/self-closing-comp */
import { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getUser } from "../state/profile";
import "ninja-keys";

/**
 * A simple, redux connected Sandbox for you play around with. Don't send a PR to update this file, it is perfect the way it is. Unless, you think we can improve it from a staging perspective - in that case, send it in.
 */

const routes = [
  {
    path: "/context-builder",
    name: "Library",
  },
  {
    path: "/arena",
    name: "Library",
  },
  {
    path: "/arena/create/sprints",
    name: "Start a Sprint",
  },
  {
    path: "/arena/create/template",
    name: "Create Sprint Template",
  },
  {
    path: "/training",
    name: "Learning Dashboard",
  },
  {
    path: "/sandbox",
    name: "Sandbox",
  },
  {
    path: "/mentorship",
    name: "Mentorship Dashboard",
  },
];

function Sandbox(props) {
  const ninjaKeys = useRef(null);

  useEffect(() => {
    let routeHotkeys = routes.map((route) => ({
      id: route.name,
      title: route.name,
      handler: () => {
        props.history.push(route.path);
      },
    }));
    // setHotkeys(routeHotkeys);
    if (ninjaKeys.current) {
      ninjaKeys.current.data = routeHotkeys;
    }
  }, []);

  return (
    <div>
      <h2>Hit "Cmd+K" or "Ctrl+K"</h2>
      <h3>Actions logged to console in demo</h3>
      <ninja-keys ref={ninjaKeys}></ninja-keys>
    </div>
  );
}

const mapStateToProps = (state) => ({
  redux: state.redux,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getUser: () => getUser(),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sandbox);
