import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import { AiFillCode } from "react-icons/ai";
import { FaTools, FaHandsHelping } from "react-icons/fa";
import { IoMdSchool, IoMdCreate } from "react-icons/io";
import { BiRun } from "react-icons/bi";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import white from "../assets/Pareto_Lockup-White.png";
import { availableLanguages, updateLanguage } from "../libs/languages";
import LanguageContext from "../LanguageContext";

function LeftNav(props) {
  const { language, setLanguage } = useContext(LanguageContext);
  const { user, athletes } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCode, setSelectedCode] = useState(language.code);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, code) => {
    setSelectedCode(code);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetLanguage = (language) => {
    setLanguage(language);
  };

  const headingStyle = {
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
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

  // Dropdown styling is very hacky at the moment - will eventually be converted to MUI
  const renderLanguageDropdown = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleClickListItem}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ width: 24, height: 24 }} src={language.image} />
      </IconButton>
      <Menu
        id="language-menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-button",
          role: "listbox",
        }}
      >
        {availableLanguages.map((language) => (
          <MenuItem
            key={language.code}
            selected={language.code === selectedCode}
            onClick={(e) => {
              handleMenuItemClick(e, language.code);
              updateLanguage({
                language,
                id: user.id,
                setLanguage: handleSetLanguage,
              });
            }}
          >
            {language.name}
          </MenuItem>
        ))}
      </Menu>
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
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={
              user.picture ||
              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            }
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
        style={headingStyle}
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

      <NavLink
        to="/sandbox"
        style={headingStyle}
        activeStyle={activeStyle}
        exact
      >
        &ensp;Sandbox
      </NavLink>

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
