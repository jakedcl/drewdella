import React, { useState, useEffect } from "react";
import axios from "axios";
import { Masonry } from "@mui/lab";
import { CircularProgress, Alert, Box } from "@mui/material";

function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/images');

        if (response.data.error) {
          throw new Error(response.data.message || 'Failed to load images');
        }

        if (!response.data || !response.data.images) {
          throw new Error('Invalid response format');
        }

        // Sort images by createdAt timestamp in descending order (newest first)
        const sortedImages = response.data.images.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setImages(sortedImages);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message || 'Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
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

  if (!images.length) {
    return (
      <Box p={2}>
        <Alert severity="info">No images found</Alert>
      </Box>
    );
  }

  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
      {images.map((image, index) => (
        <div key={image.publicId || index} style={{ margin: 4 }}>
          <img
            src={image.url}
            alt={`Gallery image ${index + 1}`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 4
            }}
            loading="lazy"
          />
        </div>
      ))}
    </Masonry>
  );
}

export default ImagesPage;
