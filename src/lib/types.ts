// Guardian System Types
export interface Guardian {
  id: string;
  institutionName: string;
  jurisdiction: string;
  leiCode: string;
  walletAddress: string;
  publicKey: string;
  reputationScore: number;
  isActive: boolean;
  roles: GuardianRole[];
  lastActivity: string;
  certificateStatus: 'verified' | 'pending' | 'expired';
  votingPower: number;
  performanceMetrics: {
    totalVotes: number;
    consensusParticipation: number;
    averageResponseTime: number; // in seconds
    accuracy: number; // percentage
  };
}

export type GuardianRole = 
  | 'guardian_voter'
  | 'guardian_administrator' 
  | 'senior_guardian'
  | 'system_administrator';

export type GuardianJurisdiction = 
  | 'ECB'     // European Central Bank
  | 'DNB'     // Dutch Central Bank  
  | 'BaFin'   // German Financial Authority
  | 'FINMA'   // Swiss Financial Authority
  | 'FCA'     // UK Financial Authority
  | 'SEC'     // US Securities and Exchange Commission
  | 'CFTC'    // US Commodity Futures Trading Commission
  | 'FinCEN'  // US Financial Crimes Enforcement Network
  | 'AUSTRAC' // Australian Transaction Reports and Analysis Centre
  | 'JFSA';   // Japan Financial Services Agency

// Voting System Types  
export interface DeAnonymizationRequest {
  id: string;
  requestingGuardianId?: string;
  transactionHash?: string;
  transactionId?: string; // API compatibility
  blockchainNetwork?: string;
  evidenceHash?: string;
  evidenceIpfsCid?: string;
  complianceReason?: string;
  description?: string; // API compatibility
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  urgency?: 'low' | 'medium' | 'high' | 'critical'; // API compatibility
  consensusThreshold?: number;
  requiredVotes?: number; // API compatibility
  privacyImpactAssessment?: PrivacyImpactAssessment;
  deadline: string;
  status: RequestStatus;
  createdAt: string;
  currentVotes: Vote[] | number; // API compatibility
  consensusProgress?: number; // percentage
}

export interface PrivacyImpactAssessment {
  affectedParties: number;
  dataTypes: string[];
  retentionPeriod: string;
  disclosureScope: 'minimal' | 'partial' | 'full';
  riskLevel: 'low' | 'medium' | 'high';
  mitigationMeasures: string[];
}

export type RequestStatus = 
  | 'pending'
  | 'voting'
  | 'consensus_reached'
  | 'approved'
  | 'denied' 
  | 'expired'
  | 'executed';

export interface Vote {
  id: string;
  requestId: string;
  guardianId: string;
  decision: VoteDecision;
  reasoning: string;
  confidenceLevel: number; // 0.0 to 1.0
  blsSignature: string;
  timestamp: string;
  jurisdiction: GuardianJurisdiction;
}

export type VoteDecision = 'APPROVE' | 'DENY' | 'ABSTAIN';

export interface ConsensusResult {
  id: string;
  requestId: string;
  decision: VoteDecision;
  thresholdMet: boolean;
  participatingGuardians: number;
  consensusProof: {
    sessionId: string;
    thresholdRequired: number;
    participatingGuardians: string[];
    thresholdMet: boolean;
    proofHash: string;
    signaturesHash: string;
    scheme: string;
    timestamp: string;
  };
  finalizedAt: string;
}

// ADK Agent Types
export interface ADKAgent {
  id: string;
  name: string;
  type: 'TransactionMonitor' | 'RiskAssessment' | 'GuardianCouncil' | 'PrivacyRevoker' | 'MonitoringConsensus' |
    // Tenth Opinion Protocol agents
    'FirstOpinion' | 'SecondOpinion' | 'ThirdOpinion' | 'FourthOpinion' |
    'FifthOpinion' | 'SixthOpinion' | 'SeventhOpinion' |
    'EighthOpinion' | 'NinthOpinion' | 'TenthOpinion';
  status: AgentStatus;
  health: AgentHealth;
  lastHeartbeat: string;
  performanceScore: number;
  reputationWeight: number;
  executionStats: {
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    errorCount: number;
  };
  currentWorkflow?: string;
  // Tenth Opinion specific fields
  phaseNumber?: number;
  phaseRole?: string;
}

export type AgentStatus = 'healthy' | 'degraded' | 'unhealthy' | 'offline';

// Tenth Opinion Protocol Types
export interface TenthOpinionRequest {
  transactionId: string;
  amount: number;
  riskScore: number;
  transactionType?: string;
  jurisdiction?: string;
  entities?: Array<{
    id: string;
    sanctions_hit?: boolean;
  }>;
  timestamp?: string;
}

