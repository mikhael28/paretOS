import React, { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Dialog, Button } from "@mui/material";
import { I18n } from "@aws-amplify/core";
import Tour from "reactour";
import SuggestionModal from "./SuggestionModal";
import add from "../assets/add.png";
import help from "../assets/help.png";
import sanity from "../libs/sanity";
import ContextObject from "./ContextObject";
import ExternalSiteModal from "./ExternalSiteModal";
import { LibraryEntry } from "./ContextTypes";

const builder = imageUrlBuilder(sanity);

/**
 * The Digest page, displaying Context Objects about a particular topic.
 * @TODO Issue #27
 */

function ContextPage(props: any) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<LibraryEntry[]>([]);
  const [support, setSupport] = useState<LibraryEntry[]>([]);
  const [companies, setCompanies] = useState<LibraryEntry[]>([]);
  const [news, setNews] = useState<LibraryEntry[]>([]);
  const [assorted, setAssorted] = useState<LibraryEntry[]>([]);
  const [schema, setSchema] = useState("");
  const [renderType, setRenderType] = useState("generic");
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [schemaObject, setSchemaObject] = useState<any>({
    body: [],
    description: "",
    mainImage: {
      asset: {
        _ref: "",
      },
    },
    title: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [externalModal, setExternalModal] = useState({
    display: false,
    url: "",
  });

  function openExternalModal(url: string) {
    setExternalModal({ display: true, url });
  }

  function closeExternalModal() {
    setExternalModal({ display: false, url: "" });
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchSanityResources();
  }, []);

  async function fetchSanityResources() {
    let tempPath = window.location.pathname.split("/");
    if (tempPath[1] === "hubs") {
      setRenderType("hubs");
    }
    let schemaObj = tempPath[2];
    setSchema(schemaObj);
    const query = `*[_type == '${schemaObj}Schema' && !(_id in path("drafts.**"))]`;
    const links = await sanity.fetch(query);
    setItems(links);
    let tempCommunity: LibraryEntry[] = [];
    let tempSupport: LibraryEntry[] = [];
    let tempCompanies: LibraryEntry[] = [];
    let tempNews: LibraryEntry[] = [];
    let tempAssorted: LibraryEntry[] = [];
    if (tempPath[1] === "hubs") {
      console.log(links);
      links.map((link: LibraryEntry) => {
        if (
          link.type === "community" ||
          link.type === "education" ||
          link.type === "social" ||
          link.type === "leader"
        ) {
          tempCommunity.push(link);
        } else if (link.type === "incubators" || link.type === "vc") {
          tempSupport.push(link);
        } else if (link.type === "companies" || link.type === "marketplace") {
          tempCompanies.push(link);
        } else if (link.type === "news") {
          tempNews.push(link);
        } else {
          tempAssorted.push(link);
        }
      });
      setCommunity(tempCommunity);
      setSupport(tempSupport);
      setCompanies(tempCompanies);
      setNews(tempNews);
      setAssorted(tempAssorted);
    }
  }

  useEffect(() => {
    if (props.sanitySchemas.technicalSchemas.length > 0) {
      let tempPath = window.location.pathname.split("/");
      let schema = tempPath[2];
      let sObj;
      // possible to refactor??
      props.sanitySchemas.technicalSchemas.map((obj: LibraryEntry) => {
        if (obj.slug.current === schema) {
          sObj = obj;
          setSchemaObject(sObj);
          setLoading(false);
        }
      });
      props.sanitySchemas.economicSchemas.map((obj: LibraryEntry) => {
        if (obj.slug.current === schema) {
          sObj = obj;
          setSchemaObject(sObj);
          setLoading(false);
        }
      });
      props.sanitySchemas.hubSchemas.map((obj: LibraryEntry) => {
        if (obj.slug.current === schema) {
          sObj = obj;
          setSchemaObject(sObj);
          setLoading(false);
        }
      });
    }
  }, [props.sanitySchemas]);

  const steps = [
    {
      selector: ".third-step-library",
      content: `${I18n.get("libraryThird")}`,
    },
  ];

  return (
    <div style={{ marginTop: 10 }}>
      <div className="flex">
        {renderType === "generic" ? (
          <h1>{schemaObject.title}</h1>
        ) : (
          <h1>Welcome to {schemaObject.title}</h1>
        )}
        <img
          src={add}
          alt="Suggest Resource"
          height="60"
          width="60"
          style={{ cursor: "pointer", marginTop: 20, marginLeft: 10 }}
          onClick={() => {
            setOpenModal(true);
          }}
          className="third-step-library"
        />
        <img
          src={help}
          onClick={() => {
            setIsTourOpen(true);
          }}
          alt="Context page tour"
          height="40"
          width="40"
          style={{ cursor: "pointer", margin: 30, marginLeft: 10 }}
        />
      </div>

      {renderType === "hubs" ? (
        <>
          <PortableText value={schemaObject.body} />

          <h3>Local Communities & Meetups</h3>
          {community.length === 0 ? (
            <p
              className="flex"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Click&nbsp;
              <p style={{ cursor: "pointer", textDecoration: "underline" }}>
                {" "}
                here{" "}
              </p>
              &nbsp;to suggest a resource into our community knowledge base.
            </p>
          ) : (
            <div className="context-cards-start">
              {community.map((item: any) => {
                function urlFor(source: any) {
                  return builder.image(source);
                }
                let url;
                if (!item.logo && !item.mainImage) {
                  url = "na";
                } else if (!item.logo && item.mainImage) {
                  url = urlFor(item.mainImage.asset._ref);
                } else {
                  url = urlFor(item.logo.asset._ref);
                }

                return (
                  <React.Fragment key={item._id}>
                    {loading === true ? (
                      <></>
                    ) : (
                      <ContextObject
                        item={item}
                        img={url.toString()}
                        openExternalModal={openExternalModal}
                        closeExternalModal={closeExternalModal}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
          <h3>Start-up Incubators & Venture Capital</h3>
          {support.length === 0 ? (
            <p
              className="flex"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Click&nbsp;
              <p style={{ cursor: "pointer", textDecoration: "underline" }}>
                {" "}
                here{" "}
              </p>
              &nbsp;to suggest a resource into our community knowledge base.
            </p>
          ) : (
            <div className="context-cards-start">
              {support.map((item: any) => {
                function urlFor(source: any) {
                  return builder.image(source);
                }
                let url;
                if (!item.logo && !item.mainImage) {
                  url = "na";
                } else if (!item.logo && item.mainImage) {
                  url = urlFor(item.mainImage.asset._ref);
                } else {
                  url = urlFor(item.logo.asset._ref);
                }
                if (item.type === "incubators" || item.type === "vc") {
                  return (
                    <React.Fragment key={item._id}>
                      {loading === true ? (
                        <></>
                      ) : (
                        <ContextObject
                          item={item}
                          img={url.toString()}
                          openExternalModal={openExternalModal}
                          closeExternalModal={closeExternalModal}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          )}
          <h3>Hot Startups & Hiring Co's</h3>
          {companies.length === 0 ? (
            <p
              className="flex"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Click&nbsp;
              <p style={{ cursor: "pointer", textDecoration: "underline" }}>
                {" "}
                here{" "}
              </p>
              &nbsp;to suggest a resource into our community knowledge base.
            </p>
          ) : (
            <div className="context-cards-start">
              {companies.map((item: any) => {
                function urlFor(source: any) {
                  return builder.image(source);
                }
                let url;
                if (!item.logo && !item.mainImage) {
                  url = "na";
                } else if (!item.logo && item.mainImage) {
                  url = urlFor(item.mainImage.asset._ref);
                } else {
                  url = urlFor(item.logo.asset._ref);
                }
                if (item.type === "companies" || item.type === "marketplace") {
                  return (
                    <React.Fragment key={item._id}>
                      {loading === true ? (
                        <></>
                      ) : (
                        <ContextObject
                          item={item}
                          img={url.toString()}
                          openExternalModal={openExternalModal}
                          closeExternalModal={closeExternalModal}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          )}
          <h3>Local News & Industry Trends</h3>
          {news.length === 0 ? (
            <p
              className="flex"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Click&nbsp;
              <p style={{ cursor: "pointer", textDecoration: "underline" }}>
                {" "}
                here{" "}
              </p>
              &nbsp;to suggest a resource into our community knowledge base.
            </p>
          ) : (
            <div className="context-cards-start">
              {news.map((item: any) => {
                function urlFor(source: any) {
                  return builder.image(source);
                }
                let url;
                if (!item.logo && !item.mainImage) {
                  url = "na";
                } else if (!item.logo && item.mainImage) {
                  url = urlFor(item.mainImage.asset._ref);
                } else {
                  url = urlFor(item.logo.asset._ref);
                }
                if (item.type === "news") {
                  return (
                    <React.Fragment key={item._id}>
                      {loading === true ? (
                        <></>
                      ) : (
                        <ContextObject
                          item={item}
                          img={url.toString()}
                          openExternalModal={openExternalModal}
                          closeExternalModal={closeExternalModal}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          )}
          <h3>The Best of the Rest</h3>
          {assorted.length === 0 ? (
            <p
              className="flex"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Click&nbsp;
              <p style={{ cursor: "pointer", textDecoration: "underline" }}>
                {" "}
                here{" "}
              </p>
              &nbsp;to suggest a resource into our community knowledge base.
            </p>
          ) : (
            <div className="context-cards-start">
              {assorted.map((item: any) => {
                function urlFor(source: string) {
                  return builder.image(source);
                }
                let url;
                if (!item.logo && !item.mainImage) {
                  url = "na";
                } else if (!item.logo && item.mainImage) {
                  url = urlFor(item.mainImage.asset._ref);
                } else {
                  url = urlFor(item.logo.asset._ref);
                }
                if (item.type === "news") {
                  return (
                    <React.Fragment key={item._id}>
                      {loading === true ? (
                        <></>
                      ) : (
                        <ContextObject
                          item={item}
                          img={url.toString()}
                          openExternalModal={openExternalModal}
                          closeExternalModal={closeExternalModal}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          )}
        </>
      ) : null}
      {/* This is the render for non-city based pages. */}
      {renderType === "generic" ? (
        <>
          <h2>{schemaObject.description}</h2>
          <details>
            <summary>Read Overview</summary>
            <PortableText value={schemaObject.body} />
          </details>

          <h3>
            Pareto curated resources below - tap or click to open in a new tab.
          </h3>
          <div className="context-cards">
            {items.map((item: any) => {
              function urlFor(source: string) {
                return builder.image(source);
              }
              let url;
              if (!item.logo && !item.mainImage) {
                url = "na";
              } else if (!item.logo && item.mainImage) {
                url = urlFor(item.mainImage.asset._ref);
              } else {
                url = urlFor(item.logo.asset._ref);
              }
              return (
                <React.Fragment key={item._id}>
                  {loading === true ? (
                    <></>
                  ) : (
                    <ContextObject
                      item={item}
                      img={url.toString()}
                      openExternalModal={openExternalModal}
                      closeExternalModal={closeExternalModal}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      ) : null}
      {/* Modal Component */}
      <Dialog
        style={{
          margin: "auto",
        }}
        open={openModal}
        onClose={handleCloseModal}
        // TransitionComponent={Transition}
        keepMounted
        hideBackdrop={false}
        aria-labelledby="Suggestion Form"
        aria-describedby="Please write the details of the resource you are suggesting."
      >
        <SuggestionModal
          handleClose={handleCloseModal}
          schema={schema}
          user={props.user}
        />
      </Dialog>

      <Dialog
        style={{
          margin: "auto",
        }}
        open={externalModal.display}
        onClose={closeExternalModal}
        // TransitionComponent={Transition}
        keepMounted
        hideBackdrop={false}
      >
        <ExternalSiteModal url={externalModal.url} />

        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{
            padding: "10px",
            fontSize: "20px",
          }}
          onClick={() => {
            let win = window.open(externalModal.url, "_blank");
            win?.focus();
          }}
        >
          Open External Link
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          style={{
            padding: "10px",
            fontSize: "20px",
          }}
          onClick={() => closeExternalModal()}
        >
          Close
        </Button>
      </Dialog>

      {/* { externalModal.display ? <ExternalSiteModal url={externalModal.url} /> : null } */}

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        showCloseButton
        // rewindOnClose={false}
      />
    </div>
  );
}

export default ContextPage;
