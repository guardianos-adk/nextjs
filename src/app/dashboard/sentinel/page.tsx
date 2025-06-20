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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Activity, AlertTriangle, Bell, TrendingUp, Shield, Zap, Filter, RefreshCw, CheckCircle, Wifi, WifiOff, BarChart } from "lucide-react";
import { toast } from "sonner";

interface FraudAlert {
  id: string;
  transactionId: string;
  walletAddress: string;
  fraudScore: number;
  confidence: number;
  riskLevel: string;
  detectionMethod: string;
  timestamp: string;
  patterns: string[];
  recommendations: string[];
}

interface SystemMetrics {
  timestamp: string;
  processedTransactions: number;
  detectedFraud: number;
  falsePositives: number;
  accuracy: number;
  precision: number;
  recall: number;
  processingLatency: number;
  systemHealth: Record<string, string>;
}

export default function SentinelPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/v1/fraud/alerts?limit=50");
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      setIsConnected(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/v1/metrics/current");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      const response = await fetch("http://localhost:8001/health");
      setIsConnected(response.ok);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchMetrics();
    checkConnection();

    const interval = setInterval(() => {
      fetchAlerts();
      fetchMetrics();
      checkConnection();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDetectionMethodIcon = (method: string) => {
    switch (method) {
      case 'pattern_analysis':
        return <TrendingUp className="h-4 w-4" />;
      case 'ml_classification':
        return <Zap className="h-4 w-4" />;
      case 'anomaly_detection':
        return <Activity className="h-4 w-4" />;
      case 'rule_based':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAlerts();
    fetchMetrics();
    toast.success("Data refreshed");
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/v1/fraud/alerts/${alertId}/acknowledge`, {
        method: "POST",
      });
      
      if (response.ok) {
        toast.success("Alert acknowledged");
        fetchAlerts();
      }
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const activeAlerts = alerts.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length;
  const avgRiskScore = alerts.length > 0 
    ? Math.round(alerts.reduce((acc, a) => acc + a.fraudScore, 0) / alerts.length * 100)
    : 0;

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
                  <BreadcrumbPage>FraudSentinel Monitor</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="ml-auto px-4 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowFilterDialog(true)}>
              <Filter className="h-4 w-4" />
            </Button>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <><Wifi className="h-3 w-3 mr-1" /> Connected to Port 8001</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Real-time Monitoring</h2>
              <p className="text-muted-foreground">
                FraudSentinel AI-powered blockchain fraud detection
              </p>
            </div>
          </div>

          {!isConnected && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <WifiOff className="h-5 w-5" />
                  <p>FraudSentinel API is not available. Ensure the fraud monitoring service is running on port 8001.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Real-time Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAlerts}</div>
                <p className="text-xs text-muted-foreground">High/Critical severity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRiskScore}</div>
                <p className="text-xs text-muted-foreground">System-wide average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">ML model accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics ? `${metrics.processingLatency.toFixed(0)}ms` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">Average latency</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          {metrics && (
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Processed</p>
                    <p className="text-lg font-semibold">{metrics.processedTransactions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Detected</p>
                    <p className="text-lg font-semibold">{metrics.detectedFraud}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precision</p>
                    <p className="text-lg font-semibold">{(metrics.precision * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recall</p>
                    <p className="text-lg font-semibold">{(metrics.recall * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Alert Feed */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Fraud Alerts</CardTitle>
                <Badge variant="secondary">{alerts.length} alerts</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading && alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Loading alerts...</div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No fraud alerts detected</div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getDetectionMethodIcon(alert.detectionMethod)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{alert.id}</h4>
                                <Badge className={getSeverityColor(alert.riskLevel)}>
                                  {alert.riskLevel}
                                </Badge>
                                <Badge variant="outline">{alert.detectionMethod}</Badge>
                                <Badge variant="secondary">
                                  Score: {(alert.fraudScore * 100).toFixed(0)}
                                </Badge>
                              </div>
                              <p className="text-sm">
                                Transaction: <code className="text-xs">{alert.transactionId.slice(0, 10)}...</code>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Wallet: <code className="text-xs">{alert.walletAddress}</code>
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                {alert.patterns.map((pattern, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {pattern}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledgeAlert(alert.id);
                            }}
                          >
                            Acknowledge
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* System Health */}
          {metrics && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(metrics.systemHealth).map(([component, status]) => (
                      <div key={component} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{component.replace(/_/g, ' ')}</span>
                        <Badge variant={status === 'healthy' ? 'default' : 'destructive'}>
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">False Positive Rate</span>
                      <span className="text-sm font-medium">
                        {metrics.falsePositives > 0 
                          ? `${((metrics.falsePositives / metrics.detectedFraud) * 100).toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Throughput</span>
                      <span className="text-sm font-medium">
                        {(metrics.processedTransactions / 3600).toFixed(1)} tx/s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="text-sm font-medium">24</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Alert Details Dialog */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Fraud Alert Details</DialogTitle>
              <DialogDescription>
                Detailed information about the detected fraud pattern
              </DialogDescription>
            </DialogHeader>
            
            {selectedAlert && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Alert ID</p>
                    <p className="font-medium">{selectedAlert.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <Badge className={getSeverityColor(selectedAlert.riskLevel)}>
                      {selectedAlert.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fraud Score</p>
                    <p className="font-medium">{(selectedAlert.fraudScore * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-medium">{(selectedAlert.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Transaction Details</p>
                  <div className="space-y-1">
                    <p className="text-sm">ID: <code className="text-xs">{selectedAlert.transactionId}</code></p>
                    <p className="text-sm">Wallet: <code className="text-xs">{selectedAlert.walletAddress}</code></p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Detected Patterns</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedAlert.patterns.map((pattern, i) => (
                      <Badge key={i} variant="secondary">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recommendations</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAlert.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
              <Button onClick={() => {
                if (selectedAlert) {
                  handleAcknowledgeAlert(selectedAlert.id);
                  setSelectedAlert(null);
                }
              }}>
                Acknowledge Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}