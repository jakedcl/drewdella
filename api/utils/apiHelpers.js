// Common headers for all responses
export const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

// Handle CORS preflight requests
export function handleCors(res) {
  res.writeHead(204, commonHeaders);
  res.end();
}

// Handle method not allowed
export function handleMethodNotAllowed(res) {
  res.writeHead(405, commonHeaders);
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

// Create success response
export function createSuccessResponse(res, data, customHeaders = {}) {
  res.writeHead(200, { ...commonHeaders, ...customHeaders });
  res.end(JSON.stringify(data));
}

// Create error response
export function createErrorResponse(res, error, status = 500) {
  console.error('API Error:', error);
  
  const errorResponse = {
    error: true,
    message: error.message || 'Internal server error',
    status: status
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.writeHead(status, commonHeaders);
  res.end(JSON.stringify(errorResponse));
}

// Validate environment variables
export function validateEnvVars(required) {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
} 