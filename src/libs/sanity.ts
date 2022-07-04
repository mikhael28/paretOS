import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: import.meta.env.VITE_SANITY_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  useCdn: true,
  token: import.meta.env.VITE_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});
