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
              All message data was collected between April 12, 2016 to November 15,
              2023.
            </Typography>
            <Typography>
              Excludes{" "}
              <Link
                href="https://discord.com/channels/169611319501258753/653764929169522710"
                target="_blank"
              >
                #waifu
              </Link>{" "}
              for obvious reasons.
            </Typography>
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Home;
