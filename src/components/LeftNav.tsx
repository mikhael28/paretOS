import React, {
  ReactComponentElement,
  StyleHTMLAttributes,
  useContext,
  useState,
  useRef,
  ComponentPropsWithRef,
  useEffect,
  SyntheticEvent,
  CSSProperties,
} from "react";
import { NavLink } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import { AiFillCode } from "react-icons/ai";
import { FaTools, FaHandsHelping } from "react-icons/fa";
import { IoMdSchool, IoMdCreate } from "react-icons/io";
import { BiRun } from "react-icons/bi";
import { Avatar, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import white from "../assets/Pareto_Lockup-White.png";
import { availableLanguages, updateLanguage } from "../libs/languages";
import LanguageContext, { Language } from "../state/LanguageContext";
import { User } from "../types/ProfileTypes";
import { Relationship } from "../types/MentorshipTypes";
import Pomodoro from "./Pomodoro";

interface LeftNavProps {
  user: User;
  athletes: Array<Relationship>;
  chosenLanguage?: object;
  updateState?: any;
}

// Style definitions
const headingStyle: CSSProperties = {
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 600,
  marginLeft: 16,
  marginRight: 8,
  marginTop: 24,
  textTransform: "uppercase",
  letterSpacing: "2.5px",
  width: "fit-content",
};
const subheadingStyle = {
  fontSize: 15,
  marginTop: 8,
  marginLeft: 16,
  display: "flex",
  alignItems: "center",
};
const activeStyle = {
  opacity: 1,
  textDecoration: "none",
};

function LeftNav(props: LeftNavProps) {
  const theme = useTheme();
  const { language, setLanguage } = useContext(LanguageContext);
  const { user, athletes } = props;
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedCode, setSelectedCode] = useState<string>(
    (language as Language).code as string
  );
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (code: string) => {
    setSelectedCode(code);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetLanguage = (language: any) => {
    setLanguage(language);
  };

  // Dropdown styling is very hacky at the moment - will eventually be converted to MUI
  const LanguageDropdown = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleClickListItem}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{ width: 24, height: 24 }}
          src={(language as Language).image as string}
        />
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
              handleMenuItemClick(language.code);
              updateLanguage({
                language,
                id: user.id.toString(),
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

  const iconStyle = { height: 18, width: 18, margin: 3 };

  const arenaMenu: LeftNavSection = {
    heading: { path: "/", label: I18n.get("arena") },
    subHeadings: [
      {
        path: "/arena/create/sprints",
        label: I18n.get("startSprint"),
        Icon: <BiRun style={iconStyle} />,
      },
      {
        path: "/arena/create/template",
        label: "Sprint Template",
        Icon: <IoMdCreate style={iconStyle} />,
      },
    ],
  };

  const mentorshipsMenu: LeftNavSection | null =
    user.instructor === true && athletes.length > 0
      ? {
        heading: { path: "/mentorship", label: I18n.get("mentorship") },
        subHeadings: athletes.map((relationship) => ({
          path: `/mentorship/${relationship.id}`,
          label: `${relationship.mentee.fName} ${relationship.mentee.lName}`,
          Icon: (
            <FaHandsHelping style={{ height: 20, width: 20, margin: 2 }} />
          ),
        })),
      }
      : null;

  const trainingMenu: LeftNavSection = {
    heading: { path: "/training", label: I18n.get("basicTraining") },
    subHeadings: [
      {
        path: `/training/${user.apprenticeshipId}`,
        label: I18n.get("technicalTraining"),
        Icon: <AiFillCode style={iconStyle} />,
      },
      {
        path: `/training/${user.productId}`,
        label: I18n.get("product"),
        Icon: <FaTools style={iconStyle} />,
      },
      {
        path: `/training/${user.masteryId}`,
        label: I18n.get("interviewing"),
        Icon: <IoMdSchool style={iconStyle} />,
      },
    ],
  };

  const fullMenu: LeftNavSection[] = [
    /* Arena */
    arenaMenu,
  ];

  if (mentorshipsMenu) fullMenu.push(mentorshipsMenu);

  fullMenu.push(
    /* Training */
    trainingMenu,
    /* Library of Context */
    {
      heading: { path: "/context-builder", label: I18n.get("library") },
      subHeadings: [],
    },
    /* Journal */
    // TODO re-enable journal once it's ready
    // {
    //   heading: { path: "/journal", label: I18n.get("journal") },
    //   subHeadings: [],
    // },
    /* Profile - TODO: move to dropdown from profile pic */
    {
      heading: { path: `/profile/edit/${user.id}`, label: "Profile" },
      subHeadings: [],
    }
  );

  return (
    <div id="mySidenav" className="sidenav">
      <div
        style={{
          marginLeft: 16,
          marginRight: 16,
          marginBottom: 8,
          display: "flex",
          width: "calc(100% - 32px)",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={

              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            }
          />

          <p
            style={{
              fontSize: 18,
              border: "none",
              marginLeft: 12,
              fontWeight: 600,
            }}
          >
            {user.fName}
          </p>
        </div>
        <LanguageDropdown />
      </div>

      {fullMenu.map((menuSection, i) => (
        <MenuSection key={`menu-${i}`} data={menuSection} />
      ))}

      <Pomodoro headingStyle={headingStyle} />

      <div
        style={{
          width: "calc(max(254px, 20vw - 16px))",
          backgroundColor: theme.palette.background.paper,
          position: "fixed",
          paddingTop: 32,
          bottom: 24,
          left: 16,
        }}
      >
        <img
          src={white}
          width="120"
          style={{ opacity: 0.6 }}
          alt="pareto logo"
          onMouseEnter={(e) => {
            (e.currentTarget.style.opacity as any) = 1;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.opacity as any) = 0.6;
          }}
        />
      </div>
    </div>
  );
}

// Menu rending components
interface LeftNavItem {
  path: string;
  label: string;
  Icon?: React.ReactComponentElement<any>;
}
interface LeftNavSection {
  heading: LeftNavItem;
  subHeadings: LeftNavItem[];
}

interface SubHeadingsProps extends ComponentPropsWithRef<any> {
  subHeadings: LeftNavItem[];
}

function MenuSection({ data }: { data: LeftNavSection }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const subHeadingsRef = useRef(null);

  useEffect(() => {
    const element = subHeadingsRef.current;
    if (expanded && element) {
      const { top, bottom } = (
        element as HTMLDivElement
      ).getBoundingClientRect();
      const height = bottom - top;
      if (height < 250) {
        (element as HTMLDivElement).style.maxHeight = `${height}px`;
      }
    }
  });

  const handleClick = (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => {
    const caratElement = e.target as HTMLDivElement;
    const element = subHeadingsRef.current;
    if (element && !expanded && !updating) {
      setUpdating(true);
      caratElement.classList.remove("dropdown-caret-down");
      caratElement.classList.add("dropdown-caret-up");
      (element as HTMLDivElement).style.top = `0px`;
      (element as HTMLDivElement).style.height = `fit-content`;
      (element as HTMLDivElement).style.maxHeight = `250px`;
      setTimeout(() => {
        setUpdating(false);
        const { top, bottom } = (
          element as HTMLDivElement
        ).getBoundingClientRect();
        const height = bottom - top;
        (element as HTMLDivElement).style.maxHeight = `${height}px`;
        setExpanded(!expanded);
      }, 500);
    } else if (element && expanded && !updating) {
      const { top, bottom } = (
        element as HTMLDivElement
      ).getBoundingClientRect();
      const height = bottom - top;
      (element as HTMLDivElement).style.maxHeight = `${height}px`;
      setUpdating(true);
      caratElement.classList.remove("dropdown-caret-up");
      caratElement.classList.add("dropdown-caret-down");
      (element as HTMLDivElement).style.height = "0px";
      (element as HTMLDivElement).style.maxHeight = "0px";
      (element as HTMLDivElement).style.top = `-${height}px`;
      setTimeout(() => {
        (element as HTMLDivElement).style.maxHeight = `${height}px`;
        (element as HTMLDivElement).style.height = `${height}px`;
        setUpdating(false);
        setExpanded(!expanded);
      }, 300);
    }
  };

  return (
    <>
      <Heading
        path={data.heading.path}
        label={data.heading.label}
        dropdown={data.subHeadings.length > 0}
        expanded={expanded}
        handleClick={handleClick}
      />
      <div style={{ overflow: "hidden", height: "max-content" }}>
        <div
          ref={subHeadingsRef}
          style={{
            maxHeight: expanded ? `250px` : "0vh",
            position: "relative",
            transition: expanded
              ? "top 0.2s ease"
              : "max-height 0.5s ease-out, top 0.2s ease",
            overflow: "scroll",
          }}
        >
          <Subheadings subHeadings={data.subHeadings} />
        </div>
      </div>
    </>
  );
}

function Heading({
  path,
  label,
  dropdown,
  expanded,
  handleClick,
}: {
  path: string;
  label: string;
  dropdown: boolean;
  expanded: boolean;
  handleClick: (e: SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div className="sidenav-dropdown">
      <NavLink
        to={path}
        style={headingStyle as StyleHTMLAttributes<HTMLElement>}
        className="flex"
        activestyle={activeStyle}
        end
      >
        <p
          style={{
            fontWeight: "600",
            opacity: 1,
          }}
        >
          {label}
        </p>
      </NavLink>
      {dropdown && (
        <div
          className={expanded ? "dropdown-caret-up" : "dropdown-caret-down"}
          onClick={handleClick}
        ></div>
      )}
    </div>
  );
}

const SubHeading = ({
  path,
  label,
  Icon,
}: {
  path: string;
  label: string;
  Icon: React.ReactComponentElement<any>;
}) => {
  return (
    <NavLink end to={path} style={subheadingStyle} activestyle={activeStyle}>
      {Icon}
      <p style={{ marginLeft: 8 }}>{label}</p>
    </NavLink>
  );
};

function Subheadings(props: SubHeadingsProps) {
  return (
    <>
      {props.subHeadings.map((sub) => (
        <SubHeading
          key={sub.label}
          path={sub.path}
          label={sub.label}
          Icon={sub.Icon as ReactComponentElement<any>}
        />
      ))}
    </>
  );
}

export default LeftNav;
