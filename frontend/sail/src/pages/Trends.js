import React, { useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { Search, TrendingUp } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getTrendData } from "../api";
import TrendChart from "../components/TrendChart";

const Trends = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });

  const [trendInput, setTrendInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [trendData, setTrendData] = useState(null);
  const [trendName, setTrendName] = useState(null);
  const [loadingTrendData, setLoadingTrendData] = useState(false);

  const submitInput = async () => {
    if (trendInput == null || trendInput.length === 0) {
      setInputError(true);
      toast.error("Trend word can't be empty", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    if (trendInput.includes(" ")) {
      setInputError(true);
      toast.error("Trend word must be one word (no spaces)", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    if (trendInput.length > 40) {
      setInputError(true);
      toast.error("Trend word can be a maximum of 40 characters", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    const token = localStorage.getItem("access_token");
    setLoadingTrendData(true);
    const res = await getTrendData(trendInput, token);
    if (res.status === "ok") {
      if (res.data.length > 0) {
        setTrendData(res.data);
        setTrendName(trendInput.toLowerCase());
      } else {
        toast.error("No trend data found for that word.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });

        setInputError(true);
        setTrendName(null);
        setTrendData(null);
      }
    } else {
      toast.error(res.reason, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setInputError(true);
      setTrendName(null);
      setTrendData(null);
    }
    setLoadingTrendData(false);
  };

  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box display="flex" gap={1} alignItems="center">
            <TrendingUp sx={{ fontSize: 48 }} />
            <Typography variant="h3">Trends</Typography>
          </Box>
          <Typography>Word usage throughout the past 7 years</Typography>
          <Box mt={2} display="flex" gap={1} alignItems="center">
            <TextField
              variant="outlined"
              disabled={loadingTrendData}
              error={inputError}
              placeholder="Search for a word..."
              value={trendInput}
              onChange={(e) => {
                setTrendInput(e.target.value);
                setInputError(false);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && !loadingTrendData) {
                  submitInput();
                  e.target.blur();
                }
              }}
            />
            <IconButton
              variant="contained"
              sx={{ height: 40 }}
              disabled={loadingTrendData}
              onClick={submitInput}
            >
              <Search />
            </IconButton>
          </Box>
          <Box mt={4}>
            {loadingTrendData ? (
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <CircularProgress size={30} />
                <Typography>Loading trend data...</Typography>
              </Box>
            ) : (
              trendName != null &&
              trendData != null && (
                  <TrendChart trendData={trendData} trendName={trendName} />
              )
            )}
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Trends;
