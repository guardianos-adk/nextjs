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
  }, [setConnectionStatus]);
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
      const response = await apiClient.getCurrentGuardian();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch guardian');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Guardian info doesn't change often
  });
}

// Dashboard Overview Query
export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const response = await apiClient.getDashboardOverview();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard overview');
      }
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// System Health Query
export function useSystemHealthQuery() {
  return useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: async () => {
      const response = await apiClient.getSystemHealth();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch system health');
      }
      return response.data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

// Active Voting Requests Query
export function useActiveRequestsQuery() {
  return useQuery({
    queryKey: ['voting', 'active-requests'],
    queryFn: async () => {
      const response = await apiClient.getActiveRequests();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch active requests');
      }
      return response.data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

// Agent Status Query
export function useAgentsStatusQuery() {
  return useQuery({
    queryKey: ['agents', 'status'],
    queryFn: async () => {
      const response = await apiClient.getAllAgentsStatus();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch agents status');
      }
      return response.data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Sentinel Metrics Query
export function useSentinelMetricsQuery() {
  return useQuery({
    queryKey: ['sentinel', 'metrics'],
    queryFn: async () => {
      const response = await apiClient.getCurrentMetrics();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch sentinel metrics');
      }
      return response.data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time metrics
  });
}

// Active Alerts Query
export function useActiveAlertsQuery(severity?: string) {
  return useQuery({
    queryKey: ['alerts', 'active', severity],
    queryFn: async () => {
      const response = await apiClient.getActiveAlerts(severity);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch active alerts');
      }
      return response.data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// All Guardians Query
export function useAllGuardiansQuery() {
  return useQuery({
    queryKey: ['guardians', 'all'],
    queryFn: async () => {
      const response = await apiClient.getAllGuardians();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch guardians');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // Guardians list doesn't change often
  });
}

// Active Workflows Query
export function useActiveWorkflowsQuery() {
  return useQuery({
    queryKey: ['workflows', 'active'],
    queryFn: async () => {
      const response = await apiClient.getActiveWorkflows();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch active workflows');
      }
      return response.data;
    },
    refetchInterval: 20000, // Refetch every 20 seconds
  });
}

// Voting History Query
export function useVotingHistoryQuery(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['voting', 'history', page, pageSize],
    queryFn: async () => {
      const response = await apiClient.getVotingHistory(page, pageSize);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch voting history');
      }
      return response.data;
    },
    staleTime: 60 * 1000, // History is relatively stable
  });
}

// Backend Health Check Query
export function useBackendHealthQuery() {
  return useQuery({
    queryKey: ['backend', 'health'],
    queryFn: async () => {
      return await apiClient.checkHealth();
    },
    refetchInterval: 30000, // Check health every 30 seconds
    retry: 1, // Don't retry health checks aggressively
  });
} 