import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, CircularProgress, Alert } from "@mui/material";
import {
  SearchResults,
  VideoResult,
  formatElapsed,
} from "../../components/SearchResults/SearchResults.jsx";

function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState("0.12");

  useEffect(() => {
    const fetchVideos = async () => {
      const started = performance.now();
      try {
        setLoading(true);
        const response = await axios.get("/api/videos");

        const list = response.data?.videos;
        if (response.data?.error || !Array.isArray(list)) {
          throw new Error(response.data?.message || "Failed to load videos");
        }

        setVideos(list);
        setElapsed(formatElapsed(performance.now() - started));
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <SearchResults count={videos.length} elapsed={elapsed}>
      {videos.map((video) => (
        <VideoResult key={video.id} video={video} />
      ))}
    </SearchResults>
  );
}

export default VideosPage;
