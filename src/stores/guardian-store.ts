// GuardianOS Global State Store - Zustand + TypeScript
// File: src/stores/guardian-store.ts
// Modern state management following 2025 best practices

import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  Guardian, 
  DeAnonymizationRequest, 
  ADKAgent, 
  SentinelMetrics, 
  Alert 
} from '@/lib/types';

// 🎯 **Core Application State Interface**
interface DashboardStats {
  totalGuardians: number;
  activeRequests: number;
  consensusRate: number;
  systemHealth: string;
  recentActivity: any[];
}

interface GuardianOSState {
  // Authentication & User State
  auth: {
    guardian: Guardian | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  
  // Real-time Connection State
  connection: {
    isConnected: boolean;
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
    retryCount: number;
    lastActivity: string | null;
  };
  
  // Dashboard State
  dashboard: {
    stats: DashboardStats | null;
    isOfflineMode: boolean;
    lastSync: string | null;
    pendingUpdates: number;
  };
  
  // Voting System State
  voting: {
    activeRequests: DeAnonymizationRequest[];
    pendingVotes: Map<string, any>;
    consensusStatus: Map<string, number>;
    recentActivity: any[];
  };
  
  // Agent Management State
  agents: {
    list: ADKAgent[];
    activeWorkflows: any[];
    healthStatus: 'healthy' | 'degraded' | 'critical';
    lastUpdate: string | null;
  };
  
  // Sentinel Monitoring State
  sentinel: {
    metrics: SentinelMetrics | null;
    alerts: Alert[];
    realTimeData: any[];
    performanceHistory: any[];
  };
  
  // UI State
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    activeView: string;
    notifications: any[];
    modals: Map<string, boolean>;
  };
}

