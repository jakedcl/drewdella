export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

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
    
    return new Response(JSON.stringify({
      images: data.resources.map(file => ({
        url: file.secure_url,
        publicId: file.public_id,
        width: file.width,
        height: file.height,
        format: file.format
      }))
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal Server Error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
} 