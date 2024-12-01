export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } = process.env;
    
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      throw new Error('Missing YouTube configuration');
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&type=video`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const data = await response.json();
    
    return res.status(200).json({
      videos: data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt
      }))
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to load videos' });
  }
} 