import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import generator from "generate-password";
import "react-quill/dist/quill.snow.css";

class Languages extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        id: "",
        uuid: generator.generate({
          length: 12,
          numbers: true,
        }),
        text: "",
        defaultLanguage: "",
      };
    }
     handleChange = (event) => {
        this.setState({
          [event.target.id]: event.target.value,
        });
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