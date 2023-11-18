import React, { useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

ChartJS.defaults.color = "#FFFFFF";

const TrendChart = ({ trendData, trendName }) => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });
  const data = useMemo(
    () => ({
      datasets: [
        {
          data: trendData.map((point) => ({
            x: moment.unix(point.timestamp).format("YYYY-MM-DD"),
            y: point.count,
          })),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)",
          fill: true,
        },
      ],
    }),
    [trendData]
  );
  return (
    <animated.div style={styles}>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width={900}
        height={500}
        alignItems="center"
      >
        <Typography variant="h5">
          Historical usage of &quot;{trendName}&quot;
        </Typography>
        <Line options={CHART_OPTIONS} data={data} style={{ zIndex: 1 }}/>
      </Box>
    </animated.div>
  );
};

TrendChart.propTypes = {
  trendData: PropTypes.array.isRequired,
  trendName: PropTypes.string.isRequired,
};

export default TrendChart;
