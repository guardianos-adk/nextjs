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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'acknowledged' | 'resolved';
  timestamp: string;
  source: string;
  category: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const fetchAlerts = async () => {
    try {
      // Fetch from multiple sources
      const [fraudResponse, agentResponse, complianceResponse] = await Promise.all([
        fetch("http://localhost:8001/api/v1/fraud/alerts?limit=20"),
        fetch("http://localhost:8000/api/v1/adk/agents/status"),
        fetch("http://localhost:8000/api/v1/compliance/updates?days=1")
      ]);

      const systemAlerts: SystemAlert[] = [];

      // Process fraud alerts
      if (fraudResponse.ok) {
        const fraudData = await fraudResponse.json();
        const fraudAlerts = fraudData.map((alert: any) => ({
          id: alert.id,
          title: alert.ruleTriggered || "Fraud Alert",
          description: alert.reason || "Suspicious activity detected",
          severity: alert.severity === 'critical' ? 'critical' : 
                   alert.severity === 'high' ? 'high' : 
                   alert.severity === 'medium' ? 'medium' : 'low',
          status: alert.acknowledged ? 'acknowledged' : 'active',
          timestamp: alert.timestamp,
          source: "FraudSentinel",
          category: "fraud_detection"
        }));
        systemAlerts.push(...fraudAlerts);
      }

      // Process agent alerts
      if (agentResponse.ok) {
        const agentData = await agentResponse.json();
        const agentAlerts = agentData
          .filter((agent: any) => agent.status !== 'healthy' || agent.performanceScore < 0.8)
          .map((agent: any) => ({
            id: `agent-${agent.id}`,
            title: `Agent ${agent.name} ${agent.status === 'unhealthy' ? 'Unhealthy' : 'Performance Issue'}`,
            description: agent.status === 'unhealthy' ? 
              'Agent is not responding' : 
              `Performance score: ${(agent.performanceScore * 100).toFixed(1)}%`,
            severity: agent.status === 'unhealthy' ? 'critical' : 
                     agent.performanceScore < 0.7 ? 'high' : 'medium',
            status: 'active',
            timestamp: agent.lastHeartbeat,
            source: "SystemMonitor",
            category: "system"
          }));
        systemAlerts.push(...agentAlerts);
      }

      // Process compliance alerts
      if (complianceResponse.ok) {
        const complianceData = await complianceResponse.json();
        if (complianceData.updates && complianceData.updates.length > 0) {
          const complianceAlerts = complianceData.updates.map((update: any) => ({
            id: `compliance-${update.id || Date.now()}`,
            title: update.title || "Compliance Update",
            description: update.description || update.summary || "New compliance requirement",
            severity: update.urgency === 'high' ? 'high' : 'medium',
            status: 'active',
            timestamp: update.published_at || new Date().toISOString(),
            source: "ComplianceEngine",
            category: "compliance"
          }));
          systemAlerts.push(...complianceAlerts);
        }
      }

      // Sort by timestamp (newest first)
      systemAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setAlerts(systemAlerts);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAlerts();
    toast.success("Alerts refreshed");
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      // For fraud alerts, use the acknowledge endpoint
      if (alertId.startsWith('alert_fraud_')) {
        const response = await fetch(`http://localhost:8001/api/v1/fraud/alerts/${alertId}/acknowledge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          setAlerts(prev => prev.map(alert => 
            alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
          ));
          toast.success("Alert acknowledged");
        }
      } else {
        // For other alerts, just update locally
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
        ));
        toast.success("Alert acknowledged");
      }
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(alert => 
      alert.status === 'active' ? { ...alert, status: 'acknowledged' as const } : alert
    ));
    toast.success("All alerts marked as read");
  };

  // Filter alerts based on search and severity
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === "" || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500 bg-red-500/10 text-red-700";
      case "high": return "border-orange-500 bg-orange-500/10 text-orange-700";
      case "medium": return "border-yellow-500 bg-yellow-500/10 text-yellow-700";
      case "low": return "border-blue-500 bg-blue-500/10 text-blue-700";
      default: return "border-gray-500 bg-gray-500/10 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-red-600 bg-red-100";
      case "investigating": return "text-orange-600 bg-orange-100";
      case "acknowledged": return "text-yellow-600 bg-yellow-100";
      case "resolved": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low": return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
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
                  <BreadcrumbPage>Alert Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Alert Management</h2>
              <p className="text-muted-foreground">
                Security and performance alerts across all systems
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
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
                  <p>Backend services are not available. Showing cached alerts.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search alerts..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={filterSeverity === "all" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterSeverity("all")}
                  >
                    All ({alerts.length})
                  </Badge>
                  <Badge 
                    variant={filterSeverity === "critical" ? "destructive" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterSeverity("critical")}
                  >
                    Critical ({alerts.filter(a => a.severity === "critical").length})
                  </Badge>
                  <Badge 
                    variant={filterSeverity === "high" ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterSeverity("high")}
                  >
                    High ({alerts.filter(a => a.severity === "high").length})
                  </Badge>
                  <Badge 
                    variant={filterSeverity === "medium" ? "outline" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterSeverity("medium")}
                  >
                    Medium ({alerts.filter(a => a.severity === "medium").length})
                  </Badge>
                  <Badge 
                    variant={filterSeverity === "low" ? "outline" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterSeverity("low")}
                  >
                    Low ({alerts.filter(a => a.severity === "low").length})
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">Loading alerts...</div>
                </CardContent>
              </Card>
            ) : filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    {searchQuery || filterSeverity !== "all" 
                      ? "No alerts match your filters" 
                      : "No active alerts"}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Alert className={`border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">{alert.title}</h4>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </div>
                          <AlertDescription className="text-xs">
                            {alert.description}
                          </AlertDescription>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                            <span>•</span>
                            <span>{alert.source}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.severity}
                        </Badge>
                        {alert.status === "active" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-7"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))
            )}
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.severity === "critical").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.severity === "high").length}
                  </div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {alerts.filter(a => a.severity === "medium").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {alerts.filter(a => a.severity === "low").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}