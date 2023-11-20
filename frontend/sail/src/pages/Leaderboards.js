import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { Leaderboard } from "@mui/icons-material";
import BasicLeaderboard from "../components/BasicLeaderboard";
import { LEADERBOARD_TAB } from "../consts";

const Leaderboards = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  const [currentTab, setCurrentTab] = useState(LEADERBOARD_TAB.MESSAGES_SENT);
  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <Leaderboard sx={{ fontSize: 48 }} />
            <Typography variant="h3">Leaderboards</Typography>
          </Box>
          <Typography>
            Rankings calculated from messages and reactions
          </Typography>
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            sx={{
              mt: 2,
            }}
          >
            <Tab label={LEADERBOARD_TAB.MESSAGES_SENT} value={LEADERBOARD_TAB.MESSAGES_SENT} />
            <Tab
              label={LEADERBOARD_TAB.TOTAL_ATTACHMENTS_SIZE}
              value={LEADERBOARD_TAB.TOTAL_ATTACHMENTS_SIZE}
            />
            <Tab label={LEADERBOARD_TAB.MENTIONS_RECEIVED} value={LEADERBOARD_TAB.MENTIONS_RECEIVED} />
            <Tab label={LEADERBOARD_TAB.MENTIONS_GIVEN} value={LEADERBOARD_TAB.MENTIONS_GIVEN} />
            <Tab
              label={LEADERBOARD_TAB.REACTIONS_RECEIVED}
              value={LEADERBOARD_TAB.REACTIONS_RECEIVED}
            />
            <Tab label={LEADERBOARD_TAB.REACTIONS_GIVEN} value={LEADERBOARD_TAB.REACTIONS_GIVEN} />
            <Tab label={LEADERBOARD_TAB.PATTERN} value={LEADERBOARD_TAB.PATTERN} />
          </Tabs>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Typography variant="h5">{currentTab}</Typography>
            <BasicLeaderboard tab={currentTab} />
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Leaderboards;
