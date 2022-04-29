/* eslint-disable react/self-closing-comp */
import { useSelector, useDispatch } from "react-redux";

/**
 * A simple, redux connected Sandbox for you play around with. Don't send a PR to update this file, it is perfect the way it is. Unless, you think we can improve it from a staging perspective - in that case, send it in.
 */

function Sandbox(props: any) {
  // redux state and dispatch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redux = useSelector((state) => state);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  return (
    <div>
      <h2>Hit "Cmd+K" or "Ctrl+K"</h2>
      <h3>Actions logged to console in demo</h3>
    </div>
  );
}

export default Sandbox;
