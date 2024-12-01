import { handleCors, handleMethodNotAllowed, createSuccessResponse, createErrorResponse } from './utils/apiHelpers';
import imagesHandler from './images';
import videosHandler from './videos';
import testHandler from './test';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCors(res);
  }

  // Extract the path from the URL
  const path = req.url.split('/api/')[1];

  // Route to the appropriate handler
  try {
    switch (path) {
      case 'images':
        return await imagesHandler(req, res);
      case 'videos':
        return await videosHandler(req, res);
      case 'test':
        return await testHandler(req, res);
      default:
        return createErrorResponse(res, new Error('Not Found'), 404);
    }
  } catch (error) {
    return createErrorResponse(res, error);
  }
} 