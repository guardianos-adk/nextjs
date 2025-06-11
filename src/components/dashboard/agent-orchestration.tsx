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
  Network
} from "lucide-react";
import { ADKAgent, WorkflowExecution } from "@/lib/types";

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

function AgentPerformanceChart() {
  // Mock performance data for the chart
  const performanceData = [
    { name: "TransactionMonitor", performance: 95, fill: "#3b82f6" },
    { name: "RiskAssessment", performance: 88, fill: "#10b981" },
    { name: "GuardianCouncil", performance: 97, fill: "#8b5cf6" },
    { name: "PrivacyRevoker", performance: 92, fill: "#f59e0b" },
    { name: "MonitoringConsensus", performance: 74, fill: "#ef4444" },
    { name: "ComplianceAuditor", performance: 85, fill: "#06b6d4" }
  ];

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

  // Mock data for demonstration
  const mockAgents: ADKAgent[] = [
    {
      id: "agent-1",
      name: "TransactionMonitor",
      type: "TransactionMonitor",
      status: "healthy",
      health: { cpu: 45, memory: 32, responseTime: 120, errorRate: 0.1 },
      lastHeartbeat: new Date().toISOString(),
      performanceScore: 0.95,
      reputationWeight: 1.0,
      executionStats: {
        totalExecutions: 1247,
        successRate: 99.4,
        averageExecutionTime: 450,
        errorCount: 7
      }
    },
    {
      id: "agent-2",
      name: "RiskAssessment",
      type: "RiskAssessment",
      status: "healthy",
      health: { cpu: 67, memory: 78, responseTime: 1200, errorRate: 0.3 },
      lastHeartbeat: new Date().toISOString(),
      performanceScore: 0.88,
      reputationWeight: 0.832,
      executionStats: {
        totalExecutions: 1247,
        successRate: 98.8,
        averageExecutionTime: 1200,
        errorCount: 15
      },
      currentWorkflow: "High-risk transaction analysis"
    },
    {
      id: "agent-3",
      name: "GuardianCouncil",
      type: "GuardianCouncil",
      status: "healthy",
      health: { cpu: 23, memory: 45, responseTime: 1400, errorRate: 0.1 },
      lastHeartbeat: new Date().toISOString(),
      performanceScore: 0.97,
      reputationWeight: 1.0,
      executionStats: {
        totalExecutions: 89,
        successRate: 99.7,
        averageExecutionTime: 1400,
        errorCount: 0
      }
    },
    {
      id: "agent-4",
      name: "PrivacyRevoker",
      type: "PrivacyRevoker",
      status: "degraded",
      health: { cpu: 89, memory: 92, responseTime: 210, errorRate: 1.2 },
      lastHeartbeat: new Date().toISOString(),
      performanceScore: 0.74,
      reputationWeight: 0.924,
      executionStats: {
        totalExecutions: 89,
        successRate: 99.1,
        averageExecutionTime: 210,
        errorCount: 1
      }
    }
  ];

  const mockWorkflows: WorkflowExecution[] = [
    {
      id: "workflow-1",
      workflowType: "Compliance Analysis",
      status: "running",
      startTime: new Date().toISOString(),
      inputData: {},
      agents: ["agent-1", "agent-2"],
      currentStep: "Risk Assessment",
      progress: 45
    },
    {
      id: "workflow-2",
      workflowType: "Guardian Consensus",
      status: "running",
      startTime: new Date().toISOString(),
      inputData: {},
      agents: ["agent-3"],
      currentStep: "Vote Collection",
      progress: 78
    }
  ];

  const agentData = agents.length > 0 ? agents : mockAgents;
  const workflowData = workflows.length > 0 ? workflows : mockWorkflows;

  const handleRestart = (agentId: string) => {
    console.log(`Restarting agent ${agentId}`);
    restartAgent(agentId);
  };

  const handleConfigure = (agentId: string) => {
    console.log(`Configuring agent ${agentId}`);
    // Navigate to agent configuration page
  };

  const handleTriggerWorkflow = () => {
    console.log("Triggering new workflow");
    triggerWorkflow({
      type: "compliance_analysis",
      data: {
        transactionId: "0x1234567890abcdef",
        urgency: "high"
      }
    });
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

  const healthyAgents = agentData.filter(a => a.status === "healthy").length;
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
              <Badge variant="outline" className="text-xs">
                {healthyAgents}/{totalAgents} Healthy
              </Badge>
              <Button size="sm" onClick={handleTriggerWorkflow}>
                <Play className="h-3 w-3 mr-1" />
                New Workflow
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Agent Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agentData.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRestart={handleRestart}
                onConfigure={handleConfigure}
              />
            ))}
          </div>

          {/* Performance Chart & Active Workflows */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Agent Performance Overview</h4>
              <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                <AgentPerformanceChart />
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
