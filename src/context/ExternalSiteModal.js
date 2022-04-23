import { useEffect, useState } from "react";

export default function ExternalSiteModal(props) {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(false);

  // The iFrame checking solution was found on StackOverflow, the solution was not possible on the client-Side.
  // A helpful developer posted a Cloudflare worker he developed to check the http headers of the website in question, and return false/true if we could watch
  // They asked not to use their solution in production, but I have included it here as a temporary fix.
  // The gist to deploy it ourselves is here: The code is available at: https://gist.github.com/repalash/b1e778dbe3ac2e7149831c530a6535f9 and can be deployed directly as a cloudflare worker

  function checkUrlFrameOptions(siteUrl) {
    return fetch(
      `https://header-inspector.repalash.workers.dev/?${new URLSearchParams({
        apiurl: siteUrl,
        headers: "x-frame-options",
      })}`,
      {
        method: "GET",
      }
    )
      .then((r) => r.json())
      .then((json) => {
        let xFrameOp = (json.headers["x-frame-options"] || "").toLowerCase();
        // deny all requests
        if (xFrameOp === "deny") return false;
        // deny if different origin
        // eslint-disable-next-line no-restricted-globals
        if (xFrameOp === "sameorigin" && json.origin !== location.origin)
          return false;
        return true;
      })
      .catch((e) => console.log("Cloudflare error: ", e));
  }
  useEffect(() => {
    if (props.url !== "" || props.url !== "https://example.com/") {
      checkUrlFrameOptions(props.url).then((res) => {
        // console.log(`${props.url} can be loaded in iframe: `, res);
        if (res === true) {
          setLoading(false);
          setRender(true);
        } else if (res === false) {
          setRender(false);
        }
      });
    }
  }, [props.url]);

  return (
    <>
      {loading === true ? (
        <div>Loading</div>
      ) : (
        <>
          {render === false ? (
            <div
              style={{
                width: 600,
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>This page is not available to view in an iFrame</p>
            </div>
          ) : (
            <iframe
              id="inlineFrameExample"
              title="Inline Frame Example"
              width="600px"
              height="600px"
              src={props.url}
            />
          )}
        </>
      )}
    </>
  );
}
