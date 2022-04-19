import { useState } from "react";
import { useHistory } from "react-router-dom";
import Image from "react-bootstrap/lib/Image";
import { I18n } from "@aws-amplify/core";
import { AppBar, Tabs, Tab } from "@mui/material";
import Tour from "reactour";
import imageUrlBuilder from "@sanity/image-url";
import classNames from "classnames";
import ContextObject from "./ContextObject";
import help from "../assets/help.png";
import sanity from "../libs/sanity";
import TabPanel from "../components/TabPanel.js";

const builder = imageUrlBuilder(sanity);

/**
 * The ContextBuilder component is the main dashboard for the Library of Context.
 *
 */

function ContextBuilder({ sanitySchemas }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [value, setValue] = useState(0);
  const history = useHistory();

  const renderTopicsList = (topics) => {
    const newCardClass = classNames("context-card", "second-step-library");

    return (
      <div className="context-cards">
        {topics?.length > 0 &&
          topics.map((topic) => {
            const link = topic.type === "hub" ? "hubs" : "context";
            const img = builder.image(topic.mainImage.asset._ref);

            return (
              <div
                className={newCardClass}
                onClick={() => history.push(`/${link}/${topic.slug.current}`)}
              >
                <ContextObject
                  img={img}
                  title={topic.title}
                  summary={topic.summary}
                />
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

  return (
    <div style={{ width: "100%" }}>
      <h1>
        {I18n.get("library")}
        <Image
          src={help}
          onClick={(event) => {
            event.preventDefault();
            setIsTourOpen(true);
          }}
          height="40"
          width="40"
          circle
          style={{ cursor: "pointer" }}
        />
      </h1>
      <AppBar
        position="static"
        style={{
          boxShadow: "none",
          backgroundImage: "none",
          backgroundColor: "transparent",
        }}
      >
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="Select the topics you wish to see in this group of tab"
        >
          <Tab label={I18n.get("fullStackDev")} style={{ fontSize: 18 }} />
          <Tab label={I18n.get("findingWork")} style={{ fontSize: 18 }} />
          <Tab label={I18n.get("cityByCity")} style={{ fontSize: 18 }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className="tabPanelCont">
        {renderTopicsList(sanitySchemas.technicalSchemas)}
      </TabPanel>
      <TabPanel value={value} index={1} className="tabPanelCont">
        {renderTopicsList(sanitySchemas.economicSchemas)}
      </TabPanel>
      <TabPanel value={value} index={2} className="tabPanelCont">
        {renderTopicsList(sanitySchemas.hubSchemas)}
      </TabPanel>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        showCloseButton
        rewindOnClose={false}
      />
    </div>
  );
}

export default ContextBuilder;
