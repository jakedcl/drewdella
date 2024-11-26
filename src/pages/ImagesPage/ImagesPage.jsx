import React, { useState, useEffect } from "react";
import axios from "axios";
import { Masonry } from "@mui/lab";

function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get('/api/images');
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again later.");
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) return <div>Loading images...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Masonry columns={4} spacing={0.5}>
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Gallery image ${index}`}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ))}
    </Masonry>
  );
}

export default ImagesPage;
