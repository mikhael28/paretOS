import React, {useState, useEffect} from "react";

const Languages = (props) => {
  let [defaultLanguage, setDefaultLanguage] = useState("")
  let [isLoading, setIsLoading] = useState(false)
  let [isTourOpen, setIsTourOpen] = useState(false)
  //let [event.target.id, setEventTargetId] = useState(event.target.value)//check validity of this usestate


  const closeTour = () => {
    // this.setState({
    //  isTourOpen: false,
    // });
    setIsTourOpen(!isTourOpen)
  };

  const handleChange = (event) => {
    setEventTargetId(initialvalue)
  };

  const updateLanguage = async () => {
    let body = {
      defaultLanguage: this.state.defaultLanguage,
    };
    try {
      const response = await API.put("pareto", `/users/${this.state.id}`, {
        body,
      });
      // console.log(response);
      this.setState({ user: response });
    } catch (e) {
      // console.log(e);
    }
  };

  // const handleChange = event => {  //FROM ANOTHER SITE ON HOW THIS SUPPOSE TO LOOK
  //  // use spread operator
  //  setForm({
  //    ...form,
  //    [event.target.name]: event.target.value,
  //  });
  // };

  return (
    <div>
       <FormGroup controlId="defaultLanguage" bsSize="large">//import
        <ControlLabel>Default Language</ControlLabel>//import
        <div className="flex">
          <FormControl//import
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
          <LoaderButton  //import
            align="center"
            block
            type="submit"
            style={{ width: 90 }}
            disabled={!this.validateForm()}
            onClick={this.updateLanguage}
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Updating..."
          />
        </div>
      </FormGroup>

      <Button onClick={() => this.props.history.push("/settings/password")}> //move current page to password page
        Change Password
      </Button>

      <Tour  //import
        steps={steps}
        isOpen={this.state.isTourOpen}
        onRequestClose={this.closeTour}
        showCloseButton={true}
        rewindOnClose={false}
      /> 
    
    </div>
   
  )
  }
  export default Languages;