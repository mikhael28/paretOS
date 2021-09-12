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
  let [defaultLanguage, setDefaultLanguage] = useState("")
  let [isLoading, setIsLoading] = useState(false)
  let [isTourOpen, setIsTourOpen] = useState(false)
  let [value, setValue] = useState("")
  let [user, setUser] = useState(props.response)
  let [name, setName] = useState(props.name)
  let [id, setId] = useState("")
 //  let [user, setUser] = useState(response)  // let [summary,setSummary] = useState(response[0].summary)
  // let [fname, setFname] = useState(response[0].fName)
  // let [lname, setLname] = useState(response[0].lName)
  // let [note, setNote] = useState(response[0].notes[0])
  // let [school, setSchool] = useState(response[0].school)

  //  useEffect (() => {
  //   const path = window.location.pathname.split("/");
  //   let userId;
  //   userId = path[path.length - 1];
  //   // what we did above, was the get the user id from the navigation bar
  //   const response = await API.get("pareto", `/users/${userId}`);
  //   // here we are populating our initial state. In the future, we will likely just pass stuff in via props, instead of running a fresh network request. That was a legacy decision, don't worry about it @antonio-b
  //    // user: response[0],
  //    setUser(user)
  //    setId(id)
  //     // id: userId,
  //    setSummary(summary)
  //     // summary: response[0].summary,
  //    setFname(fname)
  //     // fName: response[0].fName,
  //    setLname(lname)
  //     // lName: response[0].lName,
  //    setNote(note)
  //     // note: response[0].notes[0],
  //    setSchool(school)
  //     // school: response[0].school,
  //     setDefaultLanguage(response[0].defaultLanguage)
  //     // defaultLanguage: response[0].defaultLanguage,
  // }, [])

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
            <option value="en">Choose Here</option>
            <option value="en">English</option>
            <option value="lg">Luganda</option>
            <option value="ac">Acholi</option>
            <option value="es">Spanish</option>
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
        showCloseButton={true}
        rewindOnClose={false}
      /> 
    
    </div>
    
  )
  }
  export default Languages;