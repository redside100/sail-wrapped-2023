import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const BasicStatCard = ({ Icon, name, value, altValue, loading }) => {
  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={150} />;
  }
  return (
    <Card>
      <CardContent
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08) !important",
          },
          transition: "background-color 0.2s",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            {Icon && <Icon sx={{ fontSize: 30 }} />}
            <Typography variant="h5" noWrap>
              {name}
            </Typography>
          </Box>
          {altValue != null ? (
            altValue()
          ) : (
            <Typography variant="h3" noWrap color="#5ac8fa">
              {value}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

BasicStatCard.propTypes = {
  Icon: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  altValue: PropTypes.func,
  loading: PropTypes.bool,
};

BasicStatCard.defaultProps = {
  Icon: null,
  value: null,
  altValue: null,
  loading: false,
};

export default BasicStatCard;
