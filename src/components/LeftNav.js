import React from "react";
import { NavLink } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import Image from "react-bootstrap/lib/Image";
import DropdownButton from "react-bootstrap/lib/DropdownButton";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import red from "../assets/Pareto-Red-01.png";
import blue from "../assets/Pareto-Blue-01.png";
import white from "../assets/Pareto_Lockup-White.png";
import { AiFillCode } from "react-icons/ai";
import { FaTools } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";

const LeftNav = (props) => {
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

  const renderLanguageDropdown = () => {
    return (
      <div style={{ marginLeft: 14 }}>
        <Image src={chosenLanguage.image} height="26" width="26" circle />
        <DropdownButton
          key={1}
          title={`${chosenLanguage.name}`}
          id={`pick-service`}
          style={{
            color: "white",
            fontSize: 14,
            backgroundColor: "rgb(37, 38, 39)",
            border: "none",
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
          </div>
        </DropdownButton>
      </div>
    );
  };

  return (
    <div id="mySidenav" className="sidenav">
      <div style={{ marginLeft: 10, display: "flex" }}>
        <Image
          src={
            user.picture ||
            "https://wallsheaven.co.uk/photos/A065336811/220/user-account-profile-circle-flat-icon-for-apps-and-websites-.webp"
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

      <div style={{}}>
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
          &ensp; <p style={{ marginTop: 4 }}>{I18n.get("arena")}</p>
        </NavLink>
      </div>

      {user.instructor === true && athletes.length !== 0 ? (
        <React.Fragment>
          <p style={(activeTextStyle, { marginLeft: 12, marginTop: 10 })}>
            <img
              src={red}
              height="30"
              width="30"
              style={{ marginBottom: 6 }}
              alt="pareto-learn"
            />
            &ensp; {I18n.get("mentorship")}
          </p>

          {/* Experience/Quick Info Below */}
          <div className="small-overflow">
            {athletes.map((relationship, idx) => {
              return (
                <NavLink to={`/mentorship/${relationship.id}`} key={idx}>
                  <div
                    className="flex"
                    style={{
                      fontSize: 16,
                      color: "white",
                      padding: 8,
                    }}
                  >
                    <p style={{ marginTop: 6, marginLeft: 18 }}>
                      {idx + 1}. {relationship.mentee.fName}{" "}
                      {relationship.mentee.lName}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </React.Fragment>
      ) : null}
      {user.instructor !== true ? (
        <div>
          {/* Experience/Quick Info Below */}
          <div style={{ marginTop: 15, marginLeft: 3 }}>
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
        </div>
      ) : null}

      <div style={{ flex: "0 0 4px" }} />

      <div style={{ flex: "0 0 4px" }} />

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

      <div style={{ flex: "0 0 4px" }} />

      <div style={{ flex: "0 0 4px" }} />

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
        &ensp;Edit Profile
      </NavLink>

      <div style={{ flex: "0 0 4px" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
};

export default LeftNav;