// 🚀 **State Actions Interface**
interface GuardianOSActions {
  // Authentication Actions
  setGuardian: (guardian: Guardian | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Connection Actions
  setConnectionStatus: (status: GuardianOSState['connection']['status']) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  updateLastActivity: () => void;
  
  // Dashboard Actions
  setDashboardStats: (stats: DashboardStats) => void;
  toggleOfflineMode: () => void;
  updateLastSync: () => void;
  incrementPendingUpdates: () => void;
  clearPendingUpdates: () => void;
  
  // Voting Actions
  setActiveRequests: (requests: DeAnonymizationRequest[]) => void;
  addNewRequest: (request: DeAnonymizationRequest) => void;
  removeRequest: (requestId: string) => void;
  updateConsensus: (requestId: string, votes: number) => void;
  setPendingVote: (requestId: string, vote: any) => void;
  removePendingVote: (requestId: string) => void;
  
  // Agent Actions
  setAgents: (agents: ADKAgent[]) => void;
  updateAgent: (agentId: string, updates: Partial<ADKAgent>) => void;
  setActiveWorkflows: (workflows: any[]) => void;
  updateAgentHealth: (status: GuardianOSState['agents']['healthStatus']) => void;
  
  // Sentinel Actions
  setSentinelMetrics: (metrics: SentinelMetrics) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
  updateRealTimeData: (data: any) => void;
  addPerformanceData: (data: any) => void;
  
  // UI Actions
  toggleSidebar: () => void;
  setTheme: (theme: GuardianOSState['ui']['theme']) => void;
  setActiveView: (view: string) => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  toggleModal: (modalId: string) => void;
  
  // Utility Actions
  resetStore: () => void;
  hydrateFromCache: () => void;
}

// 🎯 **Initial State**
const initialState: GuardianOSState = {
  auth: {
    guardian: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  connection: {
    isConnected: false,
    status: 'disconnected',
    retryCount: 0,
    lastActivity: null,
  },
  dashboard: {
    stats: null,
    isOfflineMode: false,
    lastSync: null,
    pendingUpdates: 0,
  },
  voting: {
    activeRequests: [],
    pendingVotes: new Map(),
    consensusStatus: new Map(),
    recentActivity: [],
  },
  agents: {
    list: [],
    activeWorkflows: [],
    healthStatus: 'healthy',
    lastUpdate: null,
  },
  sentinel: {
    metrics: null,
    alerts: [],
    realTimeData: [],
    performanceHistory: [],
  },
  ui: {
    sidebarOpen: true,
    theme: 'system',
    activeView: 'dashboard',
    notifications: [],
    modals: new Map(),
  },
};

// 🛡️ **Create Zustand Store with Middleware**
export const useGuardianStore = create<GuardianOSState & GuardianOSActions>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        
        // 🔐 Authentication Actions
        setGuardian: (guardian) => set((state) => {
          state.auth.guardian = guardian;
          state.auth.isAuthenticated = !!guardian;
          state.auth.error = null;
        }),
        
        setAuthLoading: (loading) => set((state) => {
          state.auth.isLoading = loading;
        }),
        
        setAuthError: (error) => set((state) => {
          state.auth.error = error;
          state.auth.isLoading = false;
        }),
        
        clearAuth: () => set((state) => {
          state.auth = initialState.auth;
          // Clear sensitive data
          state.voting.pendingVotes.clear();
          state.ui.notifications = [];
        }),
        
        // 🔗 Connection Actions
        setConnectionStatus: (status) => set((state) => {
          state.connection.status = status;
          state.connection.isConnected = status === 'connected';
          
          // Auto-enable offline mode if disconnected
          if (status === 'disconnected' || status === 'error') {
            state.dashboard.isOfflineMode = true;
          } else {
            state.dashboard.isOfflineMode = false;
          }
        }),
        
        incrementRetryCount: () => set((state) => {
          state.connection.retryCount += 1;
        }),
        
        resetRetryCount: () => set((state) => {
          state.connection.retryCount = 0;
        }),
        
        updateLastActivity: () => set((state) => {
          state.connection.lastActivity = new Date().toISOString();
        }),
        
        // 📊 Dashboard Actions
        setDashboardStats: (stats) => set((state) => {
          state.dashboard.stats = stats;
          state.dashboard.lastSync = new Date().toISOString();
        }),
        
        toggleOfflineMode: () => set((state) => {
          state.dashboard.isOfflineMode = !state.dashboard.isOfflineMode;
        }),
        
        updateLastSync: () => set((state) => {
          state.dashboard.lastSync = new Date().toISOString();
        }),
        
        incrementPendingUpdates: () => set((state) => {
          state.dashboard.pendingUpdates += 1;
        }),
        
        clearPendingUpdates: () => set((state) => {
          state.dashboard.pendingUpdates = 0;
        }),
        
        // 🗳️ Voting Actions
        setActiveRequests: (requests) => set((state) => {
          state.voting.activeRequests = requests;
        }),
        
        addNewRequest: (request) => set((state) => {
          // Add to beginning of array (most recent first)
          state.voting.activeRequests.unshift(request);
          
          // Add notification
          state.ui.notifications.unshift({
            id: `request-${request.id}`,
            type: 'info',
            title: 'New Request',
            message: `De-anonymization request: ${request.complianceReason}`,
            timestamp: new Date().toISOString(),
          });
        }),
        
        removeRequest: (requestId) => set((state) => {
          state.voting.activeRequests = state.voting.activeRequests.filter(
            req => req.id !== requestId
          );
          state.voting.consensusStatus.delete(requestId);
          state.voting.pendingVotes.delete(requestId);
        }),
        
        updateConsensus: (requestId, votes) => set((state) => {
          state.voting.consensusStatus.set(requestId, votes);
        }),
        
        setPendingVote: (requestId, vote) => set((state) => {
          state.voting.pendingVotes.set(requestId, vote);
        }),
        
        removePendingVote: (requestId) => set((state) => {
          state.voting.pendingVotes.delete(requestId);
        }),
        
        // 🤖 Agent Actions
        setAgents: (agents) => set((state) => {
          state.agents.list = agents;
          state.agents.lastUpdate = new Date().toISOString();
          
          // Calculate health status
          const healthyCount = agents.filter(agent => agent.status === 'healthy').length;
          const total = agents.length;
          
          if (total === 0) {
            state.agents.healthStatus = 'critical';
          } else if (healthyCount / total >= 0.8) {
            state.agents.healthStatus = 'healthy';
          } else if (healthyCount / total >= 0.5) {
            state.agents.healthStatus = 'degraded';
          } else {
            state.agents.healthStatus = 'critical';
          }
        }),
        
        updateAgent: (agentId, updates) => set((state) => {
          const agentIndex = state.agents.list.findIndex(agent => agent.id === agentId);
          if (agentIndex !== -1) {
            Object.assign(state.agents.list[agentIndex], updates);
          }
        }),
        
        setActiveWorkflows: (workflows) => set((state) => {
          state.agents.activeWorkflows = workflows;
        }),
        
        updateAgentHealth: (status) => set((state) => {
          state.agents.healthStatus = status;
        }),
        
        // 🛡️ Sentinel Actions
        setSentinelMetrics: (metrics) => set((state) => {
          state.sentinel.metrics = metrics;
          
          // Add to real-time data
          state.sentinel.realTimeData.push({
            timestamp: new Date().toISOString(),
            ...metrics,
          });
          
          // Keep only last 100 data points
          if (state.sentinel.realTimeData.length > 100) {
            state.sentinel.realTimeData = state.sentinel.realTimeData.slice(-100);
          }
        }),
        
        addAlert: (alert) => set((state) => {
          state.sentinel.alerts.unshift(alert);
          
          // Add to notifications if critical
          if (alert.severity === 'critical' || alert.severity === 'high') {
            state.ui.notifications.unshift({
              id: `alert-${alert.id}`,
              type: 'error',
              title: 'Security Alert',
              message: alert.message,
              timestamp: new Date().toISOString(),
            });
          }
        }),
        
        removeAlert: (alertId) => set((state) => {
          state.sentinel.alerts = state.sentinel.alerts.filter(
            alert => alert.id !== alertId
          );
        }),
        
        updateRealTimeData: (data) => set((state) => {
          state.sentinel.realTimeData.push({
            timestamp: new Date().toISOString(),
            ...data,
          });
          
          // Keep only last 100 data points
          if (state.sentinel.realTimeData.length > 100) {
            state.sentinel.realTimeData = state.sentinel.realTimeData.slice(-100);
          }
        }),
        
        addPerformanceData: (data) => set((state) => {
          state.sentinel.performanceHistory.push(data);
          
          // Keep only last 1000 data points
          if (state.sentinel.performanceHistory.length > 1000) {
            state.sentinel.performanceHistory = state.sentinel.performanceHistory.slice(-1000);
          }
        }),
        
        // 🎨 UI Actions
        toggleSidebar: () => set((state) => {
          state.ui.sidebarOpen = !state.ui.sidebarOpen;
        }),
        
        setTheme: (theme) => set((state) => {
          state.ui.theme = theme;
        }),
        
        setActiveView: (view) => set((state) => {
          state.ui.activeView = view;
        }),
        
        addNotification: (notification) => set((state) => {
          state.ui.notifications.unshift({
            id: notification.id || `notif-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...notification,
          });
          
          // Keep only last 50 notifications
          if (state.ui.notifications.length > 50) {
            state.ui.notifications = state.ui.notifications.slice(0, 50);
          }
        }),
        
        removeNotification: (id) => set((state) => {
          state.ui.notifications = state.ui.notifications.filter(
            notif => notif.id !== id
          );
        }),
        
        toggleModal: (modalId) => set((state) => {
          const isOpen = state.ui.modals.get(modalId) || false;
          state.ui.modals.set(modalId, !isOpen);
        }),
        
        // 🔄 Utility Actions
        resetStore: () => set(() => initialState),
        
        hydrateFromCache: () => {
          if (typeof window !== 'undefined') {
            try {
              const cached = localStorage.getItem('guardianOS-state');
              if (cached) {
                const parsedState = JSON.parse(cached);
                set((state) => {
                  // Only hydrate non-sensitive data
                  state.ui.theme = parsedState.ui?.theme || 'system';
                  state.ui.sidebarOpen = parsedState.ui?.sidebarOpen ?? true;
                  state.dashboard.isOfflineMode = parsedState.dashboard?.isOfflineMode ?? false;
                });
              }
            } catch (error) {
              console.warn('Failed to hydrate state from cache:', error);
            }
          }
        },
      }))
    ),
    {
      name: 'guardianOS-store',
    }
  )
);

// 🔍 **Selector Hooks for Performance**
export const useAuthState = () => useGuardianStore((state) => state.auth);
export const useConnectionState = () => useGuardianStore((state) => state.connection);
export const useDashboardState = () => useGuardianStore((state) => state.dashboard);
export const useVotingState = () => useGuardianStore((state) => state.voting);
export const useAgentsState = () => useGuardianStore((state) => state.agents);
export const useSentinelState = () => useGuardianStore((state) => state.sentinel);
export const useUIState = () => useGuardianStore((state) => state.ui);

// 🎯 **Derived State Selectors**
export const useIsOnline = () => useGuardianStore((state) => 
  state.connection.isConnected && !state.dashboard.isOfflineMode
);

export const useActiveAlertsCount = () => useGuardianStore((state) => 
  state.sentinel.alerts.filter(alert => !alert.acknowledged).length
);

export const usePendingVotesCount = () => useGuardianStore((state) => 
  state.voting.pendingVotes.size
);

export const useSystemHealth = () => useGuardianStore((state) => {
  const agentHealth = state.agents.healthStatus;
  const alertCount = state.sentinel.alerts.length;
  const isConnected = state.connection.isConnected;
  
  if (!isConnected || agentHealth === 'critical' || alertCount > 10) {
    return 'critical';
  } else if (agentHealth === 'degraded' || alertCount > 5) {
    return 'warning';
  } else {
    return 'healthy';
  }
});

// 🔄 **Store Persistence**
useGuardianStore.subscribe(
  (state) => state.ui,
  (ui) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('guardianOS-ui-preferences', JSON.stringify(ui));
      } catch (error) {
        console.warn('Failed to persist UI preferences:', error);
      }
    }
  },
  { fireImmediately: false }
); 