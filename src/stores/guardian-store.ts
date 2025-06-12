// GuardianOS Zustand Store - Real Backend Integration
// Centralized state management for the Guardian dashboard

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'

// Types
export interface Guardian {
  id: string
  name: string
  institution: string
  leiCode: string
  jurisdiction: string[]
  roles: string[]
  isActive: boolean
  lastActivity: string
  certificateStatus: string
}

export interface Vote {
  id: string
  transactionId: string
  requestType: string
  jurisdiction: string
  urgency: string
  requiredVotes: number
  currentVotes: number
  status: string
  createdAt: string
  deadline: string
  description: string
}

export interface Agent {
  id: string
  name: string
  type: string
  status: string
  health: {
    cpu: number
    memory: number
    network: number
  }
  lastHeartbeat: string
  performanceScore: number
  reputationWeight: number
  executionStats: {
    successRate: number
    avgResponseTime: number
    totalRequests: number
  }
  currentWorkflow?: string
}

export interface SentinelMetrics {
  timestamp: string
  transactionsProcessed: number
  fraudDetected: number
  accuracyRate: number
  processingTime: number
  systemLoad: {
    cpu: number
    memory: number
    network: number
  }
  activeConnections: number
}

export interface DashboardOverview {
  totalGuardians: number
  activeRequests: number
  consensusRate: number
  systemHealth: string
}

// Store state interface
interface GuardianStoreState {
  // Connection state
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  backendHealth: {
    main: boolean
    fraud: boolean
  }
  
  // Authentication
  currentGuardian: Guardian | null
  isAuthenticated: boolean
  
  // Dashboard data
  dashboardOverview: DashboardOverview | null
  systemHealth: any | null
  
  // Voting data
  activeRequests: Vote[]
  votingHistory: Vote[]
  
  // Agent data
  agents: Agent[]
  activeWorkflows: any[]
  
  // Sentinel data
  sentinelMetrics: SentinelMetrics | null
  activeAlerts: any[]
  
  // UI state
  sidebarCollapsed: boolean
  selectedTab: string
  notifications: Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
  
  // Actions
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void
  setBackendHealth: (health: { main: boolean; fraud: boolean }) => void
  setCurrentGuardian: (guardian: Guardian | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setDashboardOverview: (overview: DashboardOverview) => void
  setSystemHealth: (health: any) => void
  setActiveRequests: (requests: Vote[]) => void
  setVotingHistory: (history: Vote[]) => void
  setAgents: (agents: Agent[]) => void
  setActiveWorkflows: (workflows: any[]) => void
  setSentinelMetrics: (metrics: SentinelMetrics) => void
  setActiveAlerts: (alerts: any[]) => void
  addAlert: (alert: any) => void
  
  // UI Actions
  toggleSidebar: () => void
  setSelectedTab: (tab: string) => void
  addNotification: (notification: Omit<GuardianStoreState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  
  // Data refresh
  refreshData: () => Promise<void>
}

// Create the store
export const useGuardianStore = create<GuardianStoreState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      connectionStatus: 'connecting',
      backendHealth: { main: false, fraud: false },
      currentGuardian: null,
      isAuthenticated: false,
      dashboardOverview: null,
      systemHealth: null,
      activeRequests: [],
      votingHistory: [],
      agents: [],
      activeWorkflows: [],
      sentinelMetrics: null,
      activeAlerts: [],
      sidebarCollapsed: false,
      selectedTab: 'overview',
      notifications: [],

      // Connection actions
      setConnectionStatus: (status) => set((state) => {
        state.connectionStatus = status
      }),

      setBackendHealth: (health) => set((state) => {
        state.backendHealth = health
        // Update connection status based on backend health
        if (health.main || health.fraud) {
          state.connectionStatus = 'connected'
        } else {
          state.connectionStatus = 'disconnected'
        }
      }),

      // Authentication actions
      setCurrentGuardian: (guardian) => set((state) => {
        state.currentGuardian = guardian
        state.isAuthenticated = !!guardian
      }),

      setAuthenticated: (authenticated) => set((state) => {
        state.isAuthenticated = authenticated
        if (!authenticated) {
          state.currentGuardian = null
        }
      }),

      // Data actions
      setDashboardOverview: (overview) => set((state) => {
        state.dashboardOverview = overview
      }),

      setSystemHealth: (health) => set((state) => {
        state.systemHealth = health
      }),

      setActiveRequests: (requests) => set((state) => {
        state.activeRequests = requests
      }),

      setVotingHistory: (history) => set((state) => {
        state.votingHistory = history
      }),

      setAgents: (agents) => set((state) => {
        state.agents = agents
      }),

      setActiveWorkflows: (workflows) => set((state) => {
        state.activeWorkflows = workflows
      }),

      setSentinelMetrics: (metrics) => set((state) => {
        state.sentinelMetrics = metrics
      }),

      setActiveAlerts: (alerts) => set((state) => {
        state.activeAlerts = alerts
      }),

      addAlert: (alert) => set((state) => {
        // Check if alert already exists to prevent duplicates
        const exists = state.activeAlerts.some(existing => existing.id === alert.id);
        if (!exists) {
          state.activeAlerts.push(alert);
          
          // Keep only last 100 alerts
          if (state.activeAlerts.length > 100) {
            state.activeAlerts = state.activeAlerts.slice(-100);
          }
        }
      }),

      // UI actions
      toggleSidebar: () => set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed
      }),

      setSelectedTab: (tab) => set((state) => {
        state.selectedTab = tab
      }),

      addNotification: (notification) => set((state) => {
        const newNotification = {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false,
        }
        state.notifications.unshift(newNotification)
        
        // Keep only last 50 notifications
        if (state.notifications.length > 50) {
          state.notifications = state.notifications.slice(0, 50)
        }
      }),

      markNotificationRead: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id)
        if (notification) {
          notification.read = true
        }
      }),

      clearNotifications: () => set((state) => {
        state.notifications = []
      }),

      // Data refresh action
      refreshData: async () => {
        // This would trigger React Query refetches
        // The actual data fetching is handled by React Query hooks
        console.log('🔄 Data refresh triggered')
      },
    }))
  )
)

