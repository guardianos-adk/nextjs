// GuardianOS Mock Backend Service
// File: src/lib/mock-backend.ts
// Provides fallback data when backend is unavailable

import type { 
  Guardian, 
  DeAnonymizationRequest, 
  ADKAgent, 
  SentinelMetrics, 
  Alert 
} from '@/lib/types';

// 🎭 **Mock Data Generation**
export class MockBackendService {
  private static instance: MockBackendService;
  private isEnabled: boolean = false;

  public static getInstance(): MockBackendService {
    if (!MockBackendService.instance) {
      MockBackendService.instance = new MockBackendService();
    }
    return MockBackendService.instance;
  }

  public enable() {
    this.isEnabled = true;
    console.log('🎭 Mock Backend Service enabled - providing fallback data');
  }

  public disable() {
    this.isEnabled = false;
  }

  public isActive(): boolean {
    return this.isEnabled;
  }

  // 🔐 **Mock Guardian Data**
  public getMockGuardian(): Guardian {
    return {
      id: 'guardian-001',
      institutionName: 'GuardianOS Development',
      jurisdiction: 'DNB',
      leiCode: 'DEMO001234567890',
      walletAddress: '0x1234567890123456789012345678901234567890',
      publicKey: 'demo-public-key',
      reputationScore: 95,
      isActive: true,
      roles: ['guardian_voter', 'senior_guardian'],
      lastActivity: new Date().toISOString(),
      certificateStatus: 'verified',
      votingPower: 100,
      performanceMetrics: {
        totalVotes: 150,
        consensusParticipation: 0.95,
        averageResponseTime: 2.1,
        accuracy: 97.8,
      },
    };
  }

  // 📊 **Mock Dashboard Stats**
  public getMockDashboardStats() {
    return {
      totalGuardians: 24,
      activeRequests: 3,
      consensusRate: 97.8,
      systemHealth: 'healthy',
      recentActivity: [
        {
          id: 'activity-1',
          type: 'vote_submitted',
          description: 'Vote submitted for request #REQ-001',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          guardian: 'Guardian Alpha',
        },
        {
          id: 'activity-2',
          type: 'consensus_reached',
          description: 'Consensus reached for request #REQ-002',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          decision: 'approved',
        },
        {
          id: 'activity-3',
          type: 'agent_started',
          description: 'Risk Assessment Agent restarted',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          agent: 'RiskAssessment',
        },
      ],
    };
  }

  // 🗳️ **Mock Voting Requests**
  public getMockActiveRequests(): DeAnonymizationRequest[] {
    return [
      {
        id: 'req-001',
        requestingGuardianId: 'guardian-002',
        transactionHash: '0x742d35Cc6632C0532C8B2A8D6CD5D2C9F4FC7A9E',
        blockchainNetwork: 'sepolia',
        complianceReason: 'AML Investigation - Suspicious Transaction Pattern',
        urgencyLevel: 'high',
        consensusThreshold: 15,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        currentVotes: 8,
        consensusProgress: 53.3,
        privacyImpactAssessment: {
          affectedParties: 3,
          dataTypes: ['wallet_address', 'transaction_history'],
          retentionPeriod: '30 days',
          disclosureScope: 'minimal',
          riskLevel: 'high',
          mitigationMeasures: ['Only reveal sender address', 'Redact uninvolved parties'],
        },
      },
      {
        id: 'req-002',
        requestingGuardianId: 'guardian-003',
        transactionHash: '0x8A2E6D9F3C4B1A7E5F8D2C9B6A3E7D1F4C8B5A2E',
        blockchainNetwork: 'sepolia',
        complianceReason: 'Sanctions Screening - Potential OFAC Match',
        urgencyLevel: 'critical',
        consensusThreshold: 15,
        deadline: new Date(Date.now() + 43200000).toISOString(),
        status: 'voting',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        currentVotes: 12,
        consensusProgress: 80,
        privacyImpactAssessment: {
          affectedParties: 1,
          dataTypes: ['wallet_address', 'identity_kyc'],
          retentionPeriod: '90 days',
          disclosureScope: 'partial',
          riskLevel: 'high',
          mitigationMeasures: ['Limit disclosure to regulatory authorities', 'Mask secondary addresses'],
        },
      },
    ];
  }

