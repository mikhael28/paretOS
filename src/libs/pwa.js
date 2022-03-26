/* eslint-disable no-unused-vars */

// These

// This event handler can go in `App.js`, to listen for online/offline - then to reload and refresh the state.
window.addEventListener("online", () => {
  window.location.reload();
});

// the online event isn't always accurate, so have a backup request too
async function checkNetworkAndReload() {
  try {
    const response = await fetch(".");
    if (response.status >= 200 && response.status < 500) {
      window.location.reload();
      return;
    }
  } catch (e) {
    // do nothing, still offline
  }
  window.setTimeout(checkNetworkAndReload, 2500);
}

//  service worker below, cache the offline page.
//  full code here: https://web.dev/offline-fallback-page/
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") {
    return;
  }
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })()
  );
});

// add shortcuts to your PWA, you can simply add them into the app manifest file, with a name, url and any icons

// localize your web app manifest, by creating a separate manifest file for each langauge. paretOS.en.webmanifest or paretOS.fr.webmanifest
// if you are rendering from the server, you can have the http request to the host, to have the appropriate file. Not as great for client side rendering. Or, you can have a language picker in your app, and then set a cookie based on the interaction, to send off to your server.

// measure the effectiveness of your install rates. First, measure how often people install - period. A button in the header? Inline with content? Or a button shown at the end of a critical user journey?

let deferredPrompt;
let installSource;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  //   showInstallPromo();
  //   mock google analytics event below to show pwa-install
  //   ga("send", "event", {
  //     eventCategory: "pwa-install",
  //     eventAction: "promo-shown",
  //     nonInteraction: true,
  //   });
});

window.addEventListener("appInstalled", () => {
  // clear the prompts, or whatever else you need to do. Send analytics prompt
});
