import React, { Component } from "react";
import AboutYou from "/home/antonio/paretOS/src/profile/AboutYou";// need to change path
import Project from "/home/antonio/paretOS/src/profile/Project";// need to change path
import ProfileId from "/home/antonio/paretOS/src/profile/ProfileId";// need to change path
import Languages from "/home/antonio/paretOS/src/profile/Languages";// need to change path
import Button from "react-bootstrap/lib/Button";
import { I18n } from "@aws-amplify/core";
import generator from "generate-password";
import Tour from "reactour";
import "react-quill/dist/quill.snow.css";


/**
 * These are the forms where you can edit your profile.
 * @TODO GH Issue #13
 * @TODO GH Issue #26
 */

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      uuid: generator.generate({
        length: 12,
        numbers: true,
      }),
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
        selector: ".third-step-home",
        content: `${I18n.get("homeThird")}`,
      },
    ];
    return (
      <div className="flex-down">
    
      <ProfileId />
   
        <div>
          <AboutYou />
        </div>
        <div>
          <Project />
        </div>
          <br />
        <div>
          <Languages />
        </div>
       <Button onClick={() => this.props.history.push("/settings/password")}>
          Change Password
        </Button>

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
