/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { I18n } from "@aws-amplify/core";
import Table from "react-bootstrap/lib/Table";
import { User } from "../types";
import ProfileImg from "./ProfileImg";
import PageNavigation from "./PageNavigation";

/**
 * @component Leaderboard
 * @desc Compares the score property of each user object and displays in an interactive table
 * @param {Prop} users-an array of objects with name and score properties
 * @param {Prop} itemsPerPage-integer to determine how many users to display on each page
 * @param {Prop} currentUser-currently logged in user
 * @param {Prop} history-array of recent pages/views visited
 */

export type BoardProps = {
  users: Array<User>;
  itemsPerPage: number;
  currentUser: User;
  history: Array<String>;
};

function Leaderboard({
  users,
  itemsPerPage,
  currentUser,
  history,
}: BoardProps) {
  // Define users to show on podium
  const podiumCount = 3;

  // Sort a copy of the user array and add rankings
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);
  const rankedUsers = sortedUsers.map((user, i) => {
    user.rank =
      // eslint-disable-next-line eqeqeq
      i > 0 && user.score === sortedUsers[i - 1].score
        ? sortedUsers[i - 1].rank
        : i + 1;
    return user;
  });

  // Determine who should appear on the podium
  const topUsers = rankedUsers.slice(0, podiumCount);

  // Get curent user page. Will return -1 if user is not in filtered user array
  const currentUserPage = getPage(
    rankedUsers.findIndex(({ id }) => id === currentUser.id)
  );

  // Manage three state variables: sort property & order, filter phrase, and page to display
  const [sortBy, setSortBy] = useState({ property: "score", ascending: false });
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(Math.max(currentUserPage, 1));

  /**
   * @function maxPages
   * @desc Getter for the maximum number of pages given filtered user array length
   */
  const maxPages = () => getPage(rankedUsers.filter(filterUsers).length);

  /**
   * @function handleSortChange
   * @desc Callback to sort two users by score or name, in ascending or descending order
   */
  function handleSortChange(e: React.MouseEvent<HTMLElement>) {
    const property: string = (e.target as HTMLElement).id;
    const { ascending } = sortBy;
    // Check to see if the array is already sorted in order by the new property
    const sorted = rankedUsers.sort(sortUsers).filter(filterUsers);

    let alreadySorted = sorted
      .slice(1)
      .every((x, i) => x[property] <= sorted[i][property]);
    if (ascending) {
      alreadySorted = sorted
        .slice(1)
        .every((x, i) => x[property] >= sorted[i][property]);
    }
    // If there is a change in sort property, and doing so in the current order would result in changes, update only the propery
    if (property !== sortBy.property && alreadySorted === false) {
      setSortBy({ property, ascending });
      return;
    }

    // Otherwise, change the order of the sort (property may or may not change)
    setSortBy({ property, ascending: !ascending });
  }

  /**
   * @function sortUsers
   * @desc Callback to sort two users by score or name, in ascending or descending order
   */
  function sortUsers(a: User, b: User): number {
    const { ascending, property } = sortBy;
    if (ascending && a[property] < b[property]) return -1;
    if (ascending && a[property] > b[property]) return 1;
    if (ascending === false && b[property] < a[property]) return -1;
    if (ascending === false && b[property] > a[property]) return 1;
    return 0;
  }

  /**
   * @function filterUsers
   * @desc Filters each element of a user array based on a search string
   * @param {User} x user to evaluate
   */
  function filterUsers(x: User): boolean {
    const name: string = (x.fName + x.lName.substring(0, 1)).toLowerCase();
    return name.includes(filterBy.toLowerCase());
  }

  /**
   * @function increasePage
   * @desc Increments page
   * @param {Event} Click
   */
  function increasePage(e, num: number = 1) {
    if (page + num <= maxPages()) {
      setPage(page + num);
    }
  }

  /**
   * @function decreasePage
   * @desc Decrements page
   * @param {Event} Click
   */
  function decreasePage(e, num: number = 1) {
    if (page - num >= 1) {
      setPage(page - num);
    }
  }

  /**
   * @function getPage
   * @desc Gets the page number of an item based on items per page
   * @param itemNumber - number of the item to get the page of
   */
  function getPage(itemNumber: number): number {
    return Math.floor(itemNumber / itemsPerPage) + 1;
  }

  return (
    <div style={{ margin: "25px 10px" }}>
      <h2>{I18n.get("leaderboard")}</h2>
      <div className="leaderboard-container" title="Leaderboard">
        {rankedUsers.some(({ score }) => score > 0) ? (
          <Podium topUsers={topUsers} removeNullScores={false} />
        ) : null}
        <div className="table-container" style={{ flexShrink: 1 }}>
          <form style={{ paddingBottom: "10px" }}>
            <input
              className="form-control"
              type="search"
              name="search"
              placeholder="Filter by name..."
              onChange={(e) => setFilterBy(e.target.value)}
            />
          </form>
          <Table
            bordered
            condensed
            hover
            responsive
            data-testid="leaderboard-table"
          >
            <tbody>
              <tr>
                <td
                  id="score"
                  className="rank-header text-center"
                  onClick={handleSortChange}
                >
                  {I18n.get("rank")}
                </td>
                <td
                  id="fName"
                  className="rank-header"
                  onClick={handleSortChange}
                >
                  {I18n.get("name")}
                </td>
                <td
                  id="score"
                  className="rank-header text-center"
                  onClick={handleSortChange}
                >
                  {I18n.get("score")}
                </td>
              </tr>
              {rankedUsers
                .sort(sortUsers)
                .filter(filterUsers)
                .map((user, i) =>
                  getPage(i) === page ? (
                    <tr
                      className={currentUser.id === user.id ? "my-rank" : ""}
                      key={user.id}
                      data-testid="leaderboard-row"
                    >
                      <td className="data text-center">
                        {i > 0 && user.rank == rankedUsers[i - 1].rank
                          ? "-"
                          : user.rank}
                      </td>
                      <td
                        onClick={() => history.push(`/profile/${user.id}`)}
                        className="data2"
                      >
                        {`${user.fName} ${user.lName
                          .substring(0, 1)
                          .toUpperCase()}.`}
                      </td>
                      <td className="data text-center">{user.score} pts</td>
                    </tr>
                  ) : null
                )}
            </tbody>
          </Table>
          {maxPages() > 0 ? (
            <PageNavigation
              currentPage={page}
              maxPages={maxPages()}
              increasePage={increasePage}
              decreasePage={decreasePage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

type PodiumProps = {
  topUsers: Array<User>;
  removeNullScores: boolean;
};
function Podium({ topUsers, removeNullScores }: PodiumProps) {
  const sortedTopUsers: Array<User> = [];
  let winners = [...topUsers];
  if (removeNullScores) {
    winners = winners.filter(({ score }) => score > 0);
  }
  winners.forEach((user, i) => {
    i % 2 > 0 ? sortedTopUsers.push(user) : sortedTopUsers.unshift(user);
  });

  return (
    <div className="podium-padding-wrapper">
      <div className="podium-container">
        {sortedTopUsers.map((user, i) => (
          <Dais
            key={user.id}
            id={i}
            user={user}
            rank={user.rank || 1}
            ranks={winners.length}
          />
        ))}
      </div>
    </div>
  );
}

type DaisProps = {
  user: User;
  rank: number;
  ranks: number;
  // eslint-disable-next-line react/no-unused-prop-types
  id: number;
};
function Dais({ user, rank, ranks }: DaisProps) {
  const platformWidth = Math.round(100 / ranks);
  const platformHeight = Math.round(
    (200 * (ranks - rank + 2)) / (ranks * 3 + 3)
  );
  const profileHeight = `${100 - platformHeight}%`;
  const altProfileHeight = `${Math.round(
    (200 * (rank - 1)) / (ranks * 3 + 3)
  )}%`;
  const profileHeightCalc = `calc(min(80px + ${altProfileHeight}, ${profileHeight}))`;

  return (
    <div className="podium-dais" style={{ width: `${platformWidth}%` }}>
      <div style={{ height: "100%", width: "100%" }}>
        <div className="dais-user" style={{ height: profileHeightCalc }}>
          <div className="dais-image-container">
            <div className="dais-image-lockup">
              <ProfileImg
                profileImg={user.profileImg ? user.profileImg : null}
              />
              <div
                className="dais-image-label"
                style={{ verticalAlign: "middle", textAlign: "center" }}
              >
                {user.fName}
              </div>
            </div>
          </div>
        </div>
        <div className="dais-platform" style={{ height: `${platformHeight}%` }}>
          {rank}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
