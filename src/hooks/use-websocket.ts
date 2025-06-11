"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
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
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' | 'failed';
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
    onError
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error' | 'failed'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetriesReached, setMaxRetriesReached] = useState(false);
  
  const eventHandlers = useRef<Map<EventType, (data: any) => void>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8000';

  const connectWithRetry = useCallback(() => {
    if (maxRetriesReached || retryCount >= maxRetries) {
      setConnectionStatus('failed');
      setMaxRetriesReached(true);
      console.warn(`WebSocket connection failed after ${maxRetries} attempts. Stopped retrying.`);
      toast.error('Server connection failed. Please check your connection and try again later.');
      return;
    }

    setConnectionStatus('connecting');

    const newSocket = io(`${WEBSOCKET_URL}${namespace}`, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('guardian_token') : null,
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionStatus('connected');
      setRetryCount(0); // Reset retry count on successful connection
      setMaxRetriesReached(false);
      onConnect?.();
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      onDisconnect?.();
      
      // Only retry if it's not a manual disconnect and we haven't reached max retries
      if (reason !== 'io client disconnect' && !maxRetriesReached && retryCount < maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connectWithRetry();
        }, retryDelay);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);
      onError?.(error as Error);
      
      // Clean up the failed socket
      newSocket.close();
      socketRef.current = null;
      setSocket(null);
      
      // Retry if we haven't reached max retries
      if (retryCount + 1 < maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          connectWithRetry();
        }, retryDelay);
      } else {
        setConnectionStatus('failed');
        setMaxRetriesReached(true);
        console.warn(`WebSocket connection failed after ${maxRetries} attempts. Stopped retrying.`);
        toast.error('Server connection failed. Please check your connection and try again later.');
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
  }, [namespace, WEBSOCKET_URL, maxRetries, retryDelay, onConnect, onDisconnect, onError, retryCount, maxRetriesReached]);

  useEffect(() => {
    if (!autoConnect) return;

    connectWithRetry();

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [autoConnect, connectWithRetry]);

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
    if (maxRetriesReached || connectionStatus === 'failed') {
      // Reset retry state and attempt reconnection
      setRetryCount(0);
      setMaxRetriesReached(false);
      setConnectionStatus('disconnected');
      
      // Clear any existing timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      // Clean up existing socket
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
      
      // Attempt new connection
      connectWithRetry();
    }
  }, [maxRetriesReached, connectionStatus, connectWithRetry]);

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

// Specialized hooks for different Guardian use cases

export function useVotingWebSocket() {
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
    joinRoom,
    leaveRoom
  } = useWebSocket('/voting');

  const submitVote = useCallback((requestId: string, voteData: any) => {
    sendMessage({
      type: 'SUBMIT_VOTE',
      requestId,
      ...voteData,
      timestamp: new Date().toISOString(),
    });
  }, [sendMessage]);

  const subscribeToRequest = useCallback((requestId: string) => {
    joinRoom(`request_${requestId}`);
  }, [joinRoom]);

  const unsubscribeFromRequest = useCallback((requestId: string) => {
    leaveRoom(`request_${requestId}`);
  }, [leaveRoom]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    submitVote,
    subscribeToRequest,
    unsubscribeFromRequest,
    subscribe,
    unsubscribe,
  };
}

export function useSentinelWebSocket() {
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    subscribe,
    unsubscribe,
    joinRoom,
    leaveRoom
  } = useWebSocket('/sentinel');

  useEffect(() => {
    // Auto-join sentinel metrics room
    if (isConnected) {
      joinRoom('sentinel_metrics');
    }
  }, [isConnected, joinRoom]);

  const subscribeToMetrics = useCallback((callback: (metrics: any) => void) => {
    subscribe('METRICS_UPDATE', callback);
  }, [subscribe]);

  const subscribeToAlerts = useCallback((callback: (alert: any) => void) => {
    subscribe('PERFORMANCE_ALERT', callback);
    subscribe('FRAUD_DETECTED', callback);
  }, [subscribe]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    subscribeToMetrics,
    subscribeToAlerts,
    subscribe,
    unsubscribe,
  };
}

export function useAgentWebSocket() {
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    subscribe,
    unsubscribe,
    sendMessage,
    joinRoom
  } = useWebSocket('/agents');

  useEffect(() => {
    // Auto-join agent monitoring room
    if (isConnected) {
      joinRoom('agent_monitoring');
    }
  }, [isConnected, joinRoom]);

  const subscribeToAgentStatus = useCallback((callback: (status: any) => void) => {
    subscribe('AGENT_STATUS_CHANGE', callback);
  }, [subscribe]);

  const subscribeToWorkflows = useCallback((callback: (workflow: any) => void) => {
    subscribe('WORKFLOW_STARTED', callback);
    subscribe('WORKFLOW_COMPLETED', callback);
  }, [subscribe]);

  const triggerAgentAction = useCallback((agentId: string, action: string, params?: any) => {
    sendMessage({
      type: 'AGENT_ACTION',
      agentId,
      action,
      params,
      timestamp: new Date().toISOString(),
    });
  }, [sendMessage]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    subscribeToAgentStatus,
    subscribeToWorkflows,
    triggerAgentAction,
    subscribe,
    unsubscribe,
  };
}

// Dashboard-wide WebSocket hook that combines all streams
export function useDashboardWebSocket() {
  const voting = useVotingWebSocket();
  const sentinel = useSentinelWebSocket();
  const agents = useAgentWebSocket();

  const isConnected = voting.isConnected && sentinel.isConnected && agents.isConnected;
  
  const connectionStatus = (() => {
    const statuses = [voting.connectionStatus, sentinel.connectionStatus, agents.connectionStatus];
    if (statuses.every(s => s === 'connected')) return 'connected';
    if (statuses.some(s => s === 'error')) return 'error';
    if (statuses.some(s => s === 'connecting')) return 'connecting';
    return 'disconnected';
  })();

  return {
    isConnected,
    connectionStatus,
    voting,
    sentinel,
    agents,
  };
}
