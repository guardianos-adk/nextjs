const fetch = require('node-fetch');

async function testTenthOpinionIntegration() {
  console.log('🧪 Testing Tenth Opinion Frontend Integration\n');

  const endpoints = [
    {
      name: 'Tenth Opinion Status',
      url: 'http://localhost:8000/api/v1/adk/tenth-opinion/status',
      method: 'GET'
    },
    {
      name: 'Tenth Opinion Metrics',
      url: 'http://localhost:8000/api/v1/adk/tenth-opinion/metrics',
      method: 'GET'
    },
    {
      name: 'Tenth Opinion Evaluate',
      url: 'http://localhost:8000/api/v1/adk/tenth-opinion/evaluate',
      method: 'POST',
      body: {
        transactionId: 'tx_test_12345',
        amount: 100000,
        riskScore: 0.8,
        transactionType: 'cross-border',
        jurisdiction: 'CYPRUS',
        entities: [{ id: 'entity1', sanctions_hit: true }]
      }
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`📍 Testing: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);
    console.log(`   Method: ${endpoint.method}`);
    
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(endpoint.url, options);
      const status = response.status;
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Status: ${status}`);
        console.log(`   📊 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...\n');
      } else {
        console.log(`   ❌ Status: ${status}`);
        const text = await response.text();
        console.log(`   ⚠️  Error: ${text.substring(0, 100)}...\n`);
      }
    } catch (error) {
      console.log(`   ❌ Connection Error: ${error.message}`);
      console.log(`   💡 Ensure backend is running on port 8000\n`);
    }
  }

  console.log('\n📝 Frontend Integration Points:');
  console.log('1. Type definitions added to: src/lib/types.ts');
  console.log('2. API methods added to: src/lib/api-client.ts');
  console.log('3. Tenth Opinion page at: /dashboard/tenth-opinion');
  console.log('4. Integration in Compliance page: High Risk Analysis tab');
  console.log('5. Component: src/components/tenth-opinion/tenth-opinion-panel.tsx');
  
  console.log('\n🚀 To test in browser:');
  console.log('1. Start backend: cd app && poetry run python -m privacyguard.main');
  console.log('2. Start frontend: cd guardianos && bun dev');
  console.log('3. Navigate to: http://localhost:3000/dashboard/tenth-opinion');
  console.log('4. Or go to Compliance -> High Risk Analysis tab');
}

// Run the test
testTenthOpinionIntegration().catch(console.error);