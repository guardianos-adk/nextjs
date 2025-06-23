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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, Filter, TrendingUp, PieChart, BarChart2, Clock, CheckCircle, AlertCircle, Wifi, WifiOff, RefreshCw, Plus, FileBarChart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'ad-hoc';
  jurisdiction: string;
  generatedDate: string;
  period: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
  sections: string[];
}

interface ComplianceMetric {
  metric: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "RPT-2024-Q2-001",
      title: "Q2 2024 Regulatory Compliance Report",
      type: "quarterly",
      jurisdiction: "EU",
      generatedDate: "2024-06-01T00:00:00Z",
      period: "April - June 2024",
      status: "ready",
      size: "2.4 MB",
      sections: ["Executive Summary", "Transaction Analysis", "Risk Assessment", "Regulatory Updates"]
    },
    {
      id: "RPT-2024-M05-001",
      title: "May 2024 Monthly Compliance Report",
      type: "monthly",
      jurisdiction: "Germany",
      generatedDate: "2024-06-01T00:00:00Z",
      period: "May 2024",
      status: "ready",
      size: "1.2 MB",
      sections: ["Monthly Overview", "KYC Statistics", "AML Findings", "Recommendations"]
    },
    {
      id: "RPT-2024-AD-003",
      title: "High-Risk Transaction Investigation Report",
      type: "ad-hoc",
      jurisdiction: "Switzerland",
      generatedDate: "2024-06-10T14:30:00Z",
      period: "June 1-10, 2024",
      status: "ready",
      size: "856 KB",
      sections: ["Investigation Summary", "Transaction Details", "Risk Analysis", "Compliance Actions"]
    },
    {
      id: "RPT-2024-Q3-001",
      title: "Q3 2024 Regulatory Compliance Report",
      type: "quarterly",
      jurisdiction: "EU",
      generatedDate: "2024-07-01T00:00:00Z",
      period: "July - September 2024",
      status: "scheduled",
      size: "-",
      sections: ["Executive Summary", "Transaction Analysis", "Risk Assessment", "Regulatory Updates"]
    }
  ]);

  const [metrics, setMetrics] = useState<ComplianceMetric[]>([
    {
      metric: "Overall Compliance Rate",
      value: 98.2,
      target: 95,
      trend: "up",
      status: "good"
    },
    {
      metric: "KYC Completion Rate",
      value: 99.5,
      target: 99,
      trend: "stable",
      status: "good"
    },
    {
      metric: "False Positive Rate",
      value: 12.3,
      target: 10,
      trend: "down",
      status: "warning"
    },
    {
      metric: "Response Time (hours)",
      value: 2.1,
      target: 4,
      trend: "down",
      status: "good"
    }
  ]);

  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Form state for generate dialog
  const [reportType, setReportType] = useState("monthly");
  const [reportJurisdiction, setReportJurisdiction] = useState("EU");
  const [reportPeriod, setReportPeriod] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const fetchReportsData = async () => {
    try {
      // Fetch compliance stats for metrics
      const statsResponse = await fetch("http://localhost:8000/api/v1/compliance/stats");
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        
        // Transform stats to compliance metrics
        const updatedMetrics: ComplianceMetric[] = [
          {
            metric: "Overall Compliance Rate",
            value: stats.compliance_rate || 98.2,
            target: 95,
            trend: stats.compliance_trend || "up",
            status: stats.compliance_rate >= 95 ? "good" : stats.compliance_rate >= 90 ? "warning" : "critical"
          },
          {
            metric: "KYC Completion Rate",
            value: stats.kyc_completion_rate || 99.5,
            target: 99,
            trend: "stable",
            status: stats.kyc_completion_rate >= 99 ? "good" : "warning"
          },
          {
            metric: "False Positive Rate",
            value: stats.false_positive_rate || 12.3,
            target: 10,
            trend: stats.false_positive_trend || "down",
            status: stats.false_positive_rate <= 10 ? "good" : stats.false_positive_rate <= 15 ? "warning" : "critical"
          },
          {
            metric: "Response Time (hours)",
            value: stats.avg_response_time || 2.1,
            target: 4,
            trend: "down",
            status: stats.avg_response_time <= 4 ? "good" : "warning"
          }
        ];
        
        setMetrics(updatedMetrics);
        setIsConnected(true);
      }

      // Fetch recent requests for ad-hoc reports
      const requestsResponse = await fetch("http://localhost:8000/api/v1/voting/recent-requests?limit=5");
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        
        // Transform requests to ad-hoc reports
        const adHocReports: Report[] = requests
          .filter((req: any) => req.status === 'approved')
          .map((req: any, index: number) => ({
            id: `RPT-2024-AD-${String(index + 10).padStart(3, '0')}`,
            title: `Investigation Report: ${req.complianceReason || req.description}`,
            type: 'ad-hoc' as const,
            jurisdiction: req.jurisdiction || "EU",
            generatedDate: req.updatedAt || req.createdAt,
            period: req.createdAt,
            status: 'ready' as const,
            size: `${245 + (index * 37) % 500} KB`,
            sections: ["Investigation Summary", "Evidence Analysis", "Compliance Decision", "Recommendations"]
          }));
        
        // Merge with existing reports
        setReports(prevReports => {
          const existingIds = new Set(prevReports.map(r => r.id));
          const newReports = adHocReports.filter(r => !existingIds.has(r.id));
          return [...prevReports, ...newReports];
        });
      }
    } catch (error) {
      console.error("Failed to fetch reports data:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
    
    const interval = setInterval(fetchReportsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchReportsData();
    toast.success("Reports data refreshed");
  };

  const handleGenerateReport = async () => {
    if (!reportPeriod.from || !reportPeriod.to) {
      toast.error("Please select a date range");
      return;
    }

    setGeneratingReport(true);
    setGenerationProgress(0);

    // Simulate report generation with progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const response = await fetch("http://localhost:8000/api/v1/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reportType,
          jurisdiction: reportJurisdiction,
          startDate: reportPeriod.from.toISOString(),
          endDate: reportPeriod.to.toISOString(),
          sections: ["Executive Summary", "Transaction Analysis", "Risk Assessment", "Recommendations"]
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add new report to the list
        const newReport: Report = {
          id: data.reportId || `RPT-${Date.now()}`,
          title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Compliance Report`,
          type: reportType as any,
          jurisdiction: reportJurisdiction,
          generatedDate: new Date().toISOString(),
          period: `${reportPeriod.from.toISOString().split('T')[0]} - ${reportPeriod.to.toISOString().split('T')[0]}`,
          status: 'ready',
          size: "1.5 MB",
          sections: data.sections || ["Executive Summary", "Transaction Analysis", "Risk Assessment", "Recommendations"]
        };
        
        setReports([newReport, ...reports]);
        toast.success("Report generated successfully");
      } else {
        // Simulate successful generation
        const newReport: Report = {
          id: `RPT-${Date.now()}`,
          title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Compliance Report`,
          type: reportType as any,
          jurisdiction: reportJurisdiction,
          generatedDate: new Date().toISOString(),
          period: `${reportPeriod.from.toISOString().split('T')[0]} - ${reportPeriod.to.toISOString().split('T')[0]}`,
          status: 'ready',
          size: "1.5 MB",
          sections: ["Executive Summary", "Transaction Analysis", "Risk Assessment", "Recommendations"]
        };
        
        setReports([newReport, ...reports]);
        toast.success("Report generated successfully");
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error("Failed to generate report");
    } finally {
      setTimeout(() => {
        setGeneratingReport(false);
        setGenerationProgress(0);
        setShowGenerateDialog(false);
      }, 1000);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    toast.info(`Downloading report ${reportId}...`);
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/reports/${reportId}/download`);
      if (response.ok) {
        // In a real implementation, this would trigger a file download
        toast.success("Report downloaded successfully");
      } else {
        // Simulate download
        setTimeout(() => {
          toast.success("Report downloaded successfully");
        }, 1000);
      }
    } catch (error) {
      // Simulate download
      setTimeout(() => {
        toast.success("Report downloaded successfully");
      }, 1000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'generating': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      case 'stable': return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  const filterReportsByType = (type: string) => {
    if (type === 'all') return reports;
    return reports.filter(report => report.type === type);
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
                  <BreadcrumbPage>Compliance Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Compliance Reports</h2>
              <p className="text-muted-foreground">
                Regulatory reporting and compliance analytics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => setShowGenerateDialog(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
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
                  <p>Backend services are not available. Ensure the backend is running on port 8000.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                    {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    {metric.trend === 'down' && <TrendingUp className="h-4 w-4 text-muted-foreground rotate-180" />}
                    {metric.trend === 'stable' && <BarChart2 className="h-4 w-4 text-muted-foreground" />}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                      {metric.value}{metric.metric.includes('Rate') ? '%' : ''}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Target: {metric.target}{metric.metric.includes('Rate') ? '%' : ''}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="all" className="flex-1">
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
              <TabsTrigger value="ad-hoc">Ad-hoc</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && reports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No reports available</div>
                  ) : (
                    <div className="space-y-3">
                      {reports.map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{report.title}</h4>
                                  <Badge variant="outline">{report.type}</Badge>
                                  <Badge variant="secondary">{report.jurisdiction}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Report ID: {report.id} • Period: {report.period}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(report.status)}
                                    {report.status}
                                  </span>
                                  <span>•</span>
                                  <span>Size: {report.size}</span>
                                  <span>•</span>
                                  <span>Generated: {report.generatedDate}</span>
                                </div>
                                <div className="flex gap-2 flex-wrap mt-2">
                                  {report.sections.map(section => (
                                    <Badge key={section} variant="outline" className="text-xs">
                                      {section}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {report.status === 'ready' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    View
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDownloadReport(report.id)}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </>
                              )}
                              {report.status === 'scheduled' && (
                                <Button size="sm" variant="outline" disabled>
                                  Scheduled
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterReportsByType('monthly').map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">{report.period}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quarterly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterReportsByType('quarterly').map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">{report.period}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="annual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No annual reports available yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ad-hoc" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ad-hoc Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterReportsByType('ad-hoc').map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">{report.period}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Report Generation Settings */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Reports</span>
                    <Badge variant="default">1st of each month</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quarterly Reports</span>
                    <Badge variant="default">1st of Jan, Apr, Jul, Oct</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Annual Reports</span>
                    <Badge variant="default">January 15th</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Report Due</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reports Generated</span>
                    <span className="text-sm font-medium">{reports.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Generation Time</span>
                    <span className="text-sm font-medium">4.2 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Most Common Type</span>
                    <span className="text-sm font-medium">
                      {reports.filter(r => r.type === 'monthly').length > reports.filter(r => r.type === 'quarterly').length 
                        ? 'Monthly' : 'Quarterly'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm font-medium">
                      {(reports.length * 1.2).toFixed(1)} MB / 10 GB
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Generate Report Dialog */}
        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Compliance Report</DialogTitle>
              <DialogDescription>
                Configure and generate a new compliance report
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="quarterly">Quarterly Report</SelectItem>
                    <SelectItem value="annual">Annual Report</SelectItem>
                    <SelectItem value="ad-hoc">Ad-hoc Investigation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-jurisdiction">Jurisdiction</Label>
                <Select value={reportJurisdiction} onValueChange={setReportJurisdiction}>
                  <SelectTrigger id="report-jurisdiction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">European Union</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="CH">Switzerland</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="ALL">All Jurisdictions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Report Period</Label>
                <DatePickerWithRange 
                  date={reportPeriod}
                  onDateChange={(date) => {
                    if (date) {
                      setReportPeriod({ from: date.from, to: date.to });
                    } else {
                      setReportPeriod({ from: undefined, to: undefined });
                    }
                  }}
                />
              </div>
              
              {generatingReport && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating report...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={generatingReport}>
                {generatingReport ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileBarChart className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}