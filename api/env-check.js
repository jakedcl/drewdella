import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse } from './utils/apiHelpers';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return handleCors(res);
  }

  if (req.method !== 'GET') {
    return handleMethodNotAllowed(res);
  }

  try {
    // Check all environment variables
    const envStatus = {
      cloudinary: {
        cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET
      },
      youtube: {
        apiKey: !!process.env.YOUTUBE_API_KEY,
        channelId: !!process.env.YOUTUBE_CHANNEL_ID
      }
    };

    // List any missing variables
    const missing = [];
    if (!envStatus.cloudinary.cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
    if (!envStatus.cloudinary.apiKey) missing.push('CLOUDINARY_API_KEY');
    if (!envStatus.cloudinary.apiSecret) missing.push('CLOUDINARY_API_SECRET');
    if (!envStatus.youtube.apiKey) missing.push('YOUTUBE_API_KEY');
    if (!envStatus.youtube.channelId) missing.push('YOUTUBE_CHANNEL_ID');

    return createSuccessResponse(res, {
      status: missing.length === 0 ? 'ok' : 'missing_vars',
      environment: envStatus,
      missing,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return createErrorResponse(res, error);
  }
} 