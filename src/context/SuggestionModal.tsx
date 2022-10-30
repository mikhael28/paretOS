import { useContext, useEffect, useState } from "react";
import {
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { RestAPI } from "@aws-amplify/api-rest";
import LoaderButton from "../components/LoaderButton";
import { ToastMsgContext } from "../context/ToastContext";
import { generateEmail } from "../utils/generateErrorEmail";
import { useForm } from "react-hook-form";
/**
 * This is the modal where folks can offer suggestions into the prod knowledge base.
 */
export default function SuggestionModal({
  schema,
  user,
  handleClose,
  activeItem,
  method,
}: any) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    url: "",
    imgUrl: "",
    type: "",
  });
  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);
  const [disabled] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm();

  useEffect(() => {
    if (activeItem !== undefined) {
      setFormData(activeItem);
    }
  }, [activeItem]);

  const [submissionLoading, setSubmissionLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmissionLoading(true);

    let mutations;

    if (method === "post") {
      mutations = [
        {
          create: {
            _type: `${schema}Schema`,
            title: data.title,
            summary: data.summary,
            url: data.url,
            type: data.type,
          },
        },
      ];
    } else {
      mutations = [
        {
          createOrReplace: {
            _id: activeItem._id,
            _type: `${schema}Schema`,
            title: data.title,
            summary: data.summary,
            url: data.url,
            type: data.type,
          },
        },
      ];
    }

    let messageTitle = `${schema} suggestion received`;
    let messagesummary = `${user.fName} ${user.lName} has submitted a resource with the title ${formData.title}. Please review it on the Sanity Creation Studio.`;

    let email = generateEmail(messageTitle, messagesummary);

    try {
      fetch(
        `https://${
          import.meta.env.VITE_SANITY_ID
        }.api.sanity.io/v1/data/mutate/production`,
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

      await RestAPI.post("pareto", "/email", {
        body: {
          recipient: "mikhael@hey.com",
          sender: "mikhael@hey.com",
          subject: messageTitle,
          htmlBody: email,
          textBody: messagesummary,
        },
      });

      setSubmissionLoading(false);
      handleClose();
      handleShowSuccess("Thank you for your suggestion!");
    } catch (e) {
      handleShowError(e as Error);
      setSubmissionLoading(false);
    }
    reset();
  };

  const convertCamelCaseToTitleCase = (str: string) => {
    const result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div>
      
      <form  onSubmit={handleSubmit(onSubmit)} style={{maxWidth:"400px", padding:"24px"}}>
        <h3 style={{ marginTop: "0px" }}>
          New {convertCamelCaseToTitleCase(schema)} Suggestion
        </h3>
        <h4 style={{ marginTop: "8px" }}>
          Please enter details
        </h4>
        <TextField
            id="title"
            variant="outlined"
            size="medium"
            label="Title"
            style={{marginTop: 16}}
            fullWidth
            {...register("title", { 
              required: "Required field",
              minLength: {
                value: 1,
                message: "All fields must be filled"
              }
            })}
          />
          <p style={{fontSize: 14, margin:4, color:"rgb(220, 66, 100)"}}>
            {errors.title && errors.title.message}
          </p>
          <TextField
            id="summary"
            variant="outlined"
            size="medium"
            label="Summary"
            style={{marginTop: 16}}
            fullWidth
            {...register("summary", {  
              required: "Required field",
              minLength: {
                value: 1,
                message: "All fields must be filled"
              }
            })}
          />
          <p style={{fontSize: 14, margin:4, color:"rgb(220, 66, 100)"}}>
            {errors.summary && errors.summary.message}
          </p>
          <TextField
            id="url"
            variant="outlined"
            size="medium"
            autoFocus
            fullWidth
            label="Website Link"
            style={{marginTop: 16}}
            {...register("url", { 
              required: "Required field",
              minLength: {
                value: 1,
                message: "All fields must be filled"
              }
            })}
          />
          <p style={{fontSize: 14, margin:4, color:"rgb(220, 66, 100)"}}>
            {errors.url && errors.url.message}
          </p>
          <FormControl fullWidth style={{marginTop: 16}}>
            <InputLabel id="demo-simple-select-label" >Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Type"
              defaultValue="choose"
              {...register("type", { 
                required: "Required field",
                minLength: {
                  value: 1,
                  message: "All fields must be filled"
                }
              })}
            >
              <MenuItem value="choose">Choose an Option</MenuItem>
              <MenuItem value="jobs">Jobs</MenuItem>
              <MenuItem value="modules">Libraries / SDKs / Modules</MenuItem>
              <MenuItem value="news">News, Trends and Valuable Info</MenuItem>
              <MenuItem value="community">Meetups / Communities</MenuItem>
              <MenuItem value="education">Educational Programs</MenuItem>
              <MenuItem value="companies">Amazing Companies</MenuItem>
              <MenuItem value="incubators">Startup Incubators</MenuItem>
              <MenuItem value="vc">Venture Capital</MenuItem>
              <MenuItem value="docs">Documentation</MenuItem>
              <MenuItem value="game">Games / Gamified Resources</MenuItem>
              <MenuItem value="marketplace">Marketplace</MenuItem>
              <MenuItem value="tutorial">Tutorial</MenuItem>
              <MenuItem value="article">Article</MenuItem>
              <MenuItem value="audio">Podcast / Audiobook</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="social">Social Network</MenuItem>
              <MenuItem value="book">Book</MenuItem>
            </Select>
          </FormControl>
            <p style={{fontSize: 14, margin:4, color:"rgb(220, 66, 100)"}}>
              {errors.type && errors.type.message}
            </p>

        <DialogActions>
        <Button className="btn-cancel" onClick={ () => {handleClose(); reset()}}>
              Cancel
            </Button>
          <LoaderButton
                text="Submit Suggestion"
                loadingText="Submitting"
                disabled={disabled}
                type="submit"
                color="primary"
                variant="contained"
                isLoading={submissionLoading}
              />
        </DialogActions>
      </form>
    </div>
  );
}
