import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Leaderboard from "./Board";
import type { User } from "../types";

describe("sortUsersByScore", () => {
  const users = testUsers();
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
  it("displays a leaderboard list", () => {
    expect(screen.getByTitle("Leaderboard")).toBeDefined();
  });
  it("displays the current user", () => {
    expect(screen.getByText("Current U.")).toBeDefined();
  });
  it("displays a table with three users", () => {
    expect(screen.getAllByTestId("leaderboard-row").length).toEqual(3);
  });
  it("displays a podium with the top three users", () => {
    expect(screen.getByText("First")).toBeDefined();
    expect(screen.getByText("Second")).toBeDefined();
    expect(screen.getByText("Third")).toBeDefined();
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
