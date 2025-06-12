// GuardianOS Query Provider with Offline Support
// File: src/providers/query-provider.tsx
// Modern React Query setup with graceful fallbacks

'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { mockBackend } from '@/lib/mock-backend';
import { useGuardianStore } from '@/stores/guardian-store';

// 🔧 **Enhanced Query Client Configuration**
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent retries on network failures
      retry: (failureCount, error) => {
        // Don't retry if it's a network error
        if (error?.message?.includes('fetch') || error?.message?.includes('refused')) {
          return false;
        }
        return failureCount < 2;
      },
      
      // Stale time for offline scenarios
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time for offline scenarios
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
      
      // Reduce network calls
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      
      // Custom error handling
      throwOnError: false,
      
      // Use cached data while refetching
      refetchOnMount: 'always',
    },
    mutations: {
      retry: 1,
      // Global mutation error handling
      onError: (error) => {
        console.error('Mutation failed:', error);
      },
    },
  },
});

// 🏪 **Store Integration Hook**
function useStoreSync() {
  const setConnectionStatus = useGuardianStore((state) => state.setConnectionStatus);
  const toggleOfflineMode = useGuardianStore((state) => state.toggleOfflineMode);

  useEffect(() => {
    // Monitor online/offline status
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

    // Initial status
    if (!navigator.onLine) {
      setConnectionStatus('disconnected');
      mockBackend.enable();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setConnectionStatus]);
}

// 🛡️ **Enhanced useQuery Hook with Offline Support**
export function useGuardianQuery<T>(
  options: UseQueryOptions<T> & {
    mockData?: T;
    enableMock?: boolean;
  }
) {
  const isOnline = navigator.onLine;
  const { mockData, enableMock = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryFn: async (context) => {
      try {
        // Try real API first
        if (queryOptions.queryFn) {
          return await queryOptions.queryFn(context);
        }
        throw new Error('No query function provided');
      } catch (error) {
        // Fallback to mock data if available and enabled
        if (!isOnline || (enableMock && mockData)) {
          console.warn(`🎭 Using mock data for query: ${JSON.stringify(context.queryKey)}`);
          
          // Simulate network delay for realism
          await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
          
          return mockData;
        }
        throw error;
      }
    },
  });
}

// 🚀 **Query Provider Component**
interface GuardianQueryProviderProps {
  children: React.ReactNode;
}

export function GuardianQueryProvider({ children }: GuardianQueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StoreSyncComponent />
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// 🔄 **Store Synchronization Component**
function StoreSyncComponent() {
  useStoreSync();
  return null;
}

// 🎯 **Offline-Ready Query Hooks**

// Guardian Authentication Query
export function useGuardianAuthQuery() {
  return useGuardianQuery({
    queryKey: ['guardian', 'current'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockGuardian(),
    staleTime: 5 * 60 * 1000,
  });
}

// Dashboard Stats Query
export function useDashboardStatsQuery() {
  return useGuardianQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Active Requests Query
export function useActiveRequestsQuery() {
  return useGuardianQuery({
    queryKey: ['voting', 'active-requests'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockActiveRequests(),
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

// Agents Status Query
export function useAgentsStatusQuery() {
  return useGuardianQuery({
    queryKey: ['agents', 'status'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockAgents(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Sentinel Metrics Query
export function useSentinelMetricsQuery() {
  return useGuardianQuery({
    queryKey: ['sentinel', 'metrics'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockSentinelMetrics(),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time feel
  });
}

// Alerts Query
export function useAlertsQuery() {
  return useGuardianQuery({
    queryKey: ['alerts', 'active'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockAlerts(),
    refetchInterval: 20000, // Refetch every 20 seconds
  });
}

// System Health Query
export function useSystemHealthQuery() {
  return useGuardianQuery({
    queryKey: ['system', 'health'],
    queryFn: async () => {
      // This would call your API
      throw new Error('Network unavailable');
    },
    mockData: mockBackend.getMockSystemHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// 🎭 **Mock Mode Utilities**
export function enableMockMode() {
  mockBackend.enable();
  console.log('🎭 Mock mode enabled - using demo data for all queries');
}

export function disableMockMode() {
  mockBackend.disable();
  console.log('🔄 Mock mode disabled - attempting real API calls');
}

export function isMockModeActive(): boolean {
  return mockBackend.isActive();
} 