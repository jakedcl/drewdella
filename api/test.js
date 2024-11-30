export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  try {
    // Check environment variables (without exposing values)
    const envCheck = {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    };

    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'API is working',
        timestamp: new Date().toISOString(),
        environment: envCheck
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
} 