/**
 * @jest-environment jsdom
 */

import { render, screen, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";

import Missions from "../../arena/Missions/Index";
import { GenMission } from "../../types/ArenaTypes";

describe("MISSIONS", () => {
  const enTitle1 = "title1 in english";
  const enDescription1 = "description1 in english";
  const esTitle1 = "title1 in spanish";
  const esDescription1 = "description1 in spanish";
  const enTitle2 = "title2 in english";
  const enDescription2 = "description2 in english";
  const esTitle2 = "title2 in spanish";
  const esDescription2 = "description2 in spanish";

  const mission1: GenMission = {
        _createdAt: "2023-01-01",
        _id: "missionId1",
        _rev: "rev1",
        _type: "_missionType1",
        _updatedAt: "2023-01-02",
        completed: false,
        completedAt: -1,
        confirmed: false,
        img: "img1.png",
        key: "s3Key1",
        proof: [],
        questions: [],
        summary: "summary of mission1",
        type: "missionType1",
        xp: 100,
        title: enTitle1,
        description: enDescription1,
        esSummary: "spanish language summary of mission1",
        esDescription: esDescription1,
        esTitle: esTitle1,
  }
  
  const mission2: GenMission = {
    _createdAt: "2023-01-03",
    _id: "missionId2",
    _rev: "rev2",
    _type: "_missionType2",
    _updatedAt: "2023-01-04",
    completed: false,
    completedAt: -1,
    confirmed: false,
    img: "img2.png",
    key: "s3Key2",
    proof: [],
    questions: [],
    summary: "summary of mission2",
    type: "missionType2",
    xp: 200,
    title: enTitle2,
    description: enDescription2,
    esSummary: "spanish language summary of mission2",
    esDescription: esDescription2,
    esTitle: esTitle2,
  };
  const missionEntry1: ([GenMission, number]) = [mission1, 0]
  const missionEntry2: ([GenMission, number]) = [mission2, 1]
  const missions = [missionEntry1, missionEntry2];

  const emptyMissionsMessage = "no missions to display";

  const mockSetActiveIndex = vi.fn();
  const mockSetActiveMission = vi.fn();
  const mockSetShowProofModal = vi.fn();
  const mockSetView = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("renders successfully in english", () => {
    render(
      <Missions
        lengua={"en"}
        headText={"missionsheader"}
        missions={missions}
        missionBtnText={"buttonText"}
        setActiveIndex={mockSetActiveIndex}
        setActiveMission={mockSetActiveMission}
        setShowProofModal={mockSetShowProofModal}
        setView={mockSetView}
        emptyMissionsMessage={emptyMissionsMessage}
      />
    );

    const componentButton = screen.getAllByText("buttonText");
    const componentHeader = screen.getByText("missionsheader");
    const componentMission1 = screen.getByText(enTitle1);
    const componentMission2 = screen.getByText(enTitle2);
    const renderedMissionTitles = screen.getAllByRole('heading').map((node) => node.innerHTML);

    expect(componentButton).toHaveLength(2);
    expect(componentHeader).toBeDefined();
    expect(componentMission1).toBeDefined();
    expect(componentMission2).toBeDefined();
    
    expect(renderedMissionTitles.filter((h) => h === enTitle1)).toHaveLength(1);
    expect(renderedMissionTitles.filter((h) => h === enTitle2)).toHaveLength(1);
  });

  it("renders successfully in Spanish", () => {
    render(
      <Missions
        lengua={"es"}
        headText={"missionsheader"}
        missions={missions}
        missionBtnText={"buttonText"}
        setActiveIndex={mockSetActiveIndex}
        setActiveMission={mockSetActiveMission}
        setShowProofModal={mockSetShowProofModal}
        setView={mockSetView}
        emptyMissionsMessage={emptyMissionsMessage}
      />
    );

    const componentButton = screen.getAllByText("buttonText");
    const componentHeader = screen.getByText("missionsheader");
    const componentMission1 = screen.getByText(esTitle1);
    const componentMission2 = screen.getByText(esTitle2);
    const renderedMissionTitles = screen.getAllByRole('heading').map((node) => node.innerHTML);

    expect(componentButton).toHaveLength(2);
    expect(componentHeader).toBeDefined();
    expect(componentMission1).toBeDefined();
    expect(componentMission2).toBeDefined();
    
    expect(renderedMissionTitles.filter((h) => h === esTitle1)).toHaveLength(1);
    expect(renderedMissionTitles.filter((h) => h === esTitle2)).toHaveLength(1);
  });

  it("display empty missions message if no missions are provided in props", () => {
    render(
      <Missions
        lengua={"en"}
        headText={"missionsheader"}
        missions={[]}
        missionBtnText={"buttonText"}
        setActiveIndex={mockSetActiveIndex}
        setActiveMission={mockSetActiveMission}
        setShowProofModal={mockSetShowProofModal}
        setView={mockSetView}
        emptyMissionsMessage={emptyMissionsMessage}
      />
    );

    const componentContent = screen.getByText(emptyMissionsMessage);
    const renderedMissionTitles = screen.getAllByRole('heading').map((node) => node.innerHTML);

    expect(componentContent).toBeDefined();
    
    expect(renderedMissionTitles.filter((h) => h === esTitle1)).toHaveLength(0);
    expect(renderedMissionTitles.filter((h) => h === esTitle2)).toHaveLength(0);
    expect(renderedMissionTitles.filter((h) => h === enTitle1)).toHaveLength(0);
    expect(renderedMissionTitles.filter((h) => h === enTitle2)).toHaveLength(0);
  });

  // TODO: Add test that clicking the button successfully calls the intended onclick handlers
});
