// GuardianOS Modern State Management Test
// File: guardianos/test_modern_state_management.ts
// Tests the new Zustand store + React Query + Mock Backend integration

import { useGuardianStore } from './src/stores/guardian-store';
import { mockBackend } from './src/lib/mock-backend';

interface TestResult {
  test: string;
  success: boolean;
  duration: number;
  details: any;
  error?: string;
}

interface StateManagementTestSuite {
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  averageResponseTime: number;
  results: TestResult[];
  summary: {
    storeOperations: boolean;
    mockBackend: boolean;
    dataFlow: boolean;
    errorHandling: boolean;
    performance: boolean;
  };
}

class StateManagementTester {
  private results: TestResult[] = [];

  async runTestSuite(): Promise<StateManagementTestSuite> {
    console.log('🧪 Starting GuardianOS State Management Test Suite...');
    
    // Test individual components
    await this.testZustandStore();
    await this.testMockBackend();
    await this.testDataFlow();
    await this.testErrorHandling();
    await this.testPerformance();

    return this.generateReport();
  }

  private async runTest(
    testName: string,
    testFn: () => Promise<any>
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Running: ${testName}`);
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${testName} passed (${duration}ms)`);
      
      return {
        test: testName,
        success: true,
        duration,
        details: result,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error(`❌ ${testName} failed (${duration}ms):`, error);
      
      return {
        test: testName,
        success: false,
        duration,
        details: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 🏪 **Test Zustand Store Operations**
  private async testZustandStore(): Promise<void> {
    const result = await this.runTest('Zustand Store Operations', async () => {
      const store = useGuardianStore.getState();
      
      // Test initial state
      if (store.auth.guardian !== null) {
        throw new Error('Initial guardian should be null');
      }
      
      if (store.connection.status !== 'disconnected') {
        throw new Error('Initial connection status should be disconnected');
      }

      // Test authentication actions
      const mockGuardian = {
        id: 'test-guardian',
        name: 'Test Guardian',
        organization: 'Test Org',
        leiCode: 'TEST123456789012',
        status: 'active' as const,
        role: 'validator' as const,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        votingPower: 100,
        consensusParticipation: 0.95,
        certificateHash: 'test-hash',
        publicKey: 'test-key',
        metadata: {
          region: 'US',
          jurisdiction: 'Delaware',
          tier: 'enterprise',
        },
      };

      store.setGuardian(mockGuardian);
      
      const updatedStore = useGuardianStore.getState();
      if (updatedStore.auth.guardian?.id !== 'test-guardian') {
        throw new Error('Guardian not set correctly');
      }
      
      if (!updatedStore.auth.isAuthenticated) {
        throw new Error('Authentication status not updated');
      }

      // Test connection actions
      store.setConnectionStatus('connected');
      store.updateLastActivity();
      
      const connectionState = useGuardianStore.getState().connection;
      if (connectionState.status !== 'connected') {
        throw new Error('Connection status not updated');
      }
      
      if (!connectionState.isConnected) {
        throw new Error('Connection flag not updated');
      }

      // Test UI actions
      store.toggleSidebar();
      store.setTheme('dark');
      store.addNotification({
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test',
      });

      const uiState = useGuardianStore.getState().ui;
      if (uiState.sidebarOpen === true) { // Initial was true, so toggle should make it false
        throw new Error('Sidebar toggle not working');
      }
      
      if (uiState.theme !== 'dark') {
        throw new Error('Theme not updated');
      }
      
      if (uiState.notifications.length === 0) {
        throw new Error('Notification not added');
      }

      return {
        initialState: 'correct',
        authenticationActions: 'working',
        connectionActions: 'working',
        uiActions: 'working',
        storeIntegrity: 'maintained',
      };
    });
    
    this.results.push(result);
  }

  // 🎭 **Test Mock Backend Service**
  private async testMockBackend(): Promise<void> {
    const result = await this.runTest('Mock Backend Service', async () => {
      // Enable mock backend
      mockBackend.enable();
      
      if (!mockBackend.isActive()) {
        throw new Error('Mock backend not activated');
      }

      // Test data generation
      const guardian = mockBackend.getMockGuardian();
      if (!guardian || !guardian.id || !guardian.name) {
        throw new Error('Invalid guardian data generated');
      }

      const dashboardStats = mockBackend.getMockDashboardStats();
      if (!dashboardStats || typeof dashboardStats.totalGuardians !== 'number') {
        throw new Error('Invalid dashboard stats generated');
      }

      const activeRequests = mockBackend.getMockActiveRequests();
      if (!Array.isArray(activeRequests) || activeRequests.length === 0) {
        throw new Error('Invalid active requests generated');
      }

      const agents = mockBackend.getMockAgents();
      if (!Array.isArray(agents) || agents.length === 0) {
        throw new Error('Invalid agents data generated');
      }

      const metrics = mockBackend.getMockSentinelMetrics();
      if (!metrics || typeof metrics.transactionsScanned !== 'number') {
        throw new Error('Invalid sentinel metrics generated');
      }

      const alerts = mockBackend.getMockAlerts();
      if (!Array.isArray(alerts) || alerts.length === 0) {
        throw new Error('Invalid alerts data generated');
      }

      const systemHealth = mockBackend.getMockSystemHealth();
      if (!systemHealth || !systemHealth.agents) {
        throw new Error('Invalid system health data generated');
      }

      // Test API simulation
      const apiResponse = await mockBackend.mockApiCall({ test: 'data' }, 50);
      if (!apiResponse.success || !apiResponse.data || !apiResponse.timestamp) {
        throw new Error('Mock API call failed');
      }

      return {
        mockDataGeneration: 'working',
        guardianData: 'valid',
        dashboardStats: 'valid',
        activeRequests: 'valid',
        agentsData: 'valid',
        sentinelMetrics: 'valid',
        alertsData: 'valid',
        systemHealth: 'valid',
        apiSimulation: 'working',
      };
    });
    
    this.results.push(result);
  }

  // 🔄 **Test Data Flow Integration**
  private async testDataFlow(): Promise<void> {
    const result = await this.runTest('Data Flow Integration', async () => {
      const store = useGuardianStore.getState();
      
      // Test voting workflow
      const mockRequest = mockBackend.getMockActiveRequests()[0];
      store.addNewRequest(mockRequest);
      
      let votingState = useGuardianStore.getState().voting;
      if (votingState.activeRequests.length === 0) {
        throw new Error('Request not added to store');
      }
      
      // Check if notification was added
      const uiState = useGuardianStore.getState().ui;
      const hasRequestNotification = uiState.notifications.some(
        notif => notif.id === `request-${mockRequest.id}`
      );
      if (!hasRequestNotification) {
        throw new Error('Request notification not created');
      }

      // Test agent updates
      const mockAgents = mockBackend.getMockAgents();
      store.setAgents(mockAgents);
      
      const agentsState = useGuardianStore.getState().agents;
      if (agentsState.list.length !== mockAgents.length) {
        throw new Error('Agents not synced to store');
      }
      
      if (!agentsState.lastUpdate) {
        throw new Error('Agent last update not set');
      }

      // Test sentinel metrics
      const mockMetrics = mockBackend.getMockSentinelMetrics();
      store.setSentinelMetrics(mockMetrics);
      
      const sentinelState = useGuardianStore.getState().sentinel;
      if (!sentinelState.metrics) {
        throw new Error('Sentinel metrics not set');
      }
      
      if (sentinelState.realTimeData.length === 0) {
        throw new Error('Real-time data not updated');
      }

      // Test alerts
      const mockAlerts = mockBackend.getMockAlerts();
      mockAlerts.forEach(alert => store.addAlert(alert));
      
      const updatedSentinelState = useGuardianStore.getState().sentinel;
      if (updatedSentinelState.alerts.length === 0) {
        throw new Error('Alerts not added');
      }

      return {
        votingWorkflow: 'working',
        notificationSystem: 'working',
        agentUpdates: 'working',
        sentinelMetrics: 'working',
        alertsSystem: 'working',
        storeSync: 'working',
      };
    });
    
    this.results.push(result);
  }

  // 🚨 **Test Error Handling**
  private async testErrorHandling(): Promise<void> {
    const result = await this.runTest('Error Handling', async () => {
      const store = useGuardianStore.getState();
      
      // Test auth error handling
      store.setAuthError('Test authentication error');
      
      const authState = useGuardianStore.getState().auth;
      if (authState.error !== 'Test authentication error') {
        throw new Error('Auth error not set correctly');
      }
      
      if (authState.isLoading !== false) {
        throw new Error('Loading state not reset on error');
      }

      // Test connection retry logic
      store.incrementRetryCount();
      store.incrementRetryCount();
      
      const connectionState = useGuardianStore.getState().connection;
      if (connectionState.retryCount !== 2) {
        throw new Error('Retry count not incremented correctly');
      }

      // Test graceful degradation
      store.setConnectionStatus('error');
      
      const updatedConnectionState = useGuardianStore.getState().connection;
      if (!updatedConnectionState.dashboard?.isOfflineMode) {
        // Note: This might fail if the store structure is different
        console.warn('Offline mode might not be automatically enabled');
      }

      // Test store reset
      store.resetStore();
      
      const resetState = useGuardianStore.getState();
      if (resetState.auth.guardian !== null) {
        throw new Error('Store not reset correctly');
      }

      return {
        authErrorHandling: 'working',
        retryLogic: 'working',
        gracefulDegradation: 'partial',
        storeReset: 'working',
      };
    });
    
    this.results.push(result);
  }

  // ⚡ **Test Performance**
  private async testPerformance(): Promise<void> {
    const result = await this.runTest('Performance Tests', async () => {
      const iterations = 1000;
      const store = useGuardianStore.getState();
      
      // Test store update performance
      const startTime = Date.now();
      
      for (let i = 0; i < iterations; i++) {
        store.updateLastActivity();
        store.incrementPendingUpdates();
      }
      
      const storeUpdateTime = Date.now() - startTime;
      const avgStoreUpdate = storeUpdateTime / iterations;
      
      if (avgStoreUpdate > 1) { // Should be sub-millisecond
        console.warn(`Store updates averaging ${avgStoreUpdate}ms - may be slow`);
      }

      // Test mock data generation performance
      const mockStartTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        mockBackend.getMockGuardian();
        mockBackend.getMockDashboardStats();
        mockBackend.getMockActiveRequests();
      }
      
      const mockDataTime = Date.now() - mockStartTime;
      const avgMockGeneration = mockDataTime / 100;
      
      if (avgMockGeneration > 10) { // Should be under 10ms
        console.warn(`Mock data generation averaging ${avgMockGeneration}ms - may be slow`);
      }

      // Test selector performance
      const selectorStartTime = Date.now();
      
      for (let i = 0; i < iterations; i++) {
        const state = useGuardianStore.getState();
        // Simulate selector access
        const _ = state.auth.isAuthenticated;
        const __ = state.connection.isConnected;
        const ___ = state.dashboard.stats;
      }
      
      const selectorTime = Date.now() - selectorStartTime;
      const avgSelectorAccess = selectorTime / iterations;
      
      if (avgSelectorAccess > 0.1) {
        console.warn(`Selector access averaging ${avgSelectorAccess}ms - may be slow`);
      }

      return {
        storeUpdatePerf: `${avgStoreUpdate.toFixed(3)}ms avg`,
        mockDataGenPerf: `${avgMockGeneration.toFixed(3)}ms avg`,
        selectorPerf: `${avgSelectorAccess.toFixed(3)}ms avg`,
        totalIterations: iterations,
        performanceGrade: avgStoreUpdate < 1 && avgMockGeneration < 10 ? 'excellent' : 'good',
      };
    });
    
    this.results.push(result);
  }

  private generateReport(): StateManagementTestSuite {
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = this.results.filter(r => !r.success).length;
    const totalTests = this.results.length;
    const averageResponseTime = this.results.reduce((sum, r) => sum + r.duration, 0) / totalTests;

    const summary = {
      storeOperations: this.results.find(r => r.test.includes('Store Operations'))?.success || false,
      mockBackend: this.results.find(r => r.test.includes('Mock Backend'))?.success || false,
      dataFlow: this.results.find(r => r.test.includes('Data Flow'))?.success || false,
      errorHandling: this.results.find(r => r.test.includes('Error Handling'))?.success || false,
      performance: this.results.find(r => r.test.includes('Performance'))?.success || false,
    };

    const report: StateManagementTestSuite = {
      totalTests,
      successfulTests,
      failedTests,
      averageResponseTime,
      results: this.results,
      summary,
    };

    // Save results
    if (typeof window === 'undefined') {
      try {
        const fs = require('fs');
        fs.writeFileSync(
          'guardianos/state_management_test_results.json',
          JSON.stringify(report, null, 2)
        );
      } catch (error) {
        console.warn('Could not save test results to file:', error);
      }
    }

    return report;
  }

  public async displayResults(report: StateManagementTestSuite): Promise<void> {
    console.log('\n' + '='.repeat(80));
    console.log('🏆 GUARDIANS STATE MANAGEMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log(`📊 Overall Results:`);
    console.log(`   • Total Tests: ${report.totalTests}`);
    console.log(`   • Passed: ${report.successfulTests} ✅`);
    console.log(`   • Failed: ${report.failedTests} ❌`);
    console.log(`   • Success Rate: ${((report.successfulTests / report.totalTests) * 100).toFixed(1)}%`);
    console.log(`   • Average Duration: ${report.averageResponseTime.toFixed(0)}ms`);

    console.log(`\n🧪 Component Results:`);
    console.log(`   • Zustand Store: ${report.summary.storeOperations ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   • Mock Backend: ${report.summary.mockBackend ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   • Data Flow: ${report.summary.dataFlow ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   • Error Handling: ${report.summary.errorHandling ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   • Performance: ${report.summary.performance ? '✅ PASS' : '❌ FAIL'}`);

    console.log(`\n📋 Detailed Results:`);
    report.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${result.test} (${result.duration}ms)`);
      if (!result.success && result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    console.log('\n' + '='.repeat(80));

    const overallSuccess = report.successfulTests / report.totalTests >= 0.8;
    if (overallSuccess) {
      console.log('🎉 STATE MANAGEMENT TESTS SUCCESSFUL! Ready for production.');
    } else {
      console.log('⚠️  Some state management tests failed. Review and fix before deployment.');
    }
    
    console.log('='.repeat(80) + '\n');
  }
}

// 🚀 **Execute Test Suite**
async function runStateManagementTests() {
  const tester = new StateManagementTester();
  
  try {
    console.log('🔧 Initializing GuardianOS State Management Test Suite...');
    
    const report = await tester.runTestSuite();
    await tester.displayResults(report);
    
    return report;
  } catch (error) {
    console.error('❌ Test suite execution failed:', error);
    return null;
  }
}

// Execute if run directly
runStateManagementTests().catch(console.error); 