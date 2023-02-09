/* This file contains all interface common among arena components. */
import { Dispatch, SetStateAction } from "react";
import { User } from "./ProfileTypes"

export type ActiveMission = {
  title: string;
  description: string;
  proofLink: string;
};


export interface ActivePersonMissionsOnDay {
  dailyCompletion: number;
  dailyScore: number;
  missions: GenMission[];
}

export interface Mission {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  completed: boolean;
  completedAt: number;
  confirmed: boolean;
  img: string;
  key: string;
  proof: string[];
  questions: string[];
  esSummary: string;
  type: string;
  xp: number;
  esTitle: string;
  esDescription: string;
  proofLink?: string;
}

export interface EnMission extends Omit<Mission, "esTitle" | "esDescription" | "esSummary"> {
  title: string;
  description: string;
  summary: string
}

export type GenMission = Mission | EnMission;

export type FullMission = Mission & EnMission;

// TODO: Pick a more descriptive name for this interface - there are several differen/conflicting types involving collections of missions
export interface Missions {
  headClassName?: string;
  headText: string;
  // missions: (Mission | EnMission)[];
  missions: ([GenMission, number])[];
  emptyMissionsMessage: string;
  lengua: string;
  missionBtnText: string;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  setActiveMission: Dispatch<
    SetStateAction<number>
  >;
  setView?: Dispatch<SetStateAction<string>>;
  setShowProofModal: Dispatch<SetStateAction<boolean>>;
}

export type PlanningField = {
  name: string;
  code: string;
  content: string;
};

export type ReviewField = {
  name: string;
  code: string;
  content: string;
};

export interface Sprint {
  id: string;
  athleteId: string;
  coachId: string;
  startDate: Date;
  endDate: Date;
  started: boolean;
  events: Array<object>;
  type: string;
  verified: boolean;
  teams: Array<User>;
  stake: {
    title: string;
    value: string;
    conditions: Array<object>;
  };
  createdAt: Date;
  updatedAt: Date;
}
