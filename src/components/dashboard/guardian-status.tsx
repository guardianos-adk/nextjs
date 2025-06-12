// GuardianOS Status Dashboard Component
// File: src/components/dashboard/guardian-status.tsx
// Modern dashboard with Zustand state and React Query integration

'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Server,
  Wifi,
  WifiOff,
  Settings,
  RefreshCw,
  Vote,
  TrendingUp,
  Network,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useGuardianStore, 
  useConnectionState, 
  useDashboardState,
  useVotingState,
  useAgentsState,
  useSentinelState,
  useSystemHealth,
  useIsOnline
} from '@/stores/guardian-store';
import {
  useDashboardStatsQuery,
  useActiveRequestsQuery,
  useAgentsStatusQuery,
  useSentinelMetricsQuery,
  useAlertsQuery,
  enableMockMode,
  disableMockMode,
  isMockModeActive,
  useCurrentGuardianQuery,
  useDashboardOverviewQuery,
  useSystemHealthQuery,
  useBackendHealthQuery
} from '@/providers/query-provider';

// 🎯 **Main Status Dashboard Component**
export function GuardianStatusDashboard() {
  const systemHealth = useSystemHealth();

  // Store actions
  const { setDashboardStats, setActiveRequests, setAgents, setSentinelMetrics, addAlert, setConnectionStatus, setBackendHealth } = useGuardianStore();

  // React Query hooks
  const dashboardQuery = useDashboardStatsQuery();
  const requestsQuery = useActiveRequestsQuery();
  const agentsQuery = useAgentsStatusQuery();
  const metricsQuery = useSentinelMetricsQuery();
  const alertsQuery = useAlertsQuery();

  // Sync query data to store
  useEffect(() => {
    if (dashboardQuery.data) {
      setDashboardStats(dashboardQuery.data);
    }
  }, [dashboardQuery.data, setDashboardStats]);

  useEffect(() => {
    if (requestsQuery.data) {
      setActiveRequests(requestsQuery.data);
    }
  }, [requestsQuery.data, setActiveRequests]);

  useEffect(() => {
    if (agentsQuery.data) {
      setAgents(agentsQuery.data);
    }
  }, [agentsQuery.data, setAgents]);

  useEffect(() => {
    if (metricsQuery.data) {
      setSentinelMetrics(metricsQuery.data);
    }
  }, [metricsQuery.data, setSentinelMetrics]);

  useEffect(() => {
    if (alertsQuery.data) {
      alertsQuery.data.forEach(alert => addAlert(alert));
    }
  }, [alertsQuery.data, addAlert]);

  const { data: backendHealth } = useBackendHealthQuery();

  // Update store with backend health
  useEffect(() => {
    if (backendHealth) {
      setBackendHealth(backendHealth);
      if (backendHealth.main || backendHealth.fraud) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    }
  }, [backendHealth, setBackendHealth, setConnectionStatus]);

  return (
    <div className="space-y-6">
      {/* Connection Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guardian Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and control center</p>
        </div>
        <ConnectionStatus />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GuardianProfile />
        <DashboardOverview />
        <VotingRequests />
        <SystemHealth />
      </div>

      {/* Footer */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            Real-time data from Python backend
          </span>
        </div>
      </div>
    </div>
  );
}

// 🏥 **System Health Banner**
function SystemHealthBanner() {
  const systemHealth = useSystemHealth();
  const isOnline = useIsOnline();
  const connectionState = useConnectionState();

  const getHealthColor = () => {
    if (systemHealth === 'healthy') return 'text-green-600 bg-green-50 border-green-200';
    if (systemHealth === 'warning') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getHealthIcon = () => {
    if (systemHealth === 'healthy') return <CheckCircle className="h-5 w-5" />;
    if (systemHealth === 'warning') return <AlertTriangle className="h-5 w-5" />;
    return <XCircle className="h-5 w-5" />;
  };

  return (
    <Alert className={cn('border-l-4', getHealthColor())}>
      <div className="flex items-center gap-3">
        {getHealthIcon()}
        <div className="flex-1">
          <AlertDescription className="text-sm font-medium">
            {systemHealth === 'healthy' && isOnline && 'All systems operational'}
            {systemHealth === 'healthy' && !isOnline && 'Operating in offline mode with demo data'}
            {systemHealth === 'warning' && 'Some services experiencing issues'}
            {systemHealth === 'critical' && 'Critical system issues detected'}
            
            {!isOnline && (
              <span className="ml-2 text-xs opacity-75">
                • Network: {connectionState.status} • Retries: {connectionState.retryCount}
              </span>
            )}
          </AlertDescription>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          
          {isMockModeActive() && (
            <Badge variant="outline" className="text-xs">
              Demo Mode
            </Badge>
          )}
        </div>
      </div>
    </Alert>
  );
}

// 🔗 **Connection Status Card**
function ConnectionStatusCard() {
  const connectionState = useConnectionState();
  const isOnline = useIsOnline();

  const getStatusColor = () => {
    if (connectionState.status === 'connected') return 'text-green-600';
    if (connectionState.status === 'connecting') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold capitalize">
          <span className={getStatusColor()}>
            {connectionState.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {isOnline ? 'Network available' : 'Offline mode active'}
          {connectionState.retryCount > 0 && ` • ${connectionState.retryCount} retries`}
        </p>
        {connectionState.lastActivity && (
          <p className="text-xs text-muted-foreground mt-1">
            Last activity: {new Date(connectionState.lastActivity).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// 👥 **Guardian Network Card**
function GuardianNetworkCard() {
  const dashboardState = useDashboardState();
  const dashboardQuery = useDashboardStatsQuery();

  const stats = dashboardQuery.data || dashboardState.stats;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Guardian Network</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats?.totalGuardians || 0}</div>
        <p className="text-xs text-muted-foreground">
          Active guardians
        </p>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span>Consensus Rate</span>
            <span>{stats?.consensusRate || 0}%</span>
          </div>
          <Progress value={stats?.consensusRate || 0} className="h-1 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// 🗳️ **Voting Status Card**
function VotingStatusCard() {
  const votingState = useVotingState();
  const requestsQuery = useActiveRequestsQuery();

  const activeRequests = requestsQuery.data || votingState.activeRequests;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Votes</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeRequests.length}</div>
        <p className="text-xs text-muted-foreground">
          Pending decisions
        </p>
        {activeRequests.length > 0 && (
          <div className="mt-2 space-y-1">
            {activeRequests.slice(0, 2).map((request) => (
              <div key={request.id} className="text-xs">
                <Badge variant="outline" className="mr-1">
                  {request.priority}
                </Badge>
                <span className="opacity-75">
                  {request.votesReceived}/{request.votesRequired}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 🛡️ **Sentinel Metrics Card**
function SentinelMetricsCard() {
  const sentinelState = useSentinelState();
  const metricsQuery = useSentinelMetricsQuery();

  const metrics = metricsQuery.data || sentinelState.metrics;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Fraud Detection</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metrics?.fraudDetected || 0}</div>
        <p className="text-xs text-muted-foreground">
          Threats detected today
        </p>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span>Accuracy</span>
            <span>{((metrics?.accuracyRate || 0) * 100).toFixed(1)}%</span>
          </div>
          <Progress value={(metrics?.accuracyRate || 0) * 100} className="h-1 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// 🤖 **Agent Status Card**
function AgentStatusCard() {
  const agentsState = useAgentsState();
  const agentsQuery = useAgentsStatusQuery();

  const agents = agentsQuery.data || agentsState.list;

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'text-green-600';
    if (status === 'degraded') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Agent Status
        </CardTitle>
        <CardDescription>
          Autonomous agent health and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.slice(0, 3).map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm">{agent.name}</div>
                <div className="text-xs text-muted-foreground">
                  v{agent.version} • {(agent.uptime * 100).toFixed(1)}% uptime
                </div>
              </div>
              <div className="text-right">
                <div className={cn('text-sm font-medium capitalize', getStatusColor(agent.status))}>
                  {agent.status}
                </div>
                <div className="text-xs text-muted-foreground">
                  {agent.workload.current}/{agent.workload.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 🚨 **Alerts Card**
function AlertsCard() {
  const sentinelState = useSentinelState();
  const alertsQuery = useAlertsQuery();

  const alerts = alertsQuery.data || sentinelState.alerts;

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'bg-red-100 text-red-800 border-red-200';
    if (severity === 'high') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
        <CardDescription>
          Latest security and system alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{alert.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {alert.description}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn('text-xs capitalize', getSeverityColor(alert.severity))}
                >
                  {alert.severity}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(alert.timestamp).toLocaleString()} • {alert.source}
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">No active alerts</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// 🎛️ **Control Panel**
function ControlPanel() {
  const { resetStore } = useGuardianStore();

  const handleToggleMockMode = () => {
    if (isMockModeActive()) {
      disableMockMode();
    } else {
      enableMockMode();
    }
    window.location.reload(); // Refresh to apply changes
  };

  const handleResetStore = () => {
    resetStore();
    console.log('🔄 Store reset to initial state');
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Controls
        </CardTitle>
        <CardDescription>
          Development and testing utilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleMockMode}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            {isMockModeActive() ? 'Disable' : 'Enable'} Mock Mode
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetStore}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Store
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Mock mode: {isMockModeActive() ? 'Enabled' : 'Disabled'} • 
          Query cache active • State management: Zustand
        </div>
      </CardContent>
    </Card>
  );
}

// Connection status indicator
function ConnectionStatus() {
  const { data: backendHealth, isLoading } = useBackendHealthQuery()
  const connectionStatus = useGuardianStore((state) => state.connectionStatus)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        Checking connection...
      </div>
    )
  }

  const isConnected = connectionStatus === 'connected' && (backendHealth?.main || backendHealth?.fraud)

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
        {isConnected ? 'Connected to Backend' : 'Backend Offline'}
      </span>
      {backendHealth && (
        <span className="text-muted-foreground text-xs">
          (Main: {backendHealth.main ? '✓' : '✗'}, Fraud: {backendHealth.fraud ? '✓' : '✗'})
        </span>
      )}
    </div>
  )
}

// Guardian profile card
function GuardianProfile() {
  const { data: guardian, isLoading, error } = useCurrentGuardianQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guardian Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guardian Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load guardian profile</p>
            <p className="text-xs">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!guardian) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guardian Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p>No guardian profile found</p>
            <Button variant="outline" size="sm" className="mt-2">
              Initialize Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Guardian Profile
        </CardTitle>
        <CardDescription>Current guardian information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">{guardian.name}</h3>
          <p className="text-sm text-muted-foreground">{guardian.institution}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">LEI Code</p>
            <p className="font-mono">{guardian.leiCode}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant={guardian.isActive ? 'default' : 'secondary'}>
              {guardian.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Jurisdiction</p>
          <div className="flex gap-1 mt-1">
            {guardian.jurisdiction.map((j) => (
              <Badge key={j} variant="outline" className="text-xs">
                {j}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Roles</p>
          <div className="flex gap-1 mt-1">
            {guardian.roles.map((role) => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Certificate</span>
          <Badge variant={guardian.certificateStatus === 'valid' ? 'default' : 'destructive'}>
            {guardian.certificateStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Dashboard overview card
function DashboardOverview() {
  const { data: overview, isLoading, error } = useDashboardOverviewQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !overview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load system overview</p>
            {error && <p className="text-xs">{error.message}</p>}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Overview
        </CardTitle>
        <CardDescription>Current system statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Guardians</p>
            <p className="text-2xl font-bold">{overview.totalGuardians}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active Requests</p>
            <p className="text-2xl font-bold">{overview.activeRequests}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Consensus Rate</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{overview.consensusRate}%</p>
              <Progress value={overview.consensusRate} className="h-2" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">System Health</p>
            <Badge variant={overview.systemHealth === 'healthy' ? 'default' : 'destructive'}>
              {overview.systemHealth}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Active voting requests
function VotingRequests() {
  const { data: requests, isLoading, error } = useActiveRequestsQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Active Voting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Active Voting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Vote className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load voting requests</p>
            <p className="text-xs">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeRequests = requests || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="w-5 h-5" />
          Active Voting ({activeRequests.length})
        </CardTitle>
        <CardDescription>Pending de-anonymization requests</CardDescription>
      </CardHeader>
      <CardContent>
        {activeRequests.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p>No active voting requests</p>
            <p className="text-xs">All requests have been processed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{request.requestType}</Badge>
                  <Badge variant={request.urgency === 'high' ? 'destructive' : 'secondary'}>
                    {request.urgency}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{request.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Votes: {request.currentVotes}/{request.requiredVotes}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(request.deadline).toLocaleDateString()}
                  </span>
                </div>
                <Progress 
                  value={(request.currentVotes / request.requiredVotes) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
            {activeRequests.length > 3 && (
              <Button variant="outline" size="sm" className="w-full">
                View All {activeRequests.length} Requests
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// System health monitoring
function SystemHealth() {
  const { data: health, isLoading, error } = useSystemHealthQuery()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load system health</p>
            {error && <p className="text-xs">{error.message}</p>}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          System Health
        </CardTitle>
        <CardDescription>Real-time system monitoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Agents</p>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">
                {health.agents.healthy}/{health.agents.total}
              </div>
              <Badge variant={health.agents.healthy === health.agents.total ? 'default' : 'destructive'}>
                {health.agents.healthy === health.agents.total ? 'Healthy' : 'Issues'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Consensus</p>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">{health.consensus.successRate}%</div>
              <Badge variant={health.consensus.successRate > 90 ? 'default' : 'secondary'}>
                {health.consensus.avgTime}s avg
              </Badge>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Throughput</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Current: {health.throughput?.current || 0}</span>
              <span>Capacity: {health.throughput?.capacity || 0}</span>
            </div>
            <Progress 
              value={((health.throughput?.current || 0) / (health.throughput?.capacity || 1)) * 100} 
              className="h-2" 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active Alerts</span>
          <Badge variant={health.alerts?.active > 0 ? 'destructive' : 'default'}>
            {health.alerts?.active || 0} alerts
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
} 