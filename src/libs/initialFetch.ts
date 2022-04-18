import API from "@aws-amplify/api/";
import sortby from "lodash.sortby";
import sanity from "./sanity";
import { errorToast } from "./toasts";

export const fetchUser = async (username) => {
  let user = {};
  try {
    user = await API.get("pareto", `/users/${username}`, {});
  } catch (e) {
    console.error(e);
  }
  return user;
};

export const fetchStarterKitSanity = async () => {
  let result = {
    success: false,
    sanityTraining: null,
    sanityProduct: null,
    sanityInterview: null,
  };
  try {
    let storedTrainingSanity = localStorage.getItem("trainingSanity");
    let storedProductSanity = localStorage.getItem("productSanity");
    let storedInterviewSanity = localStorage.getItem("interviewSanity");

    if (storedTrainingSanity === null) {
      const [trainingData, interviewData, productData] = await Promise.all([
        sanity.fetch(`*[_type == 'apprenticeExperienceSchema']`),
        sanity.fetch(`*[_type == 'interviewSchema']`),
        sanity.fetch(`*[_type == 'productExperienceSchema']`),
      ]);

      let sortedTraining = sortby(trainingData, "priority");
      let sortedInterview = sortby(interviewData, "priority");
      let sortedProduct = sortby(productData, "priority");

      result.success = true;
      result.sanityTraining = sortedTraining;
      result.sanityInterview = sortedInterview;
      result.sanityProduct = sortedProduct;

      localStorage.setItem("trainingSanity", JSON.stringify(sortedTraining));
      localStorage.setItem("productSanity", JSON.stringify(sortedProduct));
      localStorage.setItem("interviewSanity", JSON.stringify(sortedInterview));
    } else {
      result.success = true;
      result.sanityTraining = JSON.parse(storedTrainingSanity);
      result.sanityInterview = JSON.parse(storedInterviewSanity || "");
      result.sanityProduct = JSON.parse(storedProductSanity || "");
    }
  } catch (e) {
    console.log("Error fetching Sanity Experience: ", e);
  }
  return result;
};

export const fetchStarterKitExperience = async (id) => {
  const result = {
    success: false,
    training: null,
    product: null,
    interviewing: null,
    experiences: null,
  };
  try {
    let experiences = await API.get("pareto", `/experience/user/${id}`, {});
    let product;
    let apprenticeship;
    let interviewing;

    await experiences.forEach((exp) => {
      if (exp.type === "Product") {
        product = exp;
      } else if (exp.type === "Apprenticeship") {
        apprenticeship = exp;
      } else if (exp.type === "Interviewing") {
        interviewing = exp;
      }
    });
    result.success = true;
    result.training = apprenticeship;
    result.product = product;
    result.interviewing = interviewing;
    result.experiences = experiences;
  } catch (e) {
    console.log("Error fetching experience: ", e);
  }
  return result;
};

export const fetchCoachingRoster = async (id) => {
  const result = { success: false, athletes: null };
  try {
    let athletes = await API.get("pareto", `/relationship/mentor/${id}`, {});
    result.success = true;
    result.athletes = athletes;
  } catch (e) {
    console.log("Error fetching athletes");
  }
  return result;
};

export const fetchCoaches = async (id) => {
  let result = { success: false, coaches: null };
  try {
    let existingCoaches = localStorage.getItem("coaches");
    if (existingCoaches === null) {
      let coaches = await API.get("pareto", `/relationship/mentee/${id}`, {});
      result.success = true;
      result.coaches = coaches;
      localStorage.setItem("coaches", JSON.stringify(coaches));
    } else {
      // check for empty arrays
      result.success = true;
      result.coaches = JSON.parse(existingCoaches);
    }
  } catch (e) {
    console.log("Error fetching athletes");
  }
  return result;
};

export const fetchSanitySchemas = async () => {
  let result = {
    success: false,
    sanitySchemas: {
      technicalSchemas: null,
      economicSchemas: null,
      hubSchemas: null,
    },
  };
  try {
    let existingSanityData = localStorage.getItem("sanity");
    let technicalSchemas;
    let economicSchemas;
    let hubSchemas;
    if (existingSanityData === null) {
      const query = `*[_type == 'project']`;
      const query1 = `*[_type == 'economic']`;
      const query2 = `*[_type == 'hubs' && !(_id in path("drafts.**"))]`;
      const [technicalSchemas, economicSchemas, hubSchemas] = await Promise.all(
        [sanity.fetch(query), sanity.fetch(query1), sanity.fetch(query2)]
      );
      localStorage.setItem(
        "sanity",
        JSON.stringify({ technicalSchemas, economicSchemas, hubSchemas })
      );
    } else {
      const data = JSON.parse(existingSanityData);
      technicalSchemas = data.technicalSchemas;
      economicSchemas = data.economicSchemas;
      hubSchemas = data.hubSchemas;
    }
    result.success = true;
    result.sanitySchemas = { technicalSchemas, economicSchemas, hubSchemas };
  } catch (e) {
    errorToast(e);
  }
  return result;
};
