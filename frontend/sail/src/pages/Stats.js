import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, Link as MuiLink, Tooltip } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import {
  Abc,
  AccessTime,
  AlternateEmail,
  Attachment,
  EmojiEmotions,
  FontDownload,
  Insights,
  KeyboardCapslock,
  Leaderboard,
  Link,
  Message,
  Storage,
  TrendingUp,
} from "@mui/icons-material";
import { getStats } from "../api";
import BasicStatCard from "../components/BasicStatCard";

const Stats = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  const [statsData, setStatsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const token = localStorage.getItem("access_token");
      setLoadingStats(true);
      const res = await getStats(token);
      if (res.status === "ok") {
        setStatsData(res.data);
      } else {
        window.location = "/";
      }
      setLoadingStats(false);
    };
    loadStats();
  }, []);

  const mostFrequentHour = useMemo(() => {
    if (statsData?.most_frequent_hour > 12) {
      return `${statsData?.most_frequent_hour - 12} PM UTC`;
    }
    return `${statsData?.most_frequent_hour} AM UTC`;
  }, [statsData]);

  const reactions = useMemo(
    () =>
      Object.keys(statsData?.top_three_reactions ?? {})
        .map((url) => ({
          url,
          count: statsData?.top_three_reactions[url],
        }))
        .sort((a, b) => b.count - a.count),
    [statsData]
  );

  const channels = useMemo(() =>
    Object.keys(statsData?.top_three_channels ?? {})
      .map((id) => ({
        id,
        count: statsData?.top_three_channels[id]?.count,
        name: statsData?.top_three_channels[id]?.name,
      }))
      .sort((a, b) => b.count - a.count)
  );

  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <Insights sx={{ fontSize: 48 }} />
            <Typography variant="h3">Statistics</Typography>
          </Box>
          <Typography>Interesting stats compiled from message data</Typography>
          <Box display="flex" justifyContent="center" width="80%" mt={2}>
            <Grid container spacing={2}>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Message}
                  name="Total Messages"
                  value={statsData?.total_messages}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={TrendingUp}
                  name="Avg. Messages per Hour"
                  value={statsData?.average_messages_per_hour}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={AccessTime}
                  name="Most Frequent Hour"
                  value={mostFrequentHour}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Abc}
                  name="Avg. Words per Message"
                  value={statsData?.average_words}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={FontDownload}
                  name="Avg. Characters per Message"
                  value={statsData?.average_characters}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={KeyboardCapslock}
                  name="Messages in Full Caps"
                  value={statsData?.messages_in_full_caps}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Attachment}
                  name="Total Attachments"
                  value={statsData?.total_attachments}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Storage}
                  name="Total Attachments Size"
                  value={`${(
                    statsData?.total_attachments_size / 1000000000
                  ).toFixed(1)} GB`}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={4} xs={12}>
                <BasicStatCard
                  Icon={Link}
                  name="Links Sent"
                  value={statsData?.links_sent}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <BasicStatCard
                  Icon={EmojiEmotions}
                  name="Total Reactions"
                  value={statsData?.total_reactions}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <BasicStatCard
                  Icon={AlternateEmail}
                  name="Total Mentions"
                  value={statsData?.total_mentions}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <BasicStatCard
                  Icon={Leaderboard}
                  name="Top 3 Reactions"
                  altValue={() => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={3}
                    >
                      {reactions.map((reaction, i) => (
                        <Box
                          key={`reaction-${i}`}
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Box
                            component="img"
                            src={reaction.url}
                            height={40}
                            width={40}
                            sx={{
                              zIndex: 1,
                            }}
                          />
                          <Typography variant="h3" noWrap color="#5ac8fa">
                            {reaction.count}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  loading={loadingStats}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <BasicStatCard
                  Icon={Leaderboard}
                  name="Top 3 Channels"
                  altValue={() => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={3}
                    >
                      {channels.map((channel, i) => (
                        <Box
                          key={`channel-${i}`}
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                        >
                          <Tooltip
                            title={
                              <Typography>{channel.count} messages</Typography>
                            }
                          >
                            <MuiLink sx={{ fontSize: 37 }}>
                              #{channel.name}
                            </MuiLink>
                          </Tooltip>
                        </Box>
                      ))}
                    </Box>
                  )}
                  loading={loadingStats}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Stats;
