import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Leaderboard from "../components/Board";
import type { User } from "../types";

describe("LEADERBOARD", () => {
  const users = testUsers();

  describe("Leaderboard Table with 3 users per page and a current user", () => {
    beforeEach(() => {
      render(
        <Leaderboard
          users={users}
          itemsPerPage={3}
          currentUser={users[5]}
          history={[]}
        />
      );
    });
    it("displays a leaderboard table", () => {
      expect(screen.getByTitle("Leaderboard")).toBeDefined();
    });
    it("displays the page of the table containing the current user", () => {
      expect(screen.getByText("Current U.")).toBeDefined();
    });

    // header also considered a row, so the counting starts from 1
    it("displays a table with three users if itemsperpage is set to 3 users + 1 row (header)", () => {
      expect(screen.getAllByRole("row").length).toEqual(4);
    });
    it("decrements and increments page", () => {
      // go to previous page
      fireEvent.click(screen.getByTitle("Go to previous page"));
      let rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(/1000/);
      expect(rows[2]).toHaveTextContent(/900/);
      expect(rows[3]).toHaveTextContent(/800/);
      // go to next page
      fireEvent.click(screen.getByTitle("Go to next page"));
      rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(/700/);
      expect(rows[2]).toHaveTextContent(/600/);
      expect(rows[3]).toHaveTextContent(/500/);
    });
  });

  describe("Leaderboard Table with all users per page", () => {
    beforeEach(() => {
      render(
        <Leaderboard
          users={users}
          itemsPerPage={6}
          currentUser={users[3]}
          history={[]}
        />
      );
    });
    it("initially displays the table in descending score order", () => {
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(/1000/);
      expect(rows[2]).toHaveTextContent(/900/);
      expect(rows[3]).toHaveTextContent(/800/);
    });
    it("clicking on 'name' column header sorts by ascending name order", () => {
      fireEvent.click(screen.getByText(/name/i));
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(/Third/);
      expect(rows[2]).toHaveTextContent(/Second/);
      expect(rows[3]).toHaveTextContent(/First/);
    });
    it("clicking on 'score' column header sorts by ascending score order", () => {
      fireEvent.click(screen.getByText(/score/i));
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(/500/i);
      expect(rows[2]).toHaveTextContent(/600/i);
      expect(rows[3]).toHaveTextContent(/700/i);
    });
    it("clicking on 'rank' column header sorts by ascending score order", () => {
      fireEvent.click(screen.getByText(/rank/i));
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(/500 pts/i);
      expect(rows[2]).toHaveTextContent(/600 pts/i);
      expect(rows[3]).toHaveTextContent(/700 pts/i);
    });
    // ! this test fails because fireEvent.change function
    // ! doesn't seem to change the value of the input element
    it("filters the leaderboard based on a given filter phrase", async () => {
      const inputEl = screen.getByPlaceholderText(/Filter by name/);
      await waitFor(() =>
        fireEvent.change(inputEl, {
          target: {
            value: "Adam",
          },
        })
      );
      expect(inputEl).toHaveValue("Adam");
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // + 1 row (header)
      expect(rows[1]).toHaveTextContent(/Adam/i);
    });
  });

  describe("Leaderboard Podium:", () => {
    beforeEach(() => {
      render(
        <Leaderboard
          users={users}
          itemsPerPage={3}
          currentUser={users[5]}
          history={[]}
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

// @TODO retype the User type from any, actually a better todo is to create a complete initial state object that can be used for mock data for offline development, and for our test suite.

function testUsers(): Array<any> {
  const users: Array<any> = [
    {
      rank: 1,
      score: 1000,
      id: 1,
      fName: "First",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
      instructor: false,
    },
    {
      rank: 2,
      score: 900,
      id: 2,
      fName: "Second",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
      instructor: false,
    },
    {
      rank: 3,
      score: 800,
      id: 3,
      fName: "Third",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
      instructor: false,
    },
    {
      rank: 4,
      score: 700,
      id: 4,
      fName: "Alfred",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
      instructor: false,
    },
    {
      rank: 5,
      score: 600,
      id: 5,
      fName: "Adam",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
      instructor: false,
    },
    {
      rank: 6,
      score: 500,
      id: 6,
      fName: "Current",
      lName: "User",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
      instructor: false,
    },
  ];
  return users;
}
