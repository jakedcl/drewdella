import express from 'express';
import cors from 'cors';
import { handler as imagesHandler } from './images.js';

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Convert Edge API response to Express response
const edgeToExpress = (handler) => async (req, res) => {
  try {
    const response = await handler(req);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Routes
app.get('/api/images', edgeToExpress(imagesHandler));

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log(`📸 Test images endpoint at http://localhost:${PORT}/api/images`);
}); 