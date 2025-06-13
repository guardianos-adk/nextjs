"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketEvent, EventType } from '@/lib/types';
import { toast } from 'sonner';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  fallbackMode?: boolean;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' | 'failed' | 'disabled';
  lastMessage: WebSocketEvent | null;
  sendMessage: (message: any) => void;
  subscribe: (eventType: EventType, handler: (data: any) => void) => void;
  unsubscribe: (eventType: EventType) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  retryCount: number;
  maxRetriesReached: boolean;
  manualRetry: () => void;
}

export function useWebSocket(
  namespace = '/',
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    autoConnect = true,
    maxRetries = 3,
    retryDelay = 5000,
    onConnect,
    onDisconnect,
    onError,
    fallbackMode = false
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error' | 'failed' | 'disabled'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(0);

  const [maxRetriesReached, setMaxRetriesReached] = useState(false);
  const maxRetriesReachedRef = useRef(false);
  
  const eventHandlers = useRef<Map<EventType, (data: any) => void>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  // Stabilize the WebSocket URL to prevent re-renders
  const WEBSOCKET_URL = useMemo(() => 
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8000', 
    []
  );

  // Memoize callback functions to prevent infinite re-renders
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onConnectRef.current = onConnect;
  }, [onConnect]);

  useEffect(() => {
    onDisconnectRef.current = onDisconnect;
  }, [onDisconnect]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Check if backend is available before attempting WebSocket connection
  const checkBackendAvailability = useCallback(async () => {
    try {
      const response = await fetch(`${WEBSOCKET_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend not available, skipping WebSocket connection');
      return false;
    }
  }, [WEBSOCKET_URL]);

  const connectWithRetry = useCallback(async () => {
    // If in fallback mode, don't attempt connection
    if (fallbackMode) {
      setConnectionStatus('disabled');
      console.log('WebSocket disabled in fallback mode');
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (isConnectingRef.current) {
      console.log('Connection attempt already in progress, skipping...');
      return;
    }

    if (maxRetriesReachedRef.current || retryCountRef.current >= maxRetries) {
      setConnectionStatus('failed');
      maxRetriesReachedRef.current = true;
      setMaxRetriesReached(true);
      console.warn(`WebSocket connection failed after ${maxRetries} attempts. Stopped retrying.`);
      // Don't show toast on every retry failure to avoid spam
      if (retryCountRef.current === maxRetries) {
        toast.error('Server connection failed. Running in offline mode.');
      }
      return;
    }

    // Check if backend is available before attempting connection
    const isBackendAvailable = await checkBackendAvailability();
    if (!isBackendAvailable) {
      console.warn('Backend not available, skipping WebSocket connection');
      setConnectionStatus('failed');
      retryCountRef.current = maxRetries; // Stop retrying
      maxRetriesReachedRef.current = true;
      setMaxRetriesReached(true);
      return;
    }

    isConnectingRef.current = true;
    setConnectionStatus('connecting');

    // Clean up any existing socket first
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
    }

    const newSocket = io(`${WEBSOCKET_URL}${namespace}`, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      autoConnect: false, // Manual connection control
      auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('guardian_token') : null,
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      isConnectingRef.current = false;
      setIsConnected(true);
      setConnectionStatus('connected');
      retryCountRef.current = 0;
      setRetryCount(0);
      maxRetriesReachedRef.current = false;
      setMaxRetriesReached(false);
      onConnectRef.current?.();
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      isConnectingRef.current = false;
      setIsConnected(false);
      setConnectionStatus('disconnected');
      onDisconnectRef.current?.();
      
      // Only retry if it's not a manual disconnect and we haven't reached max retries
      if (reason !== 'io client disconnect' && !maxRetriesReachedRef.current && retryCountRef.current < maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          retryCountRef.current += 1;
          setRetryCount(retryCountRef.current);
          connectWithRetry();
        }, retryDelay);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      isConnectingRef.current = false;
      setConnectionStatus('error');
      retryCountRef.current += 1;
      setRetryCount(retryCountRef.current);
      onErrorRef.current?.(error as Error);
      
      // Clean up the failed socket
      newSocket.close();
      socketRef.current = null;
      setSocket(null);
      
      // Retry if we haven't reached max retries
      if (retryCountRef.current < maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          connectWithRetry();
        }, retryDelay);
      } else {
        setConnectionStatus('failed');
        maxRetriesReachedRef.current = true;
        setMaxRetriesReached(true);
        console.warn(`WebSocket connection failed after ${maxRetries} attempts. Stopped retrying.`);
      }
    });

    // Generic message handler
    newSocket.onAny((eventName: string, data: any) => {
      if (eventName.startsWith('guardian_')) {
        const event: WebSocketEvent = {
          type: eventName.replace('guardian_', '').toUpperCase() as EventType,
          data,
          timestamp: new Date().toISOString(),
          source: 'websocket',
        };
        
        setLastMessage(event);
        
        // Call specific event handler if registered
        const handler = eventHandlers.current.get(event.type);
        if (handler) {
          handler(event.data);
        }
      }
    });

    // Actually connect the socket
    newSocket.connect();
  }, [namespace, WEBSOCKET_URL, maxRetries, retryDelay, fallbackMode, checkBackendAvailability]);

  // Fixed: Only run effect once on mount, not on every connectWithRetry change
  useEffect(() => {
    if (!autoConnect) return;

    connectWithRetry();

    return () => {
      console.log('Cleaning up WebSocket connection');
      isConnectingRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [autoConnect]); // Removed connectWithRetry from dependencies to prevent infinite re-renders

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('guardian_message', message);
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  }, []);

  const subscribe = useCallback((eventType: EventType, handler: (data: any) => void) => {
    eventHandlers.current.set(eventType, handler);
  }, []);

  const unsubscribe = useCallback((eventType: EventType) => {
    eventHandlers.current.delete(eventType);
  }, []);

  const joinRoom = useCallback((room: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', room);
      console.log(`Joined room: ${room}`);
    }
  }, []);

  const leaveRoom = useCallback((room: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave_room', room);
      console.log(`Left room: ${room}`);
    }
  }, []);

  const manualRetry = useCallback(() => {
    // Reset retry state and attempt connection
    retryCountRef.current = 0;
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    setMaxRetriesReached(false);
    connectWithRetry();
  }, []);

  return {
    socket,
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
    joinRoom,
    leaveRoom,
    retryCount,
    maxRetriesReached,
    manualRetry,
  };
}

// Specialized hooks for different services
export function useVotingWebSocket() {
  return useWebSocket('/voting', {
    autoConnect: true,
    maxRetries: 3,
    retryDelay: 5000,
    fallbackMode: false,
  });
}

export function useSentinelWebSocket() {
  return useWebSocket('/sentinel', {
    autoConnect: true,
    maxRetries: 3,
    retryDelay: 5000,
    fallbackMode: false,
  });
}

export function useAgentWebSocket() {
  return useWebSocket('/agents', {
    autoConnect: true,
    maxRetries: 3,
    retryDelay: 5000,
    fallbackMode: false,
  });
}

// Dashboard-specific WebSocket hook with enhanced error handling
export function useDashboardWebSocket() {
  // Use individual WebSocket connections for each service
  const voting = useVotingWebSocket();
  const sentinel = useSentinelWebSocket();
  const agents = useAgentWebSocket();
  
  // Calculate overall connection status
  const isConnected = voting.isConnected || sentinel.isConnected || agents.isConnected;
  
  // Determine overall connection status based on individual services
  const getOverallConnectionStatus = () => {
    const statuses = [voting.connectionStatus, sentinel.connectionStatus, agents.connectionStatus];
    
    // If any service is connected, overall is connected
    if (statuses.includes('connected')) return 'connected';
    
    // If any service is connecting, overall is connecting
    if (statuses.includes('connecting')) return 'connecting';
    
    // If all services are disabled, overall is disabled
    if (statuses.every(status => status === 'disabled')) return 'disabled';
    
    // If any service has failed, overall has failed
    if (statuses.includes('failed')) return 'failed';
    
    // If any service has error, overall has error
    if (statuses.includes('error')) return 'error';
    
    // Default to disconnected
    return 'disconnected';
  };
  
  const connectionStatus = getOverallConnectionStatus();
  
  // Combine last messages from all services
  const lastMessage = voting.lastMessage || sentinel.lastMessage || agents.lastMessage;
  
  // Combined send message function
  const sendMessage = useCallback((message: any, service?: 'voting' | 'sentinel' | 'agents') => {
    switch (service) {
      case 'voting':
        voting.sendMessage(message);
        break;
      case 'sentinel':
        sentinel.sendMessage(message);
        break;
      case 'agents':
        agents.sendMessage(message);
        break;
      default:
        // Send to all services if no specific service is specified
        voting.sendMessage(message);
        sentinel.sendMessage(message);
        agents.sendMessage(message);
        break;
    }
  }, [voting.sendMessage, sentinel.sendMessage, agents.sendMessage]);
  
  // Combined subscribe function
  const subscribe = useCallback((eventType: EventType, handler: (data: any) => void, service?: 'voting' | 'sentinel' | 'agents') => {
    switch (service) {
      case 'voting':
        voting.subscribe(eventType, handler);
        break;
      case 'sentinel':
        sentinel.subscribe(eventType, handler);
        break;
      case 'agents':
        agents.subscribe(eventType, handler);
        break;
      default:
        // Subscribe to all services if no specific service is specified
        voting.subscribe(eventType, handler);
        sentinel.subscribe(eventType, handler);
        agents.subscribe(eventType, handler);
        break;
    }
  }, [voting.subscribe, sentinel.subscribe, agents.subscribe]);
  
  // Combined unsubscribe function
  const unsubscribe = useCallback((eventType: EventType, service?: 'voting' | 'sentinel' | 'agents') => {
    switch (service) {
      case 'voting':
        voting.unsubscribe(eventType);
        break;
      case 'sentinel':
        sentinel.unsubscribe(eventType);
        break;
      case 'agents':
        agents.unsubscribe(eventType);
        break;
      default:
        // Unsubscribe from all services if no specific service is specified
        voting.unsubscribe(eventType);
        sentinel.unsubscribe(eventType);
        agents.unsubscribe(eventType);
        break;
    }
  }, [voting.unsubscribe, sentinel.unsubscribe, agents.unsubscribe]);
  
  // Manual retry for all services
  const manualRetry = useCallback(() => {
    voting.manualRetry();
    sentinel.manualRetry();
    agents.manualRetry();
  }, [voting.manualRetry, sentinel.manualRetry, agents.manualRetry]);
  
  return {
    // Overall connection state
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
    manualRetry,
    
    // Individual service connection states
    voting: {
      isConnected: voting.isConnected,
      connectionStatus: voting.connectionStatus,
      lastMessage: voting.lastMessage,
      sendMessage: voting.sendMessage,
      subscribe: voting.subscribe,
      unsubscribe: voting.unsubscribe,
      retryCount: voting.retryCount,
      maxRetriesReached: voting.maxRetriesReached,
      manualRetry: voting.manualRetry,
    },
    sentinel: {
      isConnected: sentinel.isConnected,
      connectionStatus: sentinel.connectionStatus,
      lastMessage: sentinel.lastMessage,
      sendMessage: sentinel.sendMessage,
      subscribe: sentinel.subscribe,
      unsubscribe: sentinel.unsubscribe,
      retryCount: sentinel.retryCount,
      maxRetriesReached: sentinel.maxRetriesReached,
      manualRetry: sentinel.manualRetry,
    },
    agents: {
      isConnected: agents.isConnected,
      connectionStatus: agents.connectionStatus,
      lastMessage: agents.lastMessage,
      sendMessage: agents.sendMessage,
      subscribe: agents.subscribe,
      unsubscribe: agents.unsubscribe,
      retryCount: agents.retryCount,
      maxRetriesReached: agents.maxRetriesReached,
      manualRetry: agents.manualRetry,
    },
  };
}
