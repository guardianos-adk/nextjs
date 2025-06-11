"use client";

import { motion } from "framer-motion";
import { useDashboard, useAgents, useSentinel } from "@/hooks/use-guardian";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeatmapChart } from "@/components/ui/heatmaps";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Shield, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Cpu,
  Database,
  Network
} from "lucide-react";

interface HealthMetric {
  label: string;
  value: number;
  maxValue: number;
  status: "healthy" | "warning" | "critical";
  icon: React.ReactNode;
}

function HealthIndicator({ label, value, maxValue, status, icon }: HealthMetric) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-emerald-500";
      case "warning": return "text-amber-500";
      case "critical": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "critical": return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-background/50">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">
            {value} / {maxValue}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <Progress 
            value={percentage} 
            className="h-2"
          />
        </div>
        <div className={getStatusColor(status)}>
          {getStatusIcon(status)}
        </div>
      </div>
    </div>
  );
}

function AgentStatusGrid() {
  const { agents, agentsLoading } = useAgents();

  if (agentsLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const mockAgents = agents.length > 0 ? agents : [
    { id: "1", name: "TransactionMonitor", status: "healthy", performanceScore: 0.95 },
    { id: "2", name: "RiskAssessment", status: "healthy", performanceScore: 0.88 },
    { id: "3", name: "GuardianCouncil", status: "healthy", performanceScore: 0.97 },
    { id: "4", name: "PrivacyRevoker", status: "healthy", performanceScore: 0.92 },
    { id: "5", name: "MonitoringConsensus", status: "degraded", performanceScore: 0.74 },
    { id: "6", name: "ComplianceAuditor", status: "offline", performanceScore: 0.00 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
      case "degraded": return "bg-amber-500/20 border-amber-500/30 text-amber-400";
      case "unhealthy": return "bg-red-500/20 border-red-500/30 text-red-400";
      case "offline": return "bg-gray-500/20 border-gray-500/30 text-gray-400";
      default: return "bg-muted/20 border-border/30 text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {mockAgents.map((agent) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className={`p-3 rounded-lg border text-center ${getStatusColor(agent.status)} transition-all duration-200 cursor-pointer`}
        >
          <p className="text-xs font-medium truncate">{agent.name}</p>
          <p className="text-xs opacity-75 mt-1">
            {(agent.performanceScore * 100).toFixed(0)}%
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function SystemHealthWidget() {
  const { systemHealth, isLoading } = useDashboard();
  const { agents } = useAgents();
  const { systemStatus } = useSentinel();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration
  const health = systemHealth || {
    agents: { healthy: 5, total: 6 },
    consensus: { successRate: 94.7, avgTime: 2.3 },
    throughput: { current: 156, capacity: 200 },
    alerts: { active: 2, critical: 0 }
  };

  const healthMetrics: HealthMetric[] = [
    {
      label: "Agent Health",
      value: health.agents.healthy,
      maxValue: health.agents.total,
      status: health.agents.healthy / health.agents.total > 0.8 ? "healthy" : "warning",
      icon: <Cpu className="h-4 w-4" />
    },
    {
      label: "System Throughput",
      value: health.throughput.current,
      maxValue: health.throughput.capacity,
      status: health.throughput.current / health.throughput.capacity > 0.7 ? "healthy" : "warning",
      icon: <Database className="h-4 w-4" />
    },
    {
      label: "Network Consensus",
      value: Math.round(health.consensus.successRate),
      maxValue: 100,
      status: health.consensus.successRate > 90 ? "healthy" : "warning",
      icon: <Network className="h-4 w-4" />
    },
    {
      label: "Response Time",
      value: Math.round(health.consensus.avgTime),
      maxValue: 10,
      status: health.consensus.avgTime < 5 ? "healthy" : "warning",
      icon: <Clock className="h-4 w-4" />
    }
  ];

  const overallStatus = health.alerts.critical > 0 
    ? "critical" 
    : health.agents.healthy / health.agents.total < 0.8 
    ? "warning" 
    : "healthy";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              System Health Overview
            </CardTitle>
            <Badge 
              variant={overallStatus === "healthy" ? "default" : overallStatus === "warning" ? "secondary" : "destructive"}
              className="text-xs"
            >
              {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Metrics */}
          <div className="space-y-3">
            {healthMetrics.map((metric, index) => (
              <HealthIndicator key={index} {...metric} />
            ))}
          </div>

          {/* Agent Status Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">ADK Agent Status</h4>
            <AgentStatusGrid />
          </div>

          {/* System Performance Heatmap */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Performance Matrix</h4>
            <div className="bg-muted/20 rounded-lg p-2 border border-border/50">
              <HeatmapChart 
                width={280} 
                height={120}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                events={false}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-500">{health.agents.healthy}</p>
              <p className="text-xs text-muted-foreground">Healthy Agents</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-500">{health.consensus.successRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Consensus Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-500">{health.alerts.active}</p>
              <p className="text-xs text-muted-foreground">Active Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
