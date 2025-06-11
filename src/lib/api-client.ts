import { 
  Guardian, 
  DeAnonymizationRequest, 
  ADKAgent, 
  SentinelMetrics, 
  Alert, 
  ConsensusResult,
  ApiResponse,
  PaginatedResponse,
  VoteFormData
} from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('guardian_token');
    }
  }

  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          // Clear invalid token
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('guardian_token');
          }
          throw new Error('Authentication failed. Please log in again.');
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
      console.error('API request failed:', url, error);
      
      // Handle network errors
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return { 
          success: false, 
          error: 'Request timeout. Please check your connection and try again.',
          timestamp: new Date().toISOString()
        };
      }
      
      if (error.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Network error. Please check your connection and try again.',
          timestamp: new Date().toISOString()
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }

  private get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  private post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Authentication
  async login(leiCode: string, certificate: string): Promise<ApiResponse<{ token: string; guardian: Guardian }>> {
    const response = await this.post<{ token: string; guardian: Guardian }>('/api/v1/auth/login', {
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
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guardian_token');
    }
  }

  // Guardian Management
  async getCurrentGuardian(): Promise<ApiResponse<Guardian>> {
    return this.get<Guardian>('/api/v1/guardians/me');
  }

  async getAllGuardians(): Promise<ApiResponse<Guardian[]>> {
    return this.get<Guardian[]>('/api/v1/guardians');
  }

  async updateGuardianProfile(updates: Partial<Guardian>): Promise<ApiResponse<Guardian>> {
    return this.patch<Guardian>('/api/v1/guardians/me', updates);
  }

  // Voting System
  async getActiveRequests(): Promise<ApiResponse<DeAnonymizationRequest[]>> {
    return this.get<DeAnonymizationRequest[]>('/api/v1/voting/active-requests');
  }

  async getRequest(requestId: string): Promise<ApiResponse<DeAnonymizationRequest>> {
    return this.get<DeAnonymizationRequest>(`/api/v1/voting/requests/${requestId}`);
  }

  async submitVote(requestId: string, voteData: VoteFormData): Promise<ApiResponse<ConsensusResult>> {
    return this.post<ConsensusResult>(`/api/v1/voting/requests/${requestId}/vote`, voteData);
  }

  async createRequest(requestData: any): Promise<ApiResponse<DeAnonymizationRequest>> {
    return this.post<DeAnonymizationRequest>('/api/v1/voting/requests', requestData);
  }

  async getVotingHistory(page = 1, pageSize = 50): Promise<ApiResponse<PaginatedResponse<DeAnonymizationRequest>>> {
    return this.get<PaginatedResponse<DeAnonymizationRequest>>(`/api/v1/voting/history?page=${page}&pageSize=${pageSize}`);
  }

  // ADK Agent Management
  async getAllAgentsStatus(): Promise<ApiResponse<ADKAgent[]>> {
    return this.get<ADKAgent[]>('/api/v1/adk/agents/status');
  }

  async getAgentStatus(agentId: string): Promise<ApiResponse<ADKAgent>> {
    return this.get<ADKAgent>(`/api/v1/adk/agents/${agentId}/status`);
  }

  async restartAgent(agentId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/api/v1/adk/agents/${agentId}/restart`);
  }

  async getActiveWorkflows(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/api/v1/adk/workflows/active');
  }

  async triggerWorkflow(workflowType: string, inputData: any): Promise<ApiResponse<any>> {
    return this.post<any>('/api/v1/adk/workflows/trigger', {
      workflowType,
      inputData,
    });
  }

  async getAgentLogs(agentId: string, limit = 100): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/api/v1/adk/agents/${agentId}/logs?limit=${limit}`);
  }

  // FraudSentinel Monitoring
  async getSentinelStatus(): Promise<ApiResponse<{ status: string; health: any }>> {
    return this.get<{ status: string; health: any }>('/api/v1/sentinel/status');
  }

  async getCurrentMetrics(): Promise<ApiResponse<SentinelMetrics>> {
    return this.get<SentinelMetrics>('/api/v1/sentinel/metrics/current');
  }

  async getHistoricalMetrics(
    startDate: string, 
    endDate: string, 
    granularity = 'hour'
  ): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/api/v1/sentinel/metrics/historical?start_date=${startDate}&end_date=${endDate}&granularity=${granularity}`);
  }

  async getPerformanceReport(days = 7): Promise<ApiResponse<any>> {
    return this.get<any>(`/api/v1/sentinel/performance/report?days=${days}`);
  }

  async getActiveAlerts(severity?: string): Promise<ApiResponse<Alert[]>> {
    const query = severity ? `?severity=${severity}` : '';
    return this.get<Alert[]>(`/api/v1/sentinel/alerts/active${query}`);
  }

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/api/v1/sentinel/alerts/acknowledge/${alertId}`);
  }

  // Dashboard Analytics
  async getDashboardOverview(): Promise<ApiResponse<{
    totalGuardians: number;
    activeRequests: number;
    consensusRate: number;
    systemHealth: string;
    recentActivity: any[];
  }>> {
    return this.get('/api/v1/dashboard/overview');
  }

  async getSystemHealth(): Promise<ApiResponse<{
    agents: { healthy: number; total: number };
    consensus: { successRate: number; avgTime: number };
    throughput: { current: number; capacity: number };
    alerts: { active: number; critical: number };
  }>> {
    return this.get('/api/v1/dashboard/health');
  }

  async getRecentActivity(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/api/v1/dashboard/activity');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Helper functions for specific use cases
export const guardianApi = {
  login: (leiCode: string, certificate: string) => apiClient.login(leiCode, certificate),
  logout: () => apiClient.logout(),
  getCurrentGuardian: () => apiClient.getCurrentGuardian(),
  getAllGuardians: () => apiClient.getAllGuardians(),
  updateProfile: (updates: Partial<Guardian>) => apiClient.updateGuardianProfile(updates),
};

export const votingApi = {
  getActiveRequests: () => apiClient.getActiveRequests(),
  getRequest: (id: string) => apiClient.getRequest(id),
  submitVote: (requestId: string, voteData: VoteFormData) => apiClient.submitVote(requestId, voteData),
  createRequest: (data: any) => apiClient.createRequest(data),
  getHistory: (page?: number, pageSize?: number) => apiClient.getVotingHistory(page, pageSize),
};

export const agentApi = {
  getAllStatus: () => apiClient.getAllAgentsStatus(),
  getAgentStatus: (id: string) => apiClient.getAgentStatus(id),
  restartAgent: (id: string) => apiClient.restartAgent(id),
  getActiveWorkflows: () => apiClient.getActiveWorkflows(),
  triggerWorkflow: (type: string, data: any) => apiClient.triggerWorkflow(type, data),
  getAgentLogs: (id: string, limit?: number) => apiClient.getAgentLogs(id, limit),
};

export const sentinelApi = {
  getStatus: () => apiClient.getSentinelStatus(),
  getCurrentMetrics: () => apiClient.getCurrentMetrics(),
  getHistoricalMetrics: (start: string, end: string, granularity?: string) => 
    apiClient.getHistoricalMetrics(start, end, granularity),
  getPerformanceReport: (days?: number) => apiClient.getPerformanceReport(days),
  getActiveAlerts: (severity?: string) => apiClient.getActiveAlerts(severity),
  acknowledgeAlert: (id: string) => apiClient.acknowledgeAlert(id),
};

export const dashboardApi = {
  getOverview: () => apiClient.getDashboardOverview(),
  getSystemHealth: () => apiClient.getSystemHealth(),
  getRecentActivity: () => apiClient.getRecentActivity(),
};

export default apiClient;
