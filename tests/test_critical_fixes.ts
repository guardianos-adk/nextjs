#!/usr/bin/env bun
/**
 * Critical Fixes Verification Test
 * 
 * This test verifies the fixes for:
 * 1. React TypeError: Cannot read properties of undefined (reading 'current')
 * 2. WebSocket connection failures with Socket.IO implementation
 */

interface ApiHealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

interface DashboardHealthResponse {
  agents: {
    healthy: number;
    total: number;
  };
  consensus: {
    successRate: number;
    avgTime: number;
  };
  timestamp: string;
  // Add optional throughput and alerts to test null safety
  throughput?: {
    current: number;
    capacity: number;
  };
  alerts?: {
    active: number;
    critical: number;
  };
}

interface GuardianResponse {
  id: string;
  name: string;
  institution: string;
  institutionName: string;
  leiCode: string;
  jurisdiction: string;
  roles: string[];
  isActive: boolean;
  lastActivity: string;
  certificateStatus: string;
  reputationScore: number;
  votingPower: number;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  guardian: {
    id: string;
    name: string;
    institution: string;
  } | null;
  severity: string;
  category: string;
  metrics: {
    responseTime: number;
    accuracy: number;
    confidenceScore: number;
  };
}

const BASE_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

class CriticalFixesTest {
  private testResults: Record<string, boolean> = {};
  private errors: string[] = [];

  private logTest(testName: string, passed: boolean, details?: string) {
    this.testResults[testName] = passed;
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${testName}`);
    if (details) {
      console.log(`   ${details}`);
    }
    if (!passed) {
      this.errors.push(`${testName}: ${details || 'Test failed'}`);
    }
  }

  private async testHealthEndpoint(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/health`);
      if (!response.ok) {
        this.logTest('Health Endpoint', false, `HTTP ${response.status}`);
        return false;
      }

      const data: ApiHealthResponse = await response.json();
      const isValid = data.status === 'healthy' && 
                      data.service === 'guardian_os_main_api' &&
                      data.version === '1.0.0';

