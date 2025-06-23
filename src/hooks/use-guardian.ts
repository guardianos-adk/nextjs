"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './use-websocket';
import { 
  guardianApi, 
  votingApi, 
  agentApi, 
  sentinelApi, 
  dashboardApi 
} from '@/lib/api-client';
import { 
  Guardian, 
  DeAnonymizationRequest, 
  ADKAgent, 
  SentinelMetrics, 
  Alert,
  VoteFormData 
} from '@/lib/types';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

// Guardian Authentication Hook
export function useGuardianAuth() {
  const queryClient = useQueryClient();

  const { data: guardian, isLoading, error } = useQuery({
    queryKey: ['guardian', 'current'],
    queryFn: async () => {
      const response = await guardianApi.getCurrentGuardian();
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: ({ leiCode, certificate }: { leiCode: string; certificate: string }) =>
      guardianApi.login(leiCode, certificate),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(['guardian', 'current'], response.data?.guardian);
        toast.success('Successfully authenticated as Guardian');
      } else {
        toast.error(response.error || 'Login failed');
      }
    },
    onError: (error) => {
      toast.error('Authentication failed. Please check your credentials.');
      console.error('Login error:', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: guardianApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Successfully logged out');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Guardian>) => guardianApi.updateProfile(updates),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(['guardian', 'current'], response.data);
        toast.success('Profile updated successfully');
      }
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  return {
    guardian,
    isLoading,
    error,
    isAuthenticated: !!guardian,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}

// Voting System Hook
export function useVoting() {
  const queryClient = useQueryClient();
  const { lastMessage, subscribe, unsubscribe } = useWebSocket('/voting');

  // Real-time updates for voting
  useEffect(() => {
    const handleNewRequest = (data: any) => {
      queryClient.setQueryData(['voting', 'active-requests'], (old: DeAnonymizationRequest[] = []) => [
        data.request,
        ...old,
      ]);
      toast.info(`New de-anonymization request: ${data.request.complianceReason}`);
    };

    const handleVoteUpdate = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['voting', 'request', data.requestId] });
      toast.info(`Vote update for request ${data.requestId}`);
    };

    const handleConsensusReached = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['voting', 'active-requests'] });
      toast.success(`Consensus reached for request ${data.requestId}: ${data.decision}`);
    };

    subscribe('NEW_REQUEST', handleNewRequest);
    subscribe('VOTE_SUBMITTED', handleVoteUpdate);
    subscribe('CONSENSUS_REACHED', handleConsensusReached);

    return () => {
      unsubscribe('NEW_REQUEST');
      unsubscribe('VOTE_SUBMITTED');
      unsubscribe('CONSENSUS_REACHED');
    };
  }, [subscribe, unsubscribe, queryClient]);

  const { data: activeRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['voting', 'active-requests'],
    queryFn: async () => {
      const response = await votingApi.getActiveRequests();
      return response.data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const submitVoteMutation = useMutation({
    mutationFn: ({ requestId, voteData }: { requestId: string; voteData: VoteFormData }) =>
      votingApi.submitVote(requestId, voteData),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['voting', 'active-requests'] });
        queryClient.invalidateQueries({ queryKey: ['voting', 'request', variables.requestId] });
        toast.success('Vote submitted successfully');
      } else {
        toast.error(response.error || 'Failed to submit vote');
      }
    },
    onError: () => {
      toast.error('Failed to submit vote');
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: votingApi.createRequest,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['voting', 'active-requests'] });
        toast.success('De-anonymization request created successfully');
      }
    },
    onError: () => {
      toast.error('Failed to create request');
    },
  });

  return {
    activeRequests: activeRequests || [],
    requestsLoading,
    submitVote: submitVoteMutation.mutate,
    createRequest: createRequestMutation.mutate,
    isSubmittingVote: submitVoteMutation.isPending,
    isCreatingRequest: createRequestMutation.isPending,
  };
}

// ADK Agent Management Hook
export function useAgents() {
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe } = useWebSocket('/agents');

  // Real-time agent status updates
  useEffect(() => {
    const handleAgentStatusChange = (data: any) => {
      queryClient.setQueryData(['agents', 'status'], (old: ADKAgent[] = []) =>
        old.map(agent => 
          agent.id === data.agentId 
            ? { ...agent, ...data.changes }
            : agent
        )
      );
    };

    const handleWorkflowUpdate = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['agents', 'workflows'] });
      if (data.type === 'WORKFLOW_COMPLETED') {
        toast.success(`Workflow ${data.workflowId} completed successfully`);
      } else if (data.type === 'WORKFLOW_STARTED') {
        toast.info(`Workflow ${data.workflowId} started`);
      }
    };

    subscribe('AGENT_STATUS_CHANGE', handleAgentStatusChange);
    subscribe('WORKFLOW_STARTED', handleWorkflowUpdate);
    subscribe('WORKFLOW_COMPLETED', handleWorkflowUpdate);

    return () => {
      unsubscribe('AGENT_STATUS_CHANGE');
      unsubscribe('WORKFLOW_STARTED');
      unsubscribe('WORKFLOW_COMPLETED');
    };
  }, [subscribe, unsubscribe, queryClient]);

  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['agents', 'status'],
    queryFn: async () => {
      const response = await agentApi.getAllAgentsStatus();
      return response.data || [];
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['agents', 'workflows'],
    queryFn: async () => {
      const response = await agentApi.getActiveWorkflows();
      return response.data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const restartAgentMutation = useMutation({
    mutationFn: agentApi.restartAgent,
    onSuccess: (response, agentId) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['agents', 'status'] });
        toast.success(`Agent ${agentId} restarted successfully`);
      }
    },
    onError: (error, agentId) => {
      toast.error(`Failed to restart agent ${agentId}`);
    },
  });

  const triggerWorkflowMutation = useMutation({
    mutationFn: ({ type, data }: { type: string; data: any }) => 
      agentApi.triggerWorkflow(type, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['agents', 'workflows'] });
        toast.success('Workflow triggered successfully');
      }
    },
    onError: () => {
      toast.error('Failed to trigger workflow');
    },
  });

  return {
    agents: agents || [],
    workflows: workflows || [],
    agentsLoading,
    workflowsLoading,
    restartAgent: restartAgentMutation.mutate,
    triggerWorkflow: triggerWorkflowMutation.mutate,
    isRestartingAgent: restartAgentMutation.isPending,
    isTriggeringWorkflow: triggerWorkflowMutation.isPending,
  };
}

