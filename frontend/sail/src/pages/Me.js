import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { UserContext } from "../App";
import { Person } from "@mui/icons-material";

const Me = () => {
  const userState = useContext(UserContext);
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <Person sx={{ fontSize: 48 }} />
            <Typography variant="h3">Me</Typography>
          </Box>
          <Typography>
            Interesting things about {userState.user?.global_name} in Sail
          </Typography>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Me;
