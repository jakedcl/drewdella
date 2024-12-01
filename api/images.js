import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse, validateEnvVars } from './utils/apiHelpers';

export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return handleMethodNotAllowed();
  }

  try {
    // Validate required environment variables
    validateEnvVars(['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

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

    return createSuccessResponse({
      images: data.resources.map(file => ({
        url: file.secure_url,
        publicId: file.public_id,
        width: file.width,
        height: file.height,
        format: file.format
      }))
    }, {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    });

  } catch (error) {
    return createErrorResponse(error);
  }
} 