import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";

import classNames from "classnames";
import { ContextObjectProps } from "../types/ContextTypes";

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

export default function AdminContext(props: ContextObjectProps) {
  const classes = useStyles();
  const { item, img, openExternalModal, closeExternalModal } = props;
  const [state, setState] = useState<any>({
    title: "",
    url: "",
    summary: "",
  });

  useEffect(() => {
    //   initialize state
  }, []);
  return (
    <>
      {item.slug ? (
        <div
          className={classNames("flex", "block")}
          style={{ cursor: "pointer" }}
        >
          <div className="flex-apart">
            <p style={{ fontSize: 20 }}>{item.title}</p>
            {item.summary ? (
              <p style={{ fontSize: 14 }}>{item.summary}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
