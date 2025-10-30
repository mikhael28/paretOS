import React, { useState, useEffect, useMemo } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Dialog, Button, TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel, Chip, Box } from "@mui/material";
import { I18n } from "@aws-amplify/core";
import Tour from "reactour";
import SuggestionModal from "./SuggestionModal";
import help from "../assets/help.png";
import sanity from "../libs/sanity";
import { sanityObjects } from "../offline-data/sanity-objects";
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

// Auto-categorize resources based on keywords in their titles
const categorizeResource = (resource: any) => {
  const title = resource.title?.toLowerCase() || '';
  
  // Define category patterns
  if (title.includes('react') || title.includes('vue') || title.includes('angular') || 
      title.includes('javascript') || title.includes('typescript') || title.includes('css') ||
      title.includes('html') || title.includes('web')) {
    return 'Web Development';
  }
  if (title.includes('security') || title.includes('csrf') || title.includes('sql injection') ||
      title.includes('auth')) {
    return 'Security';
  }
  if (title.includes('design') || title.includes('ui') || title.includes('ux') || 
      title.includes('color') || title.includes('font')) {
    return 'Design & UX';
  }
  if (title.includes('job') || title.includes('work') || title.includes('hire') || 
      title.includes('career') || title.includes('interview') || title.includes('freelanc')) {
    return 'Career & Jobs';
  }
  if (title.includes('startup') || title.includes('founder') || title.includes('vc') ||
      title.includes('incubat') || title.includes('venture') || title.includes('capital')) {
    return 'Startups & Funding';
  }
  if (title.includes('community') || title.includes('meetup') || title.includes('club') ||
      title.includes('group')) {
    return 'Communities';
  }
  if (title.includes('learn') || title.includes('tutorial') || title.includes('course') ||
      title.includes('academy') || title.includes('training')) {
    return 'Learning Resources';
  }
  if (title.includes('tool') || title.includes('library') || title.includes('framework') ||
      title.includes('service') || title.includes('api')) {
    return 'Tools & Services';
  }
  if (title.includes('africa') || title.includes('nigeria') || title.includes('uganda') ||
      title.includes('costa rica') || title.includes('seattle')) {
    return 'Regional';
  }
  
  return 'Other';
};

function ContextPage(props: any) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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
    // Open URL in new tab instead of modal
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  function closeExternalModal() {
    setExternalModal({ display: false, url: "" });
  }

  // Get unique categories from all resources
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    sanityObjects.forEach(item => {
      cats.add(categorizeResource(item));
    });
    return Array.from(cats).sort();
  }, []);

  // Filter resources based on search and category
  const filteredItems = useMemo(() => {
    let filtered = sanityObjects || [];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => 
        categorizeResource(item) === selectedCategory
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

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
    
    // Use static data
    const links = sanityObjects || [];
    setItems(links);
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

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search Resources"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                🔍
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          onClick={() => {
            openSuggestionModal();
          }}
          style={{ color: 'white' }}
          className={classNames("third-step-library", "btn")}
        >Suggest New Resource</Button>
      </Box>

      {/* Results count */}
      <Box sx={{ mb: 2 }}>
        <Chip 
          label={`${filteredItems.length} resources found`} 
          color="primary" 
          variant="outlined"
        />
        {selectedCategory !== 'All' && (
          <Chip 
            label={selectedCategory}
            onDelete={() => setSelectedCategory('All')}
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Simplified Resource Grid */}
      <div className="context-cards">
        {filteredItems.map((item: any) => {
          const category = categorizeResource(item);
          return (
            <div
              key={item.id}
              className="context-card"
              style={{ 
                cursor: item.url ? 'pointer' : 'default',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onClick={() => {
                if (item.url) {
                  window.open(item.url, '_blank', 'noopener,noreferrer');
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.title}</h3>
                  <Chip 
                    label={category} 
                    size="small" 
                    sx={{ mb: 1 }}
                    variant="outlined"
                  />
                  {item.summary && (
                    <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>{item.summary}</p>
                  )}
                </div>
                {item.url && (
                  <span 
                    style={{ 
                      fontSize: '16px', 
                      opacity: 0.6,
                      marginLeft: '8px'
                    }} 
                  >
                    ↗
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
                if (!person.adminPicture?.asset?._ref) {
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
                } else if (!item.logo && item.mainImage?.asset?._ref) {
                  url = urlFor(item.mainImage.asset._ref);
                } else if (item.logo?.asset?._ref) {
                  url = urlFor(item.logo.asset._ref);
                } else {
                  url = "na";
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
                } else if (!item.logo && item.mainImage?.asset?._ref) {
                  url = urlFor(item.mainImage.asset._ref);
                } else if (item.logo?.asset?._ref) {
                  url = urlFor(item.logo.asset._ref);
                } else {
                  url = "na";
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
                } else if (!item.logo && item.mainImage?.asset?._ref) {
                  url = urlFor(item.mainImage.asset._ref);
                } else if (item.logo?.asset?._ref) {
                  url = urlFor(item.logo.asset._ref);
                } else {
                  url = "na";
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
                } else if (!item.logo && item.mainImage?.asset?._ref) {
                  url = urlFor(item.mainImage.asset._ref);
                } else if (item.logo?.asset?._ref) {
                  url = urlFor(item.logo.asset._ref);
                } else {
                  url = "na";
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
                } else if (!item.logo && item.mainImage?.asset?._ref) {
                  url = urlFor(item.mainImage.asset._ref);
                } else if (item.logo?.asset?._ref) {
                  url = urlFor(item.logo.asset._ref);
                } else {
                  url = "na";
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
      {renderType === "generic" && false ? (
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
