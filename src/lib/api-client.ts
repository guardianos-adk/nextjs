import { 
  Guardian, 
  DeAnonymizationRequest, 
  ADKAgent, 
  SentinelMetrics, 
  Alert, 
  ConsensusResult,
  ApiResponse,
  PaginatedResponse,
  VoteFormData,
  TenthOpinionRequest,
  TenthOpinionResponse,
  TenthOpinionStatus,
  TenthOpinionMetrics
} from '@/lib/types';

// Real Backend Configuration
const API_CONFIG = {
  MAIN_API_BASE: 'http://localhost:8000/api/v1',
  FRAUD_API_BASE: 'http://localhost:8001/api/v1',
  TIMEOUT: 30000, // Increased to 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

class ApiClient {
  private mainApiUrl: string;
  private fraudApiUrl: string;
  private token: string | null = null;
  private activeRequests = new Map<string, AbortController>();

  constructor() {
    this.mainApiUrl = API_CONFIG.MAIN_API_BASE;
    this.fraudApiUrl = API_CONFIG.FRAUD_API_BASE;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('guardian_token');
    }
  }

  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Create a unique request ID to track and potentially cancel requests
    const requestId = `${Date.now()}-${Math.random()}`;
    const controller = new AbortController();
    
    // Store the controller to allow cancellation
    this.activeRequests.set(requestId, controller);
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
      this.activeRequests.delete(requestId);
    }, API_CONFIG.TIMEOUT);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      let lastError: Error = new Error('Unknown error');

      // Retry logic for network reliability
      for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
        try {
          console.log(`API request attempt ${attempt} to:`, url);
          
          const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          this.activeRequests.delete(requestId);

          if (!response.ok) {
            // Handle specific HTTP errors
            if (response.status === 401) {
              this.token = null;
              if (typeof window !== 'undefined') {
                localStorage.removeItem('guardian_token');
              }
              throw new Error('Authentication failed. Please log in again.');
            }
            
            if (response.status === 404) {
              // For 404s, return a more graceful response
              return { 
                success: false, 
                error: `Endpoint not found: ${url}`,
                data: undefined, // Use undefined to match ApiResponse<T> type
                timestamp: new Date().toISOString()
              };
            }
            
            if (response.status >= 500) {
              throw new Error('Server error. Please try again later.');
            }
            
            throw new Error(`Request failed with status ${response.status}`);
          }

          const data = await response.json();
          return { 
            success: true, 
            data,
            timestamp: new Date().toISOString()
          };
        } catch (error: any) {
          lastError = error;
          console.warn(`API request attempt ${attempt} failed:`, error.message);
          
          // Don't retry on abort errors (user cancelled)
          if (error.name === 'AbortError') {
            break;
          }
          
          if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
          }
        }
      }

      throw lastError;
    } catch (error: any) {
      clearTimeout(timeoutId);
      this.activeRequests.delete(requestId);
      
      // Handle network errors gracefully
      if (error.name === 'AbortError') {
        console.log('API request was aborted:', url);
        return { 
          success: false, 
          error: 'Request was cancelled',
          data: undefined, // Use undefined to match ApiResponse<T> type
          timestamp: new Date().toISOString()
        };
      }
      
      if (error.message?.includes('fetch') || error.message?.includes('Connection refused') || error.message?.includes('ECONNREFUSED')) {
        console.warn('Network connection error:', url);
        return { 
          success: false, 
          error: 'Network error. Backend server may be unavailable.',
          data: undefined, // Use undefined to match ApiResponse<T> type
          timestamp: new Date().toISOString()
        };
      }
      
      console.error('API request failed:', url, error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred',
        data: undefined, // Use undefined to match ApiResponse<T> type
        timestamp: new Date().toISOString()
      };
    }
  }

  // Cancel all active requests (useful for cleanup)
  public cancelAllRequests(): void {
    this.activeRequests.forEach((controller, requestId) => {
      controller.abort();
    });
    this.activeRequests.clear();
  }

  private get<T>(endpoint: string, useFraudApi = false): Promise<ApiResponse<T>> {
    const baseUrl = useFraudApi ? this.fraudApiUrl : this.mainApiUrl;
    return this.request<T>(`${baseUrl}${endpoint}`, { method: 'GET' });
  }

  private post<T>(endpoint: string, data?: any, useFraudApi = false): Promise<ApiResponse<T>> {
    const baseUrl = useFraudApi ? this.fraudApiUrl : this.mainApiUrl;
    return this.request<T>(`${baseUrl}${endpoint}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private patch<T>(endpoint: string, data?: any, useFraudApi = false): Promise<ApiResponse<T>> {
    const baseUrl = useFraudApi ? this.fraudApiUrl : this.mainApiUrl;
    return this.request<T>(`${baseUrl}${endpoint}`, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Health Check with better error handling
  async checkHealth(): Promise<{ main: boolean; fraud: boolean }> {
    const results = { main: false, fraud: false };
    
    try {
      const mainResponse = await this.request('http://localhost:8000/health');
      results.main = mainResponse.success;
    } catch (error) {
      console.warn('Main API health check failed:', error);
    }

    try {
      const fraudResponse = await this.request('http://localhost:8001/health');
      results.fraud = fraudResponse.success;
    } catch (error) {
      console.warn('Fraud API health check failed:', error);
    }

    return results;
  }

  // Authentication
  async login(leiCode: string, certificate: string): Promise<ApiResponse<{ token: string; guardian: Guardian }>> {
    const response = await this.post<{ token: string; guardian: Guardian }>('/auth/login', {
      leiCode,
      certificate,
    });
    
    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('guardian_token', response.data.token);
      }
    }
    
    return response;
  }

  async logout(): Promise<void> {
    this.cancelAllRequests(); // Cancel any pending requests
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guardian_token');
    }
  }

  // Guardian Management
  async getCurrentGuardian(): Promise<ApiResponse<Guardian>> {
    return this.get<Guardian>('/guardians/me');
  }

  async getAllGuardians(): Promise<ApiResponse<Guardian[]>> {
    return this.get<Guardian[]>('/guardians');
  }

  async updateGuardianProfile(updates: Partial<Guardian>): Promise<ApiResponse<Guardian>> {
    return this.patch<Guardian>('/guardians/me', updates);
  }

  // Voting System
  async getActiveRequests(): Promise<ApiResponse<DeAnonymizationRequest[]>> {
    return this.get<DeAnonymizationRequest[]>('/voting/active-requests');
  }

  async getRequest(requestId: string): Promise<ApiResponse<DeAnonymizationRequest>> {
    return this.get<DeAnonymizationRequest>(`/voting/requests/${requestId}`);
  }

  async submitVote(requestId: string, voteData: VoteFormData): Promise<ApiResponse<ConsensusResult>> {
    return this.post<ConsensusResult>(`/voting/requests/${requestId}/vote`, voteData);
  }

  async createRequest(requestData: any): Promise<ApiResponse<DeAnonymizationRequest>> {
    return this.post<DeAnonymizationRequest>('/voting/requests', requestData);
  }

  async getVotingHistory(page = 1, pageSize = 50): Promise<ApiResponse<PaginatedResponse<DeAnonymizationRequest>>> {
    return this.get<PaginatedResponse<DeAnonymizationRequest>>(`/voting/history?page=${page}&pageSize=${pageSize}`);
  }

  // ADK Agent Management
  async getAllAgentsStatus(): Promise<ApiResponse<ADKAgent[]>> {
    return this.get<ADKAgent[]>('/adk/agents/status');
  }

  async getAgentStatus(agentId: string): Promise<ApiResponse<ADKAgent>> {
    return this.get<ADKAgent>(`/adk/agents/${agentId}/status`);
  }

  async restartAgent(agentId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/adk/agents/${agentId}/restart`);
  }

  async getActiveWorkflows(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/adk/workflows/active');
  }

  async triggerWorkflow(workflowType: string, inputData: any): Promise<ApiResponse<any>> {
    return this.post<any>('/adk/workflows/trigger', { workflowType, inputData });
  }

  // Fraud Monitoring (uses fraud API on port 8001)
  async getAgentLogs(agentId: string, limit = 100): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/agents/${agentId}/logs?limit=${limit}`, true);
  }

  // Sentinel Monitoring
  async getSentinelStatus(): Promise<ApiResponse<{ status: string; health: any }>> {
    return this.get<{ status: string; health: any }>('/sentinel/status');
  }

  async getCurrentMetrics(): Promise<ApiResponse<SentinelMetrics>> {
    return this.get<SentinelMetrics>('/metrics/current', true);
  }

  async getHistoricalMetrics(
    startDate: string, 
    endDate: string, 
    granularity = 'hour'
  ): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/metrics/historical?start_date=${startDate}&end_date=${endDate}&granularity=${granularity}`, true);
  }

  async getPerformanceReport(days = 7): Promise<ApiResponse<any>> {
    return this.get<any>(`/metrics/performance?days=${days}`, true);
  }

  async getActiveAlerts(severity?: string): Promise<ApiResponse<Alert[]>> {
    const endpoint = severity ? `/fraud/alerts?severity=${severity}` : '/fraud/alerts';
    return this.get<Alert[]>(endpoint, true);
  }

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/fraud/alerts/${alertId}/acknowledge`, {}, true);
  }

  // Dashboard
  async getDashboardOverview(): Promise<ApiResponse<{
    totalGuardians: number;
    activeRequests: number;
    consensusRate: number;
    systemHealth: string;
    recentActivity: any[];
  }>> {
    return this.get<{
      totalGuardians: number;
      activeRequests: number;
      consensusRate: number;
      systemHealth: string;
      recentActivity: any[];
    }>('/dashboard/overview');
  }

  async getSystemHealth(): Promise<ApiResponse<{
    agents: { healthy: number; total: number };
    consensus: { successRate: number; avgTime: number };
    throughput: { current: number; capacity: number };
    alerts: { active: number; critical: number };
  }>> {
    return this.get<{
      agents: { healthy: number; total: number };
      consensus: { successRate: number; avgTime: number };
      throughput: { current: number; capacity: number };
      alerts: { active: number; critical: number };
    }>('/dashboard/health');
  }

  async getRecentActivity(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/dashboard/activity');
  }

  // Tenth Opinion Protocol
  async evaluateTenthOpinion(request: TenthOpinionRequest): Promise<ApiResponse<TenthOpinionResponse>> {
    return this.post<TenthOpinionResponse>('/adk/tenth-opinion/evaluate', request);
  }

  async getTenthOpinionStatus(): Promise<ApiResponse<TenthOpinionStatus>> {
    return this.get<TenthOpinionStatus>('/adk/tenth-opinion/status');
  }

  async getTenthOpinionMetrics(): Promise<ApiResponse<TenthOpinionMetrics>> {
    return this.get<TenthOpinionMetrics>('/adk/tenth-opinion/metrics');
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Export specific API groups for cleaner imports in hooks
export const guardianApi = {
  getCurrentGuardian: () => apiClient.getCurrentGuardian(),
  getAllGuardians: () => apiClient.getAllGuardians(),
  updateProfile: (updates: Partial<Guardian>) => apiClient.updateGuardianProfile(updates),
  login: (leiCode: string, certificate: string) => apiClient.login(leiCode, certificate),
  logout: () => apiClient.logout(),
};

export const votingApi = {
  getActiveRequests: () => apiClient.getActiveRequests(),
  getRequest: (requestId: string) => apiClient.getRequest(requestId),
  submitVote: (requestId: string, voteData: VoteFormData) => apiClient.submitVote(requestId, voteData),
  createRequest: (requestData: any) => apiClient.createRequest(requestData),
  getVotingHistory: (page?: number, pageSize?: number) => apiClient.getVotingHistory(page, pageSize),
};

export const agentApi = {
  getAllAgentsStatus: () => apiClient.getAllAgentsStatus(),
  getAgentStatus: (agentId: string) => apiClient.getAgentStatus(agentId),
  restartAgent: (agentId: string) => apiClient.restartAgent(agentId),
  getActiveWorkflows: () => apiClient.getActiveWorkflows(),
  triggerWorkflow: (workflowType: string, inputData: any) => apiClient.triggerWorkflow(workflowType, inputData),
  getAgentLogs: (agentId: string, limit?: number) => apiClient.getAgentLogs(agentId, limit),
};

export const sentinelApi = {
  getSentinelStatus: () => apiClient.getSentinelStatus(),
  getCurrentMetrics: () => apiClient.getCurrentMetrics(),
  getHistoricalMetrics: (startDate: string, endDate: string, granularity?: string) => 
    apiClient.getHistoricalMetrics(startDate, endDate, granularity),
  getPerformanceReport: (days?: number) => apiClient.getPerformanceReport(days),
  getActiveAlerts: (severity?: string) => apiClient.getActiveAlerts(severity),
  acknowledgeAlert: (alertId: string) => apiClient.acknowledgeAlert(alertId),
};

export const dashboardApi = {
  getDashboardOverview: () => apiClient.getDashboardOverview(),
  getSystemHealth: () => apiClient.getSystemHealth(),
  getRecentActivity: () => apiClient.getRecentActivity(),
};

export const tenthOpinionApi = {
  evaluate: (request: TenthOpinionRequest) => apiClient.evaluateTenthOpinion(request),
  getStatus: () => apiClient.getTenthOpinionStatus(),
  getMetrics: () => apiClient.getTenthOpinionMetrics(),
};

// WebSocket connection for real-time updates
export class GuardianWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private onMessage: (data: any) => void) {}

  connect() {
    try {
      this.ws = new WebSocket('ws://localhost:8001/ws/monitoring');
      
      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected to fraud monitoring');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// Export singleton instance
export const guardianWebSocket = new GuardianWebSocket((data) => {
  console.log('📡 Real-time update received:', data);
});

export default apiClient;
