// import { RestAPI } from "@aws-amplify/api-rest";
import sortby from "lodash.sortby";
// import sanity from "../../libs/sanity";
import { mockService } from "../../services/mockDataService";

interface ExperienceResult {
  success: boolean;
  sanityTraining?: object | null;
  sanityProduct?: object | null;
  sanityInterview?: object | null;
  training?: object | null;
  product?: object | null;
  interviewing?: object | null;
  experiences?: object | null;
}

export const fetchUser = async (username: string) => {
  // Use mock service instead of API
  return mockService.api.getUser(username);
};

export const fetchStarterKitSanity = async () => {
  // Return mock Sanity data
  return {
    success: true,
    sanityTraining: mockService.data.sanityTraining,
    sanityProduct: mockService.data.sanityProduct,
    sanityInterview: mockService.data.sanityInterview,
  };
};

export const fetchStarterKitExperience = async (id: number | string) => {
  const experiences = await mockService.api.getExperiences(id.toString());
  const product = experiences.find((e: any) => e.type === "Product");
  const training = experiences.find((e: any) => e.type === "Apprenticeship");
  const interviewing = experiences.find((e: any) => e.type === "Interviewing");
  
  return {
    success: true,
    training: training || null,
    product: product || null,
    interviewing: interviewing || null,
    experiences: experiences,
  };
};

export const fetchCoachingRoster = async (id: string) => {
  const athletes = await mockService.api.getAthletes(id);
  return {
    success: true,
    athletes: athletes,
  };
};

export const fetchCoaches = async (id: string) => {
  const coaches = await mockService.api.getCoaches(id);
  return {
    success: true,
    coaches: coaches,
  };
};

export const fetchSanitySchemas = async () => {
  return {
    success: true,
    sanitySchemas: mockService.data.sanitySchemas,
  };
};
