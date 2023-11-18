import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { UserContext } from "../App";
import { useSpring, animated } from "@react-spring/web";

const Debug = () => {
  const userState = useContext(UserContext);
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" justifyContent="center">
          <Typography variant="h3">Debug</Typography>
        </Box>
        <Box mt={1}>
          <Button variant="contained" onClick={() => console.log(userState)}>
            Dump user state
          </Button>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Debug;
