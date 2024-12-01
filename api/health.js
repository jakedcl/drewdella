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

  results.services.environment = {
    status: 'ok',
    details: {
      cloudinary: Object.values(envCheck.cloudinary).every(Boolean),
      youtube: Object.values(envCheck.youtube).every(Boolean)
    }
  };

  // Check Cloudinary
  try {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/search`;
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expression: "folder:drewdella",
        max_results: 1
      })
    });
    results.services.cloudinary = {
      status: cloudinaryResponse.ok ? 'ok' : 'error',
      statusCode: cloudinaryResponse.status
    };
  } catch (error) {
    results.services.cloudinary = {
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