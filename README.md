# GuardianOS Dashboard

Multi-agent compliance monitoring dashboard for privacy-preserving blockchain payments. Frontend for the ADK Hackathon submission.

## Architecture

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Wagmi + Viem for Ethereum interactions
- **Real-time**: Socket.IO for live updates

## Setup

1. **Install dependencies**:
```bash
bun install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Edit .env.local with your API endpoints and keys
```

3. **Run development server**:
```bash
bun dev
```

## Environment Variables

Required variables in `.env.local`:

```env
# API Endpoints (deployed to Google Cloud Run)
NEXT_PUBLIC_API_BASE_URL=https://your-main-api.run.app
NEXT_PUBLIC_WEBSOCKET_URL=https://your-main-api.run.app
NEXT_PUBLIC_FRAUD_API_URL=https://your-fraud-api.run.app

# Blockchain
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## Key Features

- **Real-time Monitoring**: Live updates from 14+ AI agents
- **Guardian Voting**: Threshold consensus visualization
- **Tenth Opinion Protocol**: Multi-phase decision tracking
- **Fraud Detection**: ML-powered risk assessment
- **Blockchain Integration**: Smart contract interactions on Sepolia

## Pages

- `/` - Overview dashboard with system metrics
- `/guardian-council` - Guardian voting and consensus
- `/agents` - AI agent status and performance
- `/compliance` - Regulatory compliance monitoring
- `/transactions` - Transaction analysis and de-anonymization
- `/tenth-opinion` - Advanced multi-agent protocol
- `/fraud-monitoring` - FraudSentinel alerts
- `/settings` - System configuration

## Backend Integration

The frontend connects to two deployed APIs:

1. **Main API**: ADK agent orchestration, Guardian voting, blockchain integration
2. **Fraud API**: Real-time fraud detection and pattern analysis

Both APIs are deployed on Google Cloud Run with automatic scaling.

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

## Development

- Uses `bun` as package manager (do not use npm/yarn)
- All API calls use absolute URLs to deployed services
- WebSocket connections auto-reconnect on disconnect
- Mock mode available with `MOCK=true` for offline development

## Testing

```bash
bun test
bun lint
bun type-check
```

## Security

- No sensitive keys in repository
- API keys use `NEXT_PUBLIC_` prefix for client-side access
- CORS configured for production domains
- All blockchain interactions use secure RPC endpoints