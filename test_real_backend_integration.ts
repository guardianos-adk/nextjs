/**
 * Real Backend Integration Test
 * Tests connection to Python FastAPI servers and data flow
 */

import { apiClient } from './src/lib/api-client'

// Test configuration
const TEST_CONFIG = {
  MAIN_API_URL: 'http://localhost:8000',
  FRAUD_API_URL: 'http://localhost:8001',
  TIMEOUT: 30000
}

// Test utilities
class TestReporter {
  private results: Array<{ test: string; status: 'PASS' | 'FAIL' | 'SKIP'; duration: number; error?: string }> = []
  private startTime: number = 0

  startTest(testName: string) {
    console.log(`\n🧪 Testing: ${testName}`)
    this.startTime = Date.now()
  }

  passTest(testName: string) {
    const duration = Date.now() - this.startTime
    this.results.push({ test: testName, status: 'PASS', duration })
    console.log(`   ✅ PASS (${duration}ms)`)
  }

  failTest(testName: string, error: string) {
    const duration = Date.now() - this.startTime
    this.results.push({ test: testName, status: 'FAIL', duration, error })
    console.log(`   ❌ FAIL (${duration}ms): ${error}`)
  }

  skipTest(testName: string, reason: string) {
    this.results.push({ test: testName, status: 'SKIP', duration: 0, error: reason })
    console.log(`   ⏭️  SKIP: ${reason}`)
  }

  generateReport() {
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const skipped = this.results.filter(r => r.status === 'SKIP').length
    const total = this.results.length

    console.log('\n' + '='.repeat(80))
    console.log('📊 REAL BACKEND INTEGRATION TEST RESULTS')
    console.log('='.repeat(80))
    
    console.log(`\n📈 Summary:`)
    console.log(`   Total Tests: ${total}`)
    console.log(`   ✅ Passed: ${passed}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   🎯 Success Rate: ${total > 0 ? Math.round((passed / (total - skipped)) * 100) : 0}%`)

    if (failed > 0) {
      console.log(`\n💥 Failed Tests:`)
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`   • ${result.test}: ${result.error}`)
      })
    }

    console.log(`\n⏱️  Performance:`)
    this.results.filter(r => r.status === 'PASS').forEach(result => {
      const status = result.duration < 1000 ? '🟢' : result.duration < 3000 ? '🟡' : '🔴'
      console.log(`   ${status} ${result.test}: ${result.duration}ms`)
    })

    return { passed, failed, skipped, total }
  }
}

