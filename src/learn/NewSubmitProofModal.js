import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";
import LoaderButton from "../components/LoaderButton";
import { errorToast, successToast } from "../libs/toasts";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";

/**
 * This is the modal where a player submits the proof for their Arena event
 * @TODO Issue #26
 * @TODO Issue #52
 */

export default class SubmitProof extends Component {
  constructor(props) {
    super(props);

    this.state = {
      athleteNotes: "",
      github: "https://github.com/",
      isChanging: false,
      isLoading: false,
      experienceId: "",
    };
  }

  validateForm() {
    return this.state.athleteNotes.length > 0 && this.state.github.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  // @TODO: Is this function repetitive? With Arena proof modal?
  onChange = async (e) => {
    const file = e.target.files[0];
    let fileType = e.target.files[0].name.split(".");

    // the name to save is the id of the experience_01 or whatever the number is.
    try {
      let pictureKey = await Storage.put(
        `${this.props.mongoExperience.id}${this.props.activeExperience.priority}.${fileType[1]}`,
        file,
        {
          bucket: process.env.REACT_APP_PROOF_BUCKET,
        }
      );
      console.log("Key: ", pictureKey);
      successToast("Proof successfully uploaded.");
    } catch (e) {
      errorToast(e);
    }
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{I18n.get("submitProof")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup bsSize="large" controlId="athleteNotes">
              <ControlLabel>{I18n.get("notesForCoach")}</ControlLabel>
              <FormControl
                type="text"
                onChange={this.handleChange}
                value={this.state.athleteNotes}
              />
            </FormGroup>
            <FormGroup bsSize="large" controlId="github">
              <ControlLabel>{I18n.get("submitLink")}</ControlLabel>
              <FormControl
                type="text"
                onChange={this.handleChange}
                value={this.state.github}
              />
            </FormGroup>
            <h3>{I18n.get("attachment")}</h3>
            <input
              type="file"
              accept="image/png"
              onChange={(evt) => this.onChange(evt)}
            />
            <br />
            <div className="flex">
              <Button onClick={this.props.handleClose}>
                {I18n.get("close")}
              </Button>
              <LoaderButton
                block
                onClick={() => {
                  this.props.markSubmitted(
                    this.props.activeExperience,
                    this.state.github,
                    this.state.athleteNotes
                  );
                  this.setState({
                    athleteNotes: "",
                    github: "",
                  });
                }}
                bsSize="large"
                text={I18n.get("submitProof")}
                loadingText={I18n.get("saving")}
                disabled={!this.validateForm()}
                isLoading={this.state.isChanging}
              />
            </div>
          </Modal.Body>

          <Modal.Footer />
        </Modal>
      </div>
    );
  }
}
