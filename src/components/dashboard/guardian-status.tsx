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
  RefreshCw
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
  isMockModeActive
} from '@/providers/query-provider';

// 🎯 **Main Status Dashboard Component**
export function GuardianStatusDashboard() {
  const systemHealth = useSystemHealth();

  // Store actions
  const { setDashboardStats, setActiveRequests, setAgents, setSentinelMetrics, addAlert } = useGuardianStore();

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

  return (
    <div className="space-y-6">
      {/* 🏥 System Health Banner */}
      <SystemHealthBanner />
      
      {/* 📊 Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ConnectionStatusCard />
        <GuardianNetworkCard />
        <VotingStatusCard />
        <SentinelMetricsCard />
      </div>

      {/* 🤖 Agent Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentStatusCard />
        <AlertsCard />
      </div>

      {/* 🎛️ Control Panel */}
      <ControlPanel />
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