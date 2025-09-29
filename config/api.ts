// API Configuration - SIMPLE FREE MODEL
export const API_CONFIG = {
  GEMINI_API_KEY: 'AIzaSyDX1ongpCx_Ov7HUnAEAE3h2W6Ymy3teVM',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  // Free tier limits
  DAILY_PROMPT_LIMIT: 15, // Free tier allows 15 requests per day
  QUOTA_RESET_HOURS: 24, // Reset every 24 hours
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  GEMINI_GENERATE: `${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AI_BUSY: 'AI is busy, try again',
  NETWORK_ERROR: 'Network error, please check your connection',
  API_ERROR: 'AI service is temporarily unavailable',
  TIMEOUT: 'Request timed out, please try again',
  INVALID_RESPONSE: 'Invalid response from AI service',
} as const;
