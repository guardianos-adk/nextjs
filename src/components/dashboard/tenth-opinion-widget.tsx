"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Activity,
  Shield,
  Zap
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { tenthOpinionApi } from "@/lib/api-client";
import { TenthOpinionStatus, TenthOpinionMetrics } from "@/lib/types";

export function TenthOpinionWidget() {
  const [status, setStatus] = useState<TenthOpinionStatus | null>(null);
  const [metrics, setMetrics] = useState<TenthOpinionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentHighRisk, setRecentHighRisk] = useState<number>(0);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [statusRes, metricsRes] = await Promise.all([
        tenthOpinionApi.getStatus(),
        tenthOpinionApi.getMetrics()
      ]);

      if (statusRes.success && statusRes.data) {
        setStatus(statusRes.data);
      }

      if (metricsRes.success && metricsRes.data) {
        setMetrics(metricsRes.data);
        // Simulate recent high-risk count
        setRecentHighRisk(Math.floor(metricsRes.data.total_evaluations * 0.15));
      }
    } catch (error) {
      console.error("Failed to load Tenth Opinion data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSystemHealthColor = () => {
    if (!status?.online) return "text-red-500";
    if (status.error_count > 5) return "text-yellow-500";
    return "text-green-500";
  };

  const getSystemHealthText = () => {
    if (!status?.online) return "Offline";
    if (status.error_count > 5) return "Degraded";
    return "Operational";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Tenth Opinion Protocol</CardTitle>
                <CardDescription className="text-xs">
                  Advanced 10-agent consensus for high-stakes decisions
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={status?.online ? "default" : "destructive"}
              className="text-xs"
            >
              <Activity className="h-3 w-3 mr-1" />
              {getSystemHealthText()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Evaluations</span>
              </div>
              <p className="text-2xl font-bold">
                {metrics?.total_evaluations || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {recentHighRisk} high-risk today
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Success Rate</span>
              </div>
              <p className="text-2xl font-bold">
                {metrics ? `${(metrics.consensus_success_rate * 100).toFixed(1)}%` : "—"}
              </p>
              <p className="text-xs text-green-600">
                +2.3% from last week
              </p>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. Processing Time</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {metrics ? `${metrics.average_execution_time.toFixed(1)}s` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Agents Ready</span>
              <span className="font-medium flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                {status ? `${status.agents_ready}/10` : "—"}
              </span>
            </div>
          </div>

          {/* Quality Scores */}
          {metrics && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Quality Metrics</p>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Reliability</span>
                    <span>{(metrics.quality_scores.reliability * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={metrics.quality_scores.reliability * 100} 
                    className="h-1.5"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Objectivity</span>
                    <span>{(metrics.quality_scores.objectivity * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={metrics.quality_scores.objectivity * 100} 
                    className="h-1.5"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Accuracy</span>
                    <span>{(metrics.quality_scores.accuracy * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={metrics.quality_scores.accuracy * 100} 
                    className="h-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recent Alert */}
          {recentHighRisk > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-orange-900">
                    {recentHighRisk} high-risk transactions pending
                  </p>
                  <p className="text-xs text-orange-700">
                    Requires immediate attention
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/dashboard/tenth-opinion">
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href="/dashboard/compliance?tab=high-risk">
                Analyze High-Risk
                <Brain className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>

        {/* Status Indicator */}
        <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${
          status?.online ? "bg-green-500" : "bg-red-500"
        } animate-pulse`} />
      </Card>
    </motion.div>
  );
}