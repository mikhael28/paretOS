import { afterAll, beforeAll, describe, it } from "vitest";
import { expect } from "chai";
import puppeteer, { BoundingBox, ElementHandle } from "puppeteer";
import type { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { installMouseHelper } from "./install-mouse-helper.js";

dotenv.config();
const username = process.env.TEST_FIXTURE_USERNAME;
const password = process.env.TEST_FIXTURE_PASSWORD;

const RUN_TESTS_IN_HEADLESS_MODE = true; // Change to 'false' in order to run tests in headful mode so you can see whats going on

const SLOW_MO_RATE = 50; // <-------- use this if you want to slow down the tests so you can see what is happening, 50 minimum to make it work properly or its too fast.

const randomTemplateName = nanoid(10);
const WINDOW_WIDTH = 1400; // In headed mode you need the window size to have a width of at least 1400px or the drag test will fail as there isnt enough window space to drag the box to the correct location

const WINDOW_HEIGHT = 1022;
describe("CreateSprintTemplate Page:", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: RUN_TESTS_IN_HEADLESS_MODE,

      slowMo: SLOW_MO_RATE,
      defaultViewport: null,
      args: [`--window-size=${WINDOW_WIDTH},${WINDOW_HEIGHT}`],
    });
    page = await browser.newPage();
    await installMouseHelper(page); // This is a helper function that allows you to see what the mouse is actually doing on the screen in headed mode.

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
    await browser.close();
  });

  it("should allow a user to create a sprint template", async () => {
    // Clicking into the arena
    await page.waitForSelector(`[id="The Arena"]`, { visible: true });
    await page.click(`[id="The Arena"]`);
    console.log("clicking carrot");
    await page.waitForSelector(`[id="Sprint Template"]`);
    await page.click(`[id="Sprint Template"]`);
    console.log("clicking sprint template");
    await page.waitForSelector("#template-name");
    await page.type("#template-name", randomTemplateName);

    // Drag and drop
    const origin1 = (await page.waitForSelector(
      `[id="Talk to Customers"]`
    )) as ElementHandle<Element>;

    const morning = (await page.waitForSelector(
      "#Morning"
    )) as ElementHandle<Element>;

    const workDay = (await page.waitForSelector(
      "#Workday"
    )) as ElementHandle<Element>;

    const evening = (await page.waitForSelector(
      "#Evening"
    )) as ElementHandle<Element>;

    // get bounding boxes
    let optionsColumnItem1BoundingBox =
      (await origin1.boundingBox()) as BoundingBox;
    let morningColumnBoundingBox = (await morning.boundingBox()) as BoundingBox;
    let workDayColumnBoundingBox = (await workDay.boundingBox()) as BoundingBox;
    let eveningColumnBoundingBox = (await evening.boundingBox()) as BoundingBox;

    // first box
    console.log(
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
    console.log(
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
    console.log(
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
    console.log(
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

    console.log(
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

    console.log(
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
    console.log("clicking create template button");
    
    await page.waitForSelector("#toast-message");
    await page.click("#toast-message");
    console.log("dismissing success toast message");

    // end of creating a sprint template and the start of the logout sequence
    await page.click(".sticky-logout");

    await page.waitForSelector("#email");
    const createSprintTemplate = await page.$("#email");
    if (typeof createSprintTemplate === "undefined") {
      await page.screenshot({ path: "createSprintTemplate-failure.png" });
    }
    expect(typeof createSprintTemplate === "undefined").to.equal(false);
  }, 90_000);
});
