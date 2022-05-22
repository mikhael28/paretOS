import {makeStyles} from "@mui/styles";
import classNames from "classnames";
import {FaUserEdit} from "react-icons/fa";
import {ContextObjectProps} from "./ContextTypes";

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
    backgroundColor: "black",
  },
  media: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: 0,
    border: "1px solid #dadde9",
  },
});

/**
 * This is the visual component that unlocks the content in the Knowledge Base.
 */

export default function ContextObject(props: ContextObjectProps) {
  const classes = useStyles();
  const {item, img, openExternalModal, closeExternalModal, openForEdit} = props;
  return (
    <>
      {item.slug ? (
        <div
          onClick={() =>
            window.location.pathname !== "/context-builder" && openExternalModal
              ? openExternalModal(item.url)
              : null
          }
          className={classNames("flex", "block")}
          style={{cursor: "pointer"}}
        >
          {img !== "na" ? (
            <img
              className={classes.media}
              src={img}
              alt={item.title}
              style={{marginRight: 10}}
            />
          ) : null}
          <div className="flex-down">
            <p style={{fontSize: 20}}>{item.title}</p>
            {item.summary ? (
              <p style={{fontSize: 14}}>{item.summary}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            window.location.pathname !== "/context-builder" && openForEdit ? openForEdit(item) : null;
          }}
          className={classNames("flex", "block")}
          style={{cursor: "pointer"}}
        >

          <div className="flex-down">
            <p style={{fontSize: 20}}><FaUserEdit />{item.title}</p>
            {item.summary ? (
              <p style={{fontSize: 14}}>{item.summary}</p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
