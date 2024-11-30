import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Basic CORS
app.use(cors());

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  const envVars = {
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
  };
  
  console.log('Environment check:', envVars);
  
  res.json({
    message: 'API is working',
    environmentCheck: envVars
  });
});

// Images endpoint
app.get('/api/images', async (req, res) => {
  try {
    // 1. Check environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Environment check:', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret
    });

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary configuration');
    }

    // 2. Make request to Cloudinary
    console.log('Making request to Cloudinary...');
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expression: "folder:drewdella",
        sort_by: [{ public_id: "desc" }],
        max_results: 30
      })
    });

    // 3. Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Cloudinary API error: ${response.status} ${errorText}`);
    }

    // 4. Process data
    const data = await response.json();
    console.log(`Found ${data.resources.length} images`);

    res.json({
      images: data.resources.map(file => ({
        url: file.secure_url,
        publicId: file.public_id,
        width: file.width,
        height: file.height,
        format: file.format
      }))
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n=== Development Server Started ===');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nTest endpoints:');
  console.log(`- Health check: http://localhost:${PORT}/api/test`);
  console.log(`- Images: http://localhost:${PORT}/api/images`);
  console.log('\nEnvironment variables:');
  console.log('- CLOUDINARY_CLOUD_NAME:', !!process.env.CLOUDINARY_CLOUD_NAME);
  console.log('- CLOUDINARY_API_KEY:', !!process.env.CLOUDINARY_API_KEY);
  console.log('- CLOUDINARY_API_SECRET:', !!process.env.CLOUDINARY_API_SECRET);
  console.log('\nPress Ctrl+C to stop\n');
}); 