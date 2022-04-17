import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { AppBar, Tabs, Tab } from "@mui/material";

interface ArenaTabsHeaderProps {
  setValue: Dispatch<SetStateAction<number>>;
  value: any;
}

/**
 * This component is an extension of MUI's Tab component.
 * @param {number} key index of the tab
 * @param {function} setKey function to set the key
 */

function ArenaTabsHeader({ setValue, value }: ArenaTabsHeaderProps) {
  function handleSelect(event: SyntheticEvent, newValue: number) {
    setValue(newValue);
  }

  return (
    <AppBar
      position="static"
      style={{
        marginTop: "0.5rem",
        boxShadow: "none",
        backgroundImage: "none",
        backgroundColor: "transparent",
      }}
    >
      <Tabs value={value} onChange={handleSelect} aria-label="sprint tabs">
        <Tab label="Plan" style={{ fontSize: 16, letterSpacing: 3 }} />
        <Tab label="Compete" style={{ fontSize: 16, letterSpacing: 3 }} />
        <Tab label="Leaderboard" style={{ fontSize: 16, letterSpacing: 3 }} />
      </Tabs>
    </AppBar>
  );
}

export default ArenaTabsHeader;
