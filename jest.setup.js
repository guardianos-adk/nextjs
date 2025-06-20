// Jest setup file
// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000';
process.env.NEXT_PUBLIC_FRAUD_API_URL = 'http://localhost:8001';
process.env.NEXT_PUBLIC_ENVIRONMENT = 'test';

// Mock fetch for Node.js environment
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

// Mock WebSocket
global.WebSocket = class WebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1; // OPEN
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
  }
  
  send(data) {
    // Mock send
  }
  
  close() {
    this.readyState = 3; // CLOSED
    if (this.onclose) {
      this.onclose();
    }
  }
};

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Only log non-expected errors
  if (!args[0]?.includes('Network error') && 
      !args[0]?.includes('Failed to fetch')) {
    originalConsoleError(...args);
  }
};

console.warn = (...args) => {
  // Only log non-expected warnings
  if (!args[0]?.includes('health check failed')) {
    originalConsoleWarn(...args);
  }
};