import React, { Component } from "react";
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
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const builder = imageUrlBuilder(sanity);

/**
 * This Tabpanel is repetitive
 * @TODO Issue #43
 */

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

/**
 * The ContextBuilder component is the main dashboard for the Library of Context. This is where we display our open-knowledge base.
 * @TODO Issue #42
 */

export default class ContextBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isTourOpen: false,
      key: 0,
    };
  }

  handleSelect = (event, newValue) => {
    this.setState({ key: newValue });
  };

  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  renderTopicsList(topics) {
    let newCardClass = classNames("context-card", "second-step-library");
    return (
      <div className="context-cards">
        {topics.map((topic, i) => {
          let link;
          if (topic.type === "hub") {
            link = "hubs";
          } else {
            link = "context";
          }
          function urlFor(source) {
            return builder.image(source);
          }
          let img = urlFor(topic.mainImage.asset._ref);
          return (
            <div
              className={newCardClass}
              onClick={() =>
                this.props.history.push(`/${link}/${topic.slug.current}`)
              }
              key={i}
            >
              <ContextObject
                img={img}
                title={topic.title}
                summary={topic.summary}
                img={img}
              />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
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
              this.setState({ isTourOpen: true });
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
            value={this.state.key}
            onChange={this.handleSelect}
            aria-label="simple tabs example"
          >
            <Tab label={I18n.get("cityByCity")} style={{ fontSize: 18 }} />
            <Tab label={I18n.get("findingWork")} style={{ fontSize: 18 }} />
            <Tab label={I18n.get("fullStackDev")} style={{ fontSize: 18 }} />
          </Tabs>
        </AppBar>
        <TabPanel value={this.state.key} index={0} style={{ margin: -30 }}>
          {this.renderTopicsList(this.props.sanitySchemas.hubSchemas)}
        </TabPanel>
        <TabPanel value={this.state.key} index={1} style={{ margin: -30 }}>
          {this.renderTopicsList(this.props.sanitySchemas.economicSchemas)}
        </TabPanel>
        <TabPanel value={this.state.key} index={2} style={{ margin: -30 }}>
          {this.renderTopicsList(this.props.sanitySchemas.technicalSchemas)}
        </TabPanel>

        <Tour
          steps={steps}
          isOpen={this.state.isTourOpen}
          onRequestClose={this.closeTour}
          showCloseButton={true}
          rewindOnClose={false}
        />
      </div>
    );
  }
}
