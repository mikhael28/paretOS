import React from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  GrAchievement,
  GrBook,
  GrFingerPrint,
  GrChat,
  GrCli,
} from "react-icons/gr";
import { withRouter } from "react-router-dom";

/**
 * This component is a mobile view only bottom navigation bar that helps mobile PWA users navigate the site more effectively
 */

const useStyles = makeStyles({
  root: {},
});

function BottomNav(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="navigation-bar"
      >
        <Tab
          icon={<GrAchievement />}
          style={{ fontSize: 20 }}
          onClick={() => props.history.push("/")}
        />
        {props.user.instructor !== true ? (
          <Tab
            icon={<GrCli />}
            style={{ fontSize: 20 }}
            onClick={() => props.history.push("/training")}
          />
        ) : null}
        <Tab
          icon={<GrBook />}
          style={{ fontSize: 20 }}
          onClick={() => props.history.push("/context-builder")}
        />
        <Tab
          icon={<GrChat />}
          style={{ fontSize: 20 }}
          onClick={() => props.history.push("/chat")}
        />
        <Tab
          icon={<GrFingerPrint />}
          style={{ fontSize: 20 }}
          onClick={() => props.history.push(`/profile/edit/${props.user.id}`)}
        />
      </Tabs>
    </Paper>
  );
}

export default withRouter(BottomNav);
