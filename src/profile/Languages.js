import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import LoaderButton from "../components/LoaderButton";
import "react-quill/dist/quill.snow.css";
import Button from "react-bootstrap/lib/Button";
import Tour from "reactour";
import { I18n, USER_AGENT_HEADER } from "@aws-amplify/core";
import API from "@aws-amplify/api";


const Languages = (props) => {
  let [state, setState] = useState({defaultLanguage:""});
  let [isLoading, setIsLoading] = useState(false);
  let [isTourOpen, setIsTourOpen] = useState(false);
  let [defaultLanguage, setDefaultLanguage] = useState("");
  

async function fetchUser(id){
  const response = await API.get("pareto", `/users/${id}`);
  return response;
}

useEffect ( () => {
    const path = window.location.pathname.split("/");
    let userId = path[path.length - 1]; 
    // what we did above, was the get the user id from the navigation bar
    let user = fetchUser(userId);
    setState(user);
},[])

   // This function below handles the changes in state, based on the forms. All of the information stored in the forms, is stored in state. Each form has an `id`, which is accessed by the event.target.id.
  // The actual updated value, is represented by the event.target.value. I recommend you console.log both of the values, above the setState, so you understand.

const handleChange = (e) => {
  setState({
      ...state,
      [e.target.value]: e.target.value,
    });
    const selectedInput = e.target.value;
    setDefaultLanguage(selectedInput);
};

  const closeTour = () => {
    setIsTourOpen(!isTourOpen);
  };

  const history = useHistory();
  const handleClick = () => {
    history.push('/settings/password');
  }

  const updateLanguage = async () => {
      setIsLoading(!isLoading);
      let body = {
        defaultLanguage: defaultLanguage,
    };
    try {
      const response = await API.put("pareto", `/users/${props.id}`, {
      body,
      });
      {user: response};
   } catch (e) {
    }setIsLoading(isLoading);
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
       {/* Here we are updating our default language */}

        <FormGroup controlId="defaultLanguage" bsSize="large">
          <ControlLabel>Default Language</ControlLabel>
          <div className="flex">
            <FormControl 
              componentClass="select"
              onChange={handleChange}
            >
              <option value="en">Choose Here</option>
              <option value="en">English</option>
              <option value="lg">Luganda</option>
              <option value="ac">Acholi</option>
              <option value="es">Spanish</option>
              <option value="ptbr">Portuguese</option>
              <option value="hi">Hindi</option>
            </FormControl>
            <LoaderButton
              align="center"
              block
              type="submit"
              style={{ width: 90 }}
              // disabled={!this.validateForm()}
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

        <Tour
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