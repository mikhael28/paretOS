import { CardActionArea, CardContent, CardMedia, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { ContextObjectProps } from "./ContextTypes";

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
 */

export default function ContextObject(props: ContextObjectProps) {
  const classes = useStyles();
  const { item, img, url, openExternalModal, closeExternalModal } = props;
  return (
    <>
      {item?.logo || item?.slug || img ? (
        <Tooltip title={item.summary} className={classes.tooltip}>
          <figure
            className={classNames("block")}
            onClick={() =>
              window.location.pathname !== "/context-builder"
                ? openExternalModal(url)
                : null
            }
          >
            <CardActionArea style={{ height: "100%" }}>
              {url !== "na" ? (
                <CardMedia
                  className={classes.media}
                  image={img}
                  title={item.title}
                />
              ) : null}
              <CardContent>
                <figcaption style={{ fontSize: 20 }}>{item.title}</figcaption>
              </CardContent>
            </CardActionArea>
          </figure>
        </Tooltip>
      ) : null}
    </>
  );
}
