/* eslint-disable react/self-closing-comp */
import { useRef, useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";
import "ninja-keys";
import sanity from "../libs/sanity";
import ExternalSiteModal from "../context/ExternalSiteModal";
import { useHistory } from "react-router-dom"
/**
 * A simple, redux connected Sandbox for you play around with. Don't send a PR to update this file, it is perfect the way it is. Unless, you think we can improve it from a staging perspective - in that case, send it in.
 */

const routes = [
  {
    path: "/context-builder",
    name: "GOTO Library",
  },
  {
    path: "/arena",
    name: "GOTO Library",
  },
  {
    path: "/arena/create/sprints",
    name: "GOTO Start a Sprint",
  },
  {
    path: "/arena/create/template",
    name: "GOTO Create Sprint Template",
  },
  {
    path: "/training",
    name: "GOTO Learning Dashboard",
  },
  {
    path: "/sandbox",
    name: "GOTO Sandbox",
  },
  {
    path: "/mentorship",
    name: "GOTO Mentorship Dashboard",
  },
];

function CommandPalette(props: any) {
  const ninjaKeys = useRef<any>(null);
  const history = useHistory()

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

  useEffect(() => {
    let links: any = [];
    let routeHotkeys = routes.map((route) => ({
      id: route.name,
      title: route.name,
      handler: () => {
        history.push(route.path);
      },
    }));
    fetchSanityItems().then((knowledge: any) => {
      links = [...routeHotkeys.flat(), ...knowledge.flat()];
      console.log(links);
      if (ninjaKeys.current) {
        ninjaKeys.current.data = links;
      }
    });
  }, []);

  interface SearchableLink {
    id: string;
    title: string;
    handler: Function;
    url?: string;
  }

  async function fetchSanityItems() {
    const query = `*[]`;
    let data = [];
    let links = localStorage.getItem("links");
    if (links === null) {
      data = (await sanity.fetch(query)) ?? [];
    } else {
      data = JSON.parse(links);
    }
    let searchableLinks: SearchableLink[] = [];
    data.forEach((link: any) => {
      if (link.type) {
        searchableLinks.push({
          id: link.title,
          title: link.title,
          url: link.url,
          handler: () => {
            openExternalModal(link.url);
          },
        });
      }
    });
    return searchableLinks;
  }

  return (
    <div>
      {/* @ts-ignore */}
      <ninja-keys ref={ninjaKeys}></ninja-keys>
      <Dialog
        style={{
          margin: "auto",
          padding: 12,
        }}
        open={externalModal.display}
        onClose={closeExternalModal}
        // TransitionComponent={Transition}
        keepMounted
        hideBackdrop={false}
      >
        <ExternalSiteModal url={externalModal.url} />
        <div className="flex-evenly">
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
              if (win !== null) {
                win.focus();
              }
            }}
          >
            Open New Tab
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
            Close Modal
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
export default CommandPalette;
