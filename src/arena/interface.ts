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
  proof: [];
  questions: [];
  summary: string;
  type: string;
  xp: number;
  esTitle: string;
  esDescription: string;
}

export interface EnMission extends Omit<Mission, "esTitle" | "esDescription"> {
  title: string;
  description: string;
}

export type GenMission = Mission | EnMission;

export interface Missions {
  headClassName?: string;
  headText: string;
  // missions: (Mission | EnMission)[];
  missions: GenMission[];
  emptyMisionsMessage: string;
  lengua: string;
  missionBtnText: string;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  setActiveMission: Dispatch<
    SetStateAction<{
      title: string;
      description: string;
    }>
  >;
  setView?: Dispatch<SetStateAction<string>>;
  setShowProofModal: Dispatch<SetStateAction<boolean>>;
}
