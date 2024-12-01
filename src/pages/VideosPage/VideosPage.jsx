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
    <Box sx={{ p: 2, maxWidth: '1000px' }}>
      {videos.map((video) => (
        <Box
          key={video.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #dfe1e5'
          }}
        >
          <Box
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            sx={{
              cursor: 'pointer',
              mr: 2,
              flexShrink: 0,
              width: '200px',
              height: '112px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 1
            }}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              component="a"
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              sx={{
                fontSize: '18px',
                color: '#1a0dab',
                textDecoration: 'none',
                display: 'block',
                mb: 1,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {video.title}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#70757a',
                mb: 1
              }}
            >
              {new Date(video.publishedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default VideosPage;
