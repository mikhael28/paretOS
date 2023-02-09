/**
 * @jest-environment jsdom
 */

import { screen, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";

import ContextBuilder from "../../context/ContextBuilder";
import { renderWithRouter } from "../testUtilities";
import { useNavigate } from "react-router-dom";
import { getSampleSanitySchemas } from "../testData";


describe("CONTEXT BUILDER", () => {
  const mockNavigate = vi.fn().mockImplementation(useNavigate);
  mockNavigate.mockReturnValue(vi.fn());

  const sampleSanitySchemas = {
    technicalSchemas: getSampleSanitySchemas(5),
    economicSchemas: getSampleSanitySchemas(4),
    hubSchemas: getSampleSanitySchemas(3)
  }

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it("renders successfully", () => {
    renderWithRouter(
      <ContextBuilder navigate={mockNavigate} sanitySchemas={sampleSanitySchemas}/>
    );

    const heading = screen.getByText("library");
    const tab1 = screen.getByText("fullStackDev");
    const tab2 = screen.getByText("findingWork");
    const tab3 = screen.getByText("cityByCity");
    
    expect(heading).toBeDefined();
    expect(tab1).toBeDefined();
    expect(tab2).toBeDefined();
    expect(tab3).toBeDefined();
  });

  it("renders the technical schemas by default and displays the expected number of cards", () => {
    renderWithRouter(
      <ContextBuilder navigate={mockNavigate} sanitySchemas={sampleSanitySchemas}/>
    );

    const visibleTabPanel = screen.getByRole("tabpanel");
    const contextCards = visibleTabPanel.children[0].children[0].children;
    
    expect(visibleTabPanel).toBeDefined();
    expect(contextCards.length).toEqual(5);
  });


  // TODO: Add tests related to behavior when tabs are clicked
});
