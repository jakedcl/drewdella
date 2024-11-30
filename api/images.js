export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary configuration');
    }

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

    return new Response(
      JSON.stringify({
        images: data.resources.map(file => ({
          url: file.secure_url,
          publicId: file.public_id,
          width: file.width,
          height: file.height,
          format: file.format
        }))
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch images',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
} 