/* eslint-disable react/self-closing-comp */
import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Dialog } from "@mui/material";
import "ninja-keys";
import sanity from "../libs/sanity";
import ExternalSiteModal from "../context/ExternalSiteModal";

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

function Sandbox(props) {
  const ninjaKeys = useRef<any>(null);

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
        props.history.push(route.path);
      },
    }));
    fetchSanityItems().then((knowledge) => {
      links = [...routeHotkeys.flat(), ...knowledge.flat()];
      console.log(links);
      localStorage.setItem(
        "contextLinks",
        JSON.stringify([...routeHotkeys.flat(), ...knowledge.flat()])
      );
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
    const links = await sanity.fetch(query);
    let searchableLinks: SearchableLink[] = [];
    links.forEach((link: any) => {
      if (link.type) {
        searchableLinks.push({
          id: link.title,
          title: link.title,
          url: link.url,
          handler: () => {
            console.log(link.url);
            openExternalModal(link.url);
          },
        });
      }
    });
    return searchableLinks;
  }

  return (
    <div>
      <h2>Hit "Cmd+K" or "Ctrl+K"</h2>
      <h3>Actions logged to console in demo</h3>
      {/* @ts-ignore */}
      <ninja-keys ref={ninjaKeys}></ninja-keys>
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
            if (win !== null) {
              win.focus();
            }
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
    </div>
  );
}
export default Sandbox;
