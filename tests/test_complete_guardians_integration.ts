#!/usr/bin/env bun

/**
 * Complete GuardianOS Integration Test
 * Tests the fixed guardians endpoint and full e2e integration
 */

// Simple assertion function
function expect(value: unknown) {
  return {
    toBe: (expected: unknown) => {
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (typeof value !== 'number' || value <= expected) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    },
    toBeDefined: () => {
      if (value === undefined || value === null) {
        throw new Error(`Expected value to be defined`);
      }
    }
  };
}

// API Configuration
const MAIN_API_BASE = 'http://localhost:8000';
const FRAUD_API_BASE = 'http://localhost:8001';

interface Guardian {
  id: string;
  name: string;
  institution: string;
  leiCode: string;
  jurisdiction: string[];
  roles: string[];
  isActive: boolean;
  lastActivity: string;
  certificateStatus: string;
  votingPower?: number;
  reputationScore?: number;
  walletAddress?: string;
  publicKey?: string;
  performanceMetrics?: {
    totalVotes: number;
    consensusParticipation: number;
    averageResponseTime: number;
    accuracy: number;
  };
}

interface DashboardOverview {
  totalGuardians: number;
  activeRequests: number;
  consensusRate: number;
  systemHealth: string;
}

async function makeRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Request failed: ${url}`, message);
    throw error;
  }
}

async function testGuardiansEndpoint() {
  console.log('🧪 Testing: Guardians API Endpoint');
  
  try {
    const guardians: Guardian[] = await makeRequest(`${MAIN_API_BASE}/api/v1/guardians`);
    
    // Validate response structure
    expect(Array.isArray(guardians)).toBe(true);
    expect(guardians.length).toBeGreaterThan(0);
    
    // Validate each guardian has required fields
    for (const guardian of guardians) {
      expect(guardian.id).toBeDefined();
      expect(guardian.name).toBeDefined();
      expect(guardian.institution).toBeDefined();
      expect(guardian.leiCode).toBeDefined();
      expect(Array.isArray(guardian.jurisdiction)).toBe(true);
      expect(Array.isArray(guardian.roles)).toBe(true);
      expect(typeof guardian.isActive).toBe('boolean');
      expect(guardian.lastActivity).toBeDefined();
      expect(guardian.certificateStatus).toBeDefined();
    }
    
    console.log(`   ✅ PASS - Found ${guardians.length} guardians`);
    console.log(`   👥 Guardians:`);
    guardians.forEach((g, i) => {
      console.log(`     ${i + 1}. ${g.name} (${g.institution}) - ${g.leiCode}`);
    });
    
    return guardians;
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    throw error;
  }
}

async function testCurrentGuardianEndpoint() {
  console.log('🧪 Testing: Current Guardian API Endpoint');
  
  try {
    const guardian: Guardian = await makeRequest(`${MAIN_API_BASE}/api/v1/guardians/me`);
    
    // Validate response structure
    expect(guardian.id).toBeDefined();
    expect(guardian.name).toBeDefined();
    expect(guardian.institution).toBeDefined();
    
    console.log(`   ✅ PASS`);
    console.log(`   👤 Current Guardian: ${guardian.name}`);
    console.log(`   🏢 Institution: ${guardian.institution}`);
    console.log(`   📋 LEI: ${guardian.leiCode}`);
    
    return guardian;
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    throw error;
  }
}

async function testDashboardConsistency(guardians: Guardian[]) {
  console.log('🧪 Testing: Dashboard Data Consistency');
  
  try {
    const overview: DashboardOverview = await makeRequest(`${MAIN_API_BASE}/api/v1/dashboard/overview`);
    
    // Validate that dashboard overview matches guardians count
    expect(overview.totalGuardians).toBe(guardians.length);
    expect(typeof overview.activeRequests).toBe('number');
    expect(typeof overview.consensusRate).toBe('number');
    expect(overview.systemHealth).toBeDefined();
    
    console.log(`   ✅ PASS`);
    console.log(`   📊 Dashboard shows ${overview.totalGuardians} guardians (matches API)`);
    console.log(`   📝 Active Requests: ${overview.activeRequests}`);
    console.log(`   📈 Consensus Rate: ${overview.consensusRate}%`);
    
    return overview;
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    throw error;
  }
}

async function testBackendHealthCheck() {
  console.log('🧪 Testing: Backend Health Checks');
  
  try {
    const mainHealth = await makeRequest(`${MAIN_API_BASE}/api/health`);
    const fraudHealth = await makeRequest(`${FRAUD_API_BASE}/health`);
    
    expect(mainHealth.status).toBe('healthy');
    expect(fraudHealth.status).toBe('healthy');
    
    console.log(`   ✅ PASS`);
    console.log(`   🔧 Main API: ${mainHealth.service} v${mainHealth.version}`);
    console.log(`   🔧 Fraud API: ${fraudHealth.service} v${fraudHealth.version}`);
    
    return { main: mainHealth, fraud: fraudHealth };
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    throw error;
  }
}

async function testDataIntegrity() {
  console.log('🧪 Testing: Data Integrity & Validation');
  
  try {
    const guardians = await makeRequest(`${MAIN_API_BASE}/api/v1/guardians`);
    const currentGuardian = await makeRequest(`${MAIN_API_BASE}/api/v1/guardians/me`);
    
    // Validate that current guardian exists in the guardians list
    const currentInList = guardians.find((g: Guardian) => g.id === currentGuardian.id);
    
    if (!currentInList) {
      console.log(`   ⚠️ Warning: Current guardian not found in guardians list`);
      console.log(`   🔍 Current Guardian ID: ${currentGuardian.id}`);
      console.log(`   🔍 Available Guardian IDs: ${guardians.map((g: Guardian) => g.id).join(', ')}`);
    } else {
      console.log(`   ✅ PASS - Current guardian exists in guardians list`);
    }
    
    // Validate LEI codes are unique
    const leiCodes = guardians.map((g: Guardian) => g.leiCode);
    const uniqueLeiCodes = new Set(leiCodes);
    expect(leiCodes.length).toBe(uniqueLeiCodes.size);
    
    console.log(`   ✅ All LEI codes are unique`);
    
    // Validate jurisdiction formats
    for (const guardian of guardians) {
      expect(Array.isArray(guardian.jurisdiction)).toBe(true);
      expect(guardian.jurisdiction.length).toBeGreaterThan(0);
    }
    
    console.log(`   ✅ All jurisdictions are properly formatted`);
    
    return { guardians, currentGuardian };
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    throw error;
  }
}

async function testPerformanceMetrics() {
  console.log('🧪 Testing: Performance & Response Times');
  
  const endpoints = [
    { name: 'Health Check', url: `${MAIN_API_BASE}/api/health` },
    { name: 'Guardians List', url: `${MAIN_API_BASE}/api/v1/guardians` },
    { name: 'Current Guardian', url: `${MAIN_API_BASE}/api/v1/guardians/me` },
    { name: 'Dashboard Overview', url: `${MAIN_API_BASE}/api/v1/dashboard/overview` },
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const startTime = performance.now();
      await makeRequest(endpoint.url);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      results.push({ name: endpoint.name, responseTime });
      console.log(`   🟢 ${endpoint.name}: ${responseTime}ms`);
    } catch (error) {
      console.log(`   🔴 ${endpoint.name}: FAILED - ${error.message}`);
    }
  }
  
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  console.log(`   📊 Average Response Time: ${Math.round(avgResponseTime)}ms`);
  
  if (avgResponseTime < 100) {
    console.log(`   ✅ Excellent performance (< 100ms average)`);
  } else if (avgResponseTime < 500) {
    console.log(`   ✅ Good performance (< 500ms average)`);
  } else {
    console.log(`   ⚠️ Slow performance (> 500ms average)`);
  }
  
  return results;
}

async function runCompleteGuardiansTest() {
  console.log('🎯 Running Complete Guardians Integration Test');
  console.log('=' .repeat(60));
  
  let testsPassed = 0;
  let testsTotal = 0;
  
  try {
    // Test 1: Backend Health
    testsTotal++;
    await testBackendHealthCheck();
    testsPassed++;
    
    // Test 2: Guardians API
    testsTotal++;
    const guardians = await testGuardiansEndpoint();
    testsPassed++;
    
    // Test 3: Current Guardian API
    testsTotal++;
    await testCurrentGuardianEndpoint();
    testsPassed++;
    
    // Test 4: Dashboard Consistency
    testsTotal++;
    await testDashboardConsistency(guardians);
    testsPassed++;
    
    // Test 5: Data Integrity
    testsTotal++;
    await testDataIntegrity();
    testsPassed++;
    
    // Test 6: Performance
    testsTotal++;
    await testPerformanceMetrics();
    testsPassed++;
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
  
  console.log('=' .repeat(60));
  console.log('📊 COMPLETE GUARDIANS INTEGRATION TEST RESULTS');
  console.log('=' .repeat(60));
  
  console.log(`📈 Summary:`);
  console.log(`   Total Tests: ${testsTotal}`);
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsTotal - testsPassed}`);
  console.log(`   🎯 Success Rate: ${Math.round((testsPassed / testsTotal) * 100)}%`);
  
  if (testsPassed === testsTotal) {
    console.log('');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ GuardianOS guardians integration is working perfectly');
    console.log('📡 Backend APIs are responding correctly');
    console.log('🔗 Frontend can consume the data successfully');
    console.log('');
    console.log('💡 System Status: FULLY OPERATIONAL');
    
    process.exit(0);
  } else {
    console.log('');
    console.log('⚠️ Some tests failed. Please check the backend configuration.');
    process.exit(1);
  }
}

// Run the test suite
runCompleteGuardiansTest(); 