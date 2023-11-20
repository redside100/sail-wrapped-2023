import React, { useEffect, useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import { LEADERBOARD_TAB } from "../consts";
import { getLeaderboard } from "../api";
import {
  Box,
  CircularProgress,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { formatSize } from "../util";
import { Search } from "@mui/icons-material";
import { toast } from "react-toastify";

const TAB_TO_TYPE = {
  [LEADERBOARD_TAB.MESSAGES_SENT]: "messages_sent",
  [LEADERBOARD_TAB.TOTAL_ATTACHMENTS_SIZE]: "attachments_size",
  [LEADERBOARD_TAB.MENTIONS_GIVEN]: "mentions_given",
  [LEADERBOARD_TAB.MENTIONS_RECEIVED]: "mentions_received",
  [LEADERBOARD_TAB.REACTIONS_GIVEN]: "reactions_given",
  [LEADERBOARD_TAB.REACTIONS_RECEIVED]: "reactions_received",
  [LEADERBOARD_TAB.PATTERN]: "pattern",
};

const BasicLeaderboard = ({ tab }) => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [patternInput, setPatternInput] = useState("");
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const token = localStorage.getItem("access_token");
      setLoadingLeaderboard(true);
      const res = await getLeaderboard(token, TAB_TO_TYPE[tab]);
      if (res.status === "ok") {
        setLeaderboardData(res.data);
      } else {
        window.location = "/";
      }
      setLoadingLeaderboard(false);
    };
    if (tab !== LEADERBOARD_TAB.PATTERN) {
      loadLeaderboard();
    } else {
      setLeaderboardData(null);
    }
  }, [tab]);

  const rows = useMemo(
    () =>
      leaderboardData?.map((entry, i) => ({
        id: entry.id,
        rank: i + 1,
        user: {
          id: entry.id,
          name: entry.name,
          url: entry.avatar_url,
        },
        count:
          tab !== LEADERBOARD_TAB.TOTAL_ATTACHMENTS_SIZE
            ? entry.count
            : formatSize(entry.count),
      })) ?? [],
    [leaderboardData, tab]
  );
  const columns = [
    {
      field: "rank",
      headerName: "Rank",
      width: 100,
    },
    {
      field: "user",
      headerName: "User",
      width: 400,
      renderCell: ({ value }) => (
        <Box display="flex" gap={1} alignItems="center">
          <Tooltip title={<Typography>Click to lookup ID</Typography>}>
            <Link
              href={`https://discord.id/?prefill=${value.id}`}
              target="_blank"
            >
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box
                  component="img"
                  src={`https://cdn.discordapp.com/embed/avatars/${
                    value.id % 5
                  }.png`}
                  height={32}
                  width={32}
                  sx={{
                    zIndex: 1,
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Link>
          </Tooltip>
          <strong>{value.name}</strong>
        </Box>
      ),
      sortable: false,
    },
    {
      field: "count",
      headerName: "Count",
      width: 100,
      sortable: false,
    },
  ];

  const submitInput = async () => {
    if (patternInput == null || patternInput.length === 0) {
      setInputError(true);
      toast.error("Pattern can't be empty", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    if (patternInput.length > 60) {
      setInputError(true);
      toast.error("Pattern can be a maximum of 60 characters", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    const token = localStorage.getItem("access_token");
    setLoadingLeaderboard(true);
    const res = await getLeaderboard(token, "pattern", patternInput);
    if (res.status === "ok") {
      if (res.data.length > 0) {
        setLeaderboardData(res.data);
      } else {
        toast.error("No data found for that pattern.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setInputError(true);
        setLeaderboardData(null);
      }
    } else {
      toast.error(res.reason, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setInputError(true);
      setLeaderboardData(null);
    }
    setLoadingLeaderboard(false);
  };

  return (
    <animated.div style={styles}>
      {tab === LEADERBOARD_TAB.PATTERN && (
        <Box
          mt={2}
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            variant="outlined"
            disabled={loadingLeaderboard}
            error={inputError}
            placeholder="Search for a pattern..."
            value={patternInput}
            onChange={(e) => {
              setPatternInput(e.target.value);
              setInputError(false);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && !loadingLeaderboard) {
                submitInput();
                e.target.blur();
              }
            }}
          />
          <IconButton
            variant="contained"
            sx={{ height: 40 }}
            disabled={loadingLeaderboard}
            onClick={submitInput}
          >
            <Search />
          </IconButton>
        </Box>
      )}
      <Box maxWidth={1000} display="flex" justifyContent="center" mt={2}>
        {loadingLeaderboard ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            mt={2}
          >
            <CircularProgress size={30} />
            <Typography>Loading leaderboard...</Typography>
          </Box>
        ) : (
          leaderboardData != null && (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              rowSelection={false}
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
            />
          )
        )}
      </Box>
    </animated.div>
  );
};

BasicLeaderboard.propTypes = {
  tab: PropTypes.string.isRequired,
};

export default BasicLeaderboard;
