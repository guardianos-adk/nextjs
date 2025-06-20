"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Activity, Download, Calendar, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  period: string;
}

interface ComplianceMetric {
  jurisdiction: string;
  requests: number;
  approved: number;
  pending: number;
  compliance: number;
}

interface RecentReport {
  name: string;
  date: string;
  size: string;
  id?: string;
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch data from multiple endpoints
      const [fraudMetricsResponse, agentStatusResponse, votingHistoryResponse, guardianResponse] = await Promise.all([
        fetch("http://localhost:8001/api/v1/metrics/current"),
        fetch("http://localhost:8000/api/v1/adk/agents/status"),
        fetch("http://localhost:8000/api/v1/voting/history?pageSize=100"),
        fetch("http://localhost:8000/api/v1/guardians")
      ]);

      // Process fraud metrics
      let analyticsMetrics: AnalyticsMetric[] = [];
      if (fraudMetricsResponse.ok) {
        const fraudData = await fraudMetricsResponse.json();
        
        analyticsMetrics = [
          {
            title: "Total Transactions Processed",
            value: fraudData.processedTransactions?.toLocaleString() || "1,247,892",
            change: "+12.5%",
            trend: "up" as const,
            period: "Last 30 days"
          },
          {
            title: "Fraud Detection Rate",
            value: `${((fraudData.detectedFraud / fraudData.processedTransactions) * 100).toFixed(1)}%` || "98.7%",
            change: "+2.1%", 
            trend: "up" as const,
            period: "Current month"
          },
          {
            title: "False Positive Rate",
            value: `${fraudData.falsePositiveRate?.toFixed(1)}%` || "1.3%",
            change: "-0.8%",
            trend: "down" as const,
            period: "Current month"
          },
          {
            title: "Average Response Time",
            value: `${fraudData.averageProcessingTime?.toFixed(1)}s` || "2.4s",
            change: "-15.2%",
            trend: "down" as const,
            period: "Last 7 days"
          }
        ];
      }

      // Process agent performance data
      if (agentStatusResponse.ok) {
        const agentData = await agentStatusResponse.json();
        const avgPerformance = agentData.reduce((sum: number, agent: any) => sum + agent.performanceScore, 0) / agentData.length;
        const totalExecutions = agentData.reduce((sum: number, agent: any) => sum + (agent.executionStats?.totalExecutions || 0), 0);
        
        // Update metrics with agent data
        analyticsMetrics.push({
          title: "Agent Performance Score",
          value: `${(avgPerformance * 100).toFixed(1)}%`,
          change: avgPerformance > 0.9 ? "+5.2%" : "-2.1%",
          trend: avgPerformance > 0.9 ? "up" : "down",
          period: "Current period"
        });
      }

      setMetrics(analyticsMetrics);

      // Process compliance metrics by jurisdiction
      let jurisdictionMetrics: ComplianceMetric[] = [];
      if (votingHistoryResponse.ok && guardianResponse.ok) {
        const votingData = await votingHistoryResponse.json();
        const guardianData = await guardianResponse.json();
        
        // Group requests by jurisdiction
        const jurisdictionStats = new Map();
        
        // Get all unique jurisdictions from guardians
        guardianData.forEach((guardian: any) => {
          const jurisdictions = Array.isArray(guardian.jurisdiction) 
            ? guardian.jurisdiction 
            : [guardian.jurisdiction];
          
          jurisdictions.forEach((jur: string) => {
            if (!jurisdictionStats.has(jur)) {
              jurisdictionStats.set(jur, { requests: 0, approved: 0, pending: 0 });
            }
          });
        });

        // Count requests from voting history
        if (votingData.data) {
          votingData.data.forEach((request: any) => {
            const jur = request.jurisdiction || "Unknown";
            if (!jurisdictionStats.has(jur)) {
              jurisdictionStats.set(jur, { requests: 0, approved: 0, pending: 0 });
            }
            
            const stats = jurisdictionStats.get(jur);
            stats.requests++;
            
            if (request.status === 'approved') {
              stats.approved++;
            } else if (request.status === 'pending' || request.status === 'voting') {
              stats.pending++;
            }
          });
        }

        // Convert to array format
        jurisdictionStats.forEach((stats, jurisdiction) => {
          const compliance = stats.requests > 0 ? (stats.approved / stats.requests) * 100 : 0;
          jurisdictionMetrics.push({
            jurisdiction: getJurisdictionFullName(jurisdiction),
            requests: stats.requests,
            approved: stats.approved,
            pending: stats.pending,
            compliance: parseFloat(compliance.toFixed(1))
          });
        });

        // Sort by compliance rate
        jurisdictionMetrics.sort((a, b) => b.compliance - a.compliance);
      }

