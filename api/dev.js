import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './images.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Add body parsing
app.use(express.json());

// Images endpoint that mirrors the Edge function
app.get('/api/images', async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Missing Cloudinary configuration' });
    }

    // Cloudinary API endpoint
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const searchParams = {
      expression: "folder:drewdella",
      sort_by: [{ public_id: "desc" }],
      max_results: 30
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    const images = result.resources.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
      width: file.width,
      height: file.height,
      format: file.format
    }));

    res.json({ images });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: "Failed to retrieve images",
      message: error.message
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    env: {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log(`📸 Test images endpoint at http://localhost:${PORT}/api/images`);
  console.log('Environment check:', {
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
  });
}); 