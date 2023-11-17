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
import { AUTH_URL } from "./consts";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MainView = ({ onLogout }) => {
  const userState = useContext(UserContext);

  if (!Boolean(userState.loggedIn)) {
    return (
      <Box p={3}>
        {userState.isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              window.location = AUTH_URL;
            }}
          >
            Login with Discord
          </Button>
        )}
      </Box>
    );
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex">
              <Typography variant="h4">Sail Wrapped 2023</Typography>
              <Box display="flex" alignItems="center" gap={2} ml={2}>
                <Link to="/">
                  <Typography variant="h5">Home</Typography>
                </Link>
                <Link to="/stats">
                  <Typography variant="h5">Stats</Typography>
                </Link>
                <Link to="/leaderboards">
                  <Typography variant="h5">Leaderboards</Typography>
                </Link>
              </Box>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Typography>
                Logged in as {userState.user?.global_name}
              </Typography>
              <Button variant="contained" onClick={onLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

MainView.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default MainView;
