import React, { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Dialog, Button } from "@mui/material";
import { I18n } from "@aws-amplify/core";
import Tour from "reactour";
import SuggestionModal from "./SuggestionModal";
import help from "../assets/help.png";
import sanity from "../libs/sanity";
import ContextObject from "./ContextObject";
import ExternalSiteModal from "./ExternalSiteModal";
import { LibraryEntry, Admin, Hub } from "../types/ContextTypes";
import classNames from "classnames";
import { AiFillGithub } from 'react-icons/ai';
import { BiBitcoin } from "react-icons/bi";

const builder = imageUrlBuilder(sanity);

/**
 * The Digest page, displaying Context Objects about a particular topic.
 * @TODO Issue #27
 */

interface ContextSuggestionForm {
  title: string;
  summary: string;
  url: string;
  imgUrl: string;
  type: string;
}

function ContextPage(props: any) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<LibraryEntry[]>([]);
  const [support, setSupport] = useState<LibraryEntry[]>([]);
  const [companies, setCompanies] = useState<LibraryEntry[]>([]);
  const [news, setNews] = useState<LibraryEntry[]>([]);
  const [assorted, setAssorted] = useState<LibraryEntry[]>([]);
  const [schema, setSchema] = useState("");
  const [method, setMethod] = useState("post");
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
  console.log('CONTEXT_PAGE_OPENED');
  console.log(JSON.stringify(props));
  const [activeItem, setActiveItem] = useState<ContextSuggestionForm | LibraryEntry>({
    title: "",
    summary: "",
    url: "",
    imgUrl: "",
    type: "",
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

  const openSuggestionModal = () => {
    setMethod("post");
    setActiveItem({
      title: "",
      summary: "",
      url: "",
      imgUrl: "",
      type: "",
    });
    setOpenModal(true);
  };

  const openEditSuggestionModal = (item: LibraryEntry) => {
    setMethod("put");
    setActiveItem(item);
    setOpenModal(true);
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
    const query = `*[_type == '${schemaObj}Schema']`;

    // const query = `*[_type == '${schemaObj}Schema' && !(_id in path("drafts.**"))]`;
    const links = await sanity.fetch(query);
    console.warn(links);
    setItems(links);
    let tempCommunity: LibraryEntry[] = [];
    let tempSupport: LibraryEntry[] = [];
    let tempCompanies: LibraryEntry[] = [];
    let tempNews: LibraryEntry[] = [];
    let tempAssorted: LibraryEntry[] = [];
    if (tempPath[1] === "hubs") {
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
      selector: ".first-step-library",
      content: `${I18n.get("libraryFirst")}`,
    },
    {
      selector: ".second-step-library",
      content: `${I18n.get("librarySecond")}`,
    },
    {
      selector: ".third-step-library",
      content: `${I18n.get("libraryThird")}`,
    },
  ];

  console.log(schemaObject);

  return (
    <div style={{ marginTop: 10 }}>
      <div className="flex">
        {renderType === "generic" ? (
          <h1>{schemaObject.title}</h1>
        ) : (
          <h1>Welcome to {schemaObject.title}</h1>
        )}

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

      <Button
        onClick={() => {
          openSuggestionModal();
        }}
        style={{ color: 'white' }}
        className={classNames("third-step-library", "btn")}

      >Suggest New Resource</Button>

      {renderType === "hubs" ? (
        <>
          {schemaObject.Admin ? (
            <div>

              <h2>Curator Profile(s)</h2>
              {schemaObject.Admin.map((person: Admin, i: number) => {
                function urlFor(source: any) {
                  return builder.image(source);
                }
                let url;
                if (!person.adminPicture) {
                  url = "na";
                } else {
                  url = urlFor(person.adminPicture.asset._ref);
                }
                return (
                  <div key={i} className={classNames('flex', 'block')}>
                    <img src={url.toString()} height="60" width="60" />
                    <p>{person.name} <br /> {'\n'} {person.email}</p>
                    <AiFillGithub onClick={() => { }} style={{ cursor: 'pointer' }} />
                    <BiBitcoin onClick={() => { }} style={{ cursor: 'pointer' }} />
                  </div>
                )
              })}
            </div>
          ) : null}
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
              <span style={{ cursor: "pointer", textDecoration: "underline" }}>
                {" "}
                here{" "}
              </span>
              &nbsp;to suggest a resource into our community knowledge base.
            </p>
          ) : (
            <div className="context-cards-start">
              {community.map((item: LibraryEntry) => {
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
                        openForEdit={openEditSuggestionModal}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
          <h3>Start-up Incubators & Venture Capital</h3>
          {support.length === 0 ? null : (
            <div className="context-cards-start">
              {support.map((item: LibraryEntry) => {
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
                          openForEdit={openEditSuggestionModal}
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
              {companies.map((item: LibraryEntry) => {
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
                          openForEdit={openEditSuggestionModal}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          )}
          <h3>Local News & Industry Trends</h3>
          {news.length === 0 ? null : (
            <div className="context-cards-start">
              {news.map((item: LibraryEntry) => {
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
                          openForEdit={openEditSuggestionModal}
                        />
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </div>
          )}
          <h3>The Best of the Rest</h3>
          {assorted.length === 0 ? null : (
            <div className="context-cards-start">
              {assorted.map((item: LibraryEntry) => {
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
                          openForEdit={openEditSuggestionModal}
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
          <div className="context-cards">
            {items.map((item: LibraryEntry) => {
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
                      openForEdit={openEditSuggestionModal}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      ) : null}
      <Dialog
        style={{
          margin: "auto",
        }}
        open={openModal}
        onClose={handleCloseModal}
        keepMounted
        hideBackdrop={false}
        aria-labelledby="Suggestion Form"
        aria-describedby="Please write the details of the resource you are suggesting."
      >
        <SuggestionModal
          handleClose={handleCloseModal}
          schema={schema}
          user={props.user}
          activeItem={activeItem}
          method={method}
        />
      </Dialog>

      <Dialog
        style={{
          margin: "auto",
        }}
        open={externalModal.display}
        onClose={closeExternalModal}
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
            closeExternalModal()
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

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        showCloseButton
      />
    </div>
  );
}

export default ContextPage;
