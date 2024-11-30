export const config = {
  runtime: '@vercel/node@3.0.0'
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary configuration');
    }

    // Use node-fetch in Node.js environment
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expression: "folder:drewdella",
          sort_by: [{ public_id: "desc" }],
          max_results: 30
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error:', errorText);
      throw new Error(`Cloudinary API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.resources.length} images`);

    return res.status(200).json({
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
    return res.status(500).json({
      error: 'Failed to fetch images',
      details: error.message
    });
  }
} 