import React, { useContext } from "react";
import { UserContext } from "./App";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { AUTH_URL, DISCORD_CDN_BASE } from "./consts";
import PropTypes from "prop-types";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Leaderboards from "./pages/Leaderboards";
import { Sailing } from "@mui/icons-material";
import Debug from "./pages/Debug";
import Trends from "./pages/Trends";
import Me from "./pages/Me";
import { useSpring, animated } from "@react-spring/web";
import Media from "./pages/Media";

const MainView = ({ onLogout }) => {
  const userState = useContext(UserContext);
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });

  if (userState.isLoading) {
    return (
      <animated.div style={styles}>
        <Box
          display="flex"
          position="absolute"
          p={3}
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            <CircularProgress size={30} />
            <Typography>Loading data...</Typography>
          </Box>
        </Box>
      </animated.div>
    );
  }

  if (!Boolean(userState.loggedIn)) {
    return (
      <animated.div style={styles}>
        <Box
          display="flex"
          position="absolute"
          p={3}
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Sailing sx={{ fontSize: 80 }} />
            <Typography variant="h3">Sail Wrapped 2023</Typography>
            <Button
              variant="contained"
              onClick={() => {
                window.location = AUTH_URL;
              }}
            >
              Login with Discord
            </Button>
          </Box>
        </Box>
      </animated.div>
    );
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center">
              <Sailing sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5">Sail Wrapped 2023</Typography>
              <Box display="flex" alignItems="center" ml={2}>
                <Link to="/">
                  <Button variant="primary">
                    <Typography fontSize={20}>Home</Typography>
                  </Button>
                </Link>
                <Link to="/stats">
                  <Button variant="primary">
                    <Typography fontSize={20}>Stats</Typography>
                  </Button>
                </Link>
                <Link to="/leaderboards">
                  <Button variant="primary">
                    <Typography fontSize={20}>Leaderboards</Typography>
                  </Button>
                </Link>
                <Link to="/trends">
                  <Button variant="primary">
                    <Typography fontSize={20}>Trends</Typography>
                  </Button>
                </Link>
                <Link to="/media">
                  <Button variant="primary">
                    <Typography fontSize={20}>Media</Typography>
                  </Button>
                </Link>
                <Link to="/me">
                  <Button variant="primary">
                    <Typography fontSize={20}>
                      Me ({userState.user?.global_name})
                    </Typography>
                  </Button>
                </Link>
                {/* <Link to="/debug">
                  <Button variant="primary">
                    <Typography fontSize={20}>Debug</Typography>
                  </Button>
                </Link> */}
              </Box>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Box
                component="img"
                src={`${DISCORD_CDN_BASE}/avatars/${userState.user?.id}/${userState.user?.avatar}.png?size=32`}
                sx={{ borderRadius: "50%" }}
              />
              <Typography>
                Logged in as {userState.user?.global_name}
              </Typography>
              <Button onClick={onLogout}>Logout</Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/stats" element={<Stats />} />
        <Route exact path="/leaderboards" element={<Leaderboards />} />
        <Route exact path="/trends" element={<Trends />} />
        <Route exact path="/media" element={<Media />} />
        <Route exact path="/me" element={<Me />} />
        {/* <Route exact path="/debug" element={<Debug />} /> */}
      </Routes>
    </>
  );
};

MainView.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default MainView;
