// Centralized API URL configuration
export const API_URLS = {
  MAIN_API: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  FRAUD_API: process.env.NEXT_PUBLIC_FRAUD_API_URL || 'http://localhost:8001',
} as const;

// Helper function to get full API URL
export function getApiUrl(path: string, useFraudApi = false): string {
  const baseUrl = useFraudApi ? API_URLS.FRAUD_API : API_URLS.MAIN_API;
  return `${baseUrl}${path}`;
}