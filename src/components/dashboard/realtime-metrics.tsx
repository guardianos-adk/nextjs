"use client";

import { motion } from "framer-motion";
import { useSentinel } from "@/hooks/use-guardian";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Component as FinanceChart } from "@/components/ui/finance-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Zap, Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface MetricPoint {
  timestamp: Date;
  value: number;
}

interface ChartDataProps {
  data: MetricPoint[];
  title: string;
  color: string;
  icon: React.ReactNode;
  currentValue: number;
  unit: string;
  trend?: "up" | "down" | "stable";
}

// Transform AppleStock-like data for our metrics
function transformToChartData(data: MetricPoint[]) {
  return data.map((point, index) => ({
    date: point.timestamp.toISOString(),
    close: point.value,
  }));
}

function MetricChart({ data, title, color, icon, currentValue, unit, trend }: ChartDataProps) {
  const chartData = transformToChartData(data);
  
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up": return "text-emerald-500";
      case "down": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${getTrendColor(trend)}`}>
              {currentValue.toFixed(1)}{unit}
            </span>
            <span className={`text-sm ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[120px] w-full">
          {chartData.length > 0 ? (
            <FinanceChart width={300} height={120} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="w-full h-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function RealTimeMetrics() {
  const { currentMetrics, systemStatus, statusLoading } = useSentinel();
  const [metricsHistory, setMetricsHistory] = useState<{
    throughput: MetricPoint[];
    fraudDetection: MetricPoint[];
    responseTime: MetricPoint[];
    consensusRate: MetricPoint[];
  }>({
    throughput: [],
    fraudDetection: [],
    responseTime: [],
    consensusRate: []
  });

  // Mock real-time data generation for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint = {
        timestamp: now,
        value: Math.random() * 100 + 50, // Mock data
      };

      setMetricsHistory(prev => ({
        throughput: [...prev.throughput.slice(-19), { 
          ...newPoint, 
          value: Math.random() * 200 + 100 // TPS
        }],
        fraudDetection: [...prev.fraudDetection.slice(-19), { 
          ...newPoint, 
          value: Math.random() * 20 + 80 // Detection rate %
        }],
        responseTime: [...prev.responseTime.slice(-19), { 
          ...newPoint, 
          value: Math.random() * 2000 + 1000 // Response time ms
        }],
        consensusRate: [...prev.consensusRate.slice(-19), { 
          ...newPoint, 
          value: Math.random() * 10 + 90 // Consensus success %
        }],
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Use real data if available, otherwise use mock data
  const metrics = currentMetrics || {
    timestamp: "2024-06-11T12:00:00Z",
    systemHealth: "optimal",
    transactionThroughput: 156.7,
    fraudDetectionRate: 94.3,
    averageProcessingTime: 1247,
    consensusSuccessRate: 97.8,
    alertsGenerated: 3,
    agentPerformance: {}
  };

  if (statusLoading) {
    return (
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              Real-time System Metrics
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricChart
              data={metricsHistory.throughput}
              title="Transaction Throughput"
              color="#3b82f6"
              icon={<Zap className="h-4 w-4 text-blue-500" />}
              currentValue={metrics.transactionThroughput}
              unit=" TPS"
              trend="up"
            />
            
            <MetricChart
              data={metricsHistory.fraudDetection}
              title="Fraud Detection Rate"
              color="#10b981"
              icon={<Shield className="h-4 w-4 text-emerald-500" />}
              currentValue={metrics.fraudDetectionRate}
              unit="%"
              trend="stable"
            />
            
            <MetricChart
              data={metricsHistory.responseTime}
              title="Avg Response Time"
              color="#f59e0b"
              icon={<Activity className="h-4 w-4 text-amber-500" />}
              currentValue={metrics.averageProcessingTime}
              unit="ms"
              trend="down"
            />
            
            <MetricChart
              data={metricsHistory.consensusRate}
              title="Consensus Success"
              color="#8b5cf6"
              icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
              currentValue={metrics.consensusSuccessRate}
              unit="%"
              trend="up"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
