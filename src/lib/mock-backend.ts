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
      name: 'Guardian Demo',
      organization: 'GuardianOS Development',
      leiCode: 'DEMO001234567890',
      status: 'active',
      role: 'validator',
      joinedAt: '2025-01-01T00:00:00Z',
      lastActive: new Date().toISOString(),
      votingPower: 100,
      consensusParticipation: 0.95,
      certificateHash: 'demo-certificate-hash',
      publicKey: 'demo-public-key',
      metadata: {
        region: 'US',
        jurisdiction: 'Delaware',
        tier: 'enterprise',
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
        requester: 'Guardian Beta',
        walletAddress: '0x742d35Cc6632C0532C8B2A8D6CD5D2C9F4FC7A9E',
        complianceReason: 'AML Investigation - Suspicious Transaction Pattern',
        riskScore: 0.85,
        evidence: [
          'Multiple high-value transactions to mixer addresses',
          'Pattern consistent with layering technique',
          'Connections to known risk addresses',
        ],
        requestedAt: new Date(Date.now() - 3600000).toISOString(),
        deadline: new Date(Date.now() + 86400000).toISOString(),
        status: 'pending',
        votesReceived: 8,
        votesRequired: 15,
        consensusThreshold: 0.67,
        priority: 'high',
        category: 'aml_investigation',
        jurisdiction: 'US',
        attachments: [],
      },
      {
        id: 'req-002',
        requester: 'Guardian Gamma',
        walletAddress: '0x8A2E6D9F3C4B1A7E5F8D2C9B6A3E7D1F4C8B5A2E',
        complianceReason: 'Sanctions Screening - Potential OFAC Match',
        riskScore: 0.72,
        evidence: [
          'Address linked to sanctioned entity database',
          'Transaction history shows prohibited jurisdiction activity',
        ],
        requestedAt: new Date(Date.now() - 7200000).toISOString(),
        deadline: new Date(Date.now() + 43200000).toISOString(),
        status: 'voting',
        votesReceived: 12,
        votesRequired: 15,
        consensusThreshold: 0.67,
        priority: 'critical',
        category: 'sanctions_screening',
        jurisdiction: 'EU',
        attachments: [],
      },
    ];
  }

  // 🤖 **Mock Agent Data**
  public getMockAgents(): ADKAgent[] {
    return [
      {
        id: 'agent-risk-assessment',
        name: 'Risk Assessment Agent',
        type: 'risk_assessment',
        status: 'healthy',
        uptime: 0.999,
        lastHeartbeat: new Date().toISOString(),
        version: '2.1.4',
        capabilities: ['transaction_analysis', 'risk_scoring', 'pattern_detection'],
        workload: {
          current: 45,
          capacity: 100,
          queueLength: 3,
        },
        performance: {
          avgResponseTime: 280,
          successRate: 0.997,
          errorsLast24h: 2,
        },
        configuration: {
          enabledFeatures: ['ml_models', 'real_time_scoring'],
          thresholds: {
            high_risk: 0.8,
            medium_risk: 0.5,
          },
        },
      },
      {
        id: 'agent-sanctions-monitor',
        name: 'Sanctions Monitor',
        type: 'sanctions_monitoring',
        status: 'healthy',
        uptime: 0.995,
        lastHeartbeat: new Date(Date.now() - 30000).toISOString(),
        version: '1.8.2',
        capabilities: ['sanctions_screening', 'watchlist_monitoring', 'real_time_alerts'],
        workload: {
          current: 23,
          capacity: 100,
          queueLength: 1,
        },
        performance: {
          avgResponseTime: 150,
          successRate: 0.999,
          errorsLast24h: 0,
        },
        configuration: {
          enabledFeatures: ['ofac_screening', 'eu_sanctions', 'un_sanctions'],
          updateFrequency: '15m',
        },
      },
      {
        id: 'agent-transaction-monitor',
        name: 'Transaction Monitor',
        type: 'transaction_monitoring',
        status: 'degraded',
        uptime: 0.92,
        lastHeartbeat: new Date(Date.now() - 120000).toISOString(),
        version: '3.0.1',
        capabilities: ['real_time_monitoring', 'anomaly_detection', 'compliance_reporting'],
        workload: {
          current: 78,
          capacity: 100,
          queueLength: 12,
        },
        performance: {
          avgResponseTime: 450,
          successRate: 0.94,
          errorsLast24h: 15,
        },
        configuration: {
          enabledFeatures: ['pattern_analysis', 'velocity_checks'],
          alertThresholds: {
            suspicious_volume: 50000,
            unusual_pattern: 0.7,
          },
        },
      },
    ];
  }

  // 🛡️ **Mock Sentinel Metrics**
  public getMockSentinelMetrics(): SentinelMetrics {
    const now = Date.now();
    return {
      timestamp: new Date().toISOString(),
      transactionsScanned: 1277 + Math.floor(Math.random() * 50),
      fraudDetected: 23 + Math.floor(Math.random() * 5),
      falsePositives: 5 + Math.floor(Math.random() * 3),
      accuracyRate: 0.95 + (Math.random() - 0.5) * 0.02,
      avgResponseTime: 247 + Math.floor(Math.random() * 100),
      systemLoad: 0.65 + Math.random() * 0.2,
      alerts: {
        active: 2,
        acknowledged: 15,
        resolved: 145,
      },
      performance: {
        cpuUsage: 0.45 + Math.random() * 0.3,
        memoryUsage: 0.67 + Math.random() * 0.2,
        networkLatency: 25 + Math.random() * 50,
      },
    };
  }

  // 🚨 **Mock Alerts**
  public getMockAlerts(): Alert[] {
    return [
      {
        id: 'alert-001',
        type: 'suspicious_pattern',
        severity: 'high',
        title: 'Suspicious Transaction Pattern Detected',
        description: 'Multiple rapid transfers between new addresses exceeding velocity thresholds',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        source: 'TransactionMonitor',
        acknowledged: false,
        data: {
          address: '0x742d35Cc6632C0532C8B2A8D6CD5D2C9F4FC7A9E',
          pattern: 'velocity_anomaly',
          confidence: 0.87,
        },
      },
      {
        id: 'alert-002',
        type: 'agent_performance',
        severity: 'medium',
        title: 'Agent Performance Degradation',
        description: 'RiskAssessment agent response time increased by 45% over baseline',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        source: 'SystemMonitor',
        acknowledged: false,
        data: {
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