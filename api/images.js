export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing Cloudinary configuration' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
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

    return new Response(
      JSON.stringify({ images }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve images",
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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