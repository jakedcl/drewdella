export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This endpoint is no longer used as we're fetching directly from Sanity in the frontend
    // Return a helpful message
    return res.status(200).json({
      message: 'This API is deprecated. Images are now fetched directly from Sanity.',
      images: []
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to load images' });
  }
} 