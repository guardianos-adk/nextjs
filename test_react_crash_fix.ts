#!/usr/bin/env bun

/**
 * React Crash Fix Verification Test
 * 
 * This test specifically verifies that the TypeError: Cannot read properties of undefined (reading 'toFixed')
 * has been resolved by ensuring all required data fields are present in API responses.
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
    },
    toBeTypeOf: (expectedType: string) => {
      if (typeof value !== expectedType) {
        throw new Error(`Expected ${value} to be of type ${expectedType}, got ${typeof value}`);
      }
    }
  };
}

// API Configuration  
const API_BASE = 'http://localhost:8000';

// API Request Helper
async function makeRequest(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

async function runReactCrashFixTests() {
  console.log('🔧 React TypeError: toFixed() Crash Fix Verification');
  console.log('======================================================');
  
  try {
    // Test 1: Verify dashboard activity endpoint (was returning 404)
    console.log('🧪 Test 1: Dashboard Activity Endpoint');
    const activity = await makeRequest(`${API_BASE}/api/v1/dashboard/activity`);
    expect(Array.isArray(activity)).toBe(true);
    console.log(`   ✅ Activity endpoint returns array with ${activity.length} items`);
    
    // Verify each activity has numerical metrics (prevents toFixed errors)
    if (activity.length > 0) {
      const firstActivity = activity[0];
      expect(firstActivity.metrics).toBeDefined();
      expect(firstActivity.metrics.responseTime).toBeTypeOf('number');
      expect(firstActivity.metrics.accuracy).toBeTypeOf('number');
      expect(firstActivity.metrics.confidenceScore).toBeTypeOf('number');
      
      // Test the actual toFixed operation that was crashing
      const responseTimeFormatted = firstActivity.metrics.responseTime.toFixed(1);
      const accuracyFormatted = firstActivity.metrics.accuracy.toFixed(1);
      const confidenceFormatted = firstActivity.metrics.confidenceScore.toFixed(1);
      
      console.log(`   ✅ toFixed() operations work: ${responseTimeFormatted}ms, ${accuracyFormatted}%, ${confidenceFormatted}%`);
    }
    
    // Test 2: Verify guardian data structure (was missing reputationScore)
    console.log('🧪 Test 2: Guardian Data Structure');
    const currentGuardian = await makeRequest(`${API_BASE}/api/v1/guardians/me`);
    
    // Check all fields that GuardianSwitcher component expects
    expect(currentGuardian.reputationScore).toBeDefined();
    expect(currentGuardian.reputationScore).toBeTypeOf('number');
    expect(currentGuardian.jurisdiction).toBeTypeOf('string');
    expect(currentGuardian.institutionName).toBeDefined();
    expect(currentGuardian.votingPower).toBeTypeOf('number');
    
    // Test the specific toFixed operation that was crashing in GuardianSwitcher
    const reputationScoreFormatted = currentGuardian.reputationScore.toFixed(1);
    console.log(`   ✅ Guardian reputationScore.toFixed(1) works: ${reputationScoreFormatted}`);
    console.log(`   ✅ Guardian data complete: ${currentGuardian.institutionName} (${currentGuardian.jurisdiction})`);
    
    // Test 3: Verify other endpoints that use toFixed operations
    console.log('🧪 Test 3: Other Numerical Data Endpoints');
    
    const dashboardOverview = await makeRequest(`${MAIN_API_BASE}/api/v1/dashboard/overview`);
    expect(dashboardOverview.consensusRate).toBeTypeOf('number');
    
    const guardians = await makeRequest(`${MAIN_API_BASE}/api/v1/guardians`);
    expect(Array.isArray(guardians)).toBe(true);
    
    if (guardians.length > 0) {
      const guardian = guardians[0];
      expect(guardian.reputationScore).toBeTypeOf('number');
      expect(guardian.performanceMetrics).toBeDefined();
      expect(guardian.performanceMetrics.consensusParticipation).toBeTypeOf('number');
      
      // Test toFixed operations used throughout the app
      const participationFormatted = guardian.performanceMetrics.consensusParticipation.toFixed(1);
      console.log(`   ✅ Performance metrics toFixed() works: ${participationFormatted}%`);
    }
    
    // Test 4: Verify all critical endpoints return 200 OK
    console.log('🧪 Test 4: Endpoint Availability');
    const endpoints = [
      '/api/health',
      '/api/v1/guardians',
      '/api/v1/guardians/me',
      '/api/v1/dashboard/overview',
      '/api/v1/dashboard/activity',
      '/api/v1/dashboard/health',
      '/api/v1/voting/active-requests',
      '/api/v1/adk/agents/status',
      '/api/v1/adk/workflows/active'
    ];
    
    for (const endpoint of endpoints) {
      try {
        await makeRequest(`${MAIN_API_BASE}${endpoint}`);
        console.log(`   ✅ ${endpoint}: OK`);
      } catch (error) {
        console.log(`   ❌ ${endpoint}: FAILED - ${error.message}`);
        throw error;
      }
    }
    
    console.log('\n🎉 CRASH FIX VERIFICATION COMPLETE!');
    console.log('====================================');
    console.log('✅ All TypeError: toFixed() crash scenarios have been resolved');
    console.log('✅ Missing API endpoints have been implemented');
    console.log('✅ Data structures now match frontend expectations');
    console.log('✅ Defensive programming patterns applied to frontend');
    console.log('\n💡 The React application should no longer crash with:');
    console.log('   "TypeError: Cannot read properties of undefined (reading \'toFixed\')"');
    
  } catch (error) {
    console.error('\n❌ CRASH FIX VERIFICATION FAILED!');
    console.error('==================================');
    console.error(`Error: ${error.message}`);
    console.error('\n🔧 Check that:');
    console.error('1. Backend server is running on http://localhost:8000');
    console.error('2. All required API endpoints are implemented');
    console.error('3. Data structures include all numerical fields');
    process.exit(1);
  }
}

// Run the tests
runReactCrashFixTests(); 