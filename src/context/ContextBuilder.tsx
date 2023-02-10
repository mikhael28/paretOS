import { useState, useEffect, SetStateAction, Dispatch, KeyboardEventHandler, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import Tour from "reactour";
import imageUrlBuilder from "@sanity/image-url";
import classNames from "classnames";
import { LibraryEntry } from "../types/ContextTypes";
import ContextObject from "./ContextObject";
import question from "../assets/question.svg";
import sanity from "../libs/sanity";
import TabPanel from "../components/TabPanel";

const builder = imageUrlBuilder(sanity);

/**
 * The ContextBuilder component is the main dashboard for the Library of Context.
 *
 */

interface ContextBuilderProps {
  navigate: typeof useNavigate;
  sanitySchemas: {
    technicalSchemas: LibraryEntry[];
    economicSchemas: LibraryEntry[]
    hubSchemas: LibraryEntry[];
  }
}

function ContextBuilder(props: ContextBuilderProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [value, setValue] = useState<number>(0);
  const navigate = props.navigate();

  useEffect(() => {
    let initialTab = localStorage.getItem("contextTab");
    if (initialTab !== null) {
      setValue(parseInt(initialTab, 10));
    }
  }, []);

  const renderTopicsList = (topics: LibraryEntry[]) => {
    const newCardClass = classNames("context-card", "second-step-library");

    return (
      <div className="context-cards">
        {topics?.length > 0 &&
          topics.map((topic) => {
            const link = topic.type === "hub" ? "hubs" : "context";
            const img = builder.image(topic.mainImage.asset._ref);
            const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = (e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                navigate(`/${link}/${topic.slug.current}`)
              }
            }

            return (
              <div
                role="button"
                tabIndex={0}
                className={newCardClass}
                key={topic._id}
                onClick={() => navigate(`/${link}/${topic.slug.current}`)}
                onKeyDown={handleKeyPress}
              >
                <ContextObject item={topic} img={img} />
              </div>
            );
          })}
      </div>
    );
  };

  const steps = [
    {
      selector: ".first-step-library",
      content: `${I18n.get("libraryFirst")}`,
    },
    {
      selector: ".second-step-library",
      content: `${I18n.get("librarySecond")}`,
    },
  ];

  const tabPanelSxStyle = {
    margin: "-8.5vw",
    marginBottom:"6vh",
  }

  return (
    <div style={{ width: "100%" }}>
      <h1>
        {I18n.get("library")}
        <Box
          component="img"
          src={question}
          height={18}
          width={18}
          sx={{
            opacity: 0.8,
            filter: "invert()",
            margin: '8px 8px 14px 8px'
          }}
        />
      </h1>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          backgroundImage: "none",
          backgroundColor: "transparent",
        }}
      >
        <TabNavigation value={value} setValue={setValue} />
      </AppBar>
      <TabPanel value={value} index={0} sx={tabPanelSxStyle}>
        {props.sanitySchemas &&
          renderTopicsList(props.sanitySchemas.technicalSchemas)}
      </TabPanel>
      <TabPanel value={value} index={1} sx={tabPanelSxStyle}>
        {props.sanitySchemas &&
          renderTopicsList(props.sanitySchemas?.economicSchemas)}
      </TabPanel>
      <TabPanel value={value} index={2} sx={tabPanelSxStyle}>
        {props.sanitySchemas &&
          renderTopicsList(props.sanitySchemas?.hubSchemas)}
      </TabPanel>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        showCloseButton
        // rewindOnClose={false}
      />
    </div>
  );
}

function TabNavigation({ value, setValue }: { value: number, setValue: Dispatch<SetStateAction<number>> }) {
  return (
    <Tabs
      value={value}
      onChange={(_, newValue) => {
        localStorage.setItem("contextTab", newValue.toString());
        setValue(newValue);
      }}
      aria-label="Select the topics you wish to see in this group of tab"
    >
      <Tab label={I18n.get("fullStackDev")} sx={{ fontSize: 18 }} />
      <Tab label={I18n.get("findingWork")} sx={{ fontSize: 18 }} />
      <Tab label={I18n.get("cityByCity")} sx={{ fontSize: 18 }} />
    </Tabs>
  )
}

export default ContextBuilder;
