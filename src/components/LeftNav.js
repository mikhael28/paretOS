import { NavLink } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import Image from "react-bootstrap/lib/Image";
import DropdownButton from "react-bootstrap/lib/DropdownButton";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import { AiFillCode } from "react-icons/ai";
import { FaTools, FaHandsHelping } from "react-icons/fa";
import { IoMdSchool, IoMdCreate } from "react-icons/io";
import { BiRun } from "react-icons/bi";
import white from "../assets/Pareto_Lockup-White.png";
import blue from "../assets/Pareto-Blue-01.png";
import red from "../assets/Pareto-Red-01.png";

function LeftNav(props) {
  const { chosenLanguage, user, updateState, athletes } = props;

  const textStyle = {
    color: "rgb(79, 101, 116)",
    textDecoration: "none",
    fontSize: 20,
    marginLeft: 12,
    marginTop: 14,
  };
  const noPadStyle = {
    color: "rgb(79, 101, 116)",
    fontSize: 18,
    marginTop: 14,
    marginLeft: 26,
    display: "flex",
  };
  const activeTextStyle = {
    color: "rgb(243, 247, 249)",
    textDecoration: "none",
  };

  const renderLanguageDropdown = () => (
    <div style={{ marginLeft: 14 }}>
      <Image src={chosenLanguage.image} height="26" width="26" circle />
      <DropdownButton
        key={1}
        title={`${chosenLanguage.name}`}
        id="pick-service"
        style={{
          color: "white",
          fontSize: 14,
          backgroundColor: "rgb(37, 38, 39)",
          border: "none",
          textAlign: "left",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div style={{ marginLeft: 4 }}>
          <MenuItem
            exact
            key={1.1}
            onClick={() => {
              I18n.setLanguage("lg");
              updateState({
                chosenLanguage: {
                  name: "Lugandan",
                  image:
                    "https://cdn.countryflags.com/thumbs/uganda/flag-square-250.png",
                },
              });
            }}
          >
            <Glyphicon glyph="glyphicon glyphicon-cog" />
            &ensp; Luganda
          </MenuItem>
          <MenuItem
            exact
            key={1.2}
            onClick={() => {
              I18n.setLanguage("es");
              updateState({
                chosenLanguage: {
                  name: "Spanish",
                  image:
                    "https://cdn.countryflags.com/thumbs/spain/flag-400.png",
                },
              });
            }}
          >
            <Glyphicon glyph="glyphicon glyphicon-cog" />
            &ensp; Spanish
          </MenuItem>
          <MenuItem
            exact
            key={1.3}
            onClick={() => {
              I18n.setLanguage("en");
              updateState({
                chosenLanguage: {
                  name: "English",
                  image:
                    "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-400.png",
                },
              });
            }}
          >
            <Glyphicon glyph="glyphicon glyphicon-cog" />
            &ensp; English
          </MenuItem>

          <MenuItem
            exact
            key={1.4}
            onClick={() => {
              I18n.setLanguage("ptbr");
              updateState({
                chosenLanguage: {
                  name: "Portuguese",
                  image:
                    "https://cdn.countryflags.com/thumbs/brazil/flag-400.png",
                },
              });
            }}
          >
            <Glyphicon glyph="glyphicon glyphicon-cog" />
            &ensp; Portuguese(Brazil)
          </MenuItem>

          <MenuItem
            exact
            key={1.5}
            onClick={() => {
              I18n.setLanguage("ngpg");
              updateState({
                chosenLanguage: {
                  name: "Nigerian Pidgin",
                  image:
                    "https://cdn.countryflags.com/thumbs/nigeria/flag-400.png",
                },
              });
            }}
          >
            <Glyphicon glyph="glyphicon glyphicon-cog" />
            &ensp; Nigeria(Pidgin)
          </MenuItem>

          <MenuItem
            exact
            key={1.6}
            onClick={() => {
              I18n.setLanguage("hi");
              updateState({
                chosenLanguage: {
                  name: "Hindi",
                  image:
                    "https://cdn.countryflags.com/thumbs/india/flag-400.png",
                },
              });
            }}
          >
            <Glyphicon glyph="glyphicon glyphicon-cog" />
            &ensp; Hindi(India)
          </MenuItem>
        </div>
      </DropdownButton>
    </div>
  );

  return (
    <div id="mySidenav" className="sidenav">
      <div style={{ marginLeft: 10, display: "flex" }}>
        <Image
          src={
            user.picture ||
            "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          }
          height="40"
          width="40"
          circle
        />
        <p
          style={{
            color: "white",
            fontSize: 18,
            backgroundColor: "rgb(37, 38, 39)",
            border: "none",
            marginTop: 6,
            marginLeft: 12,
          }}
        >
          {user.fName}
        </p>
      </div>

      <div style={{ marginTop: 10 }}>
        <NavLink
          to="/"
          style={textStyle}
          className="flex"
          activeStyle={activeTextStyle}
          exact
        >
          <img
            src={red}
            height="30"
            width="30"
            alt="pareto blue"
            className="first-step"
          />
          &ensp;{" "}
          <p style={{ marginTop: 4, marginLeft: 3 }}>{I18n.get("arena")}</p>
        </NavLink>

        <div
          style={{
            // marginLeft: 22,
            fontSize: 14,
            color: "white",
          }}
        >
          <NavLink
            to="/arena/create/sprints"
            style={noPadStyle}
            activeStyle={activeTextStyle}
            exact
          >
            <BiRun style={{ height: 26, width: 26 }} />
            <p style={{ marginLeft: 10 }}>{I18n.get("startSprint")}</p>
          </NavLink>
          <NavLink
            to="/arena/create/template"
            style={noPadStyle}
            activeStyle={activeTextStyle}
            exact
          >
            <IoMdCreate style={{ height: 26, width: 26 }} />
            <p style={{ marginLeft: 10 }}>Sprint Template</p>
          </NavLink>
        </div>
      </div>

      {user.instructor === true ? (
        <div style={{ marginTop: 14 }}>
          <NavLink
            to="/mentorship"
            style={textStyle}
            activeStyle={activeTextStyle}
            exact
          >
            <img src={red} height="30" width="30" alt="pareto-learn" />
            &ensp; {I18n.get("mentorship")}
          </NavLink>

          {/* Experience/Quick Info Below */}
          <div className="small-overflow">
            {athletes.map((relationship) => (
              <NavLink
                to={`/mentorship/${relationship.id}`}
                key={relationship.id}
                style={noPadStyle}
                activeStyle={activeTextStyle}
                exact
              >
                <div
                  className="flex"
                  style={{
                    fontSize: 14,
                    alignItems: "center",
                  }}
                >
                  <FaHandsHelping
                    style={{ height: 26, width: 26, marginRight: 8 }}
                  />
                  <p>
                    {relationship.mentee.fName} {relationship.mentee.lName}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
      {/* Experience/Quick Info Below */}
      <div style={{ marginLeft: 3 }}>
        <NavLink
          to="/training"
          style={textStyle}
          className="flex"
          activeStyle={activeTextStyle}
          exact
        >
          <img
            src={blue}
            height="30"
            width="30"
            alt="pareto blue"
            className="first-step"
          />
          &ensp; <p style={{ marginTop: 4 }}>{I18n.get("basicTraining")}</p>
        </NavLink>
      </div>
      <div
        style={{
          // marginLeft: 22,
          fontSize: 14,
          color: "white",
        }}
        className="sixth-step-exp"
      >
        <NavLink
          to={`/training/${user.apprenticeshipId}`}
          style={noPadStyle}
          activeStyle={activeTextStyle}
          exact
        >
          <AiFillCode style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("technicalTraining")}</p>
        </NavLink>
        <NavLink
          to={`/training/${user.productId}`}
          style={noPadStyle}
          activeStyle={activeTextStyle}
          exact
        >
          <FaTools style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("product")}</p>
        </NavLink>
        <NavLink
          to={`/training/${user.masteryId}`}
          style={noPadStyle}
          activeStyle={activeTextStyle}
          exact
        >
          <IoMdSchool style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("interviewing")}</p>
        </NavLink>
      </div>

      <NavLink
        to="/context-builder"
        style={textStyle}
        activeStyle={activeTextStyle}
        className="third-step"
        exact
      >
        <img
          src={blue}
          height="30"
          width="30"
          alt="context-builder"
          style={{ marginBottom: 6 }}
        />
        &ensp;{I18n.get("library")}
      </NavLink>

      <NavLink
        to={`/profile/edit/${user.id}`}
        style={textStyle}
        activeStyle={activeTextStyle}
        exact
      >
        <img
          src={blue}
          height="30"
          width="30"
          alt="context-builder"
          style={{ marginBottom: 6 }}
        />
        &ensp;Profile
      </NavLink>

      <div style={{ flex: "0 0 4px" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        {renderLanguageDropdown()}
      </div>

      {/* <div className="fourth-step">
        <Pomodoro />
      </div> */}

      <div style={{ flex: "0 0 16px" }} />

      <img
        src={white}
        height="50"
        width="200"
        style={{ position: "fixed", bottom: 20, left: 15 }}
        alt="pareto logo"
      />
    </div>
  );
}

export default LeftNav;
