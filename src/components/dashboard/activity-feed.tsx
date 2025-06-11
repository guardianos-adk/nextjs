/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { useGuardianActivity } from "@/hooks/use-guardian";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import { useCurrentTime } from "@/hooks/use-client-only";
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  FileText,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "vote" | "consensus" | "request" | "alert" | "agent_action";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "failed" | "warning";
  guardianId?: string;
  guardianName?: string;
  jurisdiction?: string;
  metadata?: Record<string, unknown>;
}

interface ActivityItemProps {
  activity: ActivityItem;
  index: number;
}

function ActivityItemComponent({ activity, index }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'vote':
        return activity.status === 'success' ? 
          <CheckCircle className="h-4 w-4" /> : 
          <Vote className="h-4 w-4" />;
      case 'request':
        return <FileText className="h-4 w-4" />;
      case 'consensus':
        return <CheckCircle className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'agent_action':
        return <Activity className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (activity.status) {
      case 'success':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadge = () => {
    const variants = {
      success: 'default',
      pending: 'secondary',
      failed: 'destructive',
      warning: 'outline'
    } as const;
    
    return variants[activity.status] || 'secondary';
  };

  const getJurisdictionColor = (jurisdiction?: string) => {
    const colors = {
      ECB: 'bg-blue-500',
      DNB: 'bg-orange-500',
      BaFin: 'bg-red-500',
      FINMA: 'bg-green-500',
      FCA: 'bg-purple-500',
      SEC: 'bg-indigo-500',
      CFTC: 'bg-yellow-500',
      FinCEN: 'bg-pink-500',
      AUSTRAC: 'bg-teal-500',
      JFSA: 'bg-cyan-500',
    };
    return colors[jurisdiction as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200",
        "hover:shadow-md hover:shadow-primary/5 hover:border-primary/20",
        getStatusColor()
      )}>
        {/* Icon */}
        <div className={cn(
          "p-2 rounded-lg border flex-shrink-0 transition-all duration-200",
          "group-hover:scale-110",
          getStatusColor()
        )}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-foreground leading-tight">
                {activity.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {activity.description}
              </p>
              
              {/* Guardian Info */}
              {activity.guardianName && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center",
                    getJurisdictionColor(activity.jurisdiction)
                  )}>
                    <Users className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {activity.guardianName}
                  </span>
                  {activity.jurisdiction && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {activity.jurisdiction}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Status & Time */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge variant={getStatusBadge()} className="text-xs">
                {activity.status}
              </Badge>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </time>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
        >
          <Activity className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4">
          <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GuardianActivityFeed() {
  const { recentActivity, isLoading } = useGuardianActivity();

  // Mock activity data for demonstration (using fixed timestamps to avoid hydration issues)
  const baseTime = new Date('2024-06-11T12:00:00Z');
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "vote",
      title: "Vote Submitted for Request #DE-2024-001",
      description: "Approved de-anonymization request for suspicious transaction with medium confidence level",
      timestamp: new Date(baseTime.getTime() - 5 * 60 * 1000).toISOString(),
      status: "success",
      guardianId: "guard-ecb-001",
      guardianName: "European Central Bank",
      jurisdiction: "ECB",
      metadata: { requestId: "DE-2024-001", decision: "APPROVE" }
    },
    {
      id: "2", 
      type: "consensus",
      title: "Consensus Reached: Request #DE-2024-002",
      description: "Threshold consensus achieved with 4/5 guardians approving cross-border investigation",
      timestamp: new Date(baseTime.getTime() - 15 * 60 * 1000).toISOString(),
      status: "success",
      metadata: { requestId: "DE-2024-002", threshold: "4/5" }
    },
    {
      id: "3",
      type: "alert",
      title: "High-Risk Transaction Detected",
      description: "FraudSentinel flagged transaction with AML score of 0.89 requiring immediate review",
      timestamp: new Date(baseTime.getTime() - 32 * 60 * 1000).toISOString(),
      status: "warning",
      metadata: { amlScore: 0.89, riskLevel: "high" }
    },
    {
      id: "4",
      type: "request",
      title: "New De-anonymization Request",
      description: "FINMA submitted request for €75,000 cross-border transaction investigation",
      timestamp: new Date(baseTime.getTime() - 45 * 60 * 1000).toISOString(),
      status: "pending",
      guardianId: "guard-finma-001",
      guardianName: "Swiss Financial Market Supervisory Authority",
      jurisdiction: "FINMA",
      metadata: { amount: "75000", currency: "EUR" }
    },
    {
      id: "5",
      type: "agent_action",
      title: "ADK Agent Performance Update",
      description: "RiskAssessment agent completed 247 evaluations with 94.2% accuracy over last hour",
      timestamp: new Date(baseTime.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      status: "success",
      metadata: { agentType: "RiskAssessment", accuracy: 94.2, evaluations: 247 }
    },
    {
      id: "6",
      type: "vote",
      title: "Vote Timeout: Request #DE-2024-003",
      description: "Voting period expired without reaching consensus threshold",
      timestamp: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      status: "failed",
      metadata: { requestId: "DE-2024-003", reason: "timeout" }
    }
  ];

  const activities = recentActivity || mockActivities;

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Guardian Activity Feed
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time system activity and guardian actions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              View All
              <Activity className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 p-6 pt-4 overflow-y-auto">
        {isLoading ? (
          <ActivityFeedSkeleton />
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 8).map((activity: ActivityItem, index: number) => (
              <ActivityItemComponent 
                key={activity.id} 
                activity={activity} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              No Recent Activity
            </h4>
            <p className="text-xs text-muted-foreground">
              Guardian activity will appear here as actions are performed
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {activities.filter((a: ActivityItem) => a.type === 'vote').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Votes Today
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {activities.filter((a: ActivityItem) => a.status === 'success').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Successful Actions
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {new Set(activities.map((a: ActivityItem) => a.guardianId).filter(Boolean)).size}
            </div>
            <div className="text-xs text-muted-foreground">
              Active Guardians
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
