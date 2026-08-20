import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import {
  SearchResults,
  VideoResult,
  formatElapsed,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";

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
          throw new Error("Failed to load videos");
        }

        setVideos(list);
        setElapsed(formatElapsed(performance.now() - started));
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Couldn’t load videos right now. Try again in a bit.");
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
      <SerpMessage
        title="Videos are taking a break."
        detail={error}
        links={[
          { to: "/", label: "All results" },
          { to: "/music", label: "Music" },
        ]}
      />
    );
  }

  if (!videos.length) {
    return (
      <SearchResults count={0} elapsed={elapsed}>
        <SerpMessage
          title="No videos to show yet."
          detail="New clips will land here when they’re up."
          links={[
            { to: "/music", label: "Music" },
            { to: "/images", label: "Images" },
          ]}
        />
      </SearchResults>
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
