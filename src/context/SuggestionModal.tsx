import { useContext, useEffect, useState } from "react";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { RestAPI } from "@aws-amplify/api-rest";
import LoaderButton from "../components/LoaderButton";
import { ToastMsgContext } from "../state/ToastContext";;
import { generateEmail } from "../utils/generateErrorEmail";

/**
 * This is the modal where folks can offer suggestions into the prod knowledge base.
 */
export default function SuggestionModal({
  schema,
  user,
  handleClose,
  activeItem,
  method
}: any) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    url: "",
    imgUrl: "",
    type: "",
  });
  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);


  useEffect(() => {
    if (activeItem !== undefined) {
      setFormData(activeItem);
    }
  }, [activeItem]);

  const [submissionLoading, setSubmissionLoading] = useState(false);

  const handleChange = (event: any) => {
    console.log(event.target.id);
    console.log(event.target.value);

    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const validateForm = () =>
    formData.title.length > 0 &&
    formData.summary.length > 0 &&
    formData.url.length > 0 &&
    formData.type.length > 0;

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setSubmissionLoading(true);

    let mutations;

    if (method === "post") {

      mutations = [
        {
          create: {
            _type: `${schema}Schema`,
            title: formData.title,
            summary: formData.summary,
            url: formData.url,
            type: formData.type,
          },
        },
      ];
    } else {
      mutations = [
        {
          createOrReplace: {
            _id: activeItem._id,
            _type: `${schema}Schema`,
            title: formData.title,
            summary: formData.summary,
            url: formData.url,
            type: formData.type,
          },
        },
      ];
    }

    let messageTitle = `${schema} suggestion received`;
    let messagesummary = `${user.fName} ${user.lName} has submitted a resource with the title ${formData.title}. Please review it on the Sanity Creation Studio.`;

    let email = generateEmail(messageTitle, messagesummary);

    try {
      fetch(
        `https://${import.meta.env.VITE_SANITY_ID}.api.sanity.io/v1/data/mutate/production`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SANITY_TOKEN}`,
          },
          body: JSON.stringify({
            mutations,
          }),
        }
      )
        .then((response) => response.json())
        .catch((error) => console.error(error));

      await RestAPI.post("util", "/email", {
        body: {
          recipient: "michael@pareto.education",
          sender: "michael@pareto.education",
          subject: messageTitle,
          htmlBody: email,
          textBody: messagesummary,
        },
      });

      setSubmissionLoading(false);
      setFormData({ title: "", summary: "", url: "", imgUrl: "", type: "" });
      handleClose();
      handleShowSuccess("Thank you for your suggestion!");
    } catch (e) {
      handleShowError(e as Error);
      setSubmissionLoading(false);
    }
  };

  const convertCamelCaseToTitleCase = (str: string) => {
    const result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div>
      <DialogContent>
        <h3 style={{ marginTop: "0px" }}>
          New {convertCamelCaseToTitleCase(schema)} Suggestion
        </h3>
        <DialogContentText style={{ fontSize: "14px" }}>
          Please enter the details
        </DialogContentText>
        <FormGroup controlId="title" bsSize="large">
          <ControlLabel style={{ fontSize: "14px" }}>Title</ControlLabel>
          <FormControl value={formData.title} onChange={handleChange} />
        </FormGroup>
        <FormGroup controlId="summary" bsSize="large">
          <ControlLabel style={{ fontSize: "14px" }}>Summary</ControlLabel>
          <FormControl value={formData.summary} onChange={handleChange} />
        </FormGroup>
        <FormGroup controlId="url" bsSize="large">
          <ControlLabel style={{ fontSize: "14px" }}>Website Link</ControlLabel>
          <FormControl value={formData.url} onChange={handleChange} />
        </FormGroup>
        <FormGroup controlId="type" bsSize="large">
          <ControlLabel style={{ fontSize: "14px" }}>Type</ControlLabel>
          <FormControl
            componentClass="select"
            onChange={handleChange}
            value={formData.type}
          >
            <option value="choose">Choose an Option</option>
            <option value="jobs">Jobs</option>
            <option value="modules">Libraries / SDKs / Modules</option>
            <option value="news">News, Trends and Valuable Info</option>
            <option value="community">Meetups / Communities</option>
            <option value="education">Educational Programs</option>
            <option value="companies">Amazing Companies</option>
            <option value="incubators">Startup Incubators</option>
            <option value="vc">Venture Capital</option>
            <option value="docs">Documentation</option>
            <option value="game">Games / Gamified Resources</option>
            <option value="marketplace">Marketplace</option>
            <option value="tutorial">Tutorial</option>
            <option value="article">Article</option>
            <option value="audio">Podcast / Audiobook</option>
            <option value="video">Video</option>
            <option value="social">Social Network</option>
            <option value="book">Book</option>
          </FormControl>
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button className="btn-cancel" onClick={handleClose}>
          Cancel
        </Button>
        <LoaderButton
          text="Submit Suggestion"
          loadingText="Submitting"
          disabled={!validateForm()}
          isLoading={submissionLoading}
          onClick={handleSubmit}
        />
      </DialogActions>
    </div>
  );
}
