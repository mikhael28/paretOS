import React from "react";
import { CardActionArea, CardContent, CardMedia, Tooltip } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import classNames from "classnames";

const HtmlTooltip = withStyles(() => ({
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
    <>
      {props.logo || props.slug || props.img.options ? (
        <HtmlTooltip title={props.summary}>
          <div
            className={classNames("context-card", "block")}
            onClick={() =>
              window.location.pathname !== "/context-builder"
                ? props.openExternalModal(props.url)
                : null
            }
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
    </>
  );
}
