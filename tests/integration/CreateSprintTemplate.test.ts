import { afterAll, beforeAll, describe, it } from "vitest";
import { expect } from "chai";
import puppeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { installMouseHelper } from "./install-mouse-helper.js";

dotenv.config();
const username = process.env.TEST_FIXTURE_USERNAME;
const password = process.env.TEST_FIXTURE_PASSWORD;

const randomTemplateName = nanoid(10);
describe("Login Page:", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false, // <------------------------ This is the line that makes it so you can see whats going on

      slowMo: 50, // <-------- use this if you want to slow down the tests so you can see what is happening, 50 minimum to make it work in headless mode.
      defaultViewport: null,
      args: ["--window-size=1400,1022"], // In headed mode you need the window size to have a width of at least 1400px or the drag test will fail as there isnt enough window space to drag the box to the correct location
    });
    page = await browser.newPage();
    await installMouseHelper(page); // This is a helper function that allows you to see what the mouse is actually doing on the screen in headed mode.
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should allow a user to log in and log out", async () => {
    await page.goto(`http://localhost:5173/login`, {
      timeout: 90_000,
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("#email");
    await page.type("#email", username || "");
    await page.type("#password", password || "");
    await page.click("[type='submit']");
    await page.waitForSelector(".sticky-logout", { timeout: 90_000 });
    const logout = await page.$(".sticky-logout");
    if (typeof logout === "undefined") {
      await page.screenshot({ path: "login-failure.png" });
    }
    expect(typeof logout === "undefined").to.equal(false);
  }, 90_000);

  it("should allow a user to create a sprint template", async () => {
    await page.waitForSelector(`[id="The Arena"]`, { visible: true });
    await page.click(`[id="The Arena"]`);
    console.log("clicking carrot");
    await page.waitForSelector(`[id="Sprint Template"]`);
    await page.click(`[id="Sprint Template"]`);
    console.log("clicking sprint template");
    // |*************************************************START
    // This here is where it stops working in headless mode, if you use the page.goto method it will continue on, but for some reason it will not actually go to the page in headless mode without it.
    // await page.goto(`http://localhost:5173/arena/create/template`, {
    //   timeout: 90_000,
    //   waitUntil: "networkidle2",
    // });
    await page.waitForSelector("#template-name");
    // |*************************************************END
    await page.type("#template-name", randomTemplateName);
    const origin1 = await page.waitForSelector(`[id="Talk to Customers"]`);
    const origin2 = await page.waitForSelector(`[id="No Nicotine or Tobacco"]`);
    const origin3 = await page.waitForSelector(`[id="3 Hours of Deep Work"]`);
    const morning = await page.waitForSelector("#Morning");
    const workDay = await page.waitForSelector("#Workday");
    const evening = await page.waitForSelector("#Evening");
    let ob = await origin1?.boundingBox();
    // let ob2 = await origin2?.boundingBox(); // <-----start ||Currently not using this box as unless you make some sort of time out function it will fail as it will try to drag the box before it has moved to the correct location.
    // let ob3 = await origin3?.boundingBox(); // <--------end
    let mb = await morning?.boundingBox();
    let wb = await workDay?.boundingBox();
    let eb = await evening?.boundingBox();

    // first box
    console.log(
      `Dragging from ${ob.x + ob.width / 2}, ${ob.y + ob.height / 2}`
    );
    await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2);
    await page.mouse.down();
    console.log(
      `Dropping at   ${mb.x + mb.width / 2}, ${mb.y + mb.height / 2}`
    );
    await page.mouse.move(mb.x + mb.width / 2, mb.y + mb.height / 2, {
      steps: 3,
    });
    await page.mouse.up();

    // second box
    console.log(
      `Dragging from ${ob.x + ob.width / 2}, ${ob.y + ob.height / 2}`
    );
    await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2, {
      steps: 5,
    });
    await page.mouse.down();
    console.log(
      `Dropping at   ${wb.x + wb.width / 2}, ${wb.y + wb.height / 2}`
    );
    await page.mouse.move(wb.x + wb.width / 2, wb.y + wb.height / 2, {
      steps: 6,
    });
    await page.mouse.up();
    // third box

    console.log(
      `Dragging from ${ob.x + ob.width / 2}, ${ob.y + ob.height / 2}`
    );
    await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2, {
      steps: 10,
    });
    await page.mouse.down();

    console.log(
      `Dropping at   ${eb.x + eb.width / 2}, ${eb.y + eb.height / 2}`
    );
    await page.mouse.move(eb.x + eb.width / 2, eb.y + eb.height / 2, {
      steps: 15,
    });
    await page.mouse.up();
    await page.waitForSelector("#create-template-button");
    await page.click("#create-template-button");
    console.log("clicking create template button");
    await page.waitForSelector(`[alt="Arena tour icon"]`);
    await page.click(".sticky-logout");
    await page.waitForSelector("#animation-container");
    const createSprintTemplate = await page.$("#animation-container");
    if (typeof createSprintTemplate === "undefined") {
      await page.screenshot({ path: "createSprintTemplate-failure.png" });
    }
    expect(typeof createSprintTemplate === "undefined").to.equal(false);
  }, 90_000);
});
