export type ActiveExperience = {
  title: string;
  esTitle?: string;
  amount: number;
  overview: [];
  esOverview?: string;
  completed: boolean;
  priority: string;
  _type: string;
  github: string;
  athleteNotes: string;
};

export type MongoExperience = {
  [index: string] : any;
  achievements: number;
  approved: boolean;
  description: string;
  id: string;
  memberId: string;
  title: string;
  type: string;
  xp: number;
  xpEarned: number;
  _id: string;
  __v: number;
};