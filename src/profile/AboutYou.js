import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import LoaderButton from "../components/LoaderButton";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import generator from "generate-password";
import "react-quill/dist/quill.snow.css";

class AboutYou extends Component {
    constructor(props) {
      super(props);
        this.state = {
        isLoading: false,
        summary: "",
        summaryCheck: false,
       uuid: generator.generate({
          length: 12,
          numbers: true,
        }),
        text: "",
        user: {
          projects: [],
        },
       
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
        <div>
        <h2>About you</h2>
        {this.state.summaryCheck ? (
          <React.Fragment>
            <FormGroup controlId="" bsSize="large">
              <ControlLabel>{I18n.get("bio")}</ControlLabel>
              <FormControl
                value={this.state.summary}
                onChange={this.handleChange}
                componentClass="textarea"
              />
            </FormGroup>
            <div className="flex">
              <Button onClick={() => this.setState({ summaryCheck: false })}>
                {I18n.get("cancel")}
              </Button>
        
              <LoaderButton
                align="center"
                block
                bsSize="small"
                type="submit"
                // disabled={!this.validateForm()}
                onClick={this.handleSubmit}
                isLoading={this.state.isLoading}
                text="Update Summary"
                loadingText="Creation"
              />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="block">
              <p>
                {this.state.user.summary}{" "}
                <Glyphicon
                  onClick={() => this.setState({ summaryCheck: true })}
                  glyph="glyphicon glyphicon-pencil"
                  height="33"
                  width="33"
                  style={{ marginLeft: 6, cursor: "pointer" }}
                />
              </p>
            </div>
          </React.Fragment>
        )}
        </div>
      );
    }
  }
  export default AboutYou;