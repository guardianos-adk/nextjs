"use client";

import { ethers } from 'ethers';
import { contracts } from '@/lib/contracts';

// Contract ABIs
const SeDeFrameworkABI = contracts.SeDeFramework.abi;
const FraudSentinelABI = contracts.FraudSentinel.abi;
const PrivacyPoolABI = contracts.PrivacyPool.abi;

// Contract addresses per network
const CONTRACT_ADDRESSES = {
  sepolia: {
    SeDeFramework: contracts.SeDeFramework.addresses[11155111],
    FraudSentinel: contracts.FraudSentinel.addresses[11155111],
    PrivacyPool: contracts.PrivacyPool.addresses[11155111],
  },
  localhost: {
    SeDeFramework: contracts.SeDeFramework.addresses[31337],
    FraudSentinel: contracts.FraudSentinel.addresses[31337],
    PrivacyPool: contracts.PrivacyPool.addresses[31337],
  }
};

export class BlockchainService {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private network: 'sepolia' | 'localhost' = 'sepolia';
  
  // Contract instances
  private sedeContract: ethers.Contract | null = null;
  private fraudContract: ethers.Contract | null = null;
  private privacyPoolContract: ethers.Contract | null = null;

  async connect(network: 'sepolia' | 'localhost' = 'sepolia') {
    this.network = network;
    
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = await this.provider.getSigner();
      
      // Initialize contracts
      const addresses = CONTRACT_ADDRESSES[network];
      
      this.sedeContract = new ethers.Contract(
        addresses.SeDeFramework,
        SeDeFrameworkABI,
        this.signer
      );
      
      this.fraudContract = new ethers.Contract(
        addresses.FraudSentinel,
        FraudSentinelABI,
        this.signer
      );
      
      this.privacyPoolContract = new ethers.Contract(
        addresses.PrivacyPool,
        PrivacyPoolABI,
        this.signer
      );
      
      return true;
    }
    return false;
  }

  // SeDeFramework functions
  async submitDeAnonymizationRequest(
    targetAddress: string,
    reason: string,
    evidenceHash: string
  ): Promise<ethers.TransactionReceipt | null> {
    if (!this.sedeContract) throw new Error('Not connected');
    
    try {
      const tx = await this.sedeContract.submitRequest(
        targetAddress,
        reason,
        evidenceHash
      );
      return await tx.wait();
    } catch (error) {
      console.error('Failed to submit request:', error);
      throw error;
    }
  }

  async castVote(
    requestId: number,
    approve: boolean
  ): Promise<ethers.TransactionReceipt | null> {
    if (!this.sedeContract) throw new Error('Not connected');
    
    try {
      const tx = await this.sedeContract.castVote(requestId, approve);
      return await tx.wait();
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  }

  async getRequestStatus(requestId: number) {
    if (!this.sedeContract) throw new Error('Not connected');
    
    try {
      const result = await this.sedeContract.getRequestStatus(requestId);
      return {
        approvals: result[0],
        rejections: result[1],
        executed: result[2],
        approved: result[3],
        timeRemaining: result[4]
      };
    } catch (error) {
      console.error('Failed to get request status:', error);
      throw error;
    }
  }

  async getTotalGuardians(): Promise<number> {
    if (!this.sedeContract) throw new Error('Not connected');
    
    try {
      const total = await this.sedeContract.totalGuardians();
      return Number(total);
    } catch (error) {
      console.error('Failed to get total guardians:', error);
      throw error;
    }
  }

  async getConsensusThreshold(): Promise<number> {
    if (!this.sedeContract) throw new Error('Not connected');
    
    try {
      const threshold = await this.sedeContract.consensusThreshold();
      return Number(threshold);
    } catch (error) {
      console.error('Failed to get consensus threshold:', error);
      throw error;
    }
  }

  // FraudSentinel functions
  async flagTransaction(
    txHash: string,
    riskScore: number,
    reason: string
  ): Promise<ethers.TransactionReceipt | null> {
    if (!this.fraudContract) throw new Error('Not connected');
    
    try {
      const tx = await this.fraudContract.flagTransaction(
        txHash,
        riskScore,
        reason
      );
      return await tx.wait();
    } catch (error) {
      console.error('Failed to flag transaction:', error);
      throw error;
    }
  }

  async getRiskThreshold(): Promise<number> {
    if (!this.fraudContract) throw new Error('Not connected');
    
    try {
      const threshold = await this.fraudContract.riskThreshold();
      return Number(threshold);
    } catch (error) {
      console.error('Failed to get risk threshold:', error);
      throw error;
    }
  }

  // PrivacyPool functions
  async depositToPool(commitment: string): Promise<ethers.TransactionReceipt | null> {
    if (!this.privacyPoolContract) throw new Error('Not connected');
    
    try {
      const tx = await this.privacyPoolContract.deposit(commitment, {
        value: ethers.parseEther("1.0") // 1 ETH denomination
      });
      return await tx.wait();
    } catch (error) {
      console.error('Failed to deposit:', error);
      throw error;
    }
  }

  async withdrawFromPool(
    nullifier: string,
    recipient: string,
    merkleProof: string,
    associationRoot: string
  ): Promise<ethers.TransactionReceipt | null> {
    if (!this.privacyPoolContract) throw new Error('Not connected');
    
    try {
      const tx = await this.privacyPoolContract.withdraw(
        nullifier,
        recipient,
        merkleProof,
        associationRoot
      );
      return await tx.wait();
    } catch (error) {
      console.error('Failed to withdraw:', error);
      throw error;
    }
  }

  async getCommitmentCount(): Promise<number> {
    if (!this.privacyPoolContract) throw new Error('Not connected');
    
    try {
      const count = await this.privacyPoolContract.getCommitmentCount();
      return Number(count);
    } catch (error) {
      console.error('Failed to get commitment count:', error);
      throw error;
    }
  }

  // Event listeners
  listenForDeAnonymizationRequests(callback: (event: any) => void) {
    if (!this.sedeContract) throw new Error('Not connected');
    
    this.sedeContract.on("DeAnonymizationRequested", (requestId, requester, reason, event) => {
      callback({
        requestId: Number(requestId),
        requester,
        reason,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      });
    });
  }

  listenForVotes(callback: (event: any) => void) {
    if (!this.sedeContract) throw new Error('Not connected');
    
    this.sedeContract.on("VoteCast", (requestId, guardian, approve, event) => {
      callback({
        requestId: Number(requestId),
        guardian,
        approve,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      });
    });
  }

  listenForFraudAlerts(callback: (event: any) => void) {
    if (!this.fraudContract) throw new Error('Not connected');
    
    this.fraudContract.on("TransactionFlagged", (txHash, riskScore, reason, event) => {
      callback({
        txHash,
        riskScore: Number(riskScore),
        reason,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      });
    });
  }

  // Cleanup
  removeAllListeners() {
    this.sedeContract?.removeAllListeners();
    this.fraudContract?.removeAllListeners();
    this.privacyPoolContract?.removeAllListeners();
  }

  disconnect() {
    this.removeAllListeners();
    this.provider = null;
    this.signer = null;
    this.sedeContract = null;
    this.fraudContract = null;
    this.privacyPoolContract = null;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();