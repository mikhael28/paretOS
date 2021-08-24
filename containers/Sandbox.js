import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getUser } from "../state/profile";

/**
 * A simple, redux connected Sandbox for you play around with. Don't send a PR to update this file, it is perfect the way it is. Unless, you think we can improve it from a staging perspective - in that case, send it in.
 */

function Sandbox(props) {
  return (
    <div>
      <p>Hello world</p>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    redux: state.redux,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUser: () => getUser(),
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Sandbox);
