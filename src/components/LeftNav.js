import { NavLink } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import Image from "react-bootstrap/lib/Image";
import DropdownButton from "react-bootstrap/lib/DropdownButton";
import MenuItem from "react-bootstrap/lib/MenuItem";
import { AiFillCode } from "react-icons/ai";
import { FaTools, FaHandsHelping } from "react-icons/fa";
import { IoMdSchool, IoMdCreate } from "react-icons/io";
import { BiRun } from "react-icons/bi";
import white from "../assets/Pareto_Lockup-White.png";

function LeftNav(props) {
  const { chosenLanguage, user, updateState, athletes } = props;

  const headingStyle = {
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 48,
    paddingTop: 8,
    textTransform: "uppercase",
    letterSpacing: "2.5px",
  };
  const subheadingStyle = {
    fontSize: 15,
    marginTop: 14,
    marginLeft: 16,
    display: "flex",
  };
  const activeStyle = {
    opacity: 1,
    textDecoration: "none",
  };

  const langStyle = {
    backgroundColor: "black",
    color: white,
    padding: "3px",
  };

  const langTitle = (
    <Image
      src={chosenLanguage.image}
      height="22"
      width="22"
      circle
      style={{ position: "relative", zIndex: "999" }}
    />
  );

  // Dropdown styling is very hacky at the moment - will eventually be converted to MUI
  const renderLanguageDropdown = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <DropdownButton
        key={1}
        title={langTitle}
        id="pick-service"
        style={{
          color: "white",
          fontSize: 14,
          backgroundColor: "var(--navigation-bg)",
          backgroundImage: "none",
          border: "none",
          textAlign: "left",
          maxWidth: "40px",
          minWidth: "unset",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            background: "black",
            marginTop: "-5px",
            marginBottom: "-5px",
            padding: "8px 6px",
          }}
        >
          <MenuItem
            style={langStyle}
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
            Luganda
          </MenuItem>
          <MenuItem
            style={langStyle}
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
            Spanish
          </MenuItem>
          <MenuItem
            style={langStyle}
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
            English
          </MenuItem>

          <MenuItem
            style={langStyle}
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
            Portugeuse (BR)
          </MenuItem>

          <MenuItem
            key={1.5}
            style={langStyle}
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
            Nigeria (Pidgin)
          </MenuItem>

          <MenuItem
            key={1.6}
            style={langStyle}
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
            Hindi
          </MenuItem>
        </div>
      </DropdownButton>
    </div>
  );

  return (
    <div id="mySidenav" className="sidenav">
      <div
        style={{
          marginLeft: 16,
          marginRight: 16,
          display: "flex",
          width: "calc(100% - 32px)",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
          }}
        >
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
              fontSize: 18,
              border: "none",
              marginTop: 6,
              marginLeft: 12,
              fontWeight: 600,
            }}
          >
            {user.fName}
          </p>
        </div>
        {renderLanguageDropdown()}
      </div>
      <div style={{ marginTop: 10 }}>
        <NavLink
          to="/"
          style={headingStyle}
          className="flex"
          activeStyle={activeStyle}
          exact
        >
          <p
            style={{
              fontWeight: "600",
              opacity: 1,
              marginTop: 4,
              marginLeft: 3,
            }}
          >
            {I18n.get("arena")}
          </p>
        </NavLink>
        <NavLink
          to="/arena/create/sprints"
          style={subheadingStyle}
          activeStyle={activeStyle}
          exact
        >
          <BiRun style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("startSprint")}</p>
        </NavLink>
        <NavLink
          to="/arena/create/template"
          style={subheadingStyle}
          activeStyle={activeStyle}
          exact
        >
          <IoMdCreate style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>Sprint Template</p>
        </NavLink>
      </div>

      {user.instructor === true ? (
        <div style={{ marginTop: 14 }}>
          <NavLink
            to="/mentorship"
            style={headingStyle}
            activeStyle={activeStyle}
            exact
          >
            {I18n.get("mentorship")}
          </NavLink>

          {/* Experience/Quick Info Below */}
          <div className="small-overflow">
            {athletes.map((relationship) => (
              <NavLink
                to={`/mentorship/${relationship.id}`}
                key={relationship.id}
                style={subheadingStyle}
                activeStyle={activeStyle}
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
          style={headingStyle}
          className="flex"
          activeStyle={activeStyle}
          exact
        >
          <p style={{ marginTop: 4 }}>{I18n.get("basicTraining")}</p>
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
          style={subheadingStyle}
          activeStyle={activeStyle}
          exact
        >
          <AiFillCode style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("technicalTraining")}</p>
        </NavLink>
        <NavLink
          to={`/training/${user.productId}`}
          style={subheadingStyle}
          activeStyle={activeStyle}
          exact
        >
          <FaTools style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("product")}</p>
        </NavLink>
        <NavLink
          to={`/training/${user.masteryId}`}
          style={subheadingStyle}
          activeStyle={activeStyle}
          exact
        >
          <IoMdSchool style={{ height: 26, width: 26 }} />
          <p style={{ marginLeft: 10 }}>{I18n.get("interviewing")}</p>
        </NavLink>
      </div>

      <NavLink
        to="/context-builder"
        style={subheadingStyle}
        activeStyle={activeStyle}
        className="third-step"
        exact
      >
        &ensp;{I18n.get("library")}
      </NavLink>

      <NavLink
        to={`/profile/edit/${user.id}`}
        style={headingStyle}
        activeStyle={activeStyle}
        exact
      >
        &ensp;Profile
      </NavLink>
      <div style={{ flex: "0 0 4px" }} />

      {/* <div className="fourth-step">
        <Pomodoro />
      </div> */}

      <div style={{ flex: "0 0 16px" }} />

      <img
        src={white}
        width="120"
        style={{ opacity: 0.6, position: "fixed", bottom: 30, left: 16 }}
        alt="pareto logo"
        // eslint-disable-next-line no-return-assign
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        // eslint-disable-next-line no-return-assign
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
      />
    </div>
  );
}

export default LeftNav;
