import { afterAll, beforeAll, describe, it } from 'vitest'
import { preview } from 'vite'
import { expect } from "chai";
import type { PreviewServer } from 'vite'
import puppeteer from 'puppeteer'
import type { Browser, Page } from 'puppeteer'
import dotenv from "dotenv";

dotenv.config();

const username = process.env.TEST_FIXTURE_USERNAME;
const password = process.env.TEST_FIXTURE_PASSWORD;
const url = "http://localhost:5173";
let browser: Browser;
let page: Page;

describe("Login Page:", async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({ preview: { port: 5741 } })
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
    

  afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())
    })
  })

  it("should allow a user to log in and log out", async () => {
    await page.goto('http://localhost:5741/login')
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
  }, 60_000);
});
