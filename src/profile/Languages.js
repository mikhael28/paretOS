import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import API from "@aws-amplify/api";
import generator from "generate-password";
import "react-quill/dist/quill.snow.css";

class Languages extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        users: [],
        providers: [],
        summary: "",
        summaryCheck: false,
        user: {
          projects: [],
        },
        id: "",
        github: "https://github.com/",
        githubProfile: "",
        name: "",
        editName: false,
        description: "",
        addProject: false,
        editSchool: false,
        school: "",
        team: [],
        tools: [],
        fName: "",
        lName: "",
        createdBy: "",
        acceptedTOS: false,
        uuid: generator.generate({
          length: 12,
          numbers: true,
        }),
        type: "mentee",
        text: "",
        isTourOpen: false,
        noteLoading: false,
        defaultLanguage: "",
        picture:
          "https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp",
      };
    }
     handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
        });
      };
      handleSubmit = async (event) => {
        event.preventDefault();
    
        this.setState({ isLoading: true });
    
        let body = {
          summary: this.state.summary,
        };
        try {
          const response = await API.put("pareto", `/users/${this.state.id}`, {
            body,
          });
          this.setState({ user: response, summaryCheck: false });
        } catch (e) {
          console.log("email send error: ", e);
          // toast(e, { type: toast.TYPE.ERROR})
        }
        this.setState({ isLoading: false });
      };
      
    render() {
      return (
        <FormGroup controlId="defaultLanguage" bsSize="large">
        <ControlLabel>Default Language</ControlLabel>
        <div className="flex">
          <FormControl
            componentClass="select"
            onChange={this.handleChange}
            value={this.state.defaultLanguage}
          >
            <option value="en">Choose Here</option>
            <option value="en">English</option>
            <option value="lg">Luganda</option>
            <option value="ac">Acholi</option>
            <option value="es">Spanish</option>
          </FormControl>
          <LoaderButton
            align="center"
            block
            type="submit"
            style={{ width: 90 }}
            // disabled={!this.validateForm()}
            onClick={this.updateLanguage}
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Updating..."
          />
        </div>
      </FormGroup>
     
      
      );
    }
  }
  export default Languages;