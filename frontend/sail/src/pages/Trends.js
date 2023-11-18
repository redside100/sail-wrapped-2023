import React from "react";
import { Box, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { TrendingUp } from "@mui/icons-material";

const Trends = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <TrendingUp sx={{ fontSize: 48 }} />
            <Typography variant="h3">Trends</Typography>
          </Box>
          <Typography>Historical trends throughout the past 7 years</Typography>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Trends;
