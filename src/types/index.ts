export type color =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined;

export type buttonType = "button" | "reset" | "submit" | undefined;

export type buttonVariant = "text" | "contained" | "outlined" | undefined;

export type PlanningField = {
  name: string;
  code: string;
  content: string;
};

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
  fName: string;
  lName: string;
  email: string;
  github: string;
  missions: Array<Object>;
  percentage: number;
  phone: string;
  planning: Array<PlanningField>;
  review: string;
  profileImg?: File;
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
  notes: Array<any>;

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

export interface Relationship {
  mentee: User;
  mentor: User;
  tasks: Array<any>;
  resources: Array<any>;
  sprints: Array<any>;
  events: Array<any>;
  reminders: Array<any>;
  _id: string;
  id: string;
  coachId: string;
  athleteId: string;
  accepted: boolean;
  completed: boolean;
  createdAt: string;
  __v: number;
}

export interface Sprint {
  id: string;
  athleteId: string;
  coachId: string;
  startDate: Date;
  endDate: Date;
  started: boolean;
  events: Array<object>;
  studySessions: Array<object>;
  type: string;
  verified: boolean;
  teams: Array<User>;
  stake: {
    title: string;
    value: string;
    conditions: Array<any>;
  };
  createdAt: Date;
  updatedAt: Date;
}
