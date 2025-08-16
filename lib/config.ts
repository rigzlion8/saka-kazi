// Configuration for the application
export const config = {
  // API base URL - defaults to same origin if not specified
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Check if we're in development mode
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Get the current port dynamically
  getCurrentPort: () => {
    if (typeof window !== 'undefined') {
      // Client-side: get port from current URL
      return window.location.port || '80';
    }
    // Server-side: use environment variable or default
    return process.env.PORT || '3000';
  },
  
  // Get the API base URL dynamically
  getApiBaseUrl: () => {
    if (config.apiBaseUrl) {
      return config.apiBaseUrl;
    }
    
    // Auto-detect based on current port
    const currentPort = config.getCurrentPort();
    if (currentPort === '80') {
      return ''; // Same origin
    }
    
    // If we're on a different port, use localhost with that port
    return `http://localhost:${currentPort}`;
  },
  
  // Get the full API URL
  getApiUrl: (endpoint: string) => {
    const baseUrl = config.getApiBaseUrl();
    if (baseUrl) {
      return `${baseUrl}${endpoint}`;
    }
    // If no base URL specified, use relative URL (same origin)
    return endpoint;
  }
};
