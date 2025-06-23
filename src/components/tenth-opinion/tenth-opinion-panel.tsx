"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity,
  Eye,
  Gavel,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { tenthOpinionApi } from "@/lib/api-client";
import { 
  TenthOpinionRequest, 
  TenthOpinionResponse, 
  TenthOpinionStatus,
  TenthOpinionMetrics 
} from "@/lib/types";

interface TenthOpinionPanelProps {
  transactionData?: {
    id: string;
    amount: number;
    riskScore: number;
    type?: string;
    jurisdiction?: string;
    entities?: Array<{ id: string; sanctions_hit?: boolean }>;
  };
  onDecision?: (decision: TenthOpinionResponse) => void;
}

export function TenthOpinionPanel({ transactionData, onDecision }: TenthOpinionPanelProps) {
  const [status, setStatus] = useState<TenthOpinionStatus | null>(null);
  const [metrics, setMetrics] = useState<TenthOpinionMetrics | null>(null);
  const [evaluation, setEvaluation] = useState<TenthOpinionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseAgents, setPhaseAgents] = useState<string[]>([]);

  // Load status and metrics on mount
  useEffect(() => {
    loadStatus();
    loadMetrics();
    
    // Auto-refresh status every 10 seconds
    const interval = setInterval(loadStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const response = await tenthOpinionApi.getStatus();
      if (response.success && response.data) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error("Failed to load Tenth Opinion status:", error);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await tenthOpinionApi.getMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error("Failed to load Tenth Opinion metrics:", error);
    }
  };

  const triggerEvaluation = async () => {
    if (!transactionData) {
      toast.error("No transaction data provided");
      return;
    }

    setLoading(true);
    setCurrentPhase(0);
    setEvaluation(null);

    try {
      const request: TenthOpinionRequest = {
        transactionId: transactionData.id,
        amount: transactionData.amount,
        riskScore: transactionData.riskScore,
        transactionType: transactionData.type,
        jurisdiction: transactionData.jurisdiction,
        entities: transactionData.entities
      };

      // Simulate phase progression
      const phaseNames = [
        { phase: 1, agents: ["First", "Second", "Third", "Fourth"] },
        { phase: 2, agents: ["Fifth", "Sixth", "Seventh"] },
        { phase: 3, agents: ["Eighth", "Ninth"] },
        { phase: 4, agents: ["Tenth"] }
      ];

      for (let i = 0; i < phaseNames.length; i++) {
        setCurrentPhase(i + 1);
        setPhaseAgents(phaseNames[i].agents);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      }

      const response = await tenthOpinionApi.evaluate(request);
      
      if (response.success && response.data) {
        setEvaluation(response.data);
        toast.success("Tenth Opinion evaluation completed");
        
        if (onDecision) {
          onDecision(response.data);
        }
      } else {
        toast.error(response.error || "Evaluation failed");
      }
    } catch (error) {
      console.error("Failed to evaluate:", error);
      toast.error("Failed to trigger Tenth Opinion evaluation");
    } finally {
      setLoading(false);
      setCurrentPhase(0);
      setPhaseAgents([]);
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "approve": return "text-green-600 bg-green-100";
      case "deny": return "text-red-600 bg-red-100";
      case "investigate": return "text-yellow-600 bg-yellow-100";
      case "escalate": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-orange-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const shouldAutoTrigger = transactionData && 
    (transactionData.riskScore > 0.7 || transactionData.amount > 75000);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <CardTitle>Tenth Opinion Protocol</CardTitle>
          </div>
          {status && (
            <Badge variant={status.online ? "default" : "destructive"}>
              {status.online ? "Online" : "Offline"} • {status.agents_ready} agents
            </Badge>
          )}
        </div>
        <CardDescription>
          Advanced 10-agent consensus system for high-stakes compliance decisions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Alert */}
        {shouldAutoTrigger && !evaluation && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>High-Risk Transaction Detected</AlertTitle>
            <AlertDescription>
              This transaction meets the criteria for Tenth Opinion evaluation 
              (Risk Score: {transactionData.riskScore.toFixed(2)}, Amount: €{transactionData.amount.toLocaleString()})
            </AlertDescription>
          </Alert>
        )}

        {/* Evaluation Trigger */}
        {!evaluation && !loading && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Trigger Tenth Opinion Evaluation</p>
              <p className="text-sm text-muted-foreground">
                Activate for transactions &gt; €75,000 or risk score &gt; 0.7
              </p>
            </div>
            <Button 
              onClick={triggerEvaluation} 
              disabled={!status?.online || loading}
              variant={shouldAutoTrigger ? "default" : "outline"}
            >
              <Brain className="h-4 w-4 mr-2" />
              Evaluate
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">
                Phase {currentPhase} of 4: {phaseAgents.join(", ")} agents analyzing...
              </span>
            </div>
            <Progress value={currentPhase * 25} className="w-full" />
          </div>
        )}

        {/* Evaluation Results */}
        {evaluation && (
          <Tabs defaultValue="decision" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="decision">Decision</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="decision" className="space-y-4">
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Final Decision</span>
                  <Badge className={getDecisionColor(evaluation.decision.final_decision)}>
                    {evaluation.decision.final_decision.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Level</span>
                  <span className={`font-medium ${getRiskColor(evaluation.decision.risk_level)}`}>
                    {evaluation.decision.risk_level.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consensus Confidence</span>
                  <span className="font-medium">
                    {(evaluation.decision.consensus_confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-1">Required Action</p>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.decision.action_required}
                  </p>
                </div>
              </div>

              {/* Quality Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Reliability Score</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {(evaluation.decision.quality_metrics.reliability_score * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Objectivity Score</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {(evaluation.decision.quality_metrics.objectivity_score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {evaluation.decision.regulatory_concerns && evaluation.decision.regulatory_concerns.length > 0 && (
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Regulatory Concerns</span>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {evaluation.decision.regulatory_concerns.map((concern, i) => (
                      <li key={i} className="text-muted-foreground">{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.decision.dissenting_opinions && evaluation.decision.dissenting_opinions.length > 0 && (
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Dissenting Opinions</span>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {evaluation.decision.dissenting_opinions.map((opinion, i) => (
                      <li key={i} className="text-muted-foreground">{opinion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <div className="space-y-3">
                {evaluation.audit_trail.map((phase, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{phase.phase}</span>
                      <span className="text-sm text-muted-foreground">
                        {phase.duration.toFixed(2)}s
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {phase.agents.join(", ")}
                    </div>
                  </div>
                ))}
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Execution Time</span>
                    <span className="font-medium">{evaluation.execution_time.toFixed(2)}s</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* System Metrics */}
        {metrics && !loading && !evaluation && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">System Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Evaluations:</span>
                <span className="ml-2 font-medium">{metrics.total_evaluations}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Time:</span>
                <span className="ml-2 font-medium">{metrics.average_execution_time.toFixed(2)}s</span>
              </div>
              <div>
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="ml-2 font-medium">
                  {(metrics.consensus_success_rate * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="ml-2 font-medium">
                  {(metrics.quality_scores.accuracy * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}