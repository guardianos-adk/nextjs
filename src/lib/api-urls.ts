// Centralized API URL configuration
export const API_URLS = {
  MAIN_API: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  FRAUD_API: process.env.NEXT_PUBLIC_FRAUD_API_URL || 'http://localhost:8001',
} as const;

// WebSocket URL configuration
export const WS_URLS = {
  MAIN_WS: API_URLS.MAIN_API.replace('https://', 'wss://').replace('http://', 'ws://'),
  FRAUD_WS: API_URLS.FRAUD_API.replace('https://', 'wss://').replace('http://', 'ws://'),
} as const;

// Helper function to get full API URL
export function getApiUrl(path: string, useFraudApi = false): string {
  const baseUrl = useFraudApi ? API_URLS.FRAUD_API : API_URLS.MAIN_API;
  return `${baseUrl}${path}`;
}

// Helper function to get WebSocket URL
export function getWsUrl(path: string, useFraudApi = false): string {
  const baseUrl = useFraudApi ? WS_URLS.FRAUD_WS : WS_URLS.MAIN_WS;
  return `${baseUrl}${path}`;
}