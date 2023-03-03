/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

import CreateSprintTemplate from "../../arena/CreateSprintTemplate";
import { deleteSprintTemplate, getSprintTemplateOptionsFromSanity, getSprintTemplates, setSprintTemplate, updateSprintTemplate } from "../../utils/queries/sprintTemplateQueries";
import { useNavigate } from "react-router-dom";
import { getSampleTemplates } from "../testData";
import { User } from "../../types/ProfileTypes";



describe("CREATE SPRINT TEMPLATE", () => {
  const testUser = {
    fName: "Test",
    lName: "User",
    id: "98765",
  } as unknown as User;
  const mockGetTemplates = vi.fn().mockImplementation(getSprintTemplates);
  const mockSetTemplate = vi.fn().mockImplementation(setSprintTemplate);
  const mockGetTemplateOptions = vi.fn().mockImplementation(getSprintTemplateOptionsFromSanity);
  const mockUpdateTemplate = vi.fn().mockImplementation(updateSprintTemplate);
  const mockDeleteTemplate = vi.fn().mockImplementation(deleteSprintTemplate);
  const mockNavigate = vi.fn().mockImplementation(useNavigate);
  mockNavigate.mockReturnValue(vi.fn())

  describe("Initial view has sprint template creation components", () => {
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

      const sampleTemplates = getSampleTemplates(1, {
        firstNames: [testUser.fName],
        lastNames: [testUser.lName],
        ids: [testUser.id],
      });

      mockGetTemplates.mockResolvedValue(sampleTemplates)

      render(
          <CreateSprintTemplate
            user={testUser}
            navigate={mockNavigate}
            getTemplates={mockGetTemplates}
            setTemplate={mockSetTemplate}
            getTemplateOptionsFromSanity={mockGetTemplateOptions}
            deleteTemplate={mockDeleteTemplate}
            updateTemplate={mockUpdateTemplate}
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
      await waitFor(() => expect(screen.getByText("Talk to Customers")).toBeDefined());
      const optionsColumnItems = screen.getByText("Options").nextSibling?.childNodes[0].childNodes;
      expect(optionsColumnItems?.length).toEqual(1);
    });

    it("displays no options in the other columns", async () => {
      await waitFor(() => expect(screen.getByText("Talk to Customers")).toBeDefined());
      
      const morningColumnItems = screen.getByText("Morning").nextSibling?.childNodes[0].childNodes;
      const workdayColumnItems = screen.getByText("Workday").nextSibling?.childNodes[0].childNodes;
      const eveningColumnItems = screen.getByText("Evening").nextSibling?.childNodes[0].childNodes;

      expect(morningColumnItems?.length).toEqual(0);
      expect(workdayColumnItems?.length).toEqual(0);
      expect(eveningColumnItems?.length).toEqual(0);
    });
  
    it("displays manage templates section", async () => {
      await waitFor(() => expect(screen.getByText("manageTemplates")).toBeDefined());
      
      const manageTemplatesHeader = screen.getByText("manageTemplates");

      expect(manageTemplatesHeader).toBeDefined();
    });

    it("displays delete and edit buttons for user owned template card(s)", async () => {
      await waitFor(() => expect(screen.getByText("manageTemplates")).toBeDefined());
      
      const editButton = screen.getByTitle("edit template");
      const deleteButton = screen.getByTitle("delete template");

      expect(editButton).toBeDefined();
      expect(deleteButton).toBeDefined();
    });
  });

  describe("Initial view has manage template creation components for user with authored template", () => {
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

      const sampleTemplates = getSampleTemplates(1, {
        firstNames: [testUser.fName],
        lastNames: [testUser.lName],
        ids: [testUser.id],
      });

      mockGetTemplates.mockResolvedValue(sampleTemplates)

      render(
          <CreateSprintTemplate
            user={testUser}
            navigate={mockNavigate}
            getTemplates={mockGetTemplates}
            setTemplate={mockSetTemplate}
            getTemplateOptionsFromSanity={mockGetTemplateOptions}
            deleteTemplate={mockDeleteTemplate}
            updateTemplate={mockUpdateTemplate}
          />
      );
    });

    afterEach(() => {
      vi.restoreAllMocks()
      cleanup()
    })
  
    it("displays manage templates section", async () => {
      await waitFor(() => expect(screen.getByText("manageTemplates")).toBeDefined());
      
      const manageTemplatesHeader = screen.getByText("manageTemplates");

      expect(manageTemplatesHeader).toBeDefined();
    });

    it("displays delete and edit buttons for user owned template card(s)", async () => {
      await waitFor(() => expect(screen.getByText("manageTemplates")).toBeDefined());
      
      const editButton = screen.getByTitle("edit template");
      const deleteButton = screen.getByTitle("delete template");

      expect(editButton).toBeDefined();
      expect(deleteButton).toBeDefined();
    });
  });

  describe("Initial view with no manage template section for user with no authored template", () => {
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

      const sampleTemplates = getSampleTemplates(1);

      mockGetTemplates.mockResolvedValue(sampleTemplates)

      render(
          <CreateSprintTemplate
            user={testUser}
            navigate={mockNavigate}
            getTemplates={mockGetTemplates}
            setTemplate={mockSetTemplate}
            getTemplateOptionsFromSanity={mockGetTemplateOptions}
            deleteTemplate={mockDeleteTemplate}
            updateTemplate={mockUpdateTemplate}
          />
      );
    });

    afterEach(() => {
      vi.restoreAllMocks()
      cleanup()
    })

    it("displays no manage templates section", async () => {
      expect(await screen.queryByText("manageTemplates")).toBeNull();
    });

    it("displays no template card(s)", async () => {
      const templateCard = await screen.queryByText(
        "5 missions: 6 am club, No Alcohol, 3 Hours of Deep Work, Eat the Frog, Drink 1 Liter of Water"
      )
      expect(templateCard).toBeNull();
    });
  });

});
