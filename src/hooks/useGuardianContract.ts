"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { contracts } from '@/lib/contracts';
import { toast } from 'sonner';

export function useSeDeFramework() {
  const contract = contracts.SeDeFramework;
  const chainId = useChainId();
  const contractAddress = contract.addresses[chainId as keyof typeof contract.addresses];

  // Read functions
  const { data: totalGuardians } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'totalGuardians',
  });

  const { data: consensusThreshold } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'consensusThreshold',
  });

  const { data: requestCounter } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'requestCounter',
  });

  // Write functions
  const { 
    writeContract: submitRequest,
    data: submitRequestHash,
    isPending: isSubmittingRequest,
    error: submitRequestError
  } = useWriteContract();

  const { 
    writeContract: castVote,
    data: castVoteHash,
    isPending: isCastingVote,
    error: castVoteError
  } = useWriteContract();

  // Wait for transaction receipts
  const { isLoading: isSubmitRequestLoading, isSuccess: isSubmitRequestSuccess } = 
    useWaitForTransactionReceipt({ hash: submitRequestHash });

  const { isLoading: isCastVoteLoading, isSuccess: isCastVoteSuccess } = 
    useWaitForTransactionReceipt({ hash: castVoteHash });

  // Helper functions
  const submitDeAnonymizationRequest = async (
    targetAddress: string,
    reason: string,
    evidenceHash: `0x${string}`
  ) => {
    try {
      await submitRequest({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'submitRequest',
        args: [targetAddress, reason, evidenceHash],
      });
      toast.success('De-anonymization request submitted');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request');
    }
  };

  const voteOnRequest = async (requestId: bigint, approve: boolean) => {
    try {
      await castVote({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'castVote',
        args: [requestId, approve],
      });
      toast.success(`Vote ${approve ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error('Failed to cast vote:', error);
      toast.error('Failed to cast vote');
    }
  };

  const getRequestStatus = async (requestId: bigint) => {
    // This would need to be implemented with useReadContract hook
    // For now, returning null
    console.log('Getting request status for:', requestId);
    return null;
  };

  return {
    // Data
    totalGuardians,
    consensusThreshold,
    requestCounter,
    
    // Functions
    submitDeAnonymizationRequest,
    voteOnRequest,
    getRequestStatus,
    
    // States
    isSubmittingRequest: isSubmittingRequest || isSubmitRequestLoading,
    isCastingVote: isCastingVote || isCastVoteLoading,
    isSubmitRequestSuccess,
    isCastVoteSuccess,
    submitRequestError,
    castVoteError,
  };
}

export function useFraudSentinel() {
  const contract = contracts.FraudSentinel;
  const chainId = useChainId();
  const contractAddress = contract.addresses[chainId as keyof typeof contract.addresses];

  const { data: riskThreshold } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'riskThreshold',
  });

  const { data: alertCounter } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'alertCounter',
  });

  return {
    riskThreshold,
    alertCounter,
  };
}

export function usePrivacyPool() {
  const contract = contracts.PrivacyPool;
  const chainId = useChainId();
  const contractAddress = contract.addresses[chainId as keyof typeof contract.addresses];

  const { data: denominationAmount } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'denominationAmount',
  });

  const { data: commitmentCount } = useReadContract({
    address: contractAddress,
    abi: contract.abi,
    functionName: 'getCommitmentCount',
  });

  const { 
    writeContract: deposit,
    data: depositHash,
    isPending: isDepositing,
  } = useWriteContract();

  const depositToPool = async (commitment: `0x${string}`) => {
    try {
      await deposit({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'deposit',
        args: [commitment],
        value: BigInt(1e18), // 1 ETH
      });
      toast.success('Deposit successful');
    } catch (error) {
      console.error('Failed to deposit:', error);
      toast.error('Failed to deposit');
    }
  };

  return {
    denominationAmount,
    commitmentCount,
    depositToPool,
    isDepositing,
  };
}