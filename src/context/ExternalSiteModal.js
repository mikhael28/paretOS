
export default function ExternalSiteModal({url}){
  console.log(url)
  return(
      <iframe id="inlineFrameExample"
        title="Inline Frame Example"
        width="600px"
        height="1000px"
        src={url}
        referrerPolicy='sameorigin'
      >
      </iframe>
  )
}