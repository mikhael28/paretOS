/* eslint-disable eqeqeq */
import React, { useCallback, useState } from "react";
import { I18n } from "@aws-amplify/core";
import {
  GridColDef,
  GridValueGetterParams,
  GridCellParams,
  gridClasses,
} from "@mui/x-data-grid";
import StyledDataGrid from "./StyledDataGrid";
import { User } from "../types";
import ProfileImg from "./ProfileImg";

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

  // Define columns in the grid
  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: I18n.get("rank"),
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: I18n.get("name"),
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.fName || ""} ${
          params.row.lName.substring(0, 1).concat(".").toUpperCase() || ""
        }`,
      flex: 2,
    },
    {
      field: "score",
      headerName: I18n.get("score"),
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.score || 0} pts`,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
  ];

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

  // Manage three state variables: sort property & order, filter phrase, and page to display
  const [filterBy, setFilterBy] = useState("");

  /**
   * @function filterUsers
   * @desc Filters each element of a user array based on a search string
   * @param {User} x user to evaluate
   */
  const filterUsers = useCallback(
    (x: User): boolean => {
      const name: string = (x.fName + x.lName.substring(0, 1)).toLowerCase();
      return name.includes(filterBy.toLowerCase());
    },
    [filterBy]
  );

  /**
   * @function handleCellClick
   * @desc Reroute to the user's info page
   * @param params - params of the table's cell
   */
  function handleCellClick(params: GridCellParams) {
    history.push(`/profile/${params.row.id}`);
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
          <StyledDataGrid
            rows={rankedUsers.filter(filterUsers)}
            columns={columns}
            pageSize={itemsPerPage}
            rowsPerPageOptions={[itemsPerPage]}
            onCellClick={handleCellClick}
            autoHeight
            disableSelectionOnClick
            disableColumnMenu
            density="compact"
            getRowClassName={(params) =>
              params.row.id === currentUser.id
                ? `${gridClasses.row}-selected`
                : ""
            }
          />
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
