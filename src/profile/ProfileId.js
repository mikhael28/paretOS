import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Image from "react-bootstrap/lib/Image";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import generator from "generate-password";
import { errorToast } from "../libs/toasts";
import question from "../assets/help.png";
import "react-quill/dist/quill.snow.css";

class ProfileId extends Component {
    constructor(props) {
      super(props);
      this.state = {
        users: [],
        id: "",
        name: "",
        editName: false,
        fName: "",
        lName: "",
        uuid: generator.generate({
          length: 12,
          numbers: true,
        }),
        user: {
          projects: [],
        },
        text: "",
        isTourOpen: false,
        picture:
          "https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp",
      };
    }
    
      handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
        });
      };
    
      editName = async () => {
        let body = {
          fName: this.state.fName,
          lName: this.state.lName,
        };
        try {
          const newName = await API.put("pareto", `/users/${this.state.id}`, {
            body,
          });
          this.setState({ user: newName, editName: false });
        } catch (e) {
          console.log(e);
        }
      };

    
      onChange = async (e) => {
        const file = e.target.files[0];
        let fileType = e.target.files[0].name.split(".");
    
        try {
          // @TODO: check to see whether this works for video, and what safeguards may not to be added.
          // @TODO: update this manual id for a dynamically generated one
          let pictureKey = await Storage.put(
            `48150f13-679a-40fc-9f23-b4ebe4af6f08.${fileType[1]}`,
            file,
            {
              contentType: "image/*",
              bucket: process.env.REACT_APP_PHOTO_BUCKET,
            }
          );
          console.log("Key: ", pictureKey);
          let updatedProfile = await API.put(
            "pareto",
            `/users/${this.state.user.id}`,
            {
              body: {
                picture: `https://${process.env.REACT_APP_PHOTO_BUCKET}.s3.amazonaws.com/public/${pictureKey.key}`,
              },
            }
          );
          console.log(updatedProfile);
          this.setState({
            user: updatedProfile,
          });
          // need to save the key
        } catch (e) {
          errorToast(e);
        }
      };
      
    render() {
      return (
        <div className="flex">
        <div className="first-step-home">
          {this.state.editName === false ? (
            <div className="flex">
              <img
                src={this.state.user.picture || this.state.picture}
                height="50"
                width="50"
                alt="Profile"
                style={{ marginTop: 26 }}
              />

              <h1>{this.state.user.fName}</h1>
              <Glyphicon
                onClick={() => this.setState({ editName: true })}
                glyph="glyphicon glyphicon-pencil"
                height="33"
                width="33"
                style={{ marginTop: 54, marginLeft: 6, cursor: "pointer" }}
              />
              <Image
                src={question}
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({ isTourOpen: true });
                }}
                height="50"
                width="50"
                circle
                style={{
                  cursor: "pointer",
                  marginTop: 30,
                  marginLeft: 40,
                }}
              />
            </div>
          ) : (
            <div className="flex">
              <div className="flex-down" style={{ marginTop: 20 }}>
                <div className="flex">
                  <FormGroup controlId="fName" bsSize="large">
                    <ControlLabel>{I18n.get("firstName")}</ControlLabel>
                    <FormControl
                      value={this.state.fName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup controlId="lName" bsSize="large">
                    <ControlLabel>{I18n.get("lastName")}</ControlLabel>
                    <FormControl
                      value={this.state.lName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>
                <Button onClick={this.editName}>
                  {I18n.get("editName")}
                </Button>
              </div>
              <div className="flex-down" style={{ marginTop: 28 }}>
                <h3>{I18n.get("changePicture")}</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(evt) => this.onChange(evt)}
                />
                <Button onClick={() => this.setState({ editName: false })}>
                  {I18n.get("cancel")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      );
    }
  }
  export default ProfileId;