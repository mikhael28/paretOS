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
  notes?: Array<any>;

  // deprecate/verify achievements
  achievements: Array<any>;

  mentor: string;
  country: string;
  bio: string;
  summary: string;
  city: string;

  admin: boolean;

  xp: number;

  learningPurchase: boolean;

  cp: number;

  createdAt: string;
  __v: number;
}
