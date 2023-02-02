/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

import CreateSprintTemplate from "../arena/CreateSprintTemplate";
import { getSprintTemplateOptionsFromSanity, getSprintTemplates, setSprintTemplate } from "../utils/queries/createSprintTemplateQueries";
import { useNavigate } from "react-router-dom";
import { getSampleTemplates } from "./testData";



describe("CREATE SPRINT TEMPLATE", () => {
  const testUser = {
    fName: "Test",
    lName: "User",
    id: 12345,
  };
  const mockGetTemplates = vi.fn().mockImplementation(getSprintTemplates);
  const mockSetTemplate = vi.fn().mockImplementation(setSprintTemplate);
  const mockGetTemplateOptions = vi.fn().mockImplementation(getSprintTemplateOptionsFromSanity);
  const mockNavigate = vi.fn().mockImplementation(useNavigate);

  describe("Initial view with sprint template creation components", () => {
    beforeEach(() => {
      mockGetTemplateOptions.mockResolvedValue({
        Options: {
          name: "Options",
          items:
            [{
              "_createdAt": "2021-02-16T16:58:02Z",
              "_id": "0dba2e60-9c03-429e-aae7-aa9f85429cef",
              "_rev": "JPiyOitNVV6JvzMfjLRBCv",
              "_type": "achievement",
              "_updatedAt": "2021-02-16T16:58:02Z",
              "summary": "The primary job of the entrepreneur is to get sales, or at the least feedback to determine whether people want what you have.",
              "title": "Talk to Customers",
              "type": "productivity",
              "xp": 100
            }]
        },
        Morning: {
          name: "Morning",
          items: []
        },
        Workday: {
          name: "Workday",
          items: []
        },
        Evening: {
          name: "Evening",
          items: []
        },
      })
      mockGetTemplates.mockResolvedValue([
        getSampleTemplates(1)
      ])

      render(
        <CreateSprintTemplate
          user={testUser}
          navigate={mockNavigate}
          getTemplates={mockGetTemplates}
          setTemplate={mockSetTemplate}
          getTemplateOptionsFromSanity={mockGetTemplateOptions}
        />
      );
    });

    afterEach(() => {
      vi.restoreAllMocks()
      cleanup()
    })

    it("displays a title, name form, columns for daily achievements, and a create sprint template button", () => {
      expect(screen.getByText("createTemplate")).toBeDefined();
      expect(screen.getByText("enterTemplateName")).toBeDefined();
      expect(screen.getByText("Options")).toBeDefined();
      expect(screen.getByText("Morning")).toBeDefined();
      expect(screen.getByText("Workday")).toBeDefined();
      expect(screen.getByText("Evening")).toBeDefined();
      expect(screen.getByText("create")).toBeDefined();
    });

    it("displays one option in the options column", async () => {
      await waitFor(() => expect(screen.getByText("productivity")).toBeDefined());
      const optionsColumnItems = screen.getByText("Options").nextSibling?.childNodes[0].childNodes;
      expect(optionsColumnItems?.length).toEqual(1);
    });

    it("displays no options in the other columns", async () => {
      await waitFor(() => expect(screen.getByText("productivity")).toBeDefined());
      
      const morningColumnItems = screen.getByText("Morning").nextSibling?.childNodes[0].childNodes;
      const workdayColumnItems = screen.getByText("Workday").nextSibling?.childNodes[0].childNodes;
      const eveningColumnItems = screen.getByText("Evening").nextSibling?.childNodes[0].childNodes;

      expect(morningColumnItems?.length).toEqual(0);
      expect(workdayColumnItems?.length).toEqual(0);
      expect(eveningColumnItems?.length).toEqual(0);
    });
  });
});
