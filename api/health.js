export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    services: {}
  };

  // Check environment variables
  const envCheck = {
    sanity: {
      projectId: 'qcu6o4bq', // Hardcoded as it's public anyway
      dataset: 'production'
    },
    youtube: {
      apiKey: !!process.env.YOUTUBE_API_KEY,
      channelId: !!process.env.YOUTUBE_CHANNEL_ID
    }
  };

  results.services.environment = {
    status: 'ok',
    details: {
      sanity: true,
      youtube: Object.values(envCheck.youtube).every(Boolean)
    }
  };

  // Check Sanity
  try {
    const sanityUrl = `https://${envCheck.sanity.projectId}.api.sanity.io/v2023-05-03/data/query/${envCheck.sanity.dataset}?query=*[_type == "imageGallery"][0]{_id}`;
    const sanityResponse = await fetch(sanityUrl);
    
    results.services.sanity = {
      status: sanityResponse.ok ? 'ok' : 'error',
      statusCode: sanityResponse.status
    };
  } catch (error) {
    results.services.sanity = {
      status: 'error',
      error: error.message
    };
  }

  // Check YouTube
  try {
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&part=snippet,id&maxResults=1&type=video`;
    const youtubeResponse = await fetch(youtubeUrl);
    const youtubeData = await youtubeResponse.text();
    
    results.services.youtube = {
      status: youtubeResponse.ok ? 'ok' : 'error',
      statusCode: youtubeResponse.status,
      details: youtubeResponse.ok ? undefined : youtubeData
    };

    // If it's a JSON response, try to parse it for more details
    try {
      const jsonData = JSON.parse(youtubeData);
      if (!youtubeResponse.ok && jsonData.error) {
        results.services.youtube.errorMessage = jsonData.error.message;
        results.services.youtube.errorReason = jsonData.error.errors?.[0]?.reason;
      }
    } catch (e) {
      // If JSON parsing fails, we already have the raw response in details
    }
  } catch (error) {
    results.services.youtube = {
      status: 'error',
      error: error.message
    };
  }

  // Overall status
  results.status = Object.values(results.services)
    .every(service => service.status === 'ok') ? 'ok' : 'error';

  return res.status(200).json(results);
} 