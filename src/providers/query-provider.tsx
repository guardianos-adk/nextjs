// GuardianOS Query Provider with Offline Support
// File: src/providers/query-provider.tsx
// Modern React Query setup with graceful fallbacks

'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useGuardianStore } from '@/stores/guardian-store';
import { apiClient } from '@/lib/api-client';

// React Query configuration optimized for real backend
const queryConfig = {
  defaultOptions: {
    queries: {
      // Real backend configuration
      staleTime: 30 * 1000, // 30 seconds - data considered fresh
      gcTime: 5 * 60 * 1000, // 5 minutes - cache garbage collection
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when network reconnects
      
      // Error handling
      throwOnError: false, // Don't throw errors, handle gracefully
      
      // Network mode for real backend
      networkMode: 'online' as const,
    },
    mutations: {
      retry: 2, // Retry mutations 2 times
      retryDelay: 1000,
      networkMode: 'online' as const,
    },
  },
};

// Store integration for connection status
function useConnectionMonitoring() {
  const setConnectionStatus = useGuardianStore((state) => state.setConnectionStatus);

  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('connected');
      console.log('🟢 Network connection restored');
    };

    const handleOffline = () => {
      setConnectionStatus('disconnected');
      console.log('🔴 Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status check
    setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
}

// Connection monitoring component
function ConnectionMonitor() {
  useConnectionMonitoring();
  return null;
}



// 🚀 **Query Provider Component**
interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient(queryConfig));

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionMonitor />
      {children}
      <ReactQueryDevtools 
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}

// 🎯 **Offline-Ready Query Hooks**

// Guardian Authentication Query
export function useCurrentGuardianQuery() {
  return useQuery({
    queryKey: ['guardian', 'current'],
    queryFn: async () => {
      try {
        const response = await apiClient.getCurrentGuardian();
        if (!response.success) {
          // Return null instead of throwing error when backend is unavailable
          console.warn('Guardian query failed:', response.error);
          return null;
        }
        // Ensure we never return undefined
        return response.data ?? null;
      } catch (error) {
        console.warn('Guardian query error:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // Guardian info doesn't change often
    retry: false, // Don't retry when backend is down
  });
}

// Dashboard Overview Query
export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      try {
        const response = await apiClient.getDashboardOverview();
        if (!response.success) {
          console.warn('Dashboard overview query failed:', response.error);
          return null;
        }
        // Ensure we never return undefined
        return response.data ?? null;
      } catch (error) {
        console.warn('Dashboard overview query error:', error);
        return null;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: false,
  });
}

// System Health Query
export function useSystemHealthQuery() {
  return useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: async () => {
      try {
        const response = await apiClient.getSystemHealth();
        if (!response.success) {
          console.warn('System health query failed:', response.error);
          return null;
        }
        // Ensure we never return undefined
        return response.data ?? null;
      } catch (error) {
        console.warn('System health query error:', error);
        return null;
      }
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    retry: false,
  });
}

// Active Voting Requests Query
export function useActiveRequestsQuery() {
  return useQuery({
    queryKey: ['voting', 'active-requests'],
    queryFn: async () => {
      try {
        const response = await apiClient.getActiveRequests();
        if (!response.success) {
          console.warn('Active requests query failed:', response.error);
          return [];
        }
        // Ensure we never return undefined
        return response.data ?? [];
      } catch (error) {
        console.warn('Active requests query error:', error);
        return [];
      }
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    retry: false,
  });
}

// Agent Status Query
export function useAgentsStatusQuery() {
  return useQuery({
    queryKey: ['agents', 'status'],
    queryFn: async () => {
      try {
        const response = await apiClient.getAllAgentsStatus();
        if (!response.success) {
          console.warn('Agents status query failed:', response.error);
          return [];
        }
        // Ensure we never return undefined
        return response.data ?? [];
      } catch (error) {
        console.warn('Agents status query error:', error);
        return [];
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: false,
  });
}

// Sentinel Metrics Query
export function useSentinelMetricsQuery() {
  return useQuery({
    queryKey: ['sentinel', 'metrics'],
    queryFn: async () => {
      try {
        const response = await apiClient.getCurrentMetrics();
        if (!response.success) {
          console.warn('Sentinel metrics query failed:', response.error);
          return null;
        }
        // Ensure we never return undefined
        return response.data ?? null;
      } catch (error) {
        console.warn('Sentinel metrics query error:', error);
        return null;
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time metrics
    retry: false,
  });
}

// Active Alerts Query
export function useActiveAlertsQuery(severity?: string) {
  return useQuery({
    queryKey: ['alerts', 'active', severity],
    queryFn: async () => {
      try {
        const response = await apiClient.getActiveAlerts(severity);
        if (!response.success) {
          console.warn('Active alerts query failed:', response.error);
          return [];
        }
        // Ensure we never return undefined
        return response.data ?? [];
      } catch (error) {
        console.warn('Active alerts query error:', error);
        return [];
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: false,
  });
}

// All Guardians Query
export function useAllGuardiansQuery() {
  return useQuery({
    queryKey: ['guardians', 'all'],
    queryFn: async () => {
      try {
        const response = await apiClient.getAllGuardians();
        if (!response.success) {
          console.warn('All guardians query failed:', response.error);
          return [];
        }
        // Ensure we never return undefined
        return response.data ?? [];
      } catch (error) {
        console.warn('All guardians query error:', error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // Guardians list doesn't change often
    retry: false,
  });
}

// Active Workflows Query
export function useActiveWorkflowsQuery() {
  return useQuery({
    queryKey: ['workflows', 'active'],
    queryFn: async () => {
      try {
        const response = await apiClient.getActiveWorkflows();
        if (!response.success) {
          console.warn('Active workflows query failed:', response.error);
          return [];
        }
        // Ensure we never return undefined
        return response.data ?? [];
      } catch (error) {
        console.warn('Active workflows query error:', error);
        return [];
      }
    },
    refetchInterval: 20000, // Refetch every 20 seconds
    retry: false,
  });
}

// Voting History Query
export function useVotingHistoryQuery(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['voting', 'history', page, pageSize],
    queryFn: async () => {
      try {
        const response = await apiClient.getVotingHistory(page, pageSize);
        if (!response.success) {
          console.warn('Voting history query failed:', response.error);
          return { data: [], total: 0, page, pageSize };
        }
        // Ensure we never return undefined
        return response.data ?? { data: [], total: 0, page, pageSize };
      } catch (error) {
        console.warn('Voting history query error:', error);
        return { data: [], total: 0, page, pageSize };
      }
    },
    staleTime: 60 * 1000, // History doesn't change often
    retry: false,
  });
}

// Backend Health Check Query
export function useBackendHealthQuery() {
  return useQuery({
    queryKey: ['backend', 'health'],
    queryFn: async () => {
      try {
        const response = await apiClient.checkHealth();
        // checkHealth returns a plain object, not an ApiResponse
        return response ?? { main: false, fraud: false };
      } catch (error) {
        console.warn('Backend health query error:', error);
        return { main: false, fraud: false };
      }
    },
    refetchInterval: 30000, // Check health every 30 seconds
    retry: false,
  });
} 