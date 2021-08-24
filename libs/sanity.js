import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: process.env.REACT_APP_SANITY_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
});
