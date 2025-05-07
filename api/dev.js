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
    sanity: {
      projectId: 'qcu6o4bq',
      dataset: 'production'
    },
    youtube: {
      hasApiKey: !!process.env.YOUTUBE_API_KEY,
      hasChannelId: !!process.env.YOUTUBE_CHANNEL_ID
    }
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
    const projectId = 'qcu6o4bq';
    const dataset = 'production';

    console.log('Environment check:', {
      sanity: {
        projectId,
        dataset
      }
    });

    // Make request to Sanity
    console.log('Making request to Sanity...');
    
    const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=*[_type == "imageGallery"][0]{galleryImages[]{asset->{_id,url}}}`;

    const response = await fetch(url);

    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sanity error response:', errorText);
      throw new Error(`Sanity API error: ${response.status} ${errorText}`);
    }

    // Process data
    const data = await response.json();
    console.log('Received data from Sanity:', data);
    
    const images = data.result?.galleryImages || [];
    console.log(`Found ${images.length} images`);

    res.json({
      message: 'This API is deprecated. Images are now fetched directly from Sanity in the frontend.',
      images: []
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
  console.log('- SANITY_PROJECT_ID: qcu6o4bq');
  console.log('- SANITY_DATASET: production');
  console.log('- YOUTUBE_API_KEY:', !!process.env.YOUTUBE_API_KEY);
  console.log('- YOUTUBE_CHANNEL_ID:', !!process.env.YOUTUBE_CHANNEL_ID);
  console.log('\nPress Ctrl+C to stop\n');
}); 