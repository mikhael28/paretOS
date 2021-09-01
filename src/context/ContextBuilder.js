import React, { Children, useState } from "react";
import { useHistory } from "react-router-dom";
import Image from "react-bootstrap/lib/Image";
import sanity from "../libs/sanity";
import { I18n } from "@aws-amplify/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import help from "../assets/help.png";
import Tour from "reactour";
import imageUrlBuilder from "@sanity/image-url";
import ContextObject from "./ContextObject";
import classNames from "classnames";
import TabPanel from "../components/TabPanel.js"

const builder = imageUrlBuilder(sanity);

/**
 * The ContextBuilder component is the main dashboard for the Library of Context. This is where we display our open-knowledge base.
 *
 */

function ContextBuilder({ sanitySchemas }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [value, setValue] = useState(0);

  const renderTopicsList = (topics) => {
    const newCardClass = classNames("context-card", "second-step-library");
    const history = useHistory();

    return (
      <div className="context-cards">
        {Children.toArray(
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
          })
        )}
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
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="simple tabs example"
        >
          <Tab label={I18n.get("cityByCity")} style={{ fontSize: 18 }} />
          <Tab label={I18n.get("findingWork")} style={{ fontSize: 18 }} />
          <Tab label={I18n.get("fullStackDev")} style={{ fontSize: 18 }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} style={{ margin: -30 }}>
        {renderTopicsList(sanitySchemas.hubSchemas)}
      </TabPanel>
      <TabPanel value={value} index={1} style={{ margin: -30 }}>
        {renderTopicsList(sanitySchemas.economicSchemas)}
      </TabPanel>
      <TabPanel value={value} index={2} style={{ margin: -30 }}>
        {renderTopicsList(sanitySchemas.technicalSchemas)}
      </TabPanel>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        showCloseButton={true}
        rewindOnClose={false}
      />
    </div>
  );
}

export default ContextBuilder;
