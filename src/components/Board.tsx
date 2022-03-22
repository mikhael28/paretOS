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
  // Set state for leaderboard rankings and display order, calculate users for podium
  const sortedUsers = users.sort(sortDescending);
  const initialRanks = sortedUsers.map((user, i) => {
    user.page = getPage(i + 1);
    user.rank =
      // eslint-disable-next-line eqeqeq
      i > 0 && user.score == sortedUsers[i - 1].score
        ? sortedUsers[i - 1].rank
        : i + 1;
    return user;
  });
  const topThree =
    initialRanks.length > 3 ? initialRanks.slice(0, 3) : initialRanks.slice(0);
  const [ranking, setRanking] = useState(initialRanks);
  const [asc, setAsc] = useState(false);

  // Set state for results page
  const maxPages = getPage(users.length);
  const currentPage = getPage(
    initialRanks.findIndex(({ id }) => id === currentUser.id) + 1
  );
  const [pages, setPages] = useState({ currentPage, maxPages });

  /**
   * @function sortDescending
   * @desc Sorts the ranking by score, in descending order
   */
  function sortDescending(a: User, b: User) {
    return b.score - a.score;
  }

  /**
   * @function sortUsersByScore
   * @desc Sorts the ranking by score either ascending or descending
   */
  function sortUsersByScore() {
    const tempRanking: Array<User> = [...ranking].sort(sortDescending);
    if (asc) {
      const newRanking: Array<User> = tempRanking.map(addPage);
      setAsc(false);
      setRanking(newRanking);
    } else {
      const newRanking = tempRanking.reverse().map(addPage);
      setAsc(true);
      setRanking(newRanking);
    }
  }

  /**
   * @function filterRank
   * @desc Filters through the ranking to find matches and sorts all matches by score
   * @param {String} search input
   */
  function filterRank(e: React.FormEvent<HTMLFormElement>) {
    const input: any = e.currentTarget;
    const inputLength: number = input?.value.length;
    const filteredRanking: Array<User> = [];
    if (inputLength > 0) {
      users.forEach((user) => {
        const str = user.fName.substring(0, inputLength).toLowerCase();
        if (str === input?.value.toLowerCase()) {
          filteredRanking.push(user);
        }
      });
      filteredRanking.sort((a, b) =>
        asc ? a.score - b.score : b.score - a.score
      );
      const newRanking = filteredRanking.map(addPage);
      const [currentPage, maxPages] = [1, getPage(newRanking.length)];
      setRanking(newRanking);
      setPages({ currentPage, maxPages });
    } else {
      const newRanking = users.map(addPage);
      setRanking(newRanking);
      setPages({
        currentPage: getPage(
          initialRanks.findIndex(({ id }) => id === currentUser.id)
        ),
        maxPages: getPage(users.length),
      });
    }
  }

  /**
   * @function increasePage
   * @desc Increments page by one
   * @param {Event} Click
   */
  function increasePage() {
    let { currentPage, maxPages } = pages;
    if (currentPage < maxPages) {
      currentPage += 1;
      setPages({ currentPage, maxPages });
    }
  }

  /**
   * @function decreasePage
   * @desc Decrements page by one
   * @param {Event} Click
   */
  function decreasePage() {
    let { currentPage, maxPages } = pages;
    if (currentPage > 1) {
      currentPage -= 1;
      setPages({ currentPage, maxPages });
    }
  }

  /**
   * @function getPage
   * @desc Gets the page number of an item based on items per page
   * @param itemNumber - number of the item to get the page of
   */
  function getPage(itemNumber: number) {
    return Math.ceil(itemNumber / itemsPerPage);
  }

  /**
   * @function addPage
   * @desc Adjust the page of a user based on their current index in the array
   * @param user - the user object
   * @param index - the index in the array
   */
  function addPage(user: User, index: number) {
    const {
      email,
      fName,
      github,
      id,
      lName,
      missions,
      percentage,
      phone,
      planning,
      rank,
      review,
      score,
    } = user;
    const page = getPage(index + 1);
    return {
      email,
      fName,
      github,
      id,
      lName,
      missions,
      page,
      percentage,
      phone,
      planning,
      rank,
      review,
      score,
    };
  }

  return (
    <div style={{ margin: "25px 10px" }}>
      <h2>{I18n.get("leaderboard")}</h2>
      <div className="leaderboard-container" title="Leaderboard">
        {ranking.some(({ score }) => score > 0) ? (
          <Podium topUsers={topThree} removeNullScores={false} />
        ) : null}
        <div className="table-container" style={{ flexShrink: 1 }}>
          <form onChange={filterRank} style={{ paddingBottom: "10px" }}>
            <input
              className="form-control"
              type="search"
              name="search"
              placeholder="Filter by name..."
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
                  className="rank-header text-center"
                  onClick={sortUsersByScore}
                >
                  {I18n.get("rank")}
                </td>
                <td className="rank-header" onClick={sortUsersByScore}>
                  {I18n.get("name")}
                </td>
                <td
                  className="rank-header text-center"
                  onClick={sortUsersByScore}
                >
                  {I18n.get("score")}
                </td>
              </tr>
              {ranking.map((user, i) =>
                user.page === pages.currentPage ? (
                  <tr
                    className={currentUser.id === user.id ? "my-rank" : ""}
                    key={user.id}
                    data-testid="leaderboard-row"
                  >
                    <td className="data text-center">
                      {i > 0 && user.rank == ranking[i - 1].rank
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
          {pages.maxPages > 1 ? (
            <PageNavigation
              currentPage={pages.currentPage}
              maxPages={pages.maxPages}
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
  if (removeNullScores) {
    topUsers = topUsers.filter(({ score }) => score > 0);
  }
  topUsers.forEach((user, i) => {
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
            ranks={topUsers.length}
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
