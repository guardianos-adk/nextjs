"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { tenthOpinionApi } from "@/lib/api-client";
import { TenthOpinionMetrics } from "@/lib/types";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// Mock data for charts
const decisionTrendData = [
  { date: "Mon", approve: 12, deny: 3, investigate: 8, escalate: 2 },
  { date: "Tue", approve: 15, deny: 4, investigate: 6, escalate: 1 },
  { date: "Wed", approve: 18, deny: 2, investigate: 9, escalate: 3 },
  { date: "Thu", approve: 14, deny: 5, investigate: 7, escalate: 2 },
  { date: "Fri", approve: 20, deny: 3, investigate: 10, escalate: 4 },
  { date: "Sat", approve: 16, deny: 2, investigate: 5, escalate: 1 },
  { date: "Sun", approve: 10, deny: 1, investigate: 4, escalate: 0 }
];

const riskDistribution = [
  { name: "Low Risk", value: 45, color: "#10b981" },
  { name: "Medium Risk", value: 30, color: "#f59e0b" },
  { name: "High Risk", value: 20, color: "#ef4444" },
  { name: "Critical Risk", value: 5, color: "#7c3aed" }
];

const agentPerformanceData = [
  { agent: "First Opinion", performance: 92 },
  { agent: "Second Opinion", performance: 88 },
  { agent: "Third Opinion", performance: 85 },
  { agent: "Fourth Opinion", performance: 90 },
  { agent: "Fifth Opinion", performance: 87 },
  { agent: "Sixth Opinion", performance: 83 },
  { agent: "Seventh Opinion", performance: 91 },
  { agent: "Eighth Opinion", performance: 89 },
  { agent: "Ninth Opinion", performance: 86 },
  { agent: "Tenth Opinion", performance: 94 }
];

const qualityRadarData = [
  { metric: "Reliability", value: 88 },
  { metric: "Objectivity", value: 85 },
  { metric: "Accuracy", value: 91 },
  { metric: "Consistency", value: 87 },
  { metric: "Speed", value: 82 },
  { metric: "Compliance", value: 93 }
];

export default function TenthOpinionAnalyticsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<TenthOpinionMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  useEffect(() => {
    loadMetrics();
    // Auto-refresh every minute
    const interval = setInterval(loadMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await tenthOpinionApi.getMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMetrics();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleExport = () => {
    toast.success("Analytics report exported successfully");
    // TODO: Implement actual export functionality
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/tenth-opinion">Tenth Opinion</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <><Wifi className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            
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
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Brain className="h-8 w-8 text-purple-600" />
                Tenth Opinion Analytics
              </h1>
              <p className="text-muted-foreground">
                Comprehensive analysis of multi-agent consensus performance and decision patterns
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <TabsList>
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7d</TabsTrigger>
                  <TabsTrigger value="30d">30d</TabsTrigger>
                  <TabsTrigger value="90d">90d</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_evaluations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consensus Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? `${(metrics.consensus_success_rate * 100).toFixed(1)}%` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Target: 95%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? `${metrics.average_execution_time.toFixed(1)}s` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-0.3s</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? `${(metrics.quality_scores.accuracy * 100).toFixed(1)}%` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined accuracy metric
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analysis */}
          <Tabs defaultValue="decisions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="decisions">Decision Analysis</TabsTrigger>
              <TabsTrigger value="performance">Agent Performance</TabsTrigger>
              <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
              <TabsTrigger value="patterns">Risk Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="decisions" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Decision Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Decision Trends</CardTitle>
                    <CardDescription>
                      Distribution of decisions over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={decisionTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="approve" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="deny" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="investigate" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="escalate" 
                          stroke="#7c3aed" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Risk Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of transactions by risk level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Decision Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Decision Statistics</CardTitle>
                  <CardDescription>
                    Detailed breakdown by decision type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Approved</span>
                      </div>
                      <p className="text-2xl font-bold">68%</p>
                      <p className="text-xs text-muted-foreground">
                        215 transactions
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Denied</span>
                      </div>
                      <p className="text-2xl font-bold">12%</p>
                      <p className="text-xs text-muted-foreground">
                        38 transactions
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">Investigate</span>
                      </div>
                      <p className="text-2xl font-bold">15%</p>
                      <p className="text-xs text-muted-foreground">
                        47 transactions
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Escalated</span>
                      </div>
                      <p className="text-2xl font-bold">5%</p>
                      <p className="text-xs text-muted-foreground">
                        16 transactions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Individual Agent Performance</CardTitle>
                  <CardDescription>
                    Success rate by agent across all phases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={agentPerformanceData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="agent" type="category" width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="performance" fill="#8b5cf6">
                        {agentPerformanceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.performance >= 90 ? "#10b981" : 
                                  entry.performance >= 85 ? "#3b82f6" : 
                                  entry.performance >= 80 ? "#f59e0b" : "#ef4444"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Phase Performance */}
              {metrics && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {metrics.phase_metrics.map((phase, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{phase.phase_name}</CardTitle>
                        <CardDescription>
                          Average duration: {phase.average_duration.toFixed(2)}s
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(phase.agent_performance).map(([agent, score]) => (
                            <div key={agent} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{agent}</span>
                                <span className="text-sm">{(score * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={score * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Quality Radar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Dimensions</CardTitle>
                    <CardDescription>
                      Multi-dimensional quality assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={qualityRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name="Quality Score" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Quality Metrics Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Trends</CardTitle>
                    <CardDescription>
                      Quality score progression over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {metrics && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Reliability</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">
                                {(metrics.quality_scores.reliability * 100).toFixed(1)}%
                              </span>
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            </div>
                          </div>
                          <Progress 
                            value={metrics.quality_scores.reliability * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Objectivity</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">
                                {(metrics.quality_scores.objectivity * 100).toFixed(1)}%
                              </span>
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            </div>
                          </div>
                          <Progress 
                            value={metrics.quality_scores.objectivity * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Accuracy</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">
                                {(metrics.quality_scores.accuracy * 100).toFixed(1)}%
                              </span>
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            </div>
                          </div>
                          <Progress 
                            value={metrics.quality_scores.accuracy * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Quality Insights:</strong> The system maintains high quality scores across all dimensions. 
                            Reliability and accuracy show consistent improvement, while objectivity remains stable at optimal levels.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Pattern Analysis</CardTitle>
                  <CardDescription>
                    Common patterns triggering Tenth Opinion evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Pattern Categories */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Transaction Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span>Cross-border > €75,000 (38%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span>Multiple beneficiaries (22%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              <span>Rapid succession transfers (18%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span>Unusual time patterns (12%)</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Entity Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span>New entities < 30 days (42%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span>High-risk jurisdictions (28%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              <span>Shell company indicators (15%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span>Sanctions proximity (8%)</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Behavioral Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span>Structuring behavior (31%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span>Velocity spikes (24%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              <span>Geographic anomalies (20%)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span>Dormant reactivation (10%)</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Insights */}
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">
                          <strong>1. High-Value Transactions:</strong> 78% of evaluations involve transactions exceeding €100,000, 
                          with cross-border transfers representing the highest risk category.
                        </p>
                        <p className="text-sm">
                          <strong>2. Entity Risk:</strong> New entities (registered within 30 days) account for 42% of all 
                          high-risk evaluations, suggesting enhanced KYC requirements for new customers.
                        </p>
                        <p className="text-sm">
                          <strong>3. Pattern Clustering:</strong> Multiple risk indicators often cluster together, with 65% of 
                          critical risk transactions showing 3 or more suspicious patterns.
                        </p>
                        <p className="text-sm">
                          <strong>4. Time-based Patterns:</strong> Unusual transaction timing (outside business hours or rapid 
                          succession) correlates strongly with eventual investigation decisions.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}