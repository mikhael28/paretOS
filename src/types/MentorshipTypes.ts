import { User } from "./ProfileTypes";

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


export type Coach = {
  _id: string;
  mentor: {
    picture: string;
    fName: string;
    lName: string;
  }
}