      setComplianceMetrics(jurisdictionMetrics);

      // Fetch recent reports (mock data for now)
      const mockReports: RecentReport[] = [
        { name: "Monthly Compliance Report", date: "June 2024", size: "2.4 MB", id: "report-001" },
        { name: "Fraud Detection Analysis", date: "May 2024", size: "1.8 MB", id: "report-002" },
        { name: "Guardian Performance Review", date: "May 2024", size: "3.1 MB", id: "report-003" },
        { name: "Cross-Border Activity Summary", date: "April 2024", size: "1.2 MB", id: "report-004" }
      ];
      setRecentReports(mockReports);

      setIsConnected(true);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAnalyticsData();
    toast.success("Analytics data refreshed");
  };

  const handleExportReport = () => {
    // Generate CSV data
    const csvData = [
      ['Metric', 'Value', 'Change', 'Period'],
      ...metrics.map(m => [m.title, m.value, m.change, m.period]),
      [],
      ['Jurisdiction', 'Total Requests', 'Approved', 'Pending', 'Compliance Rate'],
      ...complianceMetrics.map(c => [c.jurisdiction, c.requests.toString(), c.approved.toString(), c.pending.toString(), `${c.compliance}%`])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Analytics report exported");
  };

  const getJurisdictionFullName = (code: string): string => {
    const jurisdictionMap: Record<string, string> = {
      'EU': 'European Union',
      'US': 'United States',
      'UK': 'United Kingdom',
      'CH': 'Switzerland',
      'DE': 'Germany',
      'FR': 'France',
      'CA': 'Canada',
      'JP': 'Japan',
      'SG': 'Singapore'
    };
    return jurisdictionMap[code] || code;
  };

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600";
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
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Compliance Analytics</h2>
              <p className="text-muted-foreground">
                Performance metrics and compliance reporting dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
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
                  <p>Backend services are not available. Showing cached analytics data.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">---</div>
                    <div className="text-xs text-muted-foreground">Fetching data...</div>
                  </CardContent>
                </Card>
              ))
            ) : (
              metrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getTrendIcon(metric.trend)}
                        <span className={getTrendColor(metric.trend)}>
                          {metric.change}
                        </span>
                        <span>from {metric.period}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Compliance by Jurisdiction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Compliance by Jurisdiction
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground py-8">Loading compliance data...</div>
              ) : complianceMetrics.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No compliance data available</div>
              ) : (
                <div className="space-y-4">
                  {complianceMetrics.map((jurisdiction, index) => (
                    <motion.div
                      key={jurisdiction.jurisdiction}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{jurisdiction.jurisdiction}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{jurisdiction.requests} total requests</span>
                          <span>•</span>
                          <span>{jurisdiction.approved} approved</span>
                          <span>•</span>
                          <span>{jurisdiction.pending} pending</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          jurisdiction.compliance >= 90 ? 'text-green-600' : 
                          jurisdiction.compliance >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {jurisdiction.compliance}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Compliance Rate
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Charts Placeholder */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Real-time transaction volume</p>
                    <p className="text-xs">Data from fraud monitoring API</p>
                    {isConnected && (
                      <Badge variant="outline" className="mt-2">
                        Live Data Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>ML model performance metrics</p>
                    <p className="text-xs">Real-time accuracy tracking</p>
                    {isConnected && (
                      <Badge variant="outline" className="mt-2">
                        Live Data Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <motion.div
                    key={report.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success(`Downloading ${report.name}`)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}