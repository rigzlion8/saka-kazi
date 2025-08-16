import { NextRequest, NextResponse } from 'next/server';

export function cors(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '*';
  
  // Check if the origin is allowed (you can restrict this in production)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005'
  ];
  
  const isAllowedOrigin = allowedOrigins.includes(origin) || origin === '*';
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleCors(request: NextRequest) {
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: cors(request),
    });
  }
  
  return null;
}
