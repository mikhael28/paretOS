import { CardActionArea, CardContent, CardMedia, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
    backgroundColor: "black",
  },
  media: {
    height: 140,
  },
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: 40,
    border: "1px solid #dadde9",
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
        <Tooltip title={props.summary} className={classes.tooltip}>
          <figure
            className={classNames("block")}
            onClick={() =>
              window.location.pathname !== "/context-builder"
                ? props.openExternalModal(props.url)
                : null
            }
          >
            <CardActionArea style={{ height: "100%" }}>
              {props.url !== "na" ? (
                <CardMedia
                  className={classes.media}
                  image={props.img}
                  title={props.title}
                />
              ) : null}
              <CardContent>
                <figcaption style={{ fontSize: 20 }}>{props.title}</figcaption>
              </CardContent>
            </CardActionArea>
          </figure>
        </Tooltip>
      ) : null}
    </>
  );
}
