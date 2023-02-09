/**
 * @jest-environment jsdom
 */

import { render, screen, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";

import Mission from "../../arena/Missions/Mission";



describe("MISSION", () => {
  const enTitle = 'title in english';
  const enDescription = 'description in english';
  const esTitle = 'title in spanish';
  const esDescription = 'description in spanish';
  
  const mission = {
    _createdAt: '2023-01-01',
    _id: 'missionId',
    _rev: 'rev',
    _type: '_missionType',
    _updatedAt: '2023-01-02',
    completed: false,
    completedAt: -1,
    confirmed: false,
    img: 'img.png',
    key: 's3Key',
    proof: [],
    questions: [],
    summary: 'summary of mission',
    type: 'missionType',
    xp: 100,
    title: enTitle,
    description: enDescription,
    esSummary: 'spanish language summary of mission',
    esDescription: esDescription,
    esTitle: esTitle
  }

  const mockSetActiveIndex = vi.fn();
  const mockSetActiveMission = vi.fn();
  const mockSetShowProofModal = vi.fn();
  const mockSetView = vi.fn();
  
  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it("renders successfully in english", () => {
    render(
      <Mission
        lengua={'en'}
        mission={mission}
        missionBtnText={'buttonText'}
        setActiveIndex={mockSetActiveIndex}
        setActiveMission={mockSetActiveMission}
        setShowProofModal={mockSetShowProofModal}
        setView={mockSetView}
        id={12345}
      />
    );

    const componentButton = screen.getByText('buttonText');
    const componentTitle = screen.getByText(enTitle);
    const componentDescription = screen.getByText(enDescription);

    expect(componentButton).toBeDefined();
    expect(componentTitle).toBeDefined();
    expect(componentDescription).toBeDefined();
    expect(screen.getByRole('heading').innerHTML).toEqual(enTitle);
    expect(screen.getByRole('listitem').innerHTML).toContain(enDescription)
  });


  it("renders successfully in Spanish", () => {
    render(
      <Mission
        lengua={'es'}
        mission={mission}
        missionBtnText={'buttonText'}
        setActiveIndex={mockSetActiveIndex}
        setActiveMission={mockSetActiveMission}
        setShowProofModal={mockSetShowProofModal}
        setView={mockSetView}
        id={12345}
      />
    );

    const componentButton = screen.getByText('buttonText');
    const componentEsTitle = screen.getByText(esTitle);
    const componentEsDescription = screen.getByText(esDescription);

    expect(componentButton).toBeDefined();
    expect(componentEsTitle).toBeDefined();
    expect(componentEsDescription).toBeDefined();
    expect(screen.getByRole('heading').innerHTML).toEqual(esTitle);
    expect(screen.getByRole('listitem').innerHTML).toContain(esDescription);
  });

  // TODO: Add test that clicking the button successfully calls the intended onclick handlers
});
