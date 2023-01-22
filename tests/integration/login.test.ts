import { afterAll, beforeAll, describe, it } from 'vitest'
import { expect } from "chai";
import puppeteer from 'puppeteer'
import type { Browser, Page } from 'puppeteer'
import dotenv from "dotenv";

dotenv.config();

const username = process.env.TEST_FIXTURE_USERNAME;
const password = process.env.TEST_FIXTURE_PASSWORD;

describe("Login Page:", () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
    

  afterAll(async () => {
    await browser.close()
  })

  it("should allow a user to log in and log out", async () => {
    await page.goto(`http://localhost:5173/login`, { timeout: 90_000, waitUntil: "networkidle2" });
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
});
