"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { TenthOpinionPanel } from "@/components/tenth-opinion/tenth-opinion-panel";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Brain,
  Shield,
  Activity,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { tenthOpinionApi } from "@/lib/api-client";
import { TenthOpinionMetrics, TenthOpinionStatus, TenthOpinionResponse } from "@/lib/types";

interface RecentEvaluation {
  id: string;
  transactionId: string;
  amount: number;
  riskScore: number;
  decision: string;
  timestamp: string;
  executionTime: number;
}

export default function TenthOpinionPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<TenthOpinionStatus | null>(null);
  const [metrics, setMetrics] = useState<TenthOpinionMetrics | null>(null);
  const [recentEvaluations, setRecentEvaluations] = useState<RecentEvaluation[]>([]);
  
  // Manual evaluation form
  const [manualTxId, setManualTxId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualRiskScore, setManualRiskScore] = useState("");

  // Load data on mount
  useEffect(() => {
    loadAllData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load status
      const statusResponse = await tenthOpinionApi.getStatus();
      if (statusResponse.success && statusResponse.data) {
        setStatus(statusResponse.data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

      // Load metrics
      const metricsResponse = await tenthOpinionApi.getMetrics();
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      // TODO: Load recent evaluations from API when endpoint is available
      // For now, using mock data
      setRecentEvaluations([
        {
          id: "eval_001",
          transactionId: "tx_12345",
          amount: 125000,
          riskScore: 0.82,
          decision: "investigate",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          executionTime: 4.2
        },
        {
          id: "eval_002",
          transactionId: "tx_67890",
          amount: 85000,
          riskScore: 0.75,
          decision: "approve",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          executionTime: 3.8
        }
      ]);
    } catch (error) {
      console.error("Failed to load Tenth Opinion data:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleManualEvaluation = async () => {
    if (!manualTxId || !manualAmount || !manualRiskScore) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(manualAmount);
    const riskScore = parseFloat(manualRiskScore);

    if (isNaN(amount) || isNaN(riskScore)) {
      toast.error("Invalid amount or risk score");
      return;
    }

    if (riskScore < 0 || riskScore > 1) {
      toast.error("Risk score must be between 0 and 1");
      return;
    }

    // Will be handled by TenthOpinionPanel component
    toast.info("Evaluation will be triggered in the panel below");
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "approve": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "deny": return <XCircle className="h-4 w-4 text-red-600" />;
      case "investigate": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "escalate": return <AlertTriangle className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDecisionBadge = (decision: string) => {
    const colors = {
      approve: "text-green-600 bg-green-100",
      deny: "text-red-600 bg-red-100",
      investigate: "text-yellow-600 bg-yellow-100",
      escalate: "text-purple-600 bg-purple-100"
    };
    return colors[decision as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tenth Opinion Protocol</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Connection Status */}
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <><Wifi className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Tenth Opinion Protocol</h1>
                <p className="text-muted-foreground">
                  Advanced 10-agent consensus system for high-stakes compliance decisions
                </p>
              </div>
            </div>
          </div>

          {!isConnected && (
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                Backend services are not available. Ensure the backend is running on port 8000.
              </AlertDescription>
            </Alert>
          )}

          {/* Status Overview */}
          {status && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {status.online ? "Online" : "Offline"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {status.agents_ready} agents ready
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.total_evaluations || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All time evaluations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics ? `${(metrics.consensus_success_rate * 100).toFixed(1)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Consensus achievement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics ? `${metrics.average_execution_time.toFixed(1)}s` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per evaluation
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="evaluate" className="space-y-4">
            <TabsList>
              <TabsTrigger value="evaluate">Evaluate Transaction</TabsTrigger>
              <TabsTrigger value="recent">Recent Evaluations</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="evaluate" className="space-y-4">
              {/* Manual Evaluation Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Manual Evaluation Request</CardTitle>
                  <CardDescription>
                    Trigger a Tenth Opinion evaluation for a specific transaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="txId">Transaction ID</Label>
                      <Input
                        id="txId"
                        placeholder="tx_12345"
                        value={manualTxId}
                        onChange={(e) => setManualTxId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (EUR)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="100000"
                        value={manualAmount}
                        onChange={(e) => setManualAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="risk">Risk Score (0-1)</Label>
                      <Input
                        id="risk"
                        type="number"
                        step="0.01"
                        placeholder="0.75"
                        value={manualRiskScore}
                        onChange={(e) => setManualRiskScore(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tenth Opinion Panel */}
              {(manualTxId && manualAmount && manualRiskScore) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TenthOpinionPanel 
                    transactionData={{
                      id: manualTxId,
                      amount: parseFloat(manualAmount),
                      riskScore: parseFloat(manualRiskScore)
                    }}
                    onDecision={(decision) => {
                      console.log("Decision received:", decision);
                      // Refresh recent evaluations
                      loadAllData();
                    }}
                  />
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Evaluations</CardTitle>
                  <CardDescription>
                    Last 10 Tenth Opinion evaluations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEvaluations.map((evaluation) => (
                      <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getDecisionIcon(evaluation.decision)}
                            <span className="font-medium">{evaluation.transactionId}</span>
                            <Badge className={getDecisionBadge(evaluation.decision)}>
                              {evaluation.decision}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>€{evaluation.amount.toLocaleString()}</span>
                            <span>Risk: {evaluation.riskScore.toFixed(2)}</span>
                            <span>{evaluation.executionTime}s</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(evaluation.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {metrics && (
                <>
                  {/* Quality Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quality Metrics</CardTitle>
                      <CardDescription>
                        Overall system quality scores
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Reliability</span>
                            <span className="text-sm font-bold">
                              {(metrics.quality_scores.reliability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${metrics.quality_scores.reliability * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Objectivity</span>
                            <span className="text-sm font-bold">
                              {(metrics.quality_scores.objectivity * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-green-600"
                              style={{ width: `${metrics.quality_scores.objectivity * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Accuracy</span>
                            <span className="text-sm font-bold">
                              {(metrics.quality_scores.accuracy * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-purple-600"
                              style={{ width: `${metrics.quality_scores.accuracy * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phase Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Phase Performance</CardTitle>
                      <CardDescription>
                        Average execution time by phase
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {metrics.phase_metrics.map((phase, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{phase.phase_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {phase.average_duration.toFixed(2)}s
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {Object.entries(phase.agent_performance).map(([agent, score]) => (
                                <div key={agent} className="text-xs">
                                  <span className="text-muted-foreground">{agent}:</span>
                                  <span className="ml-1 font-medium">{(score * 100).toFixed(0)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}