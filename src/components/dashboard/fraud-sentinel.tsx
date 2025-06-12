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

function TransactionFlowMonitor() {
  const currentTime = useCurrentTime();
  
  // Mock real-time transaction flow data
  const [flowData, setFlowData] = useState({
    totalTransactions: 1247,
    flaggedTransactions: 23,
    processingRate: 156,
    riskScore: 2.3
  });

  useEffect(() => {
    if (!currentTime) return;
    
    const interval = setInterval(() => {
      setFlowData(prev => ({
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        flaggedTransactions: prev.flaggedTransactions + (Math.random() > 0.9 ? 1 : 0),
        processingRate: 150 + Math.floor(Math.random() * 20),
        riskScore: 1.5 + Math.random() * 2
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentTime]);

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
          <Badge variant="outline" className="text-xs">
            Live
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
              +{flowData.processingRate}/min
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
              {((flowData.flaggedTransactions / flowData.totalTransactions) * 100).toFixed(2)}% rate
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
              Operational
            </div>
            <div className="text-xs text-muted-foreground">
              All systems active
            </div>
          </div>
        </div>
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

          {/* Transaction Flow Monitor */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Real-time Transaction Analysis</h4>
            <TransactionFlowMonitor />
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
              {alerts.slice(0, 3).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FraudAlert alert={alert} onAcknowledge={handleAcknowledgeAlert} />
                </motion.div>
              ))}
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
