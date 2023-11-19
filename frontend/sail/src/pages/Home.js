import React from "react";
import { Box, Link, Typography } from "@mui/material";
import { Sailing } from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";

const Home = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });

  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          height={500}
        >
          <Sailing sx={{ fontSize: 80 }} />
          <Typography variant="h3">Sail Wrapped 2023</Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography>
              A collection containing 7 years of Sail history.
            </Typography>
            <Typography color="lightgrey" mt={2}>
              All message data collected between April 12, 2016 to November 15,
              2023.
            </Typography>
            <Typography color="lightgrey">
              Excludes <Link>#waifu</Link> for obvious reasons.
            </Typography>
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Home;
