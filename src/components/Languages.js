import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import "react-quill/dist/quill.snow.css";
import Button from "react-bootstrap/lib/Button";
import Tour from "reactour";
import { I18n } from "@aws-amplify/core";
import API from "@aws-amplify/api";


const Languages = (props) => {
  let [defaultLanguage, setDefaultLanguage] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [isTourOpen, setIsTourOpen] = useState(false);
  let [value, setValue] = useState("");
  let [user, setUser] = useState(props.response);
  let [name, setName] = useState(props.name);
  let [id, setId] = useState("");
  let [summary,setSummary] = useState("");
  let [fName,setFName] = useState("");
  let [lName,setLName] = useState("");
  let [note,setNote] = useState("");
  let [school,setSchool] = useState("");
  



useEffect (async () => {
    const path = window.location.pathname.split("/");
    let userId = path[path.length - 1];
    // what we did above, was the get the user id from the navigation bar
    const response = await API.get("pareto", `/users/${userId}`);
    // here we are populating our initial state. In the future, we will likely just pass stuff in via props, instead of running a fresh network request. That was a legacy decision, don't worry about it @antonio-b
    setUser(response[0]);
    setId(userId);
    setSummary(response[0].summary);
    setFName(response[0].fName);
    setLName(response[0].lName);
    setNote(response[0].notes[0]);
    setSchool(response[0].school);
    setDefaultLanguage(response.defaultLanguage);
     
  })


  const closeTour = () => {
    setIsTourOpen(!isTourOpen);
  };

  const history = useHistory();
  const handleClick = () => {
    history.push('/settings/password');
  }

  //updates langauge to body
  const updateLanguage = async () => {
    let body = setDefaultLanguage(defaultLanguage);
    try {
      const response = await API.put("pareto", `/users/${id}`, {
        body,
      });
      console.log(response);
         setUser(user)
        
    } catch (e) {
      console.log(e);
    }
  };
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
    <div>
       <FormGroup controlId="defaultLanguage" bsSize="large">
        <ControlLabel>Default Language</ControlLabel>
        <div className="flex">
          <FormControl
            componentClass="select"
            onChange={ (e) => setName(e.target.value)}
            value={name}
          >
            <option value="">Choose Here</option>
            <option value="en">English</option>
            <option value="lg">Luganda</option>
            <option value="ac">Acholi</option>
            <option value="es">Spanish</option>
            <option value="ptbr">Portuguese</option>
            <option value="hi">Hindi</option>
          </FormControl>
          <LoaderButton // this is where the save button to render chosen language
            align="center"
            block
            type="submit"
            style={{ width: 90 }}
            // disabled={validateForm()}
            onClick={updateLanguage}
            isLoading={isLoading}
            text="Save"
            loadingText="Updating..."
          />
        </div>
      </FormGroup>

      <Button onClick={handleClick}> 
        Change Password
      </Button>

      <Tour  //import
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        // showCloseButton={true}
        // rewindOnClose={false}
      /> 
    
    </div>
    
  )
  }
  export default Languages;