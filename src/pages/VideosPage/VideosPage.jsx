import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/videos');

        if (response.data.error) {
          throw new Error(response.data.message || 'Failed to load videos');
        }

        setVideos(response.data.videos);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || 'Failed to load videos');
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
    <Box sx={{ p: 2 }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2
      }}>
        {videos.map((video) => (
          <Box
            key={video.id}
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                '.video-title': {
                  color: '#1a0dab'
                }
              }
            }}
          >
            <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 1 }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <Typography
              className="video-title"
              sx={{
                fontSize: '14px',
                color: '#1558d6',
                mb: 0.5,
                lineHeight: 1.3
              }}
            >
              {video.title}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#70757a'
              }}
            >
              {new Date(video.publishedAt).toLocaleDateString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default VideosPage;
