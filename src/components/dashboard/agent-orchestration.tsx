"use client";

import { motion } from "framer-motion";
import { useAgents } from "@/hooks/use-guardian";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Bot, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  Network,
  Wifi,
  WifiOff
} from "lucide-react";
import { ADKAgent, WorkflowExecution } from "@/lib/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: ADKAgent;
  onRestart: (agentId: string) => void;
  onConfigure: (agentId: string) => void;
}

function AgentCard({ agent, onRestart, onConfigure }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "border-emerald-500 bg-emerald-500/10";
      case "degraded": return "border-amber-500 bg-amber-500/10";
      case "unhealthy": return "border-red-500 bg-red-500/10";
      case "offline": return "border-gray-500 bg-gray-500/10";
      default: return "border-border bg-card";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "degraded": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "unhealthy": return <XCircle className="h-4 w-4 text-red-500" />;
      case "offline": return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      degraded: "secondary",
      unhealthy: "destructive",
      offline: "outline"
    } as const;
    
    return variants[status as keyof typeof variants] || "secondary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`border-2 ${getStatusColor(agent.status)} transition-all duration-200 hover:shadow-lg`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <h3 className="font-semibold text-sm">{agent.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{agent.type}</p>
            </div>
            <div className="flex items-center gap-1">
              {getStatusIcon(agent.status)}
              <Badge variant={getStatusBadge(agent.status)} className="text-xs">
                {agent.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground">Performance</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-medium">{(agent.performanceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Reputation</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium">{agent.reputationWeight.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Success Rate</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-medium">{agent.executionStats?.successRate?.toFixed(1) || 0}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Avg Time</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-medium">{agent.executionStats?.averageExecutionTime || 0}ms</span>
              </div>
            </div>
          </div>

          {/* Health Indicators */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Resource Usage</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  <span>CPU</span>
                </div>
                <span>{agent.health?.cpu || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <MemoryStick className="h-3 w-3" />
                  <span>Memory</span>
                </div>
                <span>{agent.health?.memory || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Network className="h-3 w-3" />
                  <span>Response</span>
                </div>
                <span>{agent.health?.responseTime || 0}ms</span>
              </div>
            </div>
          </div>

          {/* Current Workflow */}
          {agent.currentWorkflow && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Workflow</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium truncate">{agent.currentWorkflow}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onRestart(agent.id)}
              disabled={agent.status === "offline"}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Restart
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-xs"
              onClick={() => onConfigure(agent.id)}
            >
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WorkflowExecutionList({ workflows }: { workflows: WorkflowExecution[] }) {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No active workflows</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workflows.slice(0, 3).map((workflow) => (
        <motion.div
          key={workflow.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">{workflow.workflowType}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Step: {workflow.currentStep || "Initializing"}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="outline" className="text-xs">
              {workflow.status}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {workflow.progress.toFixed(0)}% complete
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AgentPerformanceChart({ agents }: { agents: ADKAgent[] }) {
  // Create performance data from actual agents
  const performanceData = agents.map(agent => ({
    name: agent.name.replace(/Agent$/, '').slice(0, 15),
    performance: Math.round(agent.performanceScore * 100),
    fill: getAgentColor(agent.type)
  }));

  function getAgentColor(type: string) {
    const colors: Record<string, string> = {
      TransactionMonitor: "#3b82f6",
      RiskAssessment: "#10b981",
      GuardianCouncil: "#8b5cf6",
      PrivacyRevoker: "#f59e0b",
      MonitoringConsensus: "#ef4444",
      ComplianceAuditor: "#06b6d4"
    };
    return colors[type] || "#6b7280";
  }

  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <Bot className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No agent data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              fontSize: "12px"
            }}
            formatter={(value) => [`${value}%`, "Performance"]}
          />
          <Bar 
            dataKey="performance" 
            radius={[4, 4, 0, 0]}
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AgentOrchestrationPanel() {
  const { agents, workflows, agentsLoading, workflowsLoading, restartAgent, triggerWorkflow } = useAgents();
  const [isConnected, setIsConnected] = useState(false);

  // Check if we have real data
  useEffect(() => {
    setIsConnected(agents.length > 0 || (Array.isArray(agents) && !agentsLoading));
  }, [agents, agentsLoading]);

  // Use actual data from API
  const agentData = agents || [];
  const workflowData = workflows || [];

  const handleRestart = async (agentId: string) => {
    if (!restartAgent) {
      toast.error("Backend not connected. Please ensure the backend services are running.");
      return;
    }

    try {
      await restartAgent(agentId);
      toast.success(`Agent ${agentId} restart initiated`);
    } catch (error) {
      toast.error("Failed to restart agent. Please try again.");
    }
  };

  const handleConfigure = (agentId: string) => {
    toast.info("Agent configuration will be available in the next update.");
  };

  const handleTriggerWorkflow = async () => {
    if (!triggerWorkflow) {
      toast.error("Backend not connected. Please ensure the backend services are running.");
      return;
    }

    try {
      await triggerWorkflow({
        type: "compliance_analysis",
        data: {
          transactionId: "0x1234567890abcdef",
          urgency: "high"
        }
      });
      toast.success("New workflow triggered successfully");
    } catch (error) {
      toast.error("Failed to trigger workflow. Please try again.");
    }
  };

  if (agentsLoading) {
    return (
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            ADK Agent Orchestration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthyAgents = agentData.filter((a: any) => a.status === "healthy").length;
  const totalAgents = agentData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              ADK Agent Orchestration
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
              <Badge variant="outline" className="text-xs">
                {healthyAgents}/{totalAgents} Healthy
              </Badge>
              <Button 
                size="sm" 
                onClick={handleTriggerWorkflow}
                disabled={!isConnected}
              >
                <Play className="h-3 w-3 mr-1" />
                New Workflow
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Connection warning */}
          {!isConnected && !agentsLoading && (
            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium">Agent orchestration service not connected</p>
                  <p className="text-xs mt-1 opacity-80">
                    Please ensure the backend services are running on port 8000.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Agent Grid */}
          {agentData.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {agentData.map((agent: any) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onRestart={handleRestart}
                  onConfigure={handleConfigure}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {isConnected ? "No agents registered" : "Waiting for agent data..."}
              </p>
            </div>
          )}

          {/* Performance Chart & Active Workflows */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Agent Performance Overview</h4>
              <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                <AgentPerformanceChart agents={agentData} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Active Workflows</h4>
                <Badge variant="secondary" className="text-xs">
                  {workflowData.length} running
                </Badge>
              </div>
              <WorkflowExecutionList workflows={workflowData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}