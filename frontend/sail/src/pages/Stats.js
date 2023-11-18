import React from "react";
import { Box, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { Insights } from "@mui/icons-material";

const Stats = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <Insights sx={{ fontSize: 48 }} />
            <Typography variant="h3">Statistics</Typography>
          </Box>
          <Typography>Interesting stats compiled from message data</Typography>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Stats;
