![GuardianOS](public/home.png)

# GuardianOS

Multi-agent compliance monitoring dashboard for privacy-preserving blockchain payments. Frontend for the Google ADK Hackathon submission.

## Related Repositories

- **PrivacyGuard Backend**: [guardianos-adk/adk](https://github.com/guardianos-adk/adk) - ADK agent orchestration
- **Fraud Monitoring**: [guardianos-adk/monitor](https://github.com/guardianos-adk/monitor) - ML fraud detection service
- **Smart Contracts**: [guardianos-adk/contracts](https://github.com/guardianos-adk/contracts) - Solidity contracts on Sepolia

## Live Deployment

- **Main API**: https://guardianos-api-753766936932.us-central1.run.app
- **Fraud API**: https://fraud-sentinel-api-753766936932.us-central1.run.app

## System Overview

GuardianOS implements selective disclosure for blockchain transactions using Google ADK agents. The system routes transactions based on risk assessment:

- **Low Risk (<0.4)**: Auto-approved
- **Medium Risk (0.4-0.7)**: Standard agent workflow
- **High Risk (>0.7 or >€75k)**: Tenth Opinion Protocol

## Key Features

### 1. Multi-Agent Compliance System

The backend implements multiple AI agents coordinated by Google ADK:

**Standard Agent Workflow:**
- Transaction monitoring and validation
- Risk assessment with ML models  
- Guardian council voting (3-of-5 threshold)
- Selective de-anonymization when required
- Compliance logging and audit trails

**Tenth Opinion Protocol:**
- 10+ specialized agents across 4 phases
- Parallel and sequential execution patterns
- Bias detection and quality assurance
- Used for high-risk or high-value transactions

### 2. Dashboard Pages

Implemented pages found in `src/app/dashboard/`:
- `/` - System overview with real-time metrics
- `/agents` - AI agent status monitoring
- `/compliance` - Regulatory compliance tracking
- `/tenth-opinion` - High-stakes decision protocol
- `/tenth-opinion-analytics` - Protocol performance analytics
- `/blockchain` - Smart contract interactions

### 3. Real-time Features

- WebSocket connections via Socket.IO
- Auto-refresh every 30 seconds (verified in code)
- Connection status indicators
- Toast notifications for errors

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Wagmi + Viem
- **Real-time**: Socket.IO
- **Package Manager**: Bun

## Setup

1. **Clone and install:**
```bash
git clone https://github.com/guardianos-adk/nextjs.git
cd nextjs
bun install
```

2. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your API endpoints
```

3. **Run development:**
```bash
bun dev
```

## Environment Variables

```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://guardianos-api-753766936932.us-central1.run.app
NEXT_PUBLIC_WEBSOCKET_URL=https://guardianos-api-753766936932.us-central1.run.app
NEXT_PUBLIC_FRAUD_API_URL=https://fraud-sentinel-api-753766936932.us-central1.run.app

# Blockchain
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## Smart Contract Integration

Deployed on Sepolia testnet:
- SeDeFramework: `0x4fc7714aAC94a83D829CE4Cd30f68075b594e11B`
- FraudSentinel: `0xFf0f28F105AB1df22667a4beE6f26b09c42680aa`
- PrivacyPool: `0x392469a668399A3c95293125D95588A1Bc8c8078`

## Testing

```bash
bun test
bun lint
bun type-check
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t guardianos-frontend .
docker run -p 3000:3000 guardianos-frontend
```

## License

Apache License 2.0