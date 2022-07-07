import { Component, createRef, CSSProperties, MutableRefObject } from "react";
import {
  IoMdPlay,
  IoMdPause,
  IoMdSkipForward,
  IoMdSkipBackward,
  IoMdRefresh,
} from "react-icons/io";
let timer: NodeJS.Timer;

// borrowed from here for initial code: https://gist.github.com/harunpehlivan/fe7b52218b6b99d70a0c5fe88538ea2d

interface PomodoroProps {
  headingStyle: CSSProperties;
}

interface PomodoroState {
  session_length: number;
  session_state: String;
  break_length: number;
  break_state: String;
  minutes: number;
  seconds: number;
  title: String;
  isStarted: boolean;
  isPaused: boolean;
}

export default class Pomodoro extends Component<PomodoroProps, PomodoroState> {
  time_left: MutableRefObject<any>;
  audio_beep: MutableRefObject<any>;
  headingStyle: CSSProperties;

  constructor(props: PomodoroProps) {
    super(props);
    this.time_left = createRef();
    this.audio_beep = createRef();
    this.headingStyle = props.headingStyle;
  }
  state: PomodoroState = {
    session_length: 25,
    session_state: "started",
    break_length: 5,
    break_state: "finished",
    minutes: 25,
    seconds: 0,
    title: "Session",
    isStarted: false,
    isPaused: false,
  };

  // this is dev state, to bring the initial start time from 25 minutes to 10 seconds
  // state = {
  //   session_length: 25,
  //   session_state: "started",
  //   break_length: 1,
  //   break_state: "finished",
  //   minutes: 0,
  //   seconds: 10,
  //   title: "Session",
  //   isStarted: false,
  // };

  incrementSession = () => {
    if (!this.state.isStarted) {
      if (this.state.session_length < 60) {
        this.setState((prevState: PomodoroState) => {
          return {
            session_length: prevState.session_length + 1,
          };
        });
      }
      if (this.state.session_state === "started") {
        this.setState((prevState: PomodoroState) => {
          return {
            minutes: prevState.session_length,
            seconds: 0,
          };
        });
      }
    }
  };

  decrementSession = () => {
    if (!this.state.isStarted) {
      if (this.state.session_length > 1) {
        this.setState((prevState: PomodoroState) => {
          return {
            session_length: prevState.session_length - 1,
          };
        });
      }
      if (this.state.session_state === "started") {
        this.setState((prevState: PomodoroState) => {
          return {
            minutes: prevState.session_length,
            seconds: 0,
          };
        });
      }
    }
  };

  incrementBreak = () => {
    if (!this.state.isStarted) {
      if (this.state.break_length < 60) {
        this.setState((prevState: PomodoroState) => {
          return {
            break_length: prevState.break_length + 1,
          };
        });
        let { session_length } = this.state;
        if (session_length === 0) {
          this.setState((prevState: PomodoroState) => {
            return {
              break_length: prevState.break_length + 1,
            };
          });
        }
      }
      if (this.state.break_state === "started") {
        this.setState((prevState: PomodoroState) => {
          return {
            minutes: prevState.break_length,
            seconds: 0,
          };
        });
      }
    }
  };

  decrementBreak = () => {
    if (!this.state.isStarted) {
      if (this.state.break_length > 1) {
        this.setState((prevState: PomodoroState) => {
          return {
            break_length: prevState.break_length - 1,
          };
        });
        let { session_length } = this.state;
        if (session_length === 0) {
          this.setState((prevState: PomodoroState) => {
            return {
              break_length: prevState.break_length - 1,
            };
          });
        }
      }
      if (this.state.break_state === "started") {
        this.setState((prevState: PomodoroState) => {
          return {
            minutes: prevState.break_length,
            seconds: 0,
          };
        });
      }
    }
  };

  play_stop_Time = () => {
    if (!this.state.isStarted) {
      timer = setInterval(this.countDown, 1000);
      this.setState({
        isStarted: true,
      });
    } else {
      clearInterval(timer);
      this.setState({
        isStarted: false,
      });
    }
  };

