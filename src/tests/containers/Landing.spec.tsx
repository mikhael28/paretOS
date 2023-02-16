/**
 * @jest-environment jsdom
 */

import { screen, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";

import Landing from "../../containers/Landing";
import { renderWithRouter } from "../testUtilities";
import { ResizeObserver } from "@juggle/resize-observer";


describe("LANDING", () => {

  global.ResizeObserver = ResizeObserver

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it("renders successfully", () => {
    renderWithRouter(
      <Landing />
    );

    const componentHeader = screen.getByText("Build the future")
    const signupButton = screen.getByText("signup")
    const signinButton = screen.getByText("login")

    expect(componentHeader).toBeDefined();
    expect(signupButton).toBeDefined();
    expect(signinButton).toBeDefined();
  });

  // TODO: Add tests related to graphics behavior
});
