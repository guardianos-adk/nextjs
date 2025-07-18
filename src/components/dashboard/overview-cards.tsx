"use client";

import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/use-guardian";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Clock, Shield, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  color: "green" | "blue" | "orange" | "red" | "purple";
  isLoading?: boolean;
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  suffix = "", 
  prefix = "",
  icon, 
  color, 
  isLoading 
}: MetricCardProps) {
  const colorClasses = {
    green: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-600",
    blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-600",
    orange: "from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-600",
    red: "from-red-500/10 to-red-600/10 border-red-500/20 text-red-600",
    purple: "from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-600",
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className={`p-6 bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/10 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground/80">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">
                {prefix}
                <CountUp
                  end={value}
                  duration={2}
                  suffix={suffix}
                  preserveValue
                />
              </h3>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${
                  changeType === "increase" 
                    ? "text-emerald-500" 
                    : changeType === "decrease"
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}>
                  {changeType === "increase" && <TrendingUp className="h-3 w-3" />}
                  {changeType === "decrease" && <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function DashboardOverviewCards() {
  const { overview, systemHealth, isLoading } = useDashboard();
  const isConnected = !!overview && !isLoading;

  // Use actual data from API, show zeros when loading
  const data = overview || {
    totalGuardians: 0,
    activeRequests: 0,
    consensusRate: 0,
    systemHealth: "unknown",
    recentActivity: []
  };
  const health = systemHealth || {
    agents: { healthy: 0, total: 0 },
    consensus: { successRate: 0, avgTime: 0 },
    throughput: { current: 0, capacity: 0 },
    alerts: { active: 0, critical: 0 }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case "optimal": return "green";
      case "good": return "blue";
      case "degraded": return "orange";
      case "critical": return "red";
      default: return "purple";
    }
  };

  const getHealthBadge = (status: string) => {
    const variants = {
      optimal: "default",
      good: "secondary", 
      degraded: "outline",
      critical: "destructive"
    } as const;
    
    return variants[status as keyof typeof variants] || "secondary";
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Connected to GuardianOS Backend</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-yellow-500 animate-pulse" />
            <span className="text-muted-foreground">
              {isLoading ? "Connecting to backend..." : "Backend not available - showing default values"}
            </span>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Guardians"
        value={data.totalGuardians}
        change={overview ? 8.2 : undefined}
        changeType="increase"
        icon={<Users className="h-6 w-6" />}
        color="blue"
        isLoading={isLoading}
      />
      
      <MetricCard
        title="Pending Requests"
        value={data.activeRequests}
        change={overview ? -12.5 : undefined}
        changeType="decrease"
        icon={<Clock className="h-6 w-6" />}
        color="orange"
        isLoading={isLoading}
      />
      
      <MetricCard
        title="Consensus Success"
        value={health.consensus.successRate}
        change={systemHealth ? 2.1 : undefined}
        changeType="increase"
        suffix="%"
        icon={<Shield className="h-6 w-6" />}
        color="green"
        isLoading={isLoading}
      />
      
      <div className="space-y-2">
        <MetricCard
          title="Active Alerts"
          value={health.alerts.active}
          change={health.alerts.critical > 0 ? undefined : -25}
          changeType={health.alerts.critical > 0 ? "neutral" : "decrease"}
          icon={<AlertTriangle className="h-6 w-6" />}
          color={health.alerts.critical > 0 ? "red" : "green"}
          isLoading={isLoading}
        />
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <Badge 
              variant={getHealthBadge(data.systemHealth)}
              className={cn(
                "text-xs px-3 py-1 font-medium",
                !isConnected && "opacity-50"
              )}
            >
              System {data.systemHealth === "unknown" ? "Unknown" : data.systemHealth.charAt(0).toUpperCase() + data.systemHealth.slice(1)}
            </Badge>
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
}
