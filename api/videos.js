/** Client only uses # in Shorts titles/descriptions, not in full videos. */
function snippetContainsHashtag(snippet) {
  const title = snippet?.title ?? '';
  const description = snippet?.description ?? '';
  return title.includes('#') || description.includes('#');
}

function pickThumbnailUrl(thumbnails) {
  const t = thumbnails?.high || thumbnails?.medium || thumbnails?.default;
  return t?.url ?? '';
}

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

    const maxSearch = 50;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxSearch}&type=video`;
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

    const withoutShorts = data.items.filter(
      (item) => item.id?.videoId && !snippetContainsHashtag(item.snippet)
    );

    const videos = withoutShorts.slice(0, 12).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: pickThumbnailUrl(item.snippet.thumbnails),
      publishedAt: item.snippet.publishedAt,
    }));

    console.log(
      `YouTube search: ${data.items.length} items, ${withoutShorts.length} without # in title/description, returning ${videos.length}`
    );
    
    return res.status(200).json({
      videos,
    });

  } catch (error) {
    console.error('Detailed API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to load videos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 