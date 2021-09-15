import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Tooltip from "@material-ui/core/Tooltip";
import classNames from "classnames";
import ExternalSiteModal from "./ExternalSiteModal";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: 20,
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  media: {
    height: 140,
  },
});

/**
 * This is the visual component that unlocks the content in the Knowledge Base.
 * @TODO Issue #66
 */


export default function MediaCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {props.logo || props.slug || props.img.options ? (
        <HtmlTooltip title={props.summary}>
          {/* This is where you should write the modal */}
          <div
            className={classNames("context-card", "block")}
            onClick={() => props.openExternalModal(props.url)}  // TypeError: props.openExternalModal is not a function, only after after initalizing server, navigating to library of context, and clicking a resource
          >
            <CardActionArea>
              {props.url !== "na" ? (
                <CardMedia
                  className={classes.media}
                  image={props.img}
                  title={props.title}
                />
              ) : null}
              <CardContent>
                <p style={{ fontSize: 20 }}>{props.title}</p>
              </CardContent>
            </CardActionArea>
          </div>
        </HtmlTooltip>
      ) : null}
    </React.Fragment>
  );
}
