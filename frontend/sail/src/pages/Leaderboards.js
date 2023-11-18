import React from "react";
import { Box, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";

const Leaderboards = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3">Leaderboards</Typography>
          <Typography>Rankings calculated from messages and reactions</Typography>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Leaderboards;
