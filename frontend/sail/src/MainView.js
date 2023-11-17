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

const MainView = ({ onLogout }) => {
  const userState = useContext(UserContext);

  if (userState.isLoading) {
    return (
      <Box
        display="flex"
        position="absolute"
        p={3}
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!Boolean(userState.loggedIn)) {
    return (
      <Box
        display="flex"
        position="absolute"
        p={3}
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
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
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex">
              <Sailing sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h4">Sail Wrapped 2023</Typography>
              <Box display="flex" alignItems="center" ml={2}>
                <Link to="/">
                  <Button variant="primary">
                    <Typography variant="h5">Home</Typography>
                  </Button>
                </Link>
                <Link to="/stats">
                  <Button variant="primary">
                    <Typography variant="h5">Stats</Typography>
                  </Button>
                </Link>
                <Link to="/leaderboards">
                  <Button variant="primary">
                    <Typography variant="h5">Leaderboards</Typography>
                  </Button>
                </Link>
                <Link to="/debug">
                  <Button variant="primary">
                    <Typography variant="h5">Debug</Typography>
                  </Button>
                </Link>
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
        <Route exact path="/debug" element={<Debug />} />
      </Routes>
    </>
  );
};

MainView.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default MainView;
