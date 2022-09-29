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
import { useNavigate } from "react-router-dom";
import { User } from "../types/ProfileTypes";
/**
 * This component is a mobile view only bottom navigation bar that helps mobile PWA users navigate the site more effectively
 */

const useStyles = makeStyles({
  root: {},
});

interface BottomNavProps {
  user: User;
}

function BottomNav({ user }: BottomNavProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

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
          onClick={() => navigate("/")}
        />
        {user.instructor !== true ? (
          <Tab
            icon={<GrCli />}
            style={{
              fontSize: 20,
              filter: theme.palette.mode === "dark" ? "invert()" : "",
            }}
            onClick={() => navigate("/training")}
          />
        ) : null}
        <Tab
          icon={<GrBook />}
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => navigate("/context-builder")}
        />
        <Tab
          icon={<GrChat />}
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => navigate("/chat")}
        />
        <Tab
          icon={<GrFingerPrint />}
          style={{
            fontSize: 20,
            filter: theme.palette.mode === "dark" ? "invert()" : "",
          }}
          onClick={() => navigate(`/profile/edit/${user.id}`)}
        />
      </Tabs>
    </Paper>
  );
}

// export default withRouter(BottomNav);
export default BottomNav;
