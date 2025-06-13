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
  type: 'TransactionMonitor' | 'RiskAssessment' | 'GuardianCouncil' | 'PrivacyRevoker' | 'MonitoringConsensus';
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
}

export type AgentStatus = 'healthy' | 'degraded' | 'unhealthy' | 'offline';

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
  | 'ACTIVITY_UPDATE';

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
