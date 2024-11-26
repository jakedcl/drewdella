require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './dist')));

// Route to fetch images
app.get("/api/images", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:drewdella")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();
    const images = result.resources.map((file) => file.secure_url);
    res.json({ images });
  } catch (error) {
    console.error("Failed to retrieve images:", error);
    res.status(500).send("Failed to retrieve images");
  }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
