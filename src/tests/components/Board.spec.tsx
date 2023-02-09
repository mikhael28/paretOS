/**
 * @jest-environment jsdom
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

import Leaderboard from "../../components/Board";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/ProfileTypes";
import { generateTestUserData } from "../testData";

describe("LEADERBOARD", () => {
  const usersWithoutScores = testUsersWithoutScores();
  const mockNavigate = vi.fn().mockImplementation(useNavigate);
  mockNavigate.mockReturnValue(vi.fn());

  describe("Leaderboard Table with 3 users per page and a current user", () => {
    beforeEach(() => {
      render(
        <Leaderboard
          users={usersWithoutScores}
          itemsPerPage={3}
          currentUser={usersWithoutScores[5]}
          navigate={mockNavigate}
        />
      );
    });

    afterEach(() => {
      cleanup();
    });

    it("displays a leaderboard table", () => {
      expect(screen.getByTitle("Leaderboard")).toBeDefined();
    });

    it("displays the page of the table containing the current user", () => {
      const userTableRows = screen.getAllByRole("rowheader");
      expect(userTableRows).toBeDefined();
      expect(
        userTableRows.filter((row) => row.innerHTML === "Current U.")
      ).toHaveLength(1);
    });

    // header also considered a row, so the counting starts from 1
    // all rows are present but not all are visible
    it("displays a table with three users if itemsperpage is set to 3 users + 1 row (header)", () => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(4);
    });

    it("decrements and increments page", () => {
      // go to previous page
      fireEvent.click(screen.getByTitle("Go to previous page"));
      let rows = screen.getAllByRole("row");
      expect(rows[1].innerHTML).toContain("First B.");
      expect(rows[2].innerHTML).toContain("Second B");
      expect(rows[3].innerHTML).toContain("Third B");
      // go to next page
      fireEvent.click(screen.getByTitle("Go to next page"));
      rows = screen.getAllByRole("row");
      expect(rows[1].innerHTML).toContain("Alfred B.");
      expect(rows[2].innerHTML).toContain("Adam B.");
      expect(rows[3].innerHTML).toContain("Current U.");
    });
  });

  describe("Leaderboard Table with all users per page", () => {
    beforeEach(() => {
      render(
        <Leaderboard
          users={testUsersWithScores()}
          itemsPerPage={6}
          currentUser={testUsersWithScores()[3]}
          navigate={mockNavigate}
        />
      );
    });

    afterEach(() => cleanup());

    it("initially displays the table in descending score order", () => {
      const rows = screen.getAllByRole("row");
      expect(rows[1].innerHTML).toContain("1000");
      expect(rows[2].innerHTML).toContain("900");
      expect(rows[3].innerHTML).toContain("800");
    });

    it("clicking on 'name' column header sorts by ascending name order", () => {
      fireEvent.click(screen.getByText(/name/i));
      const rows = screen.getAllByRole("row");
      expect(rows[1].innerHTML).toContain("Third");
      expect(rows[2].innerHTML).toContain("Second");
      expect(rows[3].innerHTML).toContain("First");
    });

    it("clicking on 'score' column header sorts by ascending score order", () => {
      fireEvent.click(screen.getByText(/score/i));
      const rows = screen.getAllByRole("row");
      expect(rows[1].innerHTML).toContain("500");
      expect(rows[2].innerHTML).toContain("600");
      expect(rows[3].innerHTML).toContain("700");
    });

    it("clicking on 'rank' column header sorts by ascending score order", () => {
      fireEvent.click(screen.getByText(/rank/i));
      const rows = screen.getAllByRole("row");
      expect(rows[1].innerHTML).toContain("500");
      expect(rows[2].innerHTML).toContain("600");
      expect(rows[3].innerHTML).toContain("700");
    });

    it("filters the leaderboard based on a given filter phrase", async () => {
      const inputElement = await waitFor(() =>
        screen.getByPlaceholderText("Filter by name...")
      );
      waitFor(() => {
        inputElement.setAttribute("value", "Adam");
        fireEvent.change(inputElement);
      }).then(() => {
        expect(inputElement.getAttribute("value")).toEqual("Adam");
      });
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // + 1 row (header)
      expect(rows[1].innerHTML).toContain("Adam");
    });
  });

  describe("Leaderboard Podium:", () => {
    beforeEach(() => {
      render(
        <Leaderboard
          users={testUsersWithScores()}
          itemsPerPage={3}
          currentUser={testUsersWithScores()[5]}
          navigate={mockNavigate}
        />
      );
    });
    it("displays a podium with the top three users", () => {
      expect(screen.getByText("First")).toBeDefined();
      expect(screen.getByText("Second")).toBeDefined();
      expect(screen.getByText("Third")).toBeDefined();
    });
    // TODO: add test. "displays 3 different podiums of varying heights"
    // TODO: add test. "displays the #1 scoring user on the tallest podium"
    // TODO: add test. "displays the #3 scoring user on the shorted podium"
    // TODO: add test. "does not display the podiums if no user has a score greater than 0."
  });
});

// @TODO create a complete initial state object that can be used for mock data for offline development, and for our test suite.
// @TODO open a discussion about this on GitHub. For the purposes of unit testing, the above should probably be utilities for setting initial state, to allow for testing different scenarios

function testUsersWithScores(): Array<User> {
  const users: Array<User> = [
    generateTestUserData(1, {
      _id: "user1",
      fName: "First",
      lName: "B",
      score: 1000,
    }),
    generateTestUserData(2, {
      _id: "user2",
      fName: "Second",
      lName: "B",
      score: 900,
    }),
    generateTestUserData(3, {
      _id: "user3",
      fName: "Third",
      lName: "B",
      score: 800,
    }),
    generateTestUserData(4, {
      _id: "user4",
      fName: "Alfred",
      lName: "B",
      score: 700,
    }),
    generateTestUserData(5, {
      _id: "user5",
      fName: "Adam",
      lName: "B",
      score: 600,
    }),
    generateTestUserData(6, {
      _id: "user6",
      fName: "Current",
      lName: "User",
      score: 500,
    }),
  ];
  return users;
}

function testUsersWithoutScores(): Array<User> {
  const users: Array<User> = [
    generateTestUserData(1, {
      _id: "user1",
      fName: "First",
      lName: "B",
    }),
    generateTestUserData(2, {
      _id: "user2",
      fName: "Second",
      lName: "B",
    }),
    generateTestUserData(3, {
      _id: "user3",
      fName: "Third",
      lName: "B",
    }),
    generateTestUserData(4, {
      _id: "user4",
      fName: "Alfred",
      lName: "B",
    }),
    generateTestUserData(5, {
      _id: "user5",
      fName: "Adam",
      lName: "B",
    }),
    generateTestUserData(6, {
      _id: "user6",
      fName: "Current",
      lName: "User",
    }),
  ];
  return users;
}
