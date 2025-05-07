import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse } from './utils/apiHelpers';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables (without exposing values)
    const envCheck = {
      sanity: {
        projectId: 'qcu6o4bq', // Hardcoded as it's public anyway
        dataset: 'production'
      },
      youtube: {
        apiKey: !!process.env.YOUTUBE_API_KEY,
        channelId: !!process.env.YOUTUBE_CHANNEL_ID,
        // Safe to expose first few chars to verify correct key
        apiKeyPrefix: process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.substring(0, 4) + '...' : null,
        channelIdPrefix: process.env.YOUTUBE_CHANNEL_ID ? process.env.YOUTUBE_CHANNEL_ID.substring(0, 4) + '...' : null
      }
    };

    // List any missing variables
    const missing = [];
    if (!envCheck.youtube.apiKey) missing.push('YOUTUBE_API_KEY');
    if (!envCheck.youtube.channelId) missing.push('YOUTUBE_CHANNEL_ID');

    return res.status(200).json({
      status: missing.length === 0 ? 'ok' : 'missing_vars',
      environment: envCheck,
      missing,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Environment check error:', error);
    return res.status(500).json({ error: 'Failed to check environment' });
  }
} 