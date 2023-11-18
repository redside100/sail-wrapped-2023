import React from "react";
import { Box, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { Leaderboard } from "@mui/icons-material";

const Leaderboards = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" gap={1} alignItems="center">
            <Leaderboard sx={{ fontSize: 48 }} />
            <Typography variant="h3">Leaderboards</Typography>
          </Box>
          <Typography>Rankings calculated from messages and reactions</Typography>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Leaderboards;