  pauseTime = () => {
    clearInterval(timer);
    this.setState({
      isStarted: false,
      isPaused: true,
    });
  };
  resetTime = () => {
    clearInterval(timer);
    this.setState({
      session_length: 25,
      session_state: "started",
      break_length: 5,
      break_state: "finished",
      minutes: 25,
      seconds: 0,
      title: "Session",
      isStarted: false,
    });
    this.audio_beep.current.pause();
    this.audio_beep.current.currentTime = 0;
  };
  countDown = () => {
    let { session_state, break_state } = this.state;
    if (session_state === "started") {
      this.sessionCountDown();
    } else if (break_state === "started") {
      this.breakCountDown();
    }
  };

  sessionCountDown = () => {
    let { seconds, minutes } = this.state;
    if (minutes > 0) {
      if (seconds === 0) {
        minutes--;
        this.setState({
          seconds: 59,
          minutes,
        });
      } else {
        seconds--;
        this.setState({
          seconds,
        });
      }
    } else if (minutes === 0 && seconds > 0) {
      seconds--;
      this.setState({
        seconds,
      });
    } else if (minutes === 0 && seconds === 0) {
      this.setState({
        session_state: "finished",
        break_state: "started",
        title: "Break",
        minutes: this.state.break_length,
        seconds: 0,
      });
    }
  };

  breakCountDown = () => {
    let { seconds, minutes } = this.state;
    if (minutes > 0) {
      if (seconds === 0) {
        minutes--;
        this.setState({
          seconds: 59,
          minutes,
        });
      } else {
        seconds--;
        this.setState({
          seconds,
        });
      }
    } else if (minutes === 0 && seconds > 0) {
      seconds--;
      this.setState({
        seconds,
      });
    } else if (minutes === 0 && seconds === 0) {
      this.setState({
        break_state: "finished",
        session_state: "started",
        title: "Session",
        minutes: this.state.session_length,
        seconds: 0,
      });
    }
  };

  //set time format:
  timeFormat = (time_unit: number): String => {
    if (time_unit >= 0 && time_unit < 10) {
      return "0" + time_unit;
    }
    return time_unit.toString();
  };

  render() {
    let { break_length, session_length, minutes, seconds, title, isStarted } =
      this.state;

    let time_style = { color: "white" };
    //
    minutes > 0
      ? (time_style.color = "white")
      : (time_style.color = "rgb(194, 27, 27)");
    //
    if (minutes === 0 && seconds === 0) this.audio_beep.current.play();
    //
    let button_class = "";
    !isStarted
      ? (button_class = "fa fa-play fa-2x")
      : (button_class = "fa fa-pause fa-2x");

    //
    return (
      <div>
        <audio id="beep" ref={this.audio_beep}>
          <source
            src="https://www.pacdv.com/sounds/interface_sound_effects/beep-7.wav"
            type="audio/mp3"
          />
        </audio>
        <div
          style={
            {
              ...this.headingStyle,
              display: "flex",
              justifyContent: "space-between",
              margin: 16,
              paddingTop: 8,
              alignItems: "center",
            }
          }
        >
          <div>
            Pomodoro {this.timeFormat(minutes)}:{this.timeFormat(seconds)}{" "}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            &nbsp;&nbsp;
            {!this.state.isStarted ? (
              <IoMdPlay
                style={{ height: 18, width: 18, margin: 1, cursor: "pointer" }}
                onClick={this.play_stop_Time}
              />
            ) : (
              <IoMdPause
                style={{ height: 18, width: 18, margin: 1, cursor: "pointer" }}
                onClick={this.play_stop_Time}
              />
            )}
            &nbsp;
            <IoMdRefresh
              style={{ height: 20, width: 20, cursor: "pointer" }}
              onClick={this.resetTime}
            />
          </div>
        </div>

        {/* <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <button className="btnIcon" onClick={this.decrementBreak}>
              <IoMdSkipBackward />
            </button>
            <div>{break_length} </div>
            <button className="btnIcon" onClick={this.incrementBreak}>
              <IoMdSkipForward />
            </button>
            <div>Break </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: 8,
            }}
          >
            <button className="btnIcon" onClick={this.decrementSession}>
              <IoMdSkipBackward />
            </button>
            <div>{session_length} </div>
            <button className="btnIcon" onClick={this.incrementSession}>
              <IoMdSkipForward />
            </button>
            <div>Focus</div>
          </div>
        </div> */}
      </div>
    );
  }
}
