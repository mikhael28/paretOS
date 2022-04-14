/* eslint-disable react/self-closing-comp */
import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getUser } from "../state/profile";
import "ninja-keys";

/**
 * A simple, redux connected Sandbox for you play around with. Don't send a PR to update this file, it is perfect the way it is. Unless, you think we can improve it from a staging perspective - in that case, send it in.
 */

function Sandbox() {
  const ninjaKeys = useRef(null);
  const history = useHistory();

  const [hotkeys, setHotkeys] = useState([
    {
      id: "Home",
      title: "Open Home",
      hotkey: "cmd+h",
      mdIcon: "home",
      handler: () => {
        history.push("/");
      },
    },
    {
      id: "Open Projects",
      title: "Open Projects",
      hotkey: "cmd+p",
      mdIcon: "apps",
      handler: () => {
        console.log("navigation to projects");
      },
    },
    {
      id: "Theme",
      title: "Change theme...",
      mdIcon: "desktop_windows",
      children: [
        {
          id: "Light Theme",
          title: "Change theme to Light",
          mdIcon: "light_mode",
          handler: () => {
            console.log("theme light");
          },
        },
        {
          id: "Dark Theme",
          title: "Change theme to Dark",
          mdIcon: "dark_mode",
          keywords: "lol",
          handler: () => {
            console.log("theme dark");
          },
        },
      ],
    },
  ]);

  useEffect(() => {
    if (ninjaKeys.current) {
      ninjaKeys.current.data = hotkeys;
    }
  }, []);

  console.log(setHotkeys);

  return (
    <div>
      <p>Hello world</p>
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
