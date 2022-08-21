import { PlanningField } from "./ArenaTypes";
import { ActivePersonMissionsOnDay } from "./ArenaTypes";

export interface Project {
  id: string;
  description: string;
  name: string;
  team: Array<any>;
  tools: Array<any>;
}

export interface User {
  rank?: number;
  score: number;
  _id: string;
  id: any;
}

export interface MinimalUser {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  github: string;
  id: any;
  score: number;
  percentage: string | number;
  planning: PlanningField[];
  review: ({
    code: string;
    content: string;
    name: string;
  })[];
  missions: ActivePersonMissionsOnDay[];
}
export interface User extends MinimalUser {
  rank?: number;
  _id: string;

  profileImg?: string;
  defaultLanguage?: string;
  instructor: boolean;
  apprenticeshipId?: string;
  productId?: string;
  masteryId: string;
  picture?: string;
  mentors?: Array<User>;
  projects?: Array<Project>;
  // Deprecate ideas?
  ideas?: Array<any>;
  notes?: Array<any>;

  // deprecate actions?
  actions: Array<any>;
  // deprecate/verify achievements
  achievements: Array<any>;

  mentor: string;
  country: string;
  bio: string;
  summary: string;
  city: string;

  // @TODO deprecate ranks? This was never used
  communityRank: string;
  technicalRank: string;

  // @TODO deprecate this? I'm not sure this is being used anywhere
  experience: string;

  // @TODO: integrate LinkedIn profile
  linkedIn: string;
  // @TODO deprecate stripe and paypall? We need to rethink how we handle payments/public-private keys in general
  stripe: string;
  paypal: string;

  admin: boolean;

  // @TODO deprecate Expo
  expo: string;
  xp: number;

  learningPurchase: boolean;

  // @TODO deprecate these three? It's meant to be 'lifetime' cp, but it's not used right now
  completionPercentage: number;
  completionAttempts: number;
  completions: number;

  // @TODO work through a more substantial WR integration
  wrMembers: boolean;
  wrid: string;

  createdAt: string;
  __v: number;
}
