#!/usr/bin/env bun
/**
 * Comprehensive test suite for ANKR Blockchain Engine
 * Tests real ANKR API integration and blockchain data fetching
 */

import { ankrEngine } from './src/lib/ankr-client';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  data?: any;
  error?: string;
}

class ANKRIntegrationTest {
  private results: TestResult[] = [];
  
  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Starting ANKR Blockchain Engine Test Suite');
    console.log('=' .repeat(60));
    
    // Test API key and configuration
    await this.testConfiguration();
    
    // Test basic transaction fetching
    await this.testTransactionFetching();
    
    // Test multi-chain support
    await this.testMultiChainSupport();
    
    // Test address transaction history
    await this.testAddressTransactions();
    
    // Test risk analysis
    await this.testRiskAnalysis();
    
    // Test performance benchmarks
    await this.testPerformance();
    
    // Generate summary report
    this.generateSummaryReport();
    
    return this.results;
  }
  
  private async testConfiguration(): Promise<void> {
    console.log('\n🔧 Testing ANKR Configuration');
    console.log('-'.repeat(40));
    
    const startTime = Date.now();
    
    try {
      // Check if API key is configured
      const apiKey = process.env.ANKR_API_KEY;
      
      if (!apiKey) {
        throw new Error('ANKR_API_KEY environment variable not set');
      }
      
      console.log('✅ API Key configured');
      
      // Test basic connectivity to ANKR
      const testUrl = `https://rpc.ankr.com/eth/${apiKey}`;
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`ANKR API Error: ${data.error.message}`);
      }
      
      const blockNumber = parseInt(data.result, 16);
      console.log(`✅ ANKR connectivity verified - Latest block: ${blockNumber}`);
      
      this.results.push({
        name: 'Configuration',
        success: true,
        duration: Date.now() - startTime,
        data: { blockNumber, apiKeyConfigured: true }
      });
      
    } catch (error) {
      console.log(`❌ Configuration failed: ${error.message}`);
      
      this.results.push({
        name: 'Configuration',
        success: false,
        duration: Date.now() - startTime,
        error: error.message
      });
    }
  }
  
  private async testTransactionFetching(): Promise<void> {
    console.log('\n📡 Testing Transaction Fetching');
    console.log('-'.repeat(40));
    
    // Test with known Ethereum transactions
    const testTransactions = [
      {
        hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
        blockchain: 'ethereum',
        description: 'Historic transaction'
      }
    ];
    
    for (const testTx of testTransactions) {
      const startTime = Date.now();
      
      try {
        console.log(`Testing ${testTx.description}: ${testTx.hash.substring(0, 10)}...`);
        
        const txDetails = await ankrEngine.getTransactionDetails(testTx.hash, testTx.blockchain);
        
        // Validate transaction details
        if (!txDetails.hash || !txDetails.from || !txDetails.blockchain) {
          throw new Error('Incomplete transaction data returned');
        }
        
        console.log(`  ✅ From: ${txDetails.from.substring(0, 8)}...`);
        console.log(`  ✅ To: ${txDetails.to.substring(0, 8)}...`);
        console.log(`  ✅ Value: ${(parseInt(txDetails.value, 16) / 1e18).toFixed(4)} ETH`);
        console.log(`  ✅ Block: ${txDetails.blockNumber}`);
        console.log(`  ✅ Status: ${txDetails.status}`);
        console.log(`  ✅ Risk indicators: ${txDetails.riskIndicators?.length || 0}`);
        
        this.results.push({
          name: `Transaction Fetching (${testTx.blockchain})`,
          success: true,
          duration: Date.now() - startTime,
          data: {
            hash: txDetails.hash,
            from: txDetails.from,
            to: txDetails.to,
            value: txDetails.value,
            riskIndicators: txDetails.riskIndicators?.length || 0
          }
        });
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        
        this.results.push({
          name: `Transaction Fetching (${testTx.blockchain})`,
          success: false,
          duration: Date.now() - startTime,
          error: error.message
        });
      }
    }
  }
  
  private async testMultiChainSupport(): Promise<void> {
    console.log('\n🌐 Testing Multi-Chain Support');
    console.log('-'.repeat(40));
    
    const chains = ['ethereum', 'polygon', 'arbitrum', 'optimism', 'bsc'];
    
    for (const chain of chains) {
      const startTime = Date.now();
      
      try {
        console.log(`Testing ${chain} connectivity...`);
        
        // Test basic RPC call to get latest block
        const apiKey = process.env.ANKR_API_KEY;
        const endpoint = `https://rpc.ankr.com/${chain}/${apiKey}`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Chain ${chain}: ${data.error.message}`);
        }
        
        const blockNumber = parseInt(data.result, 16);
        console.log(`  ✅ ${chain}: Block ${blockNumber}`);
        
        this.results.push({
          name: `Multi-Chain (${chain})`,
          success: true,
          duration: Date.now() - startTime,
          data: { chain, blockNumber }
        });
        
      } catch (error) {
        console.log(`  ❌ ${chain}: ${error.message}`);
        
        this.results.push({
          name: `Multi-Chain (${chain})`,
          success: false,
          duration: Date.now() - startTime,
          error: error.message
        });
      }
    }
  }
  
  private async testAddressTransactions(): Promise<void> {
    console.log('\n📚 Testing Address Transaction History');
    console.log('-'.repeat(40));
    
    // Test with a well-known address (Ethereum Foundation)
    const testAddress = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe';
    const blockchain = 'ethereum';
    
    const startTime = Date.now();
    
    try {
      console.log(`Testing address transactions for: ${testAddress.substring(0, 10)}...`);
      
      const transactions = await ankrEngine.getAddressTransactions(testAddress, blockchain, 10);
      
      console.log(`  ✅ Found ${transactions.length} transactions`);
      
      if (transactions.length > 0) {
        const firstTx = transactions[0];
        console.log(`  ✅ Sample tx: ${firstTx.hash.substring(0, 10)}...`);
        console.log(`  ✅ Block: ${firstTx.blockNumber}`);
        console.log(`  ✅ Value: ${(parseInt(firstTx.value || '0', 16) / 1e18).toFixed(4)} ETH`);
      }
      
      this.results.push({
        name: 'Address Transactions',
        success: true,
        duration: Date.now() - startTime,
        data: {
          address: testAddress,
          transactionCount: transactions.length,
          sampleTx: transactions[0]?.hash
        }
      });
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      
      this.results.push({
        name: 'Address Transactions',
        success: false,
        duration: Date.now() - startTime,
        error: error.message
      });
    }
  }
  
  private async testRiskAnalysis(): Promise<void> {
    console.log('\n🔍 Testing Risk Analysis');
    console.log('-'.repeat(40));
    
    const startTime = Date.now();
    
    try {
      // Test address clustering (simplified for demo)
      const testAddress = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe';
      const blockchain = 'ethereum';
      
      console.log(`Testing address clustering for: ${testAddress.substring(0, 10)}...`);
      
      const cluster = await ankrEngine.buildAddressCluster(testAddress, blockchain, 1); // Depth 1 for testing
      
      console.log(`  ✅ Cluster size: ${cluster.clusterSize} addresses`);
      console.log(`  ✅ Connections: ${cluster.connections.length}`);
      console.log(`  ✅ Risk score: ${cluster.riskScore.toFixed(3)}`);
      
      this.results.push({
        name: 'Risk Analysis',
        success: true,
        duration: Date.now() - startTime,
        data: {
          clusterSize: cluster.clusterSize,
          connections: cluster.connections.length,
          riskScore: cluster.riskScore
        }
      });
      
    } catch (error) {
      console.log(`  ❌ Risk analysis failed: ${error.message}`);
      
      this.results.push({
        name: 'Risk Analysis',
        success: false,
        duration: Date.now() - startTime,
        error: error.message
      });
    }
  }
  
  private async testPerformance(): Promise<void> {
    console.log('\n⚡ Testing Performance Benchmarks');
    console.log('-'.repeat(40));
    
    const startTime = Date.now();
    
    try {
      // Test batch transaction fetching
      const testHashes = [
        '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
        '0x67df02c7c4b1d3d1b27f6b8b3f9a0b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'
      ];
      
      console.log(`Testing batch fetching of ${testHashes.length} transactions...`);
      
      const batchStartTime = Date.now();
      
      const batchPromises = testHashes.map(async (hash, index) => {
        try {
          const tx = await ankrEngine.getTransactionDetails(hash, 'ethereum');
          return { success: true, hash };
        } catch (error) {
          return { success: false, hash, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const batchDuration = Date.now() - batchStartTime;
      
      const successCount = batchResults.filter(r => r.success).length;
      const avgTime = batchDuration / testHashes.length;
      
      console.log(`  ✅ Batch results: ${successCount}/${testHashes.length} successful`);
      console.log(`  ✅ Average time per tx: ${avgTime.toFixed(1)}ms`);
      console.log(`  ✅ Total batch time: ${batchDuration}ms`);
      
      this.results.push({
        name: 'Performance',
        success: true,
        duration: Date.now() - startTime,
        data: {
          batchSize: testHashes.length,
          successCount,
          avgTimePerTx: avgTime,
          totalBatchTime: batchDuration
        }
      });
      
    } catch (error) {
      console.log(`  ❌ Performance test failed: ${error.message}`);
      
      this.results.push({
        name: 'Performance',
        success: false,
        duration: Date.now() - startTime,
        error: error.message
      });
    }
  }
  
  private generateSummaryReport(): void {
    console.log('\n📋 Test Summary Report');
    console.log('='.repeat(60));
    
    const successfulTests = this.results.filter(r => r.success);
    const failedTests = this.results.filter(r => !r.success);
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Successful: ${successfulTests.length} ✅`);
    console.log(`Failed: ${failedTests.length} ❌`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Success Rate: ${((successfulTests.length / this.results.length) * 100).toFixed(1)}%`);
    
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`);
      });
    }
    
    console.log('\n✅ Successful Tests:');
    successfulTests.forEach(test => {
      console.log(`  - ${test.name} (${test.duration}ms)`);
    });
    
    // Save detailed results
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        successful: successfulTests.length,
        failed: failedTests.length,
        totalDuration,
        successRate: (successfulTests.length / this.results.length) * 100
      },
      results: this.results
    };
    
    // Write to file
    Bun.write('ankr_test_results.json', JSON.stringify(reportData, null, 2));
    console.log('\n💾 Detailed results saved to ankr_test_results.json');
  }
}

async function main() {
  console.log('🔍 ANKR Blockchain Engine Integration Test');
  console.log('Testing real ANKR API connectivity and blockchain data...');
  console.log();
  
  // Check if API key is set
  if (!process.env.ANKR_API_KEY) {
    console.error('❌ ANKR_API_KEY environment variable not set');
    console.error('Please add ANKR_API_KEY to your environment variables');
    process.exit(1);
  }
  
  const testSuite = new ANKRIntegrationTest();
  
  try {
    const results = await testSuite.runAllTests();
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
      console.log('\n🎉 All tests passed! ANKR integration is working correctly.');
      process.exit(0);
    } else {
      console.log(`\n⚠️  ${totalCount - successCount} test(s) failed. Check the output above.`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (import.meta.main) {
  main();
} 