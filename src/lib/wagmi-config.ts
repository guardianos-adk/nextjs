import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, optimism, localhost } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0a6a0b2f0c4b4e8e9f0b1c2d3e4f5a6b'

export const config = createConfig({
  chains: [localhost, mainnet, sepolia, polygon, arbitrum, optimism],
  connectors: [
    injected(),
    metaMask(),
    ...(typeof window !== 'undefined' ? [walletConnect({ 
      projectId: projectId,
      metadata: {
        name: 'GuardianOS',
        description: 'Multi-agent regulatory compliance orchestration system',
        url: window.location.origin,
        icons: ['https://guardianos.ai/icon.png']
      }
    })] : []),
    safe(),
  ],
  transports: {
    [localhost.id]: http('http://127.0.0.1:8545'),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL || `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
