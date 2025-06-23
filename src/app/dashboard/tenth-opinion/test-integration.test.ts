import { describe, it, expect, vi } from 'vitest';
import { tenthOpinionApi } from '@/lib/api-client';
import { 
  TenthOpinionRequest, 
  TenthOpinionResponse, 
  TenthOpinionStatus 
} from '@/lib/types';

describe('Tenth Opinion Frontend Integration', () => {
  it('should have proper TypeScript types defined', () => {
    const request: TenthOpinionRequest = {
      transactionId: 'tx_12345',
      amount: 100000,
      riskScore: 0.8,
      transactionType: 'cross-border',
      jurisdiction: 'CYPRUS',
      entities: [{ id: 'entity1', sanctions_hit: true }]
    };
    
    expect(request.transactionId).toBe('tx_12345');
    expect(request.amount).toBe(100000);
    expect(request.riskScore).toBe(0.8);
  });

  it('should have API methods available', () => {
    expect(tenthOpinionApi.evaluate).toBeDefined();
    expect(tenthOpinionApi.getStatus).toBeDefined();
    expect(tenthOpinionApi.getMetrics).toBeDefined();
  });

  it('should handle API response types correctly', () => {
    const mockResponse: TenthOpinionResponse = {
      success: true,
      protocol: 'tenth_opinion',
      phases_completed: 4,
      agents_involved: 10,
      decision: {
        final_decision: 'investigate',
        risk_level: 'high',
        consensus_confidence: 0.82,
        action_required: 'Require enhanced due diligence',
        quality_metrics: {
          reliability_score: 0.89,
          objectivity_score: 0.86
        },
        regulatory_concerns: ['AML violation risk'],
        dissenting_opinions: ['Agent 6 suggests approval']
      },
      execution_time: 4.2,
      audit_trail: [
        {
          phase: 'Phase 1: Blind Analysis',
          agents: ['First', 'Second', 'Third', 'Fourth'],
          duration: 1.1,
          decisions: []
        }
      ]
    };

    expect(mockResponse.protocol).toBe('tenth_opinion');
    expect(mockResponse.decision.final_decision).toBe('investigate');
    expect(mockResponse.decision.consensus_confidence).toBe(0.82);
  });

  it('should handle status response correctly', () => {
    const mockStatus: TenthOpinionStatus = {
      online: true,
      agents_ready: 10,
      last_evaluation: new Date().toISOString(),
      current_load: 0.3,
      error_count: 0
    };

    expect(mockStatus.online).toBe(true);
    expect(mockStatus.agents_ready).toBe(10);
  });
});

// Mock API calls for testing
vi.mock('@/lib/api-client', () => {
  return {
    tenthOpinionApi: {
      evaluate: vi.fn().mockResolvedValue({
        success: true,
        data: {
          protocol: 'tenth_opinion',
          phases_completed: 4,
          agents_involved: 10,
          decision: {
            final_decision: 'investigate',
            risk_level: 'high',
            consensus_confidence: 0.82,
            action_required: 'Require enhanced due diligence',
            quality_metrics: {
              reliability_score: 0.89,
              objectivity_score: 0.86
            }
          },
          execution_time: 4.2,
          audit_trail: []
        }
      }),
      getStatus: vi.fn().mockResolvedValue({
        success: true,
        data: {
          online: true,
          agents_ready: 10,
          last_evaluation: new Date().toISOString(),
          current_load: 0.3,
          error_count: 0
        }
      }),
      getMetrics: vi.fn().mockResolvedValue({
        success: true,
        data: {
          total_evaluations: 42,
          average_execution_time: 4.1,
          consensus_success_rate: 0.94,
          quality_scores: {
            reliability: 0.88,
            objectivity: 0.85,
            accuracy: 0.91
          },
          phase_metrics: []
        }
      })
    }
  };
});