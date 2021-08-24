import React, { Component } from "react";
import { I18n } from "@aws-amplify/core";
import Table from "react-bootstrap/lib/Table";
/**
 * @class Leaderboard
 * @TODO Review JSDocs techniques, apply to rest of the code-base if practical and useful.
 * @TODO Review what this component looks like, with more than 10 users passed through.
 * @TODO Review the UI of the buttons, to go from next to previous. Perhaps disable the previous button if on the first page, and next if no more than 10 users.
 * @desc Compares the score property of each user object
 * @param {Prop} users-an array of objects with name and score properties
 * @param {Prop} paginate-integer to determine how many users to display on each page
 */
class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.sortUsersByScore = this.sortUsersByScore.bind(this);
    this.sortUsersByName = this.sortUsersByName.bind(this);
    this.filterRank = this.filterRank.bind(this);
    this.increasePage = this.increasePage.bind(this);
    this.decreasePage = this.decreasePage.bind(this);

    this.state = {
      users: this.props.users,
      ranking: [],
      asc: false,
      alph: false,
      page: 1,
      pageMax: 1,
    };
  }

  /**
   * @function componentDidMount
   * @desc Sorts users by score then adds a ranking key to each user object when the component loads. Then sets the ranking state
   */
  componentDidMount() {
    const ranking = this.state.users;
    const paginate = this.props.paginate;
    ranking.sort(this.compareScore).reverse();
    ranking.map((user, index) => (user.rank = index + 1));
    ranking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ pageMax: ranking[ranking.length - 1].page });
    this.setState({ ranking: ranking });
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ users: props.users });
    const ranking = props.users;
    const paginate = this.props.paginate;
    ranking.sort(this.compareScore).reverse();
    ranking.map((user, index) => (user.rank = index + 1));
    ranking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ pageMax: ranking[ranking.length - 1].page });
    this.setState({ ranking: ranking });
  }

  /**
   * @function compareScore
   * @desc Compares the score property of each user object
   * @param {Object, Object} user
   */
  compareScore(a, b) {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
  }

  /**
   * @function compareName
   * @desc Compares the name property of each user object alphabetically
   * @param {Object, Object} user
   */
  compareName(a, b) {
    if (a.fName < b.fName) return -1;
    if (a.fName > b.fName) return 1;
    return 0;
  }

  /**
   * @function sortUsersByScore
   * @desc Sorts the ranking by score either ascending or descending
   */
  sortUsersByScore() {
    const ranking = this.state.ranking;
    const paginate = this.props.paginate;
    if (this.state.asc === true) {
      ranking.sort(this.compareScore).reverse();
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ asc: false });
      this.setState({ alph: false });
    } else {
      ranking.sort(this.compareScore);
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ asc: true });
      this.setState({ alph: false });
    }
  }

  /**
   * @function sortUsersByName
   * @desc Sorts the ranking by name alphabetically either ascending or descending
   */
  sortUsersByName() {
    const ranking = this.state.ranking;
    const paginate = this.props.paginate;
    if (this.state.alph === true) {
      ranking.sort(this.compareName).reverse();
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ alph: false });
      this.setState({ asc: true });
    } else {
      ranking.sort(this.compareName);
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ alph: true });
      this.setState({ asc: true });
    }
  }

  /**
   * @function filterRank
   * @desc Filters through the ranking to find matches and sorts all matches by score
   * @param {String} search input
   */
  filterRank(e) {
    const ranking = this.state.users;
    const paginate = this.props.paginate;
    const newRanking = [];
    const inputLength = e.target.value.length;
    for (var i = 0; i < ranking.length; i++) {
      const str = ranking[i].fName.slice(0, inputLength).toLowerCase();
      if (str === e.target.value.toLowerCase()) {
        newRanking.push(ranking[i]);
      }
    }
    newRanking.sort(this.compareScore).reverse();
    newRanking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ ranking: newRanking });
    this.setState({ page: 1 });
    this.setState({ pageMax: newRanking[newRanking.length - 1].page });
  }

  /**
   * @function increasePage
   * @desc Increments page by one
   * @param {Event} Click
   */
  increasePage(e) {
    let page = this.state.page;
    if (page < this.state.pageMax) {
      page += 1;
    }
    this.setState({ page: page });
  }

  /**
   * @function increasePage
   * @desc Decrements page by one
   * @param {Event} Click
   */
  decreasePage(e) {
    let page = this.state.page;
    if (page > 1) {
      page -= 1;
    }
    this.setState({ page: page });
  }

  /**
   * @function render
   * @desc renders jsx
   */
  render() {
    return (
      <div style={{ marginRight: 25, marginTop: 20 }}>
        <h2>{I18n.get("leaderboard")}</h2>
        <Table bordered condensed hover responsive>
          <tbody>
            <tr>
              <td colSpan="3">
                <form onChange={this.filterRank}>
                  {I18n.get("name")}:{" "}
                  <input type="search" name="search" placeholder="Search" />
                </form>
              </td>
            </tr>
            <tr>
              <td
                className="rank-header sortScore"
                onClick={this.sortUsersByScore}
              >
                {" "}
                {I18n.get("rank")}{" "}
              </td>
              <td
                className="rank-header sortAlpha"
                onClick={this.sortUsersByName}
              >
                {" "}
                {I18n.get("name")}{" "}
              </td>
              <td className="rank-header" onClick={this.sortUsersByScore}>
                {" "}
                {I18n.get("score")}{" "}
              </td>
            </tr>
            {this.state.ranking.map((user, index) => (
              <tr
                className={this.props.user.id === user.id ? "my-rank" : ""}
                key={index}
              >
                {user.page == this.state.page ? (
                  <td className="data">{user.rank}</td>
                ) : null}
                {user.page == this.state.page ? (
                  <td
                    onClick={() =>
                      this.props.history.push(`/profile/${user.id}`)
                    }
                    className="data2"
                  >
                    {user.fName}
                  </td>
                ) : null}
                {user.page == this.state.page ? (
                  <td className="data">{user.score}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="decrement" onClick={this.decreasePage}>
            {I18n.get("back")}
          </p>
          {this.state.page == 1 ? null : (
            <p onClick={this.decreasePage}> {this.state.page - 1}</p>
          )}
          <p> {this.state.page}</p>
          {this.state.page < this.state.pageMax ? (
            <p onClick={this.increasePage}> {this.state.page + 1}</p>
          ) : null}
          <p className="increment" onClick={this.increasePage}>
            {I18n.get("next")}
          </p>
        </div>
      </div>
    );
  }
}
export default Leaderboard;
