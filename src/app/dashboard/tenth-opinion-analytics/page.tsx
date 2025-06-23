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
  Workflow,
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
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { tenthOpinionApi } from "@/lib/api-client";
import type { TenthOpinionMetrics } from "@/lib/types";

export default function TenthOpinionAnalyticsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<TenthOpinionMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  useEffect(() => {
    loadMetrics();
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
  };

  // Simplified UI without complex components
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/tenth-opinion">Agent Orchestration</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tenth Opinion Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Workflow className="h-8 w-8 text-purple-600" />
                Tenth Opinion Analytics
              </h1>
              <p className="text-muted-foreground">
                Comprehensive analysis of multi-agent consensus performance and decision patterns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
                {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? metrics.total_evaluations : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time evaluations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? `${(metrics.consensus_success_rate * 100).toFixed(1)}%` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Consensus achievement rate
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
                  {metrics ? `${metrics.average_execution_time.toFixed(1)}s` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per evaluation
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
                  {metrics && metrics.quality_scores ? `${(metrics.quality_scores.accuracy * 100).toFixed(1)}%` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Combined accuracy metric
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Dashboard</CardTitle>
              <CardDescription>
                Detailed performance metrics and patterns from Tenth Opinion Protocol executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics && metrics.phase_metrics && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Phase Performance</h3>
                      <div className="space-y-3">
                        {metrics.phase_metrics.map((phase, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{phase.phase_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {Object.keys(phase.agent_performance).length} agents
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{phase.average_duration.toFixed(2)}s</p>
                              <p className="text-sm text-muted-foreground">avg duration</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {metrics && metrics.quality_scores && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Reliability</span>
                            <span className="text-sm font-bold">
                              {(metrics.quality_scores.reliability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={metrics.quality_scores.reliability * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Objectivity</span>
                            <span className="text-sm font-bold">
                              {(metrics.quality_scores.objectivity * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={metrics.quality_scores.objectivity * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Accuracy</span>
                            <span className="text-sm font-bold">
                              {(metrics.quality_scores.accuracy * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={metrics.quality_scores.accuracy * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}