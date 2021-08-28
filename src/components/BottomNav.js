import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  GrAchievement,
  GrBook,
  GrFingerPrint,
  GrChat,
  GrCli,
} from "react-icons/gr";
import { withRouter } from "react-router-dom";
import { I18n } from "@aws-amplify/core";

/**
 * This component is a mobile view only bottom navigation bar that helps mobile PWA users navigate the site more effectively
 * @TODO Investigate bargain phone screen sizes - how can we make sure the icons resize themselves
 * @TODO How can we make sure that the icons, on a small enough screen, do not push the 5th icon out of view?
 * @TODO Review accessibility on the Tabs component
 * @TODO Re-stablish I18 localization
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
        aria-label="icon label tabs example"
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
