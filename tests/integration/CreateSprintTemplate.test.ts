import { afterAll, beforeAll, describe, it } from "vitest";
import { expect } from "chai";
import puppeteer, { BoundingBox, ElementHandle } from "puppeteer";
import type { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { installMouseHelper } from "./install-mouse-helper.js";
import { xPathToFindAnyElementWithExactText, xPathToFindAnyElementWithText, xPathToFindSvgWithTitle } from "./xpath-helper.js";

dotenv.config();
const username = process.env.TEST_FIXTURE_USERNAME;
const password = process.env.TEST_FIXTURE_PASSWORD;

const RUN_TESTS_IN_HEADLESS_MODE = true; // Change to 'false' in order to run tests in headful mode so you can see whats going on

const SLOW_MO_RATE = 100; // <-------- use this if you want to slow down the tests so you can see what is happening, 50 minimum to make it work properly or its too fast.

const WINDOW_WIDTH = 1400; // In headed mode you need the window size to have a width of at least 1400px or the drag test will fail as there isnt enough window space to drag the box to the correct location
const WINDOW_HEIGHT = 1022;
const LOGGING_ENABLED = false // Change to true if you'd like to see console.logs for debugging purposes

const navigateToSprintTemplatePage = async (page: Page, ) => {
    await page.waitForSelector(`[id="The Arena"]`, { visible: true });
    await page.click(`[id="The Arena"]`);
    LOGGING_ENABLED && console.log("clicking carrot");
    await page.waitForSelector(`[id="Sprint Template"]`);
    await page.click(`[id="Sprint Template"]`);
    LOGGING_ENABLED && console.log("clicking sprint template");
}

const createTemplate = async (page: Page, templateName: string) => {
  await page.waitForSelector("#template-name");
  await page.type("#template-name", templateName);

  // Drag and drop
  const origin1 = await page.waitForSelector(
    `[id="Talk to Customers"]`
  ) as ElementHandle<Element>;

  const morning = await page.waitForSelector(
    "#Morning"
  ) as ElementHandle<Element>;

  const workDay = await page.waitForSelector(
    "#Workday"
  ) as ElementHandle<Element>;

  const evening = await page.waitForSelector(
    "#Evening"
  ) as ElementHandle<Element>;

  // get bounding boxes
  let optionsColumnItem1BoundingBox =
    (await origin1.boundingBox()) as BoundingBox;
  let morningColumnBoundingBox = await morning.boundingBox() as BoundingBox;
  let workDayColumnBoundingBox = await workDay.boundingBox() as BoundingBox;
  let eveningColumnBoundingBox = await evening.boundingBox() as BoundingBox;

  if (optionsColumnItem1BoundingBox == null) {
    await page.screenshot({ path: "/tests/debug-null-object.png" });
  }
  // first box
  LOGGING_ENABLED && console.log(
    `Dragging from ${
      optionsColumnItem1BoundingBox.x +
    optionsColumnItem1BoundingBox.width / 2
    }, ${
      optionsColumnItem1BoundingBox.y +
    optionsColumnItem1BoundingBox.height / 2
    }`
  );
  await page.mouse.move(
    optionsColumnItem1BoundingBox.x + optionsColumnItem1BoundingBox.width / 2,
    optionsColumnItem1BoundingBox.y + optionsColumnItem1BoundingBox.height / 2
  );
  await page.mouse.down();
  LOGGING_ENABLED && console.log(
    `Dropping at   ${
      morningColumnBoundingBox.x + morningColumnBoundingBox.width / 2
    }, ${morningColumnBoundingBox.y + morningColumnBoundingBox.height / 2}`
  );
  await page.mouse.move(
    morningColumnBoundingBox.x + morningColumnBoundingBox.width / 2,
    morningColumnBoundingBox.y + morningColumnBoundingBox.height / 2,
    {
      steps: 3,
    }
  );
  await page.mouse.up();

  // second box
  LOGGING_ENABLED && console.log(
    `Dragging from ${
      optionsColumnItem1BoundingBox.x +
    optionsColumnItem1BoundingBox.width / 2
    }, ${
      optionsColumnItem1BoundingBox.y +
    optionsColumnItem1BoundingBox.height / 2
    }`
  );
  await page.mouse.move(
    optionsColumnItem1BoundingBox.x + optionsColumnItem1BoundingBox.width / 2,
    optionsColumnItem1BoundingBox.y +
    optionsColumnItem1BoundingBox.height / 2,
    {
      steps: 5,
    }
  );
  await page.mouse.down();
  LOGGING_ENABLED && console.log(
    `Dropping at   ${
      workDayColumnBoundingBox.x + workDayColumnBoundingBox.width / 2
    }, ${workDayColumnBoundingBox.y + workDayColumnBoundingBox.height / 2}`
  );
  await page.mouse.move(
    workDayColumnBoundingBox.x + workDayColumnBoundingBox.width / 2,
    workDayColumnBoundingBox.y + workDayColumnBoundingBox.height / 2,
    {
      steps: 6,
    }
  );
  await page.mouse.up();

  // third box

  LOGGING_ENABLED && console.log(
    `Dragging from ${
      optionsColumnItem1BoundingBox.x +
    optionsColumnItem1BoundingBox.width / 2
    }, ${
      optionsColumnItem1BoundingBox.y +
    optionsColumnItem1BoundingBox.height / 2
    }`
  );

  await page.mouse.move(
    optionsColumnItem1BoundingBox.x + optionsColumnItem1BoundingBox.width / 2,
    optionsColumnItem1BoundingBox.y +
    optionsColumnItem1BoundingBox.height / 2,
    {
      steps: 10,
    }
  );
  await page.mouse.down();

  LOGGING_ENABLED && console.log(
    `Dropping at   ${
      eveningColumnBoundingBox.x + eveningColumnBoundingBox.width / 2
    }, ${eveningColumnBoundingBox.y + eveningColumnBoundingBox.height / 2}`
  );
  await page.mouse.move(
    eveningColumnBoundingBox.x + eveningColumnBoundingBox.width / 2,
    eveningColumnBoundingBox.y + eveningColumnBoundingBox.height / 2,
    {
      steps: 15,
    }
  );
  await page.mouse.up();

  await page.waitForSelector("#create-template-button");
  await page.click("#create-template-button");
  LOGGING_ENABLED && console.log("clicking create template button");
}

const scrollToManageTemplatesSection = async (page: Page) => {
  await page.evaluate(() => {
    document.getElementById("manage-templates-heading")?.scrollIntoView();
  })
}

const scrollToTemplateFormSection = async (page: Page) => {
  await page.evaluate(() => {
    document.getElementById("create-template-heading")?.scrollIntoView();
  })
}

const activateTemplateEditMode = async (page: Page) => {
  try {
    const [editTemplateButton] = await page.$x(xPathToFindSvgWithTitle("edit template")) as ElementHandle<Element>[];
    await editTemplateButton.click();
  } catch (e) {
    console.log(e);
  }
}

const updateTemplateName = async (page: Page, newName: string) => {
  let title;
  try {
    await scrollToTemplateFormSection(page);
    title = await page.evaluate(() => (document.getElementById("template-name") as HTMLInputElement).value);
    await page.type("#template-name", newName);
    await page.waitForXPath(xPathToFindAnyElementWithText("Update Template"));
    const [updateTemplateButton] = await page.$x(xPathToFindAnyElementWithText("Update Template")) as ElementHandle<Element>[];
    await updateTemplateButton?.click();
  } catch (e) {
    console.log(e);
  }
  return title;
}

const deleteAllSprintTemplates = async (page: Page) => {
  const deleteButtons = await page.$x(xPathToFindSvgWithTitle("delete template")) as ElementHandle<Element>[];
  deleteButtons.forEach(async (button) => await button.click()) // skipcq: JS-0336
}

const waitForToastMessage = async (page: Page) => {
  const toastDiv = await page.waitForSelector("#toast-message");
  return toastDiv;
}

describe("CreateSprintTemplate Page:", () => {
  let browser: Browser;
  let page: Page;
  let randomTemplateName = nanoid(10);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: RUN_TESTS_IN_HEADLESS_MODE,

      slowMo: SLOW_MO_RATE,
      defaultViewport: null,
      args: [`--window-size=${WINDOW_WIDTH},${WINDOW_HEIGHT}`],
    });
    page = await browser.newPage();
    await installMouseHelper(page); // This is a helper function that allows you to see what the mouse is actually doing on the screen in headed mode.

    scrollToManageTemplatesSection.bind(page);

    // Login script
    await page.goto(`http://localhost:5173/login`, {
      timeout: 90_000,
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("#email");
    await page.type("#email", username || "");
    await page.type("#password", password || "");
    await page.click("[type='submit']");
    await page.waitForSelector(".sticky-logout", { timeout: 90_000 });
  });

  afterAll(async () => {
    // end of sprint template tests and the start of the logout sequence
    await page.click(".sticky-logout");

    await page.waitForSelector("#email");
    const sprintTemplateLogoutScreen = await page.$("#email");
    if (typeof sprintTemplateLogoutScreen === "undefined") {
      await page.screenshot({ path: "createSprintTemplate-logout-failure.png" });
    }
    expect(typeof sprintTemplateLogoutScreen === "undefined").to.equal(false);
    await browser.close();
  });

  it("should allow a user to create a sprint template", async () => {
    console.log("Beginning sprint template test: CREATE");
    // Setup
    await navigateToSprintTemplatePage(page);
    await createTemplate(page, randomTemplateName);

    // Subject under test
    const toastSuccessMessage = await waitForToastMessage(page);

    // Conditions
    expect(typeof toastSuccessMessage === "undefined").to.equal(false);
    console.log("Completed sprint template test: CREATE")
  }, 90_000);

  // TODO: Split this into two tests. Current running into an unexpected race condition when they are separated that needs to be debugged.
  it("should allow a user to edit & delete sprint templates", async () => {
    console.log("Beginning sprint template test: EDIT");

    // Setup
    const newTemplateName = `${randomTemplateName}a`;
    const updatedTemplateName = `${nanoid(10)}`;
    await navigateToSprintTemplatePage(page);
    await createTemplate(page, newTemplateName);

    await navigateToSprintTemplatePage(page);
    await scrollToManageTemplatesSection(page);
    await activateTemplateEditMode(page);
    const originalTemplateName = await updateTemplateName(page, updatedTemplateName);
    
    await scrollToManageTemplatesSection(page);
    LOGGING_ENABLED && console.log(originalTemplateName)

    // Subject under test
    const toastSuccessMessage = await waitForToastMessage(page);
    const updatedTemplateCard = await page.$x(xPathToFindAnyElementWithText(`${originalTemplateName}${updatedTemplateName}`));
    const oldTemplateCard = await page.$x(xPathToFindAnyElementWithExactText(`${originalTemplateName}`));

    // Conditions
    expect(typeof toastSuccessMessage === "undefined").to.equal(false);
    const cardsCollectionIsExpectedLength = updatedTemplateCard.length === 1 || updatedTemplateCard.length === 2;
    expect(cardsCollectionIsExpectedLength).to.equal(true);
    expect(oldTemplateCard.length).to.equal(0);

    // Cleanup
    await page.click("#toast-message");
    console.log("Completed sprint template test: EDIT");
    
    
    console.log("Beginning sprint template test: DELETE");
    // Setup
    await navigateToSprintTemplatePage(page);
    await scrollToManageTemplatesSection(page);
    await deleteAllSprintTemplates(page);

    // Subject under test
    const manageTemplates = await page.evaluate("document.getElementById('manage-templates-heading').scrollIntoView()");

    // Conditions
    const isManageTemplatesUndefined = manageTemplates === undefined;
    expect(isManageTemplatesUndefined).to.equal(true);
    LOGGING_ENABLED && console.log("verifying manage templates section is no longer displayed");
    console.log("Completed sprint template test: DELETE");
  }, 90_000);
});
