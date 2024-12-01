import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Alert } from "@mui/material";

function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/videos');

        if (response.data.error) {
          throw new Error(response.data.message || 'Failed to load videos');
        }

        if (!response.data || !response.data.videos) {
          throw new Error('Invalid response format');
        }

        setVideos(response.data.videos);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || 'Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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

  if (!videos.length) {
    return (
      <Box p={2}>
        <Alert severity="info">No videos found</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card>
              <CardMedia
                component="img"
                image={video.thumbnail}
                alt={video.title}
                sx={{
                  height: 180,
                  objectFit: 'cover'
                }}
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                style={{ cursor: 'pointer' }}
              />
              <CardContent>
                <Typography variant="h6" noWrap title={video.title}>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {video.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default VideosPage;
