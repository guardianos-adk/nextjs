"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from '@/lib/api-urls'
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bot, Activity, Zap, Clock, CheckCircle, AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface ADKAgent {
  id: string;
  name: string;
  type: string;
  status: string;
  lastHeartbeat: string;
  capabilities: string[];
  performanceScore: number;
  tasksCompleted: number;
  configuration: any;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<ADKAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [deployingAgent, setDeployingAgent] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // New agent deployment form state
  const [agentType, setAgentType] = useState("");
  const [agentName, setAgentName] = useState("");

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')adk/agents/status");
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch agent status:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRestartAgent = async (agentId: string) => {
    try {
      const response = await fetch(`', getApiUrl('/api/v1/')adk/agents/${agentId}/restart`, {
        method: "POST"
      });
      
      if (response.ok) {
        toast.success("Agent restart initiated");
        await fetchAgentStatus();
      } else {
        toast.error("Failed to restart agent");
      }
    } catch (error) {
      toast.error("Failed to connect to backend");
    }
  };

  const handleDeployAgent = async () => {
    if (!agentType || !agentName) {
      toast.error("Please fill in all fields");
      return;
    }

    setDeployingAgent(true);
    try {
      const response = await fetch("', getApiUrl('/api/v1/')adk/workflows/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workflowType: "Agent Deployment",
          inputData: {
            agentType,
            agentName,
            deploymentMode: "production"
          },
          agents: [`agent_${agentType.toLowerCase()}`]
        })
      });

      if (response.ok) {
        toast.success(`Agent deployment initiated for ${agentName}`);
        setDeployDialogOpen(false);
        setAgentType("");
        setAgentName("");
        // Refresh agent list after deployment
        setTimeout(fetchAgentStatus, 2000);
      } else {
        toast.error("Failed to deploy agent");
      }
    } catch (error) {
      toast.error("Failed to connect to backend");
    } finally {
      setDeployingAgent(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAgentStatus();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "active": 
        return "text-green-600 bg-green-100";
      case "idle": 
        return "text-yellow-600 bg-yellow-100";
      case "error":
      case "unhealthy": 
        return "text-red-600 bg-red-100";
      case "restarting":
        return "text-blue-600 bg-blue-100";
      default: 
        return "text-gray-600 bg-gray-100";
    }
  };

  const getWorkload = (agent: ADKAgent) => {
    // Calculate workload based on performance score
    return Math.round(agent.performanceScore * 100);
  };

  const getWorkloadColor = (workload: number) => {
    if (workload > 80) return "text-red-500";
    if (workload > 60) return "text-orange-500";
    return "text-green-500";
  };

  const formatLastActivity = (heartbeat: string) => {
    const now = new Date();
    const lastHeartbeat = new Date(heartbeat);
    const diff = now.getTime() - lastHeartbeat.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  const agentTypes = [
    { value: "transaction_monitor", label: "Transaction Monitor" },
    { value: "risk_assessment", label: "Risk Assessment" },
    { value: "compliance_verification", label: "Compliance Verification" },
    { value: "fraud_detection", label: "Fraud Detection" },
    { value: "privacy_guardian", label: "Privacy Guardian" },
    { value: "kyc_orchestrator", label: "KYC Orchestrator" }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>ADK Agents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Connection Status */}
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <><Wifi className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">ADK Agent Monitoring</h2>
              <p className="text-muted-foreground">
                Multi-agent system performance and status overview
              </p>
            </div>
            
            <Dialog open={deployDialogOpen} onOpenChange={setDeployDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!isConnected}>
                  <Bot className="h-4 w-4 mr-2" />
                  Deploy New Agent
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deploy New ADK Agent</DialogTitle>
                  <DialogDescription>
                    Configure and deploy a new agent to the GuardianOS system
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="agent-type">Agent Type</Label>
                    <Select value={agentType} onValueChange={setAgentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g., EU Region Monitor"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeployDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeployAgent} disabled={deployingAgent}>
                    {deployingAgent ? "Deploying..." : "Deploy Agent"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!isConnected && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <WifiOff className="h-5 w-5" />
                  <p>Backend services are not available. Ensure the backend is running on port 8000.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {loading && isConnected ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Bot className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading agent status...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent, index) => {
                  const workload = getWorkload(agent);
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {agent.name}
                          </CardTitle>
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusColor(agent.status)}>
                                {agent.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatLastActivity(agent.lastHeartbeat)}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Workload</span>
                                <span className={getWorkloadColor(workload)}>
                                  {workload}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    workload > 80 ? "bg-red-500" :
                                    workload > 60 ? "bg-orange-500" : "bg-green-500"
                                  }`}
                                  style={{ width: `${workload}%` }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{agent.tasksCompleted || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-blue-500" />
                                <span>{(agent.performanceScore * 100).toFixed(1)}%</span>
                              </div>
                            </div>

                            {agent.status === "error" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleRestartAgent(agent.id)}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Restart Agent
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* System Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {agents.filter(a => a.status === "healthy" || a.status === "active").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Active Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {agents.reduce((sum, a) => sum + (a.tasksCompleted || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {agents.length > 0 
                          ? (agents.reduce((sum, a) => sum + a.performanceScore * 100, 0) / agents.length).toFixed(1)
                          : "0.0"}%
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {agents.length > 0
                          ? Math.round(agents.reduce((sum, a) => sum + getWorkload(a), 0) / agents.length)
                          : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Workload</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}