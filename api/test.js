import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse } from './utils/apiHelpers';

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
    // Check environment variables (without exposing values)
    const envCheck = {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      hasYoutubeApiKey: !!process.env.YOUTUBE_API_KEY,
      hasYoutubeChannelId: !!process.env.YOUTUBE_CHANNEL_ID
    };

    return createSuccessResponse({
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: envCheck
    }, {
      'Cache-Control': 'no-store'
    });
  } catch (error) {
    return createErrorResponse(error);
  }
} 