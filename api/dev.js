import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;



app.use(cors());
app.use(express.json());

app.get('/api/images', async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary configuration');
    }

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

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();
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
    console.error('API Error:', error);
    res.status(500).json({
      error: error.message || 'Internal Server Error'
    });
  }
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    env: {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    }
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 Development server running at http://localhost:${PORT}
📸 Test the API:
   - Images: http://localhost:${PORT}/api/images
   - Health: http://localhost:${PORT}/api/test
  `);
}); 