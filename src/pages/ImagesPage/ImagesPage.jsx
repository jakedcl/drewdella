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
        console.log('API Response:', response.data);

        if (!response.data || !response.data.images) {
          throw new Error('Invalid response format');
        }

        setImages(response.data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to load images. Please try again later."
        );
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
