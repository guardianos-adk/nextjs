"use client";

import { motion } from "framer-motion";
import { useCurrentTime } from "@/hooks/use-client-only";
import { useSentinel } from "@/hooks/use-guardian";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DarkpoolChart } from "@/components/ui/darkpool-visualiser";
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
  Target
} from "lucide-react";
import { Alert as AlertType } from "@/lib/types";
import { useState, useEffect } from "react";

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
}

function MetricTile({ title, value, change, trend, icon, color }: MetricTileProps) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case "down": return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

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

function TransactionClusterView() {
  // Mock transaction cluster data for demonstration
  const clusterData = {
    name: "Root",
    children: [
      {
        name: "Legitimate Transactions",
        size: 850,
        suspicious: false
      },
      {
        name: "High-Risk Clusters",
        children: [
          { name: "Mixing Service", size: 45, suspicious: true },
          { name: "Rapid Transfers", size: 32, suspicious: true },
          { name: "Cross-Border", size: 28, suspicious: true }
        ]
      },
      {
        name: "Medium-Risk Clusters", 
        children: [
          { name: "New Addresses", size: 67, suspicious: false },
          { name: "Large Amounts", size: 23, suspicious: false }
        ]
      },
      {
        name: "Flagged Transactions",
        children: [
          { name: "Sanctions List", size: 8, suspicious: true },
          { name: "PEP Related", size: 5, suspicious: true }
        ]
      }
    ]
  };

  return (
    <div className="h-64 w-full bg-muted/20 rounded-lg border border-border/50 p-4">
      <div className="h-full w-full flex items-center justify-center">
        <DarkpoolChart 
          width={400} 
          height={224}
        />
      </div>
    </div>
  );
}

export function FraudSentinelMonitor() {
  const { alerts, acknowledgeAlert } = useSentinel();
  const [realTimeData, setRealTimeData] = useState({
    transactionsScanned: 1247,
    fraudDetected: 23,
    falsePositives: 5,
    accuracy: 94.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        transactionsScanned: prev.transactionsScanned + Math.floor(Math.random() * 5),
        fraudDetected: prev.fraudDetected + (Math.random() > 0.95 ? 1 : 0),
        falsePositives: prev.falsePositives + (Math.random() > 0.98 ? 1 : 0),
        accuracy: 94.3 + (Math.random() - 0.5) * 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock alerts for demonstration (using fixed timestamps to avoid hydration issues)
  const baseTime = new Date('2024-06-11T12:00:00Z');
  const mockAlerts: AlertType[] = [
    {
      id: "alert-1",
      type: "fraud_detected",
      severity: "high",
      title: "Suspicious Transaction Pattern Detected",
      description: "Multiple rapid transfers between new addresses exceeding velocity thresholds",
      timestamp: new Date(baseTime.getTime() - 1000 * 60 * 15).toISOString(),
      source: "TransactionMonitor",
      status: "active"
    },
    {
      id: "alert-2", 
      type: "performance_degradation",
      severity: "medium",
      title: "Agent Performance Degradation",
      description: "RiskAssessment agent response time increased by 45% over baseline",
      timestamp: new Date(baseTime.getTime() - 1000 * 60 * 30).toISOString(),
      source: "MonitoringConsensus",
      status: "active"
    },
    {
      id: "alert-3",
      type: "fraud_detected",
      severity: "critical",
      title: "Sanctions List Match",
      description: "Transaction involving wallet address on OFAC sanctions list",
      timestamp: new Date(baseTime.getTime() - 1000 * 60 * 45).toISOString(),
      source: "ComplianceEngine",
      status: "acknowledged"
    }
  ];

  const alertData = alerts && alerts.length > 0 ? alerts : mockAlerts;
  const activeAlerts = alertData.filter(a => a.status === "active");

  const handleAcknowledgeAlert = (alertId: string) => {
    console.log(`Acknowledging alert ${alertId}`);
    acknowledgeAlert(alertId);
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
              <Badge variant={activeAlerts.length > 0 ? "destructive" : "default"} className="text-xs">
                <Bell className="h-3 w-3 mr-1" />
                {activeAlerts.length} Active Alerts
              </Badge>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
                Monitoring
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Real-time Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricTile
              title="Transactions Scanned"
              value={realTimeData.transactionsScanned.toLocaleString()}
              change="+12.3%"
              trend="up"
              icon={<Eye className="h-4 w-4 text-blue-500" />}
              color="from-blue-500/10 to-blue-600/10"
            />
            
            <MetricTile
              title="Fraud Detected"
              value={realTimeData.fraudDetected.toString()}
              change="+8.7%"
              trend="up"
              icon={<Target className="h-4 w-4 text-red-500" />}
              color="from-red-500/10 to-red-600/10"
            />
            
            <MetricTile
              title="False Positives"
              value={realTimeData.falsePositives.toString()}
              change="-15.2%"
              trend="down"
              icon={<XCircle className="h-4 w-4 text-amber-500" />}
              color="from-amber-500/10 to-amber-600/10"
            />
            
            <MetricTile
              title="Accuracy Rate"
              value={`${realTimeData.accuracy.toFixed(1)}%`}
              change="+2.1%"
              trend="up"
              icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
              color="from-emerald-500/10 to-emerald-600/10"
            />
          </div>

          {/* Transaction Cluster Visualization & Alerts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Transaction Pattern Analysis</h4>
              <TransactionClusterView />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Clustering Algorithm: Behavioral Analysis</span>
                <span>Updated 30s ago</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Alerts</h4>
                <Button size="sm" variant="ghost" className="text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activeAlerts.length > 0 ? (
                  activeAlerts.slice(0, 3).map((alert) => (
                    <FraudAlert
                      key={alert.id}
                      alert={alert}
                      onAcknowledge={handleAcknowledgeAlert}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Last scan: <span className="font-medium">2.3 seconds ago</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                Run Deep Scan
              </Button>
              <Button size="sm" variant="outline">
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
