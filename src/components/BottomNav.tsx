import { SyntheticEvent, useState } from "react";
import { Paper, Tabs, Tab, useTheme, TabsProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  GrAchievement,
  GrBook,
  GrFingerPrint,
  GrChat,
  GrCli,
} from "react-icons/gr";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { User } from "../types/ProfileTypes";
/**
 * This component is a mobile view only bottom navigation bar that helps mobile PWA users navigate the site more effectively
 */

const useStyles = makeStyles({
  root: {},
});

interface BottomNavProps extends RouteComponentProps {
  user: User;
}

function BottomNav({ user, history }: BottomNavProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent<any, any>) => {
    setValue((event.target as TabsProps).value);
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
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => history.push("/")}
        />
        {user.instructor !== true ? (
          <Tab
            icon={<GrCli />}
            style={{
              fontSize: 20,
              filter: theme.palette.mode === "dark" ? "invert()" : "",
            }}
            onClick={() => history.push("/training")}
          />
        ) : null}
        <Tab
          icon={<GrBook />}
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => history.push("/context-builder")}
        />
        <Tab
          icon={<GrChat />}
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => history.push("/chat")}
        />
        <Tab
          icon={<GrFingerPrint />}
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => history.push(`/profile/edit/${user.id}`)}
        />
      </Tabs>
    </Paper>
  );
}

export default withRouter(BottomNav);
