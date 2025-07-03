import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Check if this is a WebSocket upgrade request
  const upgradeHeader = request.headers.get('upgrade');
  
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 400 });
  }

  try {
    // Get the FastAPI server URL
    const targetUrl = process.env.NODE_ENV === 'production'
      ? process.env.FASTAPI_URL || 'http://localhost:8765'
      : 'http://localhost:8765';

    // Create WebSocket connection to FastAPI server
    const wsUrl = targetUrl.replace('http', 'ws') + '/ws';
    
    // For now, return a response indicating the WebSocket endpoint
    // The actual WebSocket handling will need to be done differently
    return new Response('WebSocket endpoint available at ' + wsUrl, { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    
  } catch (error) {
    console.error('WebSocket proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 