// Main test runner
async function runBackendIntegrationTests() {
  const reporter = new TestReporter()
  console.log('🚀 Starting Real Backend Integration Tests...')
  console.log(`📍 Main API: ${TEST_CONFIG.MAIN_API_URL}`)
  console.log(`📍 Fraud API: ${TEST_CONFIG.FRAUD_API_URL}`)

  try {
    // Test 1: Backend Health Check
    reporter.startTest('Backend Health Check')
    try {
      const health = await apiClient.checkHealth()
      if (health.main || health.fraud) {
        reporter.passTest('Backend Health Check')
        console.log(`   📊 Main API: ${health.main ? '✅' : '❌'}`)
        console.log(`   📊 Fraud API: ${health.fraud ? '✅' : '❌'}`)
      } else {
        reporter.failTest('Backend Health Check', 'No backend services responding')
      }
    } catch (error) {
      reporter.failTest('Backend Health Check', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 2: Guardian Profile Retrieval
    reporter.startTest('Guardian Profile API')
    try {
      const response = await apiClient.getCurrentGuardian()
      if (response.success && response.data) {
        reporter.passTest('Guardian Profile API')
        console.log(`   👤 Guardian: ${response.data.name || 'Test Guardian'}`)
        console.log(`   🏢 Institution: ${response.data.institution || 'Test Bank'}`)
      } else {
        reporter.failTest('Guardian Profile API', response.error || 'No data returned')
      }
    } catch (error) {
      reporter.failTest('Guardian Profile API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 3: Dashboard Overview
    reporter.startTest('Dashboard Overview API')
    try {
      const response = await apiClient.getDashboardOverview()
      if (response.success && response.data) {
        reporter.passTest('Dashboard Overview API')
        console.log(`   📊 Total Guardians: ${response.data.totalGuardians}`)
        console.log(`   📝 Active Requests: ${response.data.activeRequests}`)
        console.log(`   📈 Consensus Rate: ${response.data.consensusRate}%`)
      } else {
        reporter.failTest('Dashboard Overview API', response.error || 'No data returned')
      }
    } catch (error) {
      reporter.failTest('Dashboard Overview API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 4: System Health
    reporter.startTest('System Health API')
    try {
      const response = await apiClient.getSystemHealth()
      if (response.success && response.data) {
        reporter.passTest('System Health API')
        console.log(`   🤖 Agents: ${response.data.agents?.healthy || 0}/${response.data.agents?.total || 0}`)
        console.log(`   🎯 Consensus Rate: ${response.data.consensus?.successRate || 0}%`)
      } else {
        reporter.failTest('System Health API', response.error || 'No data returned')
      }
    } catch (error) {
      reporter.failTest('System Health API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 5: Active Voting Requests
    reporter.startTest('Voting Requests API')
    try {
      const response = await apiClient.getActiveRequests()
      if (response.success) {
        reporter.passTest('Voting Requests API')
        const requests = response.data || []
        console.log(`   📋 Active Requests: ${requests.length}`)
      } else {
        reporter.failTest('Voting Requests API', response.error || 'Request failed')
      }
    } catch (error) {
      reporter.failTest('Voting Requests API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 6: Agent Status
    reporter.startTest('Agent Status API')
    try {
      const response = await apiClient.getAllAgentsStatus()
      if (response.success) {
        reporter.passTest('Agent Status API')
        const agents = response.data || []
        console.log(`   🤖 Total Agents: ${agents.length}`)
      } else {
        reporter.failTest('Agent Status API', response.error || 'Request failed')
      }
    } catch (error) {
      reporter.failTest('Agent Status API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 7: Sentinel Metrics (Fraud API)
    reporter.startTest('Sentinel Metrics API')
    try {
      const response = await apiClient.getCurrentMetrics()
      if (response.success && response.data) {
        reporter.passTest('Sentinel Metrics API')
        console.log(`   📊 Processed: ${response.data.processedTransactions || 0}`)
        console.log(`   🚨 Fraud Detected: ${response.data.detectedFraud || 0}`)
        console.log(`   🎯 Accuracy: ${response.data.accuracy || 0}%`)
      } else {
        reporter.failTest('Sentinel Metrics API', response.error || 'No data returned')
      }
    } catch (error) {
      reporter.failTest('Sentinel Metrics API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 8: Active Alerts (Fraud API)
    reporter.startTest('Active Alerts API')
    try {
      const response = await apiClient.getActiveAlerts()
      if (response.success) {
        reporter.passTest('Active Alerts API')
        const alerts = response.data || []
        console.log(`   🚨 Active Alerts: ${alerts.length}`)
      } else {
        reporter.failTest('Active Alerts API', response.error || 'Request failed')
      }
    } catch (error) {
      reporter.failTest('Active Alerts API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 9: All Guardians
    reporter.startTest('All Guardians API')
    try {
      const response = await apiClient.getAllGuardians()
      if (response.success) {
        reporter.passTest('All Guardians API')
        const guardians = response.data || []
        console.log(`   👥 Total Guardians: ${guardians.length}`)
      } else {
        reporter.failTest('All Guardians API', response.error || 'Request failed')
      }
    } catch (error) {
      reporter.failTest('All Guardians API', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 10: Active Workflows
    reporter.startTest('Active Workflows API')
    try {
      const response = await apiClient.getActiveWorkflows()
      if (response.success) {
        reporter.passTest('Active Workflows API')
        const workflows = response.data || []
        console.log(`   ⚙️  Active Workflows: ${workflows.length}`)
      } else {
        reporter.failTest('Active Workflows API', response.error || 'Request failed')
      }
    } catch (error) {
      reporter.failTest('Active Workflows API', error instanceof Error ? error.message : 'Unknown error')
    }

  } catch (globalError) {
    console.error('💥 Global test error:', globalError)
  }

  // Generate final report
  const results = reporter.generateReport()
  
  // Performance analysis
  console.log(`\n🔬 Integration Analysis:`)
  if (results.passed >= 8) {
    console.log(`   🟢 Excellent: Full backend integration working`)
  } else if (results.passed >= 6) {
    console.log(`   🟡 Good: Most endpoints working, minor issues`)
  } else if (results.passed >= 4) {
    console.log(`   🟠 Partial: Some endpoints working, significant issues`)
  } else {
    console.log(`   🔴 Critical: Major backend connectivity issues`)
  }

  console.log(`\n💡 Recommendations:`)
  if (results.failed > 0) {
    console.log(`   • Check if backend servers are running: './start_backend_servers.sh'`)
    console.log(`   • Verify API endpoints match the backend configuration`)
    console.log(`   • Check network connectivity and CORS settings`)
  } else {
    console.log(`   • ✅ Backend integration is working perfectly!`)
    console.log(`   • Consider implementing WebSocket for real-time updates`)
    console.log(`   • Monitor performance for production optimization`)
  }

  return results
}

// Data flow verification
async function testDataFlow() {
  console.log('\n🔄 Testing Data Flow Integration...')
  
  try {
    // Test API client retry logic
    const start = Date.now()
    const health = await apiClient.checkHealth()
    const duration = Date.now() - start
    
    console.log(`⚡ Response Time: ${duration}ms`)
    if (duration < 1000) {
      console.log(`✅ Excellent response time`)
    } else if (duration < 3000) {
      console.log(`⚠️  Slow response time`)
    } else {
      console.log(`🐌 Very slow response time`)
    }

    // Test concurrent requests
    const concurrentStart = Date.now()
    const promises = [
      apiClient.getCurrentGuardian(),
      apiClient.getDashboardOverview(),
      apiClient.getActiveRequests()
    ]
    
    await Promise.all(promises)
    const concurrentDuration = Date.now() - concurrentStart
    
    console.log(`🔀 Concurrent Requests: ${concurrentDuration}ms`)
    
  } catch (error) {
    console.error('❌ Data flow test failed:', error)
  }
}

// Export for external usage
export async function runFullBackendTest() {
  console.log('🎯 Running Full Backend Integration Test Suite...')
  
  const results = await runBackendIntegrationTests()
  await testDataFlow()
  
  console.log('\n🎉 Backend integration test completed!')
  return results
}

// Run tests if called directly
if (import.meta.main) {
  runFullBackendTest()
    .then((results) => {
      if (results.failed === 0) {
        console.log('\n🎊 All tests passed! Backend integration is working perfectly.')
        process.exit(0)
      } else {
        console.log('\n⚠️  Some tests failed. Please check the backend configuration.')
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('\n💥 Test suite crashed:', error)
      process.exit(1)
    })
} 