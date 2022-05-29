import { describe, before, after } from "mocha";
import puppeteer, { Browser, Page } from "puppeteer";
import { expect } from "chai";
import dotenv from "dotenv";

dotenv.config();

const username = process.env.TEST_FIXTURE_USERNAME;
const password = process.env.TEST_FIXTURE_PASSWORD;
const url = "http://localhost:3000";
let browser: Browser;
let page: Page;

describe("Login Page:", () => {
  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`${url}/login`);
  });

  after(async () => {
    await browser.close();
  });

  it("should allow a user to log in and log out", async () => {
    await page.waitForSelector("#email");
    await page.type("#email", username || "");
    await page.type("#password", password || "");
    await page.click("[type='submit']");
    await page.waitForSelector(".sticky-logout");
    const logout = await page.$(".sticky-logout");
    if (typeof logout === "undefined") {
      await page.screenshot({ path: "login-failure.png" });
    }
    expect(typeof logout === "undefined").to.equal(false);
  });
});
