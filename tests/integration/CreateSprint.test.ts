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

const RUN_TESTS_IN_HEADLESS_MODE = false; // Change to 'false' in order to run tests in headful mode so you can see whats going on

const SLOW_MO_RATE = 50; // <-------- use this if you want to slow down the tests so you can see what is happening, 50 minimum to make it work properly or its too fast.

const randomTemplateName = nanoid(10);
const WINDOW_WIDTH = 1400; // In headed mode you need the window size to have a width of at least 1400px or the drag test will fail as there isnt enough window space to drag the box to the correct location

const WINDOW_HEIGHT = 1022;

// custom	delay function
const delay = (milliseconds: number | undefined) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

describe("CreateSprint Page:", () => {
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
		const startSprint = (await page.waitForXPath(
			"//p[contains(text(), 'Start a Sprint')]"
		)) as ElementHandle;
		await startSprint.click();
		await page.waitForSelector(`[id="sprints-input"]`);
		await delay(5000);
		await page.click(`[id="sprints-input"]`);
	}, 90_000);
});