// FraudSentinel Monitoring Hook
export function useSentinel() {
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe } = useWebSocket('/sentinel');
  const [currentMetrics, setCurrentMetrics] = useState<SentinelMetrics | null>(null);

  // Real-time metrics updates
  useEffect(() => {
    const handleMetricsUpdate = (data: SentinelMetrics) => {
      setCurrentMetrics(data);
      queryClient.setQueryData(['sentinel', 'metrics', 'current'], data);
    };

    const handleAlert = (data: Alert) => {
      queryClient.invalidateQueries({ queryKey: ['sentinel', 'alerts'] });
      
      const severity = data.severity;
      if (severity === 'critical') {
        toast.error(`Critical Alert: ${data.title}`);
      } else if (severity === 'high') {
        toast.warning(`High Priority Alert: ${data.title}`);
      } else {
        toast.info(`Alert: ${data.title}`);
      }
    };

    subscribe('METRICS_UPDATE', handleMetricsUpdate);
    subscribe('FRAUD_DETECTED', handleAlert);
    subscribe('PERFORMANCE_ALERT', handleAlert);

    return () => {
      unsubscribe('METRICS_UPDATE');
      unsubscribe('FRAUD_DETECTED');
      unsubscribe('PERFORMANCE_ALERT');
    };
  }, [subscribe, unsubscribe, queryClient]);

  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['sentinel', 'status'],
    queryFn: async () => {
      const response = await sentinelApi.getSentinelStatus();
      return response.data;
    },
    refetchInterval: 30000,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['sentinel', 'alerts'],
    queryFn: async () => {
      const response = await sentinelApi.getActiveAlerts();
      return response.data || [];
    },
    refetchInterval: 15000,
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: sentinelApi.acknowledgeAlert,
    onSuccess: (response, alertId) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['sentinel', 'alerts'] });
        toast.success('Alert acknowledged');
      }
    },
    onError: () => {
      toast.error('Failed to acknowledge alert');
    },
  });

  return {
    systemStatus,
    currentMetrics,
    alerts: alerts || [],
    statusLoading,
    alertsLoading,
    acknowledgeAlert: acknowledgeAlertMutation.mutate,
    isAcknowledgingAlert: acknowledgeAlertMutation.isPending,
  };
}

// Dashboard Overview Hook
export function useDashboard() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const response = await dashboardApi.getDashboardOverview();
      return response.data;
    },
    refetchInterval: 30000,
  });

  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: async () => {
      const response = await dashboardApi.getSystemHealth();
      return response.data;
    },
    refetchInterval: 10000,
  });

  return {
    overview,
    systemHealth,
    overviewLoading,
    healthLoading,
    isLoading: overviewLoading || healthLoading,
  };
}

// Guardian Directory Hook
export function useGuardianDirectory() {
  const { data: guardians, isLoading } = useQuery({
    queryKey: ['guardians', 'all'],
    queryFn: async () => {
      const response = await guardianApi.getAllGuardians();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    guardians: guardians || [],
    isLoading,
  };
}

// Guardian Activity Hook
export function useGuardianActivity() {
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe } = useWebSocket('/activity');

  // Real-time activity updates
  useEffect(() => {
    const handleActivityUpdate = (data: any) => {
      queryClient.setQueryData(['guardian', 'activity'], (old: any[] = []) => [
        data.activity,
        ...old.slice(0, 49), // Keep last 50 activities
      ]);
    };

    subscribe('ACTIVITY_UPDATE', handleActivityUpdate);
    subscribe('NEW_REQUEST', handleActivityUpdate);
    subscribe('VOTE_SUBMITTED', handleActivityUpdate);
    subscribe('CONSENSUS_REACHED', handleActivityUpdate);

    return () => {
      unsubscribe('ACTIVITY_UPDATE');
      unsubscribe('NEW_REQUEST');
      unsubscribe('VOTE_SUBMITTED');
      unsubscribe('CONSENSUS_REACHED');
    };
  }, [subscribe, unsubscribe, queryClient]);

  const { data: recentActivity, isLoading } = useQuery({
    queryKey: ['guardian', 'activity'],
    queryFn: async () => {
      const response = await dashboardApi.getRecentActivity();
      return response.data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    recentActivity: recentActivity || [],
    isLoading,
  };
}

// Combined Guardian Hook for Common Use Cases
export function useGuardian() {
  const auth = useGuardianAuth();
  const sentinel = useSentinel();
  
  return {
    ...auth,
    systemStatus: sentinel.systemStatus,
    alerts: sentinel.alerts,
  };
}
