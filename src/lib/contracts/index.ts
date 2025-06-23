import SeDeFrameworkABI from './SeDeFramework.abi.json'
import FraudSentinelABI from './FraudSentinel.abi.json'
import PrivacyPoolABI from './PrivacyPool.abi.json'
import EIP7702DelegateABI from './EIP7702Delegate.abi.json'

// Import deployment addresses
import localhostDeployment from './deployments/localhost.json'
import sepoliaDeployment from './deployments/sepolia.json'

export const contractAddresses = {
  localhost: {
    SeDeFramework: localhostDeployment.SeDeFramework as `0x${string}`,
    FraudSentinel: localhostDeployment.FraudSentinel as `0x${string}`,
    PrivacyPool: localhostDeployment.PrivacyPool as `0x${string}`,
    EIP7702Delegate: localhostDeployment.EIP7702Delegate as `0x${string}`,
  },
  sepolia: {
    SeDeFramework: sepoliaDeployment.SeDeFramework as `0x${string}`,
    FraudSentinel: sepoliaDeployment.FraudSentinel as `0x${string}`,
    PrivacyPool: sepoliaDeployment.PrivacyPool as `0x${string}`,
    EIP7702Delegate: sepoliaDeployment.EIP7702Delegate as `0x${string}`,
  }
}

export const contracts = {
  SeDeFramework: {
    abi: SeDeFrameworkABI.abi || SeDeFrameworkABI,
    addresses: {
      31337: contractAddresses.localhost.SeDeFramework,
      11155111: contractAddresses.sepolia.SeDeFramework,
    }
  },
  FraudSentinel: {
    abi: FraudSentinelABI.abi || FraudSentinelABI,
    addresses: {
      31337: contractAddresses.localhost.FraudSentinel,
      11155111: contractAddresses.sepolia.FraudSentinel,
    }
  },
  PrivacyPool: {
    abi: PrivacyPoolABI.abi || PrivacyPoolABI,
    addresses: {
      31337: contractAddresses.localhost.PrivacyPool,
      11155111: contractAddresses.sepolia.PrivacyPool,
    }
  },
  EIP7702Delegate: {
    abi: EIP7702DelegateABI.abi || EIP7702DelegateABI,
    addresses: {
      31337: contractAddresses.localhost.EIP7702Delegate,
      11155111: contractAddresses.sepolia.EIP7702Delegate,
    }
  },
} as const

export type ContractName = keyof typeof contracts