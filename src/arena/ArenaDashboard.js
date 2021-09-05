import React, { Component } from "react";
import Image from "react-bootstrap/lib/Image";
import { I18n } from "@aws-amplify/core";
import ArenaDashboard from "./Sprints";
import Messaging from "../components/Messaging";
import Tour from "reactour";
import question from "../assets/help.png";
import logo from "../assets/Pareto_Lockup-01.png";

/**
 * The 'main dashboard' in the UI, that shows different things depending on what level of user you are.
 * @TODO Issue #70
 *
 */

export default class HomeDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isTourOpen: false,
    };
  }

  closeTour = () => {
    this.setState({
      isTourOpen: false,
    });
  };

  render() {
    const steps = [
      {
        selector: ".first-step-home",
        content: `${I18n.get("homeFirst")}`,
      },
      {
        selector: ".second-step-home",
        content: `${I18n.get("homeSecond")}`,
      },
      // {
      // 	selector: '.third-step-home',
      // 	content: `${I18n.get('homeThird')}`
      // }
    ];
    return (
      <div className="flex-down">
        <div className="flex">
          <img
            src={logo}
            alt="Pareto"
            height="45"
            width="180"
            style={{ marginTop: 33 }}
          />

          <h1
            style={{
              marginLeft: 0,
              marginBottom: 0,
              marginTop: 33,
              fontSize: 40,
            }}
          >
            Arena
          </h1>
          <Image
            src={question}
            onClick={(event) => {
              event.preventDefault();
              this.setState({ isTourOpen: true });
            }}
            height="40"
            width="40"
            circle
            style={{
              cursor: "pointer",
              marginTop: 30,
              marginLeft: 6,
            }}
          />
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-5">
            <ArenaDashboard
              sprints={this.props.sprints}
              history={this.props.history}
              user={this.props.user}
              fetchMenteeSprints={this.props.fetchMenteeSprints}
            />
          </div>
          <div className="hidden-xs col-sm-7">
            <Messaging
              user={this.props.user}
              messages={this.props.messages}
              updateMessages={this.props.updateMessages}
              history={this.props.history}
            />
          </div>
        </div>

        <Tour
          steps={steps}
          isOpen={this.state.isTourOpen}
          onRequestClose={this.closeTour}
          // showCloseButton={true}
          // rewindOnClose={false}
        />
      </div>
    );
  }
}
