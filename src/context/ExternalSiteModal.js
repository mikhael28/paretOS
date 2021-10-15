
export default function ExternalSiteModal({url}){

  return(
      <iframe id="inlineFrameExample"
        title="Inline Frame Example"
        width="600px"
        height="1000px"
        src={url}
      >
      </iframe>
  )
}