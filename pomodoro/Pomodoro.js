import React from "react";
// import Mousetrap from "mousetrap";
import gray from "../assets/Pareto-Gray.png";
import "./styles.css";

/**
 * Experiemental Pomodoro Timer
 * @TODO move this into components folder, this was originally boilerplate code copy and pasted from somewhere.
 * @TODO re-integrate this, and test timer when the window is not focused on the tab. Service worker functionality may need to be added to track the timer.
 * @TODO track an actual pomodoro, through 3 steps
 * @TODO Keep database records, and apply them to Arena achievements
 * @TODO re-integrate audio/notification queues in the front-end. Do not enable functionality, if device or browser not compatible, better error tracking.
 *
 */

export default class Pomodoro extends React.Component {
  constructor() {
    super();
    this.state = {
      time: 0,
      play: false,
      timeType: 0,
      title: "",
    };
    // Bind early, avoid function creation on render loop
    this.setTimeForCode = this.setTime.bind(this, 1500);
    this.setTimeForSocial = this.setTime.bind(this, 300);
    this.setTimeForCoffee = this.setTime.bind(this, 900);
    this.reset = this.reset.bind(this);
    this.play = this.play.bind(this);
    this.elapseTime = this.elapseTime.bind(this);
  }

  componentDidMount() {
    this.setDefaultTime();
    this.startShortcuts();
    // Notification.requestPermission();
  }

  elapseTime() {
    if (this.state.time === 0) {
      this.reset(0);
      this.alert();
    }
    if (this.state.play === true) {
      let newState = this.state.time - 1;
      this.setState({ time: newState, title: this.getTitle(newState) });
    }
  }

  format(seconds) {
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor((seconds % 3600) % 60);
    let timeFormated = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    return timeFormated;
  }

  getFormatTypes() {
    return [
      { type: "code", time: 1500 },
      { type: "social", time: 300 },
      { type: "coffee", time: 900 },
    ];
  }

  formatType(timeType) {
    let timeTypes = this.getFormatTypes();
    for (let i = 0; i < timeTypes.length; i++) {
      let timeObj = timeTypes[i];
      if (timeObj.time === timeType) {
        return timeObj.type;
      }
    }
    return null;
  }

  restartInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(this.elapseTime, 1000);
  }

  play() {
    let audio = new Audio("assets/alarm.mp3");
    // audio.volume = 1;
    audio.play();
    setTimeout(() => audio.pause(), 1400);
    if (true === this.state.play) return;

    this.restartInterval();

    this.setState({
      play: true,
    });
  }

  reset(resetFor = this.state.time) {
    clearInterval(this.interval);
    let time = this.format(resetFor);
    this.setState({ play: false });
  }

  togglePlay() {
    try {
      if (true === this.state.play) return this.reset();

      return this.play();
    } catch (e) {
      console.log(e);
    }
  }

  setTime(newTime) {
    this.restartInterval();

    this.setState({
      time: newTime,
      timeType: newTime,
      title: this.getTitle(newTime),
      play: true,
    });
  }

  setDefaultTime() {
    let defaultTime = 1500;

    this.setState({
      time: defaultTime,
      timeType: defaultTime,
      title: this.getTitle(defaultTime),
      play: false,
    });
  }

  getTitle(time) {
    time = typeof time === "undefined" ? this.state.time : time;
    let _title = this.format(time) + " | Pomodoro timer";
    return _title;
  }

  startShortcuts() {
    // Mousetrap.bind("space", this.togglePlay.bind(this));
    // Mousetrap.bind(["ctrl+left", "meta+left"], this.toggleMode.bind(this, -1));
    // Mousetrap.bind(["ctrl+right", "meta+right"], this.toggleMode.bind(this, 1));
  }

  toggleMode(gotoDirection) {
    let timeTypes = this.getFormatTypes();
    let currentPosition = -1;

    for (let i = 0; i < timeTypes.length; i++) {
      if (timeTypes[i].time === this.state.timeType) {
        currentPosition = i;
        break;
      }
    }

    if (currentPosition !== -1) {
      let newMode = timeTypes[currentPosition + gotoDirection];
      if (newMode) this.setTime(newMode.time);
    }
  }

  _setLocalStorage(item, element) {
    let value = element.target.checked;
    localStorage.setItem("react-pomodoro-" + item, value);
  }

  _getLocalStorage(item) {
    return localStorage.getItem("react-pomodoro-" + item) == "true"
      ? true
      : false;
  }

  alert() {
    // notification
    if (true) {
      if (this.state.timeType === 1500) {
        let notification = new Notification("Relax :)", {
          icon: "img/coffee.png",
          lang: "en",
          body: "Go talk or drink a coffee.",
        });
      } else {
        let notification = new Notification("The time is over!", {
          icon: "img/code.png",
          lang: "en",
          body: "Hey, back to code!",
        });
      }
    }
  }

  render() {
    let textStyle = {
      color: "rgb(243, 247, 249)",
      textDecoration: "none",
      fontSize: 16,
      padding: "8px 16px",
    };
    return (
      <div className="pomodoro">
        <div style={{ display: "flex", marginLeft: 12 }}>
          <img src={gray} height="30" width="30" alt="Pareto" />
          <p style={textStyle}>POMODORO</p>
        </div>
        <div className="flex">
          <p className="time">{this.format(this.state.time)}</p>
          <div style={{ display: "flex", justifyContent: "end", marginTop: 6 }}>
            <button
              className="play btnIcon"
              style={{ marginLeft: 10 }}
              onClick={this.play}
            />
            <button className="stop btnIcon" onClick={this.reset} />
          </div>
        </div>

        {/* <div className="">
            <button className="btn code" onClick={this.setTimeForCode}>
              Code
            </button>
            <button className="btn social" onClick={this.setTimeForSocial}>
              Social
            </button>
            <button className="btn coffee" onClick={this.setTimeForCoffee}>
              Coffee
            </button>
          </div> */}
      </div>
    );
  }
}
