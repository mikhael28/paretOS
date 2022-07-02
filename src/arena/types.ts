/* This file contains all interface common among arena components. */
import { Dispatch, SetStateAction } from "react";

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
  proof: any[];
  questions: any[];
  esSummary: string;
  type: string;
  xp: number;
  esTitle: string;
  esDescription: string;
  proofLink?: string;
}

export interface EnMission extends Omit<Mission, "esTitle" | "esDescription"> {
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
  emptyMisionsMessage: string;
  lengua: string;
  missionBtnText: string;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  setActiveMission: Dispatch<
    SetStateAction<any>
  >;
  setView?: Dispatch<SetStateAction<string>>;
  setShowProofModal: Dispatch<SetStateAction<boolean>>;
}

export interface ActivePersonMissionsOnDay {
  dailyCompletion: number;
  dailyScore: number;
  missions: GenMission[];
}