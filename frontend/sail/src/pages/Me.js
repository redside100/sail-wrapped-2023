import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Grid, Link, Tooltip, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { UserContext } from "../App";
import {
  AccessTime,
  AlternateEmail,
  Attachment,
  Badge,
  Inbox,
  Message,
  Outbox,
  Percent,
  Person,
  Storage,
} from "@mui/icons-material";
import BasicStatCard from "../components/BasicStatCard";
import { getMe } from "../api";
import { formatSize } from "../util";

const Me = () => {
  const userState = useContext(UserContext);
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  const [meData, setMeData] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);

  useEffect(() => {
    const loadMe = async () => {
      const token = localStorage.getItem("access_token");
      setLoadingMe(true);
      const res = await getMe(token);
      if (res.status === "ok") {
        if (res.data?.has_data) {
          setMeData(res.data);
        } else {
          toast.error("No info found for this account", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      } else {
        window.location = "/";
      }
      setLoadingMe(false);
    };
    loadMe();
  }, []);

  console.log(meData);

  const mostFrequentHour = useMemo(() => {
    if (meData?.most_frequent_time > 12) {
      return `${meData?.most_frequent_time - 12} PM UTC`;
    }
    return `${meData?.most_frequent_time} AM UTC`;
  }, [meData]);

  const attachmentSize = useMemo(() => formatSize(meData?.attachments_size ?? 0), [meData]);

  const averageAttachmentSize = useMemo(() => {
    const size =
      meData?.attachments_sent === 0
        ? 0
        : Math.round(meData?.attachments_size / meData?.attachments_sent);
    if (size < 1000) {
      return `${size} B`;
    } else if (size < 1000000) {
      return `${(size / 1000).toFixed(1)} KB`;
    } else if (size < 1000000000) {
      return `${(size / 1000000).toFixed(1)} MB`;
    } else {
      return `${(size / 1000000000).toFixed(1)} GB`;
    }
  }, [meData]);

  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <Person sx={{ fontSize: 48 }} />
            <Typography variant="h3">Me</Typography>
          </Box>
          <Typography>
            Interesting stats about {userState.user?.global_name} in Sail
          </Typography>
          <Box display="flex" justifyContent="center" width="80%" mt={2}>
            <Grid container spacing={2}>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Message}
                  name="Messages Sent"
                  value={meData?.messages_sent}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={AccessTime}
                  name="Most Frequent Hour"
                  value={mostFrequentHour}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Badge}
                  name="Stored Nickname"
                  altValue={() => (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                    >
                      <Tooltip
                        title={
                          <Typography>Useful for searching mentions</Typography>
                        }
                      >
                        <Link sx={{ fontSize: 37 }}>
                          {meData?.user_nickname}
                        </Link>
                      </Tooltip>
                    </Box>
                  )}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Attachment}
                  name="Attachments Sent"
                  value={meData?.attachments_sent}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Storage}
                  name="Total Attachments Size"
                  value={attachmentSize}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Storage}
                  name="Avg. Attachment Size"
                  value={averageAttachmentSize}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Inbox}
                  name="Reactions Received"
                  value={meData?.reactions_received}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Outbox}
                  name="Reactions Given"
                  value={meData?.reactions_given}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Percent}
                  name="Reaction Ratio"
                  value={
                    meData?.reactions_given === 0
                      ? "Infinity"
                      : Math.round(
                          (meData?.reactions_received /
                            meData?.reactions_given) *
                            100
                        ) / 100
                  }
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Inbox}
                  name="Mentions Received"
                  value={meData?.mentions_received}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Outbox}
                  name="Mentions Given"
                  value={meData?.mentions_given}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={4} xs={6}>
                <BasicStatCard
                  Icon={Percent}
                  name="Mention Ratio"
                  value={
                    meData?.mentions_given === 0
                      ? "Infinity"
                      : Math.round(
                          (meData?.mentions_received / meData?.mentions_given) *
                            100
                        ) / 100
                  }
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <BasicStatCard
                  Icon={AlternateEmail}
                  name="Most Mentioned"
                  altValue={() => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                    >
                      {meData?.most_mentioned_given != null ? (
                        <>
                          <Tooltip
                            title={<Typography>Click to lookup ID</Typography>}
                          >
                            <Link
                              href={`https://discord.id/?prefill=${meData?.most_mentioned_given?.id}`}
                              target="_blank"
                            >
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Box
                                  component="img"
                                  src={`https://cdn.discordapp.com/embed/avatars/${
                                    (meData?.most_mentioned_given?.id?.slice(-1) ?? 0) % 5
                                  }.png`}
                                  height={40}
                                  width={40}
                                  sx={{
                                    zIndex: 1,
                                    borderRadius: "50%",
                                  }}
                                />
                              </Box>
                            </Link>
                          </Tooltip>
                          <Tooltip
                            title={
                              <Typography>
                                Mentioned in{" "}
                                {meData?.most_mentioned_given?.count} of your
                                messages
                              </Typography>
                            }
                          >
                            <Link sx={{ fontSize: 37 }}>
                              {meData?.most_mentioned_given?.name}
                            </Link>
                          </Tooltip>
                        </>
                      ) : (
                        <Typography variant="h3" noWrap color="grey">
                          No data
                        </Typography>
                      )}
                    </Box>
                  )}
                  loading={loadingMe}
                />
              </Grid>
              <Grid item lg={6} xs={12}>
                <BasicStatCard
                  Icon={AlternateEmail}
                  name="Most Mentioned By"
                  altValue={() => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                    >
                      {meData?.most_mentioned_received != null ? (
                        <>
                          <Tooltip
                            title={<Typography>Click to lookup ID</Typography>}
                          >
                            <Link
                              href={`https://discord.id/?prefill=${meData?.most_mentioned_received?.id}`}
                              target="_blank"
                            >
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Box
                                  component="img"
                                  src={`https://cdn.discordapp.com/embed/avatars/${
                                    (meData?.most_mentioned_received?.id?.slice(-1) ?? 0) % 5
                                  }.png`}
                                  height={40}
                                  width={40}
                                  sx={{
                                    zIndex: 1,
                                    borderRadius: "50%",
                                  }}
                                />
                              </Box>
                            </Link>
                          </Tooltip>
                          <Tooltip
                            title={
                              <Typography>
                                Mentioned you in{" "}
                                {meData?.most_mentioned_received?.count} of
                                their messages
                              </Typography>
                            }
                          >
                            <Link sx={{ fontSize: 37 }}>
                              {meData?.most_mentioned_received?.name}
                            </Link>
                          </Tooltip>
                        </>
                      ) : (
                        <Typography variant="h3" noWrap color="grey">
                          No data
                        </Typography>
                      )}
                    </Box>
                  )}
                  loading={loadingMe}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Me;
