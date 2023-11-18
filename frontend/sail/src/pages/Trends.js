import React from "react"
import { Box, Typography } from "@mui/material"
import { useSpring, animated } from "@react-spring/web";

const Trends = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3">Trends</Typography>
          <Typography>Historical trends overtime, bucketed into weeks</Typography>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Trends;