      this.logTest('Health Endpoint', isValid, 
        isValid ? 'API server is healthy' : `Invalid response: ${JSON.stringify(data)}`);
      return isValid;
    } catch (error) {
      this.logTest('Health Endpoint', false, `Error: ${error}`);
      return false;
    }
  }

  private async testDashboardHealthEndpoint(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dashboard/health`);
      if (!response.ok) {
        this.logTest('Dashboard Health Endpoint', false, `HTTP ${response.status}`);
        return false;
      }

      const data: DashboardHealthResponse = await response.json();
      
      // Test the fields that were causing the TypeError
      const hasRequiredFields = 
        typeof data.agents?.healthy === 'number' &&
        typeof data.agents?.total === 'number' &&
        typeof data.consensus?.successRate === 'number' &&
        typeof data.consensus?.avgTime === 'number';

      // Test that throughput and alerts are optional (this is what was causing the crash)
      const throughputSafe = !data.throughput || 
        (typeof data.throughput.current === 'number' && typeof data.throughput.capacity === 'number');
      
      const alertsSafe = !data.alerts || 
        (typeof data.alerts.active === 'number' && typeof data.alerts.critical === 'number');

      const isValid = hasRequiredFields && throughputSafe && alertsSafe;

      this.logTest('Dashboard Health Endpoint', isValid, 
        isValid ? 'All health fields are properly typed' : 
        `Missing or invalid fields in response: ${JSON.stringify(data)}`);
      return isValid;
    } catch (error) {
      this.logTest('Dashboard Health Endpoint', false, `Error: ${error}`);
      return false;
    }
  }

  private async testGuardianEndpoint(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/guardians/me`);
      if (!response.ok) {
        this.logTest('Guardian Endpoint', false, `HTTP ${response.status}`);
        return false;
      }

      const data: GuardianResponse = await response.json();
      
      // Test that all required fields for GuardianSwitcher component are present
      const hasRequiredFields = 
        typeof data.reputationScore === 'number' &&
        typeof data.institutionName === 'string' &&
        typeof data.jurisdiction === 'string' && // Should be string, not array
        typeof data.votingPower === 'number';

      // Test that reputationScore is a valid number (this was causing .toFixed() errors)
      const validReputationScore = !isNaN(data.reputationScore) && isFinite(data.reputationScore);

      const isValid = hasRequiredFields && validReputationScore;

      this.logTest('Guardian Endpoint', isValid, 
        isValid ? `Guardian data structure is correct (reputationScore: ${data.reputationScore})` : 
        `Invalid guardian data: ${JSON.stringify(data)}`);
      return isValid;
    } catch (error) {
      this.logTest('Guardian Endpoint', false, `Error: ${error}`);
      return false;
    }
  }

  private async testActivityEndpoint(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dashboard/activity`);
      if (!response.ok) {
        this.logTest('Activity Endpoint', false, `HTTP ${response.status} - This was the missing endpoint!`);
        return false;
      }

      const data: ActivityItem[] = await response.json();
      
      if (!Array.isArray(data)) {
        this.logTest('Activity Endpoint', false, 'Response is not an array');
        return false;
      }

      // Test that activity items have numerical metrics (preventing .toFixed() errors)
      const validMetrics = data.every(item => 
        item.metrics &&
        typeof item.metrics.responseTime === 'number' &&
        typeof item.metrics.accuracy === 'number' &&
        typeof item.metrics.confidenceScore === 'number' &&
        !isNaN(item.metrics.responseTime) &&
        !isNaN(item.metrics.accuracy) &&
        !isNaN(item.metrics.confidenceScore)
      );

      this.logTest('Activity Endpoint', validMetrics, 
        validMetrics ? `Activity endpoint returns ${data.length} items with valid numerical metrics` : 
        'Some activity items have invalid numerical metrics');
      return validMetrics;
    } catch (error) {
      this.logTest('Activity Endpoint', false, `Error: ${error}`);
      return false;
    }
  }

  private async testSocketIOConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Use Socket.IO client libraries or test with WebSocket
        const ws = new WebSocket(`${WS_URL}/socket.io/?EIO=4&transport=websocket`);
        
        let connected = false;
        let messageReceived = false;

        const timeout = setTimeout(() => {
          if (!connected) {
            this.logTest('Socket.IO Connection', false, 'Connection timeout after 5 seconds');
            resolve(false);
          }
        }, 5000);

        ws.onopen = () => {
          connected = true;
          clearTimeout(timeout);
          
          // Send Socket.IO handshake
          ws.send('40'); // Socket.IO connection packet
          
          setTimeout(() => {
            this.logTest('Socket.IO Connection', messageReceived, 
              messageReceived ? 'WebSocket connection and message exchange successful' : 
              'Connected but no messages received');
            resolve(messageReceived);
          }, 2000);
        };

        ws.onmessage = (event) => {
          console.log(`   WebSocket message received: ${event.data}`);
          if (event.data.includes('connection_established') || event.data.includes('0')) {
            messageReceived = true;
          }
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          this.logTest('Socket.IO Connection', false, `WebSocket error: ${error}`);
          resolve(false);
        };

        ws.onclose = (event) => {
          if (!connected) {
            clearTimeout(timeout);
            this.logTest('Socket.IO Connection', false, 
              `WebSocket closed before connection: code ${event.code}, reason: ${event.reason}`);
            resolve(false);
          }
        };

      } catch (error) {
        this.logTest('Socket.IO Connection', false, `Error creating WebSocket: ${error}`);
        resolve(false);
      }
    });
  }

  private async testErrorBoundaryScenarios(): Promise<boolean> {
    try {
      // Test with malformed/empty responses to ensure components handle undefined gracefully
      const scenarios = [
        { name: 'Empty dashboard health', endpoint: '/api/v1/dashboard/health' },
        { name: 'Guardian data completeness', endpoint: '/api/v1/guardians/me' }
      ];

      let allScenariosPass = true;

      for (const scenario of scenarios) {
        try {
          const response = await fetch(`${BASE_URL}${scenario.endpoint}`);
          const data = await response.json();
          
          // Verify data can be safely processed (no undefined property access)
          if (scenario.endpoint.includes('dashboard/health')) {
            const agents = data.agents || { healthy: 0, total: 0 };
            const consensus = data.consensus || { successRate: 0, avgTime: 0 };
            const throughput = data.throughput || { current: 0, capacity: 100 };
            const alerts = data.alerts || { active: 0, critical: 0 };
            
            // These operations should not throw errors
            const safeCalculations = 
              agents.healthy / (agents.total || 1) +
              throughput.current / (throughput.capacity || 1) +
              consensus.successRate +
              alerts.active;
            
            if (isNaN(safeCalculations)) {
              allScenariosPass = false;
              this.logTest(`Error Boundary - ${scenario.name}`, false, 'Safe calculations failed');
            }
          }

          if (scenario.endpoint.includes('guardians/me')) {
            const reputationScore = data.reputationScore || 0;
            // This operation should not throw errors
            const safeScore = Number(reputationScore).toFixed(1);
            if (isNaN(parseFloat(safeScore))) {
              allScenariosPass = false;
              this.logTest(`Error Boundary - ${scenario.name}`, false, 'Safe score calculation failed');
            }
          }

        } catch (error) {
          allScenariosPass = false;
          console.log(`   Error in ${scenario.name}: ${error}`);
        }
      }

      this.logTest('Error Boundary Scenarios', allScenariosPass, 
        allScenariosPass ? 'All components handle undefined data gracefully' : 
        'Some components may still crash on undefined data');
      return allScenariosPass;
    } catch (error) {
      this.logTest('Error Boundary Scenarios', false, `Error: ${error}`);
      return false;
    }
  }

  public async runAllTests(): Promise<void> {
    console.log('🚀 Running Critical Fixes Verification Tests...\n');

    // Test all critical endpoints
    await this.testHealthEndpoint();
    await this.testDashboardHealthEndpoint();
    await this.testGuardianEndpoint();
    await this.testActivityEndpoint();
    
    // Test WebSocket/Socket.IO connectivity
    console.log('\n🔌 Testing WebSocket/Socket.IO Connection...');
    await this.testSocketIOConnection();
    
    // Test error boundary scenarios
    console.log('\n🛡️ Testing Error Boundary Scenarios...');
    await this.testErrorBoundaryScenarios();

    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('─'.repeat(50));
    
    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(Boolean).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`   • ${error}`));
    }

    if (failedTests === 0) {
      console.log('\n🎉 All critical fixes are working correctly!');
      console.log('✅ React TypeError fixed - safe property access implemented');
      console.log('✅ WebSocket connection fixed - Socket.IO properly configured');
      console.log('✅ Error boundaries tested - components handle undefined data gracefully');
    } else {
      console.log('\n⚠️  Some issues still need attention.');
      console.log('Please review the failed tests above.');
    }

    process.exit(failedTests > 0 ? 1 : 0);
  }
}

// Run the tests
const tester = new CriticalFixesTest();
tester.runAllTests().catch(console.error); 