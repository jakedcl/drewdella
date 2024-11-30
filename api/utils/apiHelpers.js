// Common headers for all responses
export const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

// Handle CORS preflight requests
export function handleCors() {
  return new Response(null, {
    status: 204,
    headers: commonHeaders
  });
}

// Handle method not allowed
export function handleMethodNotAllowed() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: commonHeaders
    }
  );
}

// Create success response
export function createSuccessResponse(data, customHeaders = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...commonHeaders, ...customHeaders }
    }
  );
}

// Create error response
export function createErrorResponse(error, status = 500) {
  console.error('API Error:', error);
  
  return new Response(
    JSON.stringify({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }),
    {
      status,
      headers: commonHeaders
    }
  );
}

// Validate environment variables
export function validateEnvVars(required) {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
} 