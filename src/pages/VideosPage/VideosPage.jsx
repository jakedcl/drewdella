import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Alert, useTheme, useMediaQuery } from "@mui/material";

function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box sx={{
      p: { xs: 1, sm: 2 },
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {videos.map((video) => (
        <Box
          key={video.id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
            mb: { xs: 3, sm: 4 },
            pb: { xs: 2, sm: 2 },
            borderBottom: '1px solid #dfe1e5'
          }}
        >
          <Box
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            sx={{
              cursor: 'pointer',
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1.5, sm: 0 },
              flexShrink: 0,
              width: { xs: '160px', sm: '200px' },
              height: { xs: '90px', sm: '112px' },
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
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%'
          }}>
            <Typography
              component="a"
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              sx={{
                fontSize: { xs: '16px', sm: '18px' },
                color: '#1a0dab',
                textDecoration: 'underline',
                display: 'block',
                mb: 1,
                width: '100%',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              {video.title}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
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
