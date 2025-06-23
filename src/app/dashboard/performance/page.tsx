"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from '@/lib/api-urls'
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Minus, Award, Zap, Clock, Target, Wifi, WifiOff, RefreshCw, Activity, BarChart } from "lucide-react";
import { toast } from "sonner";

interface AgentPerformance {
  agentId: string;
  agentName: string;
  reputationScore: number;
  trend: 'up' | 'down' | 'stable';
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: string;
  specialization: string[];
  lastEvaluation: string;
  status: string;
  performanceWeight: number;
  errorCount: number;
}

export default function PerformancePage() {
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [performanceReport, setPerformanceReport] = useState<any>(null);

  const fetchAgentPerformance = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')adk/agents/status");
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to match our interface
        const transformedAgents: AgentPerformance[] = data.map((agent: any) => {
          // Calculate trend based on performance score changes
          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (agent.performanceScore > 0.9) trend = 'up';
          else if (agent.performanceScore < 0.8) trend = 'down';
          
          // Extract specializations from agent type and current workflow
          const specializations = [];
          if (agent.type === 'TransactionMonitor') {
            specializations.push('Transaction Analysis', 'Real-time Monitoring');
          } else if (agent.type === 'RiskAssessment') {
            specializations.push('Risk Scoring', 'ML Classification');
          } else if (agent.type === 'GuardianCouncil') {
            specializations.push('Consensus Building', 'Multi-jurisdiction');
          } else if (agent.type === 'PrivacyRevoker') {
            specializations.push('Selective Disclosure', 'Privacy Protection');
          }
          
          return {
            agentId: agent.id,
            agentName: agent.name,
            reputationScore: agent.performanceScore * 100,
            trend: trend,
            tasksCompleted: agent.executionStats.totalExecutions || 0,
            successRate: agent.executionStats.successRate || 0,
            avgResponseTime: `${agent.executionStats.averageExecutionTime || 0}ms`,
            specialization: specializations,
            lastEvaluation: new Date(agent.lastHeartbeat).toLocaleTimeString(),
            status: agent.status,
            performanceWeight: agent.reputationWeight,
            errorCount: agent.executionStats.errorCount || 0
          };
        });
        
        setAgents(transformedAgents);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch agent performance:", error);
      setIsConnected(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await fetch(getApiUrl('/api/v1/metrics/performance', true));
      if (response.ok) {
        const data = await response.json();
        setSystemMetrics(data);
      }
    } catch (error) {
      console.error("Failed to fetch performance metrics:", error);
    }
  };

  const fetchPerformanceReport = async () => {
    try {
      const response = await fetch(getApiUrl('/api/v1/sentinel/performance/report?days=7', true));
      if (response.ok) {
        const data = await response.json();
        setPerformanceReport(data);
      }
    } catch (error) {
      console.error("Failed to fetch performance report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentPerformance();
    fetchPerformanceMetrics();
    fetchPerformanceReport();

    const interval = setInterval(() => {
      fetchAgentPerformance();
      fetchPerformanceMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAgentPerformance();
    fetchPerformanceMetrics();
    fetchPerformanceReport();
    toast.success("Performance data refreshed");
  };

  const handleRestartAgent = async (agentId: string) => {
    try {
      const response = await fetch(`', getApiUrl('/api/v1/')adk/agents/${agentId}/restart`, {
        method: "POST"
      });
      
      if (response.ok) {
        toast.success("Agent restart initiated");
        fetchAgentPerformance();
      } else {
        toast.error("Failed to restart agent");
      }
    } catch (error) {
      toast.error("Failed to connect to backend");
    }
  };

  // Calculate overall statistics
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const avgSuccessRate = agents.length > 0 
    ? agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length 
    : 0;
  const avgReputationScore = agents.length > 0
    ? agents.reduce((sum, agent) => sum + agent.reputationScore, 0) / agents.length
    : 0;
  const avgResponseTime = agents.length > 0
    ? Math.round(agents.reduce((sum, agent) => sum + parseInt(agent.avgResponseTime), 0) / agents.length)
    : 0;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-blue-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return { text: "Excellent", variant: "default" as const };
    if (score >= 85) return { text: "Good", variant: "secondary" as const };
    if (score >= 75) return { text: "Fair", variant: "outline" as const };
    return { text: "Needs Improvement", variant: "destructive" as const };
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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Agent Performance</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Agent Performance</h2>
              <p className="text-muted-foreground">
                Reputation and performance metrics for ADK agents
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? (
                  <><Wifi className="h-3 w-3 mr-1" /> Connected</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
                )}
              </Badge>
            </div>
          </div>

          {!isConnected && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <WifiOff className="h-5 w-5" />
                  <p>Backend services are not available. Ensure the backend is running on ports 8000 and 8001.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overall Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgReputationScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">System-wide reputation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Average accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgResponseTime}ms</div>
                <p className="text-xs text-muted-foreground">Average latency</p>
              </CardContent>
            </Card>
          </div>

          {/* Agent Performance Details */}
          <div className="grid gap-4">
            {loading && agents.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">Loading agent performance data...</div>
                </CardContent>
              </Card>
            ) : agents.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">No agent data available</div>
                </CardContent>
              </Card>
            ) : (
              agents.map((agent, index) => {
                const scoreBadge = getScoreBadge(agent.reputationScore);
                return (
                  <motion.div
                    key={agent.agentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{agent.agentName}</CardTitle>
                            <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
                            {getTrendIcon(agent.trend)}
                            <Badge 
                              variant={agent.status === 'healthy' ? 'default' : agent.status === 'degraded' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {agent.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(agent.reputationScore)}`}>
                                {agent.reputationScore.toFixed(1)}
                              </div>
                              <p className="text-xs text-muted-foreground">Reputation Score</p>
                            </div>
                            {agent.status !== 'healthy' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRestartAgent(agent.agentId)}
                              >
                                <Activity className="h-3 w-3 mr-1" />
                                Restart
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Performance Progress</span>
                          <span>{agent.reputationScore}%</span>
                        </div>
                        <Progress value={agent.reputationScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Tasks Completed</p>
                          <p className="font-semibold">{agent.tasksCompleted.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-semibold">{agent.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Response</p>
                          <p className="font-semibold">{agent.avgResponseTime}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Evaluation</p>
                          <p className="font-semibold">{agent.lastEvaluation}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Performance Weight</p>
                          <p className="font-semibold">{(agent.performanceWeight * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Error Count</p>
                          <p className="font-semibold text-red-600">{agent.errorCount}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Specializations</p>
                        <div className="flex gap-2 flex-wrap">
                          {agent.specialization.map(spec => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                );
              })
            )}
          </div>

          {/* Performance Trends and ML Model Metrics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceReport ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Transactions</span>
                        <span className="text-sm font-medium">{performanceReport.summary?.totalTransactions?.toLocaleString() || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Fraud Detected</span>
                        <span className="text-sm font-medium">{performanceReport.summary?.totalFraudDetected?.toLocaleString() || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Accuracy</span>
                        <span className="text-sm font-medium">{((performanceReport.summary?.averageAccuracy || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="text-sm font-medium text-green-600">{performanceReport.summary?.uptimePercentage || "-"}%</span>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Trend Analysis</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Fraud Detection</span>
                            <Badge variant="outline" className="text-xs">
                              {performanceReport.trends?.fraudDetectionTrend || "stable"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Accuracy</span>
                            <Badge variant="outline" className="text-xs">
                              {performanceReport.trends?.accuracyTrend || "stable"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Performance</span>
                            <Badge variant="outline" className="text-xs">
                              {performanceReport.trends?.performanceTrend || "stable"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">Loading performance report...</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {systemMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    ML Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Model Metrics</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Accuracy</span>
                          <span className="text-sm font-medium">{(systemMetrics.model_performance?.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Precision</span>
                          <span className="text-sm font-medium">{(systemMetrics.model_performance?.precision * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Recall</span>
                          <span className="text-sm font-medium">{(systemMetrics.model_performance?.recall * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">F1 Score</span>
                          <span className="text-sm font-medium">{(systemMetrics.model_performance?.f1_score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AUC Score</span>
                          <span className="text-sm font-medium">{(systemMetrics.model_performance?.auc_score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">System Performance</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Throughput</span>
                          <span className="text-xs font-medium">{systemMetrics.system_performance?.throughput_per_second.toFixed(1)} tx/s</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">CPU Usage</span>
                          <span className="text-xs font-medium">{systemMetrics.system_performance?.cpu_usage.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Memory Usage</span>
                          <span className="text-xs font-medium">{systemMetrics.system_performance?.memory_usage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}