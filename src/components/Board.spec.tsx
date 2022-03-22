import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Leaderboard from "./Board";
import type { User } from "../types";

describe("LEADERBOARD", () => {
  const users = testUsers();

  describe("Leaderboard Table:", () => {
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
    it("displays a table with three users if itemsperpage is set to 3 users", () => {
      expect(screen.getAllByTestId("leaderboard-row").length).toEqual(3);
    });
    // TODO: add test. "correctly increments and decrements pages"
    // TODO: add test. "initially displays the leaderboard table in descending score order"
    // TODO: add test. "reacts to a click on the "name" column header by sorting the initial state leaderboard table by descending name order"
    // TODO: add test. "reacts to a click on "score" column header by sorting the initial state leaderboard table by ascending score order"
    // TODO: add test. "reacts to a click on the "rank" column header by sorting the initial state leaderboard by ascending score order"
    // TODO: add test. "reacts intelligently to new sortby properties. if descending score order is also descending name order, clicking the 'name' column results in sorting by ascending name order."
    // TODO: add test. "correctly filters the user array based on a given filter phrase."
    // TODO: add test. "filters according to a combination of first name plus the first letter of last name. ('John S.' would fit the filter 's'.)"
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
    // TODO: add test. "does not display the podiums if the viewport width is less than a certain value." (Use jestdom and getcomputedstyle?)
  });
});

function testUsers(): Array<User> {
  const users: Array<User> = [
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
    },
    {
      rank: 4,
      score: 700,
      id: 4,
      fName: "A",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
    },
    {
      rank: 5,
      score: 600,
      id: 5,
      fName: "A",
      lName: "B",
      email: "aaaa",
      github: "aaa",
      missions: [],
      percentage: 100,
      phone: "123",
      planning: [{ name: "a", code: "b", content: "" }],
      review: "123",
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
    },
  ];
  return users;
}
