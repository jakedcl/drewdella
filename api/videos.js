import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse, validateEnvVars } from './utils/apiHelpers';

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
    // Validate required environment variables
    validateEnvVars(['YOUTUBE_API_KEY', 'YOUTUBE_CHANNEL_ID']);

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&type=video`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube API error:', errorText);
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.items?.length || 0} videos`);

    return createSuccessResponse(res, {
      videos: data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
      }))
    }, {
      'Cache-Control': 'public, s-maxage=3600' // Cache for 1 hour
    });

  } catch (error) {
    return createErrorResponse(res, error);
  }
} 