export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } = process.env;
    
    console.log('Environment check:', {
      hasApiKey: !!YOUTUBE_API_KEY,
      hasChannelId: !!YOUTUBE_CHANNEL_ID
    });
    
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      throw new Error('Missing YouTube configuration');
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&type=video`;
    console.log('Fetching from YouTube API:', url.replace(YOUTUBE_API_KEY, 'REDACTED'));

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube API error response:', errorText);
      throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.error('Unexpected YouTube API response:', data);
      throw new Error('Invalid YouTube API response format');
    }

    console.log(`Successfully fetched ${data.items.length} videos`);
    
    return res.status(200).json({
      videos: data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt
      }))
    });

  } catch (error) {
    console.error('Detailed API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to load videos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 