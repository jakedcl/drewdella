import React, { useState, useEffect } from "react";
import { Masonry } from "@mui/lab";
import { CircularProgress, Alert, Box } from "@mui/material";
import { client, urlFor } from "../../lib/sanity";

function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // GROQ query to get the imageGallery document and its images
        const query = `*[_type == "imageGallery"][0] {
          title,
          galleryImages[] {
            asset->{
              _id,
              url,
              metadata {
                dimensions
              }
            },
            alt,
            caption,
            "id": _key
          }
        }`;

        const data = await client.fetch(query);

        if (!data || !data.galleryImages) {
          setImages([]);
        } else {
          // Filter out any images that don't have an asset
          const validImages = data.galleryImages.filter(img => img && img.asset);
          setImages(validImages);
        }
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
        <Alert severity="info">No valid images found. Add images in the Sanity Studio.</Alert>
      </Box>
    );
  }

  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
      {images.map((image) => (
        <div key={image.id} style={{ margin: 4 }}>
          {image.asset && (
            <>
              <img
                src={urlFor(image.asset)
                  .width(800)
                  .auto('format')
                  .url()}
                alt={image.alt || 'Gallery image'}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 4
                }}
                loading="lazy"
              />
              {image.caption && (
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                  {image.caption}
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </Masonry>
  );
}

export default ImagesPage;
