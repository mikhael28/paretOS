import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { AppBar, Tabs, Tab } from "@mui/material";

interface Props {
  key: number;
  setKey: Dispatch<SetStateAction<number>>;
}

/**
 * This component is an extension of MUI's Tab component.
 * @param {number} key index of the tab
 * @param {function} setKey function to set the key
 */

// FIXME: seleted tab is not highlighted
function ArenaTabsHeader({ key, setKey }: Props) {
  function handleSelect(event: SyntheticEvent, newValue: number) {
    setKey(newValue);
  }

  return (
    <AppBar
      position="static"
      style={{
        boxShadow: "none",
        backgroundImage: "none",
        backgroundColor: "transparent",
      }}
    >
      <Tabs value={key} onChange={handleSelect} aria-label="sprint tabs">
        <Tab label="Plan" style={{ fontSize: 16, letterSpacing: 3 }} />
        <Tab label="Compete" style={{ fontSize: 16, letterSpacing: 3 }} />
        <Tab label="Leaderboard" style={{ fontSize: 16, letterSpacing: 3 }} />
      </Tabs>
    </AppBar>
  );
}

export default ArenaTabsHeader;
