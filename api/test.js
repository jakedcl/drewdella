import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse } from './utils/apiHelpers';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCors(res);
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return handleMethodNotAllowed(res);
  }

  try {
    // Check environment variables (without exposing values)
    const envCheck = {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      hasYoutubeApiKey: !!process.env.YOUTUBE_API_KEY,
      hasYoutubeChannelId: !!process.env.YOUTUBE_CHANNEL_ID
    };

    return createSuccessResponse(res, {
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: envCheck
    }, {
      'Cache-Control': 'no-store'
    });
  } catch (error) {
    return createErrorResponse(res, error);
  }
} 