import React, { useContext } from "react"
import { Box, Button, Typography } from "@mui/material"
import { UserContext } from "../App";

const Debug = () => {
  const userState = useContext(UserContext);
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="center">
        <Typography variant="h3">Debug</Typography>
      </Box>
      <Box mt={1}>
        <Button variant="contained" onClick={() => console.log(userState)}>Dump user state</Button>
      </Box>
    </Box>
  );
};

export default Debug;