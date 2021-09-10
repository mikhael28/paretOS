import {useState} from "react";
import Dialog from '@material-ui/core/Dialog';

export default function ExternalSiteModal({url}){
  return(
      <iframe id="inlineFrameExample"
        title="Inline Frame Example"
        width="300"
        height="200"
        src={url}
      >
      </iframe>
  )
}