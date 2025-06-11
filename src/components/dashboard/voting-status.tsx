"use client";

import { motion } from "framer-motion";
import { useVoting } from "@/hooks/use-guardian";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle,
  Eye,
  Gavel
} from "lucide-react";
import { useState, DragEvent } from "react";
import { DeAnonymizationRequest, VoteDecision } from "@/lib/types";
import { useCurrentTime } from "@/hooks/use-client-only";

interface VotingColumnProps {
  title: string;
  requests: DeAnonymizationRequest[];
  headingColor: string;
  onVote?: (requestId: string, decision: VoteDecision) => void;
  onViewDetails?: (requestId: string) => void;
}

interface VotingCardProps {
  request: DeAnonymizationRequest;
  onVote?: (requestId: string, decision: VoteDecision) => void;
  onViewDetails?: (requestId: string) => void;
  handleDragStart?: (e: any, request: DeAnonymizationRequest) => void;
}

function VotingCard({ request, onVote, onViewDetails, handleDragStart }: VotingCardProps) {
  const currentTime = useCurrentTime();
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "border-l-red-500 bg-red-500/5";
      case "high": return "border-l-orange-500 bg-orange-500/5";
      case "medium": return "border-l-yellow-500 bg-yellow-500/5";
      case "low": return "border-l-green-500 bg-green-500/5";
      default: return "border-l-gray-500 bg-gray-500/5";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      critical: "destructive",
      high: "secondary",
      medium: "outline",
      low: "default"
    } as const;
    
    return variants[urgency as keyof typeof variants] || "secondary";
  };

  const timeLeft = currentTime 
    ? new Date(request.deadline).getTime() - currentTime.getTime()
    : 0;
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const consensusReached = request.consensusProgress >= 100;

  return (
    <motion.div
      layout
      layoutId={request.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      draggable="true"
      onDragStart={(e) => handleDragStart?.(e, request)}
      className={`cursor-grab active:cursor-grabbing rounded-lg border-l-4 bg-card border p-4 space-y-3 ${getUrgencyColor(request.urgencyLevel)} transition-all duration-200 hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium line-clamp-2">{request.complianceReason}</p>
          <p className="text-xs text-muted-foreground">
            {request.blockchainNetwork} • {request.transactionHash.slice(0, 8)}...
          </p>
        </div>
        <Badge variant={getUrgencyBadge(request.urgencyLevel)} className="text-xs">
          {request.urgencyLevel}
        </Badge>
      </div>

      {/* Consensus Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Consensus Progress</span>
          <span className="font-medium">{request.consensusProgress.toFixed(0)}%</span>
        </div>
        <Progress value={request.consensusProgress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{request.currentVotes?.length || 0} votes</span>
          <span>{hoursLeft}h remaining</span>
        </div>
      </div>

      {/* Voting Actions */}
      {request.status === "voting" && !consensusReached && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-emerald-600 border-emerald-600 hover:bg-emerald-50"
            onClick={() => onVote?.(request.id, "APPROVE")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => onVote?.(request.id, "DENY")}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Deny
          </Button>
        </div>
      )}

      {/* Details Button */}
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-xs"
        onClick={() => onViewDetails?.(request.id)}
      >
        <Eye className="h-3 w-3 mr-1" />
        View Details
      </Button>

      {/* Status Indicators */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{request.consensusThreshold} guardians required</span>
        </div>
        {request.privacyImpactAssessment.riskLevel && (
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span className={
              request.privacyImpactAssessment.riskLevel === "high" 
                ? "text-red-500" 
                : request.privacyImpactAssessment.riskLevel === "medium"
                ? "text-amber-500"
                : "text-green-500"
            }>
              {request.privacyImpactAssessment.riskLevel} risk
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function VotingColumn({ title, requests, headingColor, onVote, onViewDetails }: VotingColumnProps) {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: any, request: DeAnonymizationRequest) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData("requestId", request.id);
    }
  };

  const handleDragEnd = () => {
    setActive(false);
    // Handle drag end logic here
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  return (
    <div className="w-full min-w-[320px] shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <Badge variant="outline" className="text-xs">
          {requests.length}
        </Badge>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`min-h-[400px] w-full rounded-lg border-2 border-dashed transition-colors p-4 space-y-3 ${
          active ? "border-primary bg-primary/5" : "border-transparent bg-muted/20"
        }`}
      >
        {requests.map((request) => (
          <VotingCard
            key={request.id}
            request={request}
            onVote={onVote}
            onViewDetails={onViewDetails}
            handleDragStart={handleDragStart}
          />
        ))}
        {requests.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Gavel className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No requests</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function VotingStatusBoard() {
  const { activeRequests, requestsLoading } = useVoting();

  // Mock data for demonstration - using fixed base time to prevent hydration issues
  const baseTime = new Date('2024-06-11T12:00:00Z');
  const mockRequests: DeAnonymizationRequest[] = [
    {
      id: "req-1",
      requestingGuardianId: "guardian-ecb",
      transactionHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      blockchainNetwork: "ethereum",
      evidenceHash: "0xabcdef1234567890",
      complianceReason: "Suspected money laundering activity - unusual transaction patterns detected",
      urgencyLevel: "high",
      consensusThreshold: 3,
      privacyImpactAssessment: {
        affectedParties: 2,
        dataTypes: ["transaction_amount", "wallet_addresses"],
        retentionPeriod: "30 days",
        disclosureScope: "minimal",
        riskLevel: "medium",
        mitigationMeasures: ["data_minimization", "access_logging"]
      },
      deadline: new Date(baseTime.getTime() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      status: "voting",
      createdAt: new Date(baseTime.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      currentVotes: [],
      consensusProgress: 33.3
    },
    {
      id: "req-2",
      requestingGuardianId: "guardian-dnb",
      transactionHash: "0x9876543210fedcba0987654321fedcba09876543",
      blockchainNetwork: "polygon",
      evidenceHash: "0x9876543210fedcba",
      complianceReason: "Cross-border payment investigation - FATF Travel Rule compliance",
      urgencyLevel: "medium",
      consensusThreshold: 3,
      privacyImpactAssessment: {
        affectedParties: 5,
        dataTypes: ["wallet_addresses", "transaction_timing"],
        retentionPeriod: "90 days",
        disclosureScope: "partial",
        riskLevel: "low",
        mitigationMeasures: ["anonymization", "time_limited_access"]
      },
      deadline: new Date(baseTime.getTime() + 1000 * 60 * 60 * 48).toISOString(), // 48 hours
      status: "pending",
      createdAt: new Date(baseTime.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      currentVotes: [],
      consensusProgress: 0
    },
    {
      id: "req-3",
      requestingGuardianId: "guardian-bafin",
      transactionHash: "0xfedcba0987654321fedcba0987654321fedcba09",
      blockchainNetwork: "ethereum",
      evidenceHash: "0xfedcba0987654321",
      complianceReason: "Terrorism financing investigation - urgent regulatory inquiry",
      urgencyLevel: "critical",
      consensusThreshold: 3,
      privacyImpactAssessment: {
        affectedParties: 1,
        dataTypes: ["full_transaction_details", "metadata"],
        retentionPeriod: "180 days",
        disclosureScope: "full",
        riskLevel: "high",
        mitigationMeasures: ["enhanced_security", "audit_trail"]
      },
      deadline: new Date(baseTime.getTime() + 1000 * 60 * 60 * 6).toISOString(), // 6 hours
      status: "voting",
      createdAt: new Date(baseTime.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      currentVotes: [],
      consensusProgress: 66.7
    }
  ];

  const requests = activeRequests.length > 0 ? activeRequests : mockRequests;

  const handleVote = (requestId: string, decision: VoteDecision) => {
    console.log(`Voting ${decision} on request ${requestId}`);
    // For now, just log the vote. In real implementation, this would trigger a modal
    // or navigation to a detailed voting page
  };

  const handleViewDetails = (requestId: string) => {
    console.log(`Viewing details for request ${requestId}`);
    // Navigate to detailed view
  };

  if (requestsLoading) {
    return (
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Guardian Voting Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-80 space-y-3">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="h-32 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group requests by status
  const pendingRequests = requests.filter(r => r.status === "pending");
  const votingRequests = requests.filter(r => r.status === "voting");
  const completedRequests = requests.filter(r => r.status === "consensus_reached" || r.status === "approved" || r.status === "denied");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Guardian Voting Board
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {requests.length} active requests
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <VotingColumn
              title="Pending Review"
              requests={pendingRequests}
              headingColor="text-amber-500"
              onVote={handleVote}
              onViewDetails={handleViewDetails}
            />
            
            <VotingColumn
              title="Active Voting"
              requests={votingRequests}
              headingColor="text-blue-500"
              onVote={handleVote}
              onViewDetails={handleViewDetails}
            />
            
            <VotingColumn
              title="Consensus Reached"
              requests={completedRequests}
              headingColor="text-emerald-500"
              onViewDetails={handleViewDetails}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