export interface TenthOpinionDecision {
  final_decision: 'approve' | 'deny' | 'investigate' | 'escalate';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  consensus_confidence: number;
  action_required: string;
  quality_metrics: {
    reliability_score: number;
    objectivity_score: number;
  };
  regulatory_concerns?: string[];
  dissenting_opinions?: string[];
}

export interface TenthOpinionResponse {
  success: boolean;
  protocol: 'tenth_opinion';
  phases_completed: number;
  agents_involved: number;
  decision: TenthOpinionDecision;
  execution_time: number;
  audit_trail: {
    phase: string;
    agents: string[];
    duration: number;
    decisions: any[];
  }[];
}

export interface TenthOpinionMetrics {
  total_evaluations: number;
  average_execution_time: number;
  consensus_success_rate: number;
  quality_scores: {
    reliability: number;
    objectivity: number;
    accuracy: number;
  };
  phase_metrics: {
    phase_name: string;
    average_duration: number;
    agent_performance: Record<string, number>;
  }[];
}

export interface TenthOpinionStatus {
  online: boolean;
  agents_ready: number;
  last_evaluation: string;
  current_load: number;
  error_count: number;
}

export interface AgentHealth {
  cpu: number;
  memory: number;
  responseTime: number;
  errorRate: number;
}

export interface WorkflowExecution {
  id: string;
  workflowType: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  inputData: any;
  outputData?: any;
  agents: string[];
  currentStep?: string;
  progress: number; // percentage
}

// FraudSentinel Types
export interface SentinelMetrics {
  timestamp: string;
  systemHealth: 'optimal' | 'good' | 'degraded' | 'critical';
  transactionThroughput: number; // transactions per second
  fraudDetectionRate: number; // percentage
  averageProcessingTime: number; // milliseconds
  alertsGenerated: number;
  consensusSuccessRate: number;
  agentPerformance: {
    [agentId: string]: {
      accuracy: number;
      responseTime: number;
      availability: number;
    };
  };
}

export interface Alert {
  id: string;
  type: 'fraud_detected' | 'performance_degradation' | 'consensus_failure' | 'agent_error' | 'system_overload';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed';
  assignedTo?: string;
  metadata?: Record<string, any>;
}

// Blockchain Types
export interface TransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: number;
  timestamp: string;
  blockchain: 'ethereum' | 'polygon' | 'arbitrum' | 'optimism';
  riskScore?: number;
  flags?: string[];
  amlScore?: number;
}

export interface BlockchainMetrics {
  network: string;
  blockHeight: number;
  gasPrice: string;
  transactionCount: number;
  averageBlockTime: number;
  networkHashRate?: string;
  activeNodes: number;
}

// WebSocket Events
export interface WebSocketEvent {
  type: EventType;
  data: any;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

export type EventType = 
  // Voting events
  | 'NEW_REQUEST'
  | 'VOTE_SUBMITTED' 
  | 'CONSENSUS_REACHED'
  | 'REQUEST_EXPIRED'
  // Agent events
  | 'AGENT_STATUS_CHANGE'
  | 'WORKFLOW_STARTED'
  | 'WORKFLOW_COMPLETED'
  | 'AGENT_ERROR'
  // Sentinel events
  | 'FRAUD_DETECTED'
  | 'PERFORMANCE_ALERT'
  | 'SYSTEM_HEALTH_CHANGE'
  | 'METRICS_UPDATE'
  // Activity events
  | 'ACTIVITY_UPDATE'
  // Tenth Opinion events
  | 'TENTH_OPINION_STARTED'
  | 'TENTH_OPINION_PHASE_COMPLETED'
  | 'TENTH_OPINION_COMPLETED'
  | 'TENTH_OPINION_ERROR';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard State Types
export interface DashboardState {
  guardians: Guardian[];
  activeRequests: DeAnonymizationRequest[];
  recentVotes: Vote[];
  agentStatus: ADKAgent[];
  systemMetrics: SentinelMetrics;
  alerts: Alert[];
  blockchainMetrics: BlockchainMetrics[];
}

// Forms and UI Types
export interface VoteFormData {
  decision: VoteDecision;
  reasoning: string;
  confidenceLevel: number;
}

export interface RequestFormData {
  transactionHash: string;
  blockchainNetwork: string;
  complianceReason: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  evidenceFiles: File[];
  privacyImpactAssessment: PrivacyImpactAssessment;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface MetricsChartData {
  transactionVolume: ChartDataPoint[];
  fraudDetectionRate: ChartDataPoint[];
  consensusSuccess: ChartDataPoint[];
  responseTime: ChartDataPoint[];
}

// Configuration Types
export interface SystemConfig {
  consensusThreshold: number;
  votingTimeout: number; // minutes
  guardianTimeout: number; // minutes  
  reputationDecayFactor: number;
  minimumAgentWeight: number;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    fraudScore: number;
  };
}
