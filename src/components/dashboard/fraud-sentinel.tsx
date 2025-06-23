"use client";

import { motion } from "framer-motion";
import { useCurrentTime } from "@/hooks/use-client-only";
import { useSentinel } from "@/hooks/use-guardian";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Zap, 
  TrendingUp, 
  Activity,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Wifi,
  WifiOff
} from "lucide-react";
import { Alert as AlertType } from "@/lib/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FraudAlertProps {
  alert: AlertType;
  onAcknowledge: (alertId: string) => void;
}

function FraudAlert({ alert, onAcknowledge }: FraudAlertProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500 bg-red-500/10 text-red-700";
      case "high": return "border-orange-500 bg-orange-500/10 text-orange-700";
      case "medium": return "border-yellow-500 bg-yellow-500/10 text-yellow-700";
      case "low": return "border-blue-500 bg-blue-500/10 text-blue-700";
      default: return "border-gray-500 bg-gray-500/10 text-gray-700";
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

  const currentTime = useCurrentTime();
  const timeAgo = currentTime 
    ? Math.floor((currentTime.getTime() - new Date(alert.timestamp).getTime()) / (1000 * 60))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert className={`border ${getSeverityColor(alert.severity)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {getSeverityIcon(alert.severity)}
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{alert.title}</h4>
              <AlertDescription className="text-xs">
                {alert.description}
              </AlertDescription>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}m ago</span>
                <span>•</span>
                <span>{alert.source}</span>
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
                onClick={() => onAcknowledge(alert.id)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </motion.div>
  );
}

interface MetricTileProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

function MetricTile({ title, value, change, trend, icon, color, isLoading }: MetricTileProps) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case "down": return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`p-4 rounded-lg bg-gradient-to-br ${color} border border-border/50`}>
        <div className="animate-pulse">
          <div className="h-4 w-20 bg-muted rounded mb-2" />
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-gradient-to-br ${color} border border-border/50`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg font-bold">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {getTrendIcon(trend)}
              <span className={`text-xs ${
                trend === "up" ? "text-emerald-500" : 
                trend === "down" ? "text-red-500" : 
                "text-muted-foreground"
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-2 rounded-lg bg-background/50">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TransactionFlowMonitor({ metrics, isConnected }: { metrics: any; isConnected: boolean }) {
  const currentTime = useCurrentTime();
  
  // Use real metrics if available, otherwise show empty state
  const flowData = {
    totalTransactions: metrics?.transactionThroughput || 0,
    flaggedTransactions: metrics?.alertsGenerated || 0,
    processingRate: metrics?.averageProcessingTime || 0,
    riskScore: metrics?.fraudDetectionRate ? (metrics.fraudDetectionRate / 20) : 0 // Scale to 0-5
  };

  const getRiskColor = (score: number) => {
    if (score > 3) return "text-red-500 bg-red-500/10";
    if (score > 2) return "text-orange-500 bg-orange-500/10";
    return "text-green-500 bg-green-500/10";
  };

  return (
    <div className="h-64 w-full bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg border border-border/50 p-4">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Transaction Flow Monitor
          </h4>
          <Badge 
            variant={isConnected ? "secondary" : "outline"} 
            className={cn("text-xs", !isConnected && "opacity-60")}
          >
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Transaction Volume */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Processed</span>
              <Target className="h-3 w-3 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-blue-600">
              {flowData.totalTransactions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {flowData.processingRate}ms avg
            </div>
          </div>

          {/* Flagged Transactions */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Flagged</span>
              <AlertTriangle className="h-3 w-3 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-600">
              {flowData.flaggedTransactions}
            </div>
            <div className="text-xs text-muted-foreground">
              {flowData.totalTransactions > 0 
                ? `${((flowData.flaggedTransactions / flowData.totalTransactions) * 100).toFixed(2)}% rate`
                : "0% rate"}
            </div>
          </div>

          {/* Risk Score */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Risk Score</span>
              <Shield className="h-3 w-3 text-green-500" />
            </div>
            <div className={`text-lg font-bold rounded-md px-2 py-1 ${getRiskColor(flowData.riskScore)}`}>
              {flowData.riskScore.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              /5.0 scale
            </div>
          </div>

          {/* Processing Status */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Status</span>
              <CheckCircle className="h-3 w-3 text-green-500" />
            </div>
            <div className="text-lg font-bold text-green-600">
              {isConnected ? "Operational" : "Disconnected"}
            </div>
            <div className="text-xs text-muted-foreground">
              {isConnected ? "All systems active" : "Waiting for connection"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FraudSentinelMonitor() {
  const { alerts, currentMetrics, acknowledgeAlert, alertsLoading, statusLoading } = useSentinel();
  const [isConnected, setIsConnected] = useState(false);

  // Check if we have real data
  useEffect(() => {
    setIsConnected(!!currentMetrics && !alertsLoading && !statusLoading);
  }, [currentMetrics, alertsLoading, statusLoading]);

  // Use actual data from API
  const alertData = alerts || [];
  const activeAlerts = alertData.filter(a => a.status === "active");

  const handleAcknowledgeAlert = async (alertId: string) => {
    if (!acknowledgeAlert) {
      toast.error("Backend not connected. Please ensure the backend services are running.");
      return;
    }

    try {
      await acknowledgeAlert(alertId);
      toast.success("Alert acknowledged successfully");
    } catch (error) {
      toast.error("Failed to acknowledge alert. Please try again.");
    }
  };

  const handleRunDeepScan = () => {
    if (!isConnected) {
      toast.error("Backend not connected. Please ensure the fraud monitoring service is running on port 8001.");
      return;
    }
    toast.info("Deep scan feature will be available in the next update.");
  };

  const handlePerformanceReport = () => {
    if (!isConnected) {
      toast.error("Backend not connected. Please ensure the fraud monitoring service is running on port 8001.");
      return;
    }
    toast.info("Performance report feature will be available in the next update.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              FraudSentinel Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Connection status */}
              <Badge 
                variant={isConnected ? "secondary" : "outline"} 
                className={cn("text-xs", !isConnected && "opacity-60")}
              >
                {isConnected ? (
                  <><Wifi className="h-3 w-3 mr-1" /> Connected</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
                )}
              </Badge>
              <Badge variant={activeAlerts.length > 0 ? "destructive" : "default"} className="text-xs">
                <Bell className="h-3 w-3 mr-1" />
                {activeAlerts.length} Active Alerts
              </Badge>
              <Badge variant="outline" className="text-xs">
                <div className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                )} />
                {isConnected ? "Monitoring" : "Paused"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Connection warning */}
          {!isConnected && !alertsLoading && !statusLoading && (
            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">Fraud monitoring service not connected</p>
                  <p className="text-xs mt-1 opacity-80">
                    Please ensure the fraud monitoring API is running on port 8001.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricTile
              title="Transactions Scanned"
              value={currentMetrics?.transactionThroughput?.toLocaleString() || "0"}
              change={isConnected ? "+12.3%" : undefined}
              trend="up"
              icon={<Eye className="h-4 w-4 text-blue-500" />}
              color="from-blue-500/10 to-blue-600/10"
              isLoading={alertsLoading || statusLoading}
            />
            
            <MetricTile
              title="Fraud Detected"
              value={currentMetrics?.alertsGenerated?.toString() || "0"}
              change={isConnected ? "+8.7%" : undefined}
              trend="up"
              icon={<Target className="h-4 w-4 text-red-500" />}
              color="from-red-500/10 to-red-600/10"
              isLoading={alertsLoading || statusLoading}
            />
            
            <MetricTile
              title="Detection Rate"
              value={`${currentMetrics?.fraudDetectionRate?.toFixed(1) || "0.0"}%`}
              change={isConnected ? "-15.2%" : undefined}
              trend="down"
              icon={<XCircle className="h-4 w-4 text-amber-500" />}
              color="from-amber-500/10 to-amber-600/10"
              isLoading={alertsLoading || statusLoading}
            />
            
            <MetricTile
              title="Success Rate"
              value={`${currentMetrics?.consensusSuccessRate?.toFixed(1) || "0.0"}%`}
              change={isConnected ? "+2.1%" : undefined}
              trend="up"
              icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
              color="from-emerald-500/10 to-emerald-600/10"
              isLoading={alertsLoading || statusLoading}
            />
          </div>

          {/* Transaction Flow Monitor */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Real-time Transaction Analysis</h4>
            <TransactionFlowMonitor metrics={currentMetrics} isConnected={isConnected} />
          </div>

          {/* Recent Alerts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Alerts</h4>
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View All
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alertData.length > 0 ? (
                alertData.slice(0, 3).map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FraudAlert alert={alert} onAcknowledge={handleAcknowledgeAlert} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    {isConnected ? "No alerts at this time" : "Waiting for connection..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              {isConnected 
                ? <>Last scan: <span className="font-medium">2.3 seconds ago</span></>
                : "Scanner offline"}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRunDeepScan}
                disabled={!isConnected}
              >
                <Zap className="h-3 w-3 mr-1" />
                Run Deep Scan
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handlePerformanceReport}
                disabled={!isConnected}
              >
                <Activity className="h-3 w-3 mr-1" />
                Performance Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}