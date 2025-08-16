// Configuration for the application
export const config = {
  // API base URL - defaults to same origin if not specified
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Check if we're in development mode
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Default port for development
  defaultPort: 3002,
  
  // Get the full API URL
  getApiUrl: (endpoint: string) => {
    if (config.apiBaseUrl) {
      return `${config.apiBaseUrl}${endpoint}`;
    }
    // If no base URL specified, use relative URL (same origin)
    return endpoint;
  }
};