  // 🤖 **Mock Agent Data**
  public getMockAgents(): ADKAgent[] {
    return [
      {
        id: 'agent-risk-assessment',
        name: 'Risk Assessment Agent',
        type: 'RiskAssessment',
        status: 'healthy',
        health: {
          cpu: 45,
          memory: 62,
          responseTime: 280,
          errorRate: 0.3,
        },
        lastHeartbeat: new Date().toISOString(),
        performanceScore: 97.8,
        reputationWeight: 0.95,
        executionStats: {
          totalExecutions: 1542,
          successRate: 99.7,
          averageExecutionTime: 280,
          errorCount: 5,
        },
        currentWorkflow: 'high-risk-transaction-analysis',
      },
      {
        id: 'agent-transaction-monitor',
        name: 'Transaction Monitor',
        type: 'TransactionMonitor',
        status: 'healthy',
        health: {
          cpu: 23,
          memory: 45,
          responseTime: 150,
          errorRate: 0.1,
        },
        lastHeartbeat: new Date(Date.now() - 30000).toISOString(),
        performanceScore: 99.2,
        reputationWeight: 0.98,
        executionStats: {
          totalExecutions: 3201,
          successRate: 99.9,
          averageExecutionTime: 150,
          errorCount: 3,
        },
      },
      {
        id: 'agent-guardian-council',
        name: 'Guardian Council Coordinator',
        type: 'GuardianCouncil',
        status: 'healthy',
        health: {
          cpu: 38,
          memory: 55,
          responseTime: 320,
          errorRate: 0.5,
        },
        lastHeartbeat: new Date(Date.now() - 15000).toISOString(),
        performanceScore: 96.5,
        reputationWeight: 0.92,
        executionStats: {
          totalExecutions: 892,
          successRate: 98.5,
          averageExecutionTime: 320,
          errorCount: 13,
        },
      },
      {
        id: 'agent-privacy-revoker',
        name: 'Privacy Revocation Handler',
        type: 'PrivacyRevoker',
        status: 'healthy',
        health: {
          cpu: 15,
          memory: 32,
          responseTime: 190,
          errorRate: 0.2,
        },
        lastHeartbeat: new Date(Date.now() - 45000).toISOString(),
        performanceScore: 98.9,
        reputationWeight: 0.96,
        executionStats: {
          totalExecutions: 421,
          successRate: 99.5,
          averageExecutionTime: 190,
          errorCount: 2,
        },
      },
    ];
  }

  // 🛡️ **Mock Sentinel Metrics**
  public getMockSentinelMetrics(): SentinelMetrics {
    const now = Date.now();
    return {
      timestamp: new Date().toISOString(),
      systemHealth: 'optimal',
      transactionThroughput: 25.5 + Math.random() * 5,
      fraudDetectionRate: 0.023 + Math.random() * 0.005,
      averageProcessingTime: 247 + Math.floor(Math.random() * 100),
      alertsGenerated: 2 + Math.floor(Math.random() * 3),
      consensusSuccessRate: 0.97 + Math.random() * 0.02,
      agentPerformance: {
        'agent-risk-assessment': {
          accuracy: 0.978,
          responseTime: 280,
          availability: 0.999,
        },
        'agent-transaction-monitor': {
          accuracy: 0.992,
          responseTime: 150,
          availability: 0.995,
        },
        'agent-guardian-council': {
          accuracy: 0.965,
          responseTime: 320,
          availability: 0.998,
        },
        'agent-privacy-revoker': {
          accuracy: 0.989,
          responseTime: 190,
          availability: 0.997,
        },
      },
    };
  }

  // 🚨 **Mock Alerts**
  public getMockAlerts(): Alert[] {
    return [
      {
        id: 'alert-001',
        type: 'fraud_detected',
        severity: 'high',
        title: 'Suspicious Transaction Pattern Detected',
        description: 'Multiple rapid transfers between new addresses exceeding velocity thresholds',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        source: 'TransactionMonitor',
        status: 'active',
        metadata: {
          address: '0x742d35Cc6632C0532C8B2A8D6CD5D2C9F4FC7A9E',
          pattern: 'velocity_anomaly',
          confidence: 0.87,
        },
      },
      {
        id: 'alert-002',
        type: 'performance_degradation',
        severity: 'medium',
        title: 'Agent Performance Degradation',
        description: 'RiskAssessment agent response time increased by 45% over baseline',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        source: 'SystemMonitor',
        status: 'acknowledged',
        assignedTo: 'guardian-001',
        metadata: {
          agent: 'RiskAssessment',
          metric: 'response_time',
          current: 425,
          baseline: 280,
        },
      },
    ];
  }

  // 🎯 **System Health**
  public getMockSystemHealth() {
    return {
      agents: { healthy: 6, total: 7 },
      consensus: { successRate: 0.978, avgTime: 247 },
      throughput: { current: 1850, capacity: 2500 },
      alerts: { active: 2, critical: 0 },
    };
  }

  // 🔄 **Mock API Response**
  public async mockApiCall<T>(data: T, delay: number = 100): Promise<{ success: true; data: T; timestamp: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  // 🎭 **Mock WebSocket Events**
  public startMockWebSocketEvents(callback: (event: any) => void) {
    const events = [
      () => callback({
        type: 'METRICS_UPDATE',
        data: this.getMockSentinelMetrics(),
      }),
      () => callback({
        type: 'NEW_ALERT',
        data: {
          id: `alert-${Date.now()}`,
          type: 'system_event',
          severity: 'info',
          title: 'System Status Update',
          description: 'All systems operating normally',
          timestamp: new Date().toISOString(),
          source: 'SystemMonitor',
          acknowledged: false,
        },
      }),
      () => callback({
        type: 'AGENT_STATUS_CHANGE',
        data: {
          agentId: 'agent-risk-assessment',
          changes: {
            workload: {
              current: Math.floor(Math.random() * 80) + 20,
              capacity: 100,
              queueLength: Math.floor(Math.random() * 10),
            },
          },
        },
      }),
    ];

    // Send random events every 10-30 seconds
    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      randomEvent();
    }, 10000 + Math.random() * 20000);

    return () => clearInterval(interval);
  }
}

// Export singleton instance
export const mockBackend = MockBackendService.getInstance(); 