// Store selectors for optimal re-renders
export const useConnectionStatus = () => useGuardianStore((state) => state.connectionStatus)
export const useBackendHealth = () => useGuardianStore((state) => state.backendHealth)
export const useCurrentGuardian = () => useGuardianStore((state) => state.currentGuardian)
export const useIsAuthenticated = () => useGuardianStore((state) => state.isAuthenticated)
export const useDashboardOverview = () => useGuardianStore((state) => state.dashboardOverview)
export const useSystemHealth = () => useGuardianStore((state) => state.systemHealth)
export const useActiveRequests = () => useGuardianStore((state) => state.activeRequests)
export const useAgents = () => useGuardianStore((state) => state.agents)
export const useSentinelMetrics = () => useGuardianStore((state) => state.sentinelMetrics)
export const useActiveAlerts = () => useGuardianStore((state) => state.activeAlerts)
export const useSidebarCollapsed = () => useGuardianStore((state) => state.sidebarCollapsed)
export const useSelectedTab = () => useGuardianStore((state) => state.selectedTab)
export const useNotifications = () => useGuardianStore((state) => state.notifications)

// Stable action selectors to prevent infinite re-renders
export const useAddAlert = () => useGuardianStore((state) => state.addAlert)
export const useSetDashboardStats = () => useGuardianStore((state) => state.setDashboardOverview)
export const useSetActiveRequests = () => useGuardianStore((state) => state.setActiveRequests)
export const useSetAgents = () => useGuardianStore((state) => state.setAgents)
export const useSetSentinelMetrics = () => useGuardianStore((state) => state.setSentinelMetrics)
export const useSetBackendHealth = () => useGuardianStore((state) => state.setBackendHealth)
export const useSetConnectionStatus = () => useGuardianStore((state) => state.setConnectionStatus)

// Subscribe to connection status changes
useGuardianStore.subscribe(
  (state) => state.connectionStatus,
  (connectionStatus) => {
    console.log(`🔌 Connection status changed: ${connectionStatus}`)
  }
)

// Subscribe to backend health changes
useGuardianStore.subscribe(
  (state) => state.backendHealth,
  (health) => {
    console.log(`🏥 Backend health: Main=${health.main}, Fraud=${health.fraud}`)
  }
) 