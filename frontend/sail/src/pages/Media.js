import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { PermMedia } from "@mui/icons-material";
import { getRandomMedia } from "../api";
import moment from "moment";

const Media = () => {
  const styles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [imageTimestamp, setImageTimestamp] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const token = localStorage.getItem("access_token");
  const rollImage = async () => {
    setLoadingImage(true);
    const res = await getRandomMedia(token);
    if (res.status === "ok") {
      setImageUrl(res.url);
      setImageTimestamp(res.timestamp);
      setLoadingImage(false);
    } else {
      window.location = "/";
    }
  };

  return (
    <animated.div style={styles}>
      <Box p={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <PermMedia sx={{ fontSize: 42 }} />
            <Typography variant="h3">Media</Typography>
          </Box>
          <Typography>Random images and gifs uploaded to Sail</Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={4}
            gap={1}
          >
            <Typography color="red">
              Clicking the button below may show NSFW or offensive content.
            </Typography>
            <Button variant="contained" sx={{ width: 200 }} onClick={rollImage} disabled={loadingImage}>
              Roll Random Media
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={3}
          >
            {loadingImage ? (
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <CircularProgress size={30} />
                <Typography>Loading media...</Typography>
              </Box>
            ) : (
              imageUrl != null &&
              imageTimestamp != null && (
                <>
                  <Typography mt={2}>
                    Sent on{" "}
                    {moment
                      .unix(imageTimestamp)
                      .format("YYYY-MM-DD [at] h:mm A UTC")}
                  </Typography>
                  <Box
                    component="img"
                    src={imageUrl}
                    maxWidth="90%"
                    maxHeight={500}
                    mt={1}
                    sx={{
                      zIndex: 1,
                      boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.4);",
                    }}
                  />
                </>
              )
            )}
          </Box>
        </Box>
      </Box>
    </animated.div>
  );
};

export default Media;
