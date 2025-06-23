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
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Network, Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, Zap, Wifi, WifiOff, Plus } from "lucide-react";
import { toast } from "sonner";

interface WorkflowExecution {
  id: string;
  workflowType: string;
  status: string;
  startTime: string;
  endTime?: string | null;
  inputData: Record<string, any>;
  agents: string[];
  currentStep?: string | null;
  progress?: number | null;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showTriggerDialog, setShowTriggerDialog] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  
  // Form state for trigger dialog
  const [workflowType, setWorkflowType] = useState("");
  const [requestId, setRequestId] = useState("");
  const [additionalData, setAdditionalData] = useState("");

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')adk/workflows/active");
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch workflows:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerWorkflow = async () => {
    if (!workflowType) {
      toast.error("Please select a workflow type");
      return;
    }

    setTriggerLoading(true);
    try {
      const inputData: Record<string, any> = {
        requestId: requestId || `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: "manual_trigger"
      };

      // Parse additional data if provided
      if (additionalData) {
        try {
          const parsed = JSON.parse(additionalData);
          Object.assign(inputData, parsed);
        } catch (e) {
          // If not valid JSON, add as string
          inputData.additionalInfo = additionalData;
        }
      }

      const response = await fetch("', getApiUrl('/api/v1/')adk/workflows/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowType,
          inputData,
          agents: getAgentsForWorkflowType(workflowType)
        })
      });
      
      if (response.ok) {
        const newWorkflow = await response.json();
        setWorkflows([newWorkflow, ...workflows]);
        toast.success(`${workflowType} workflow triggered successfully`);
        setShowTriggerDialog(false);
        resetForm();
        fetchWorkflows();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to trigger workflow");
      }
    } catch (error) {
      toast.error("Failed to connect to backend");
    } finally {
      setTriggerLoading(false);
    }
  };

  const getAgentsForWorkflowType = (type: string): string[] => {
    switch (type) {
      case "Compliance Analysis":
        return ["agent_transaction_monitor", "agent_risk_assessment"];
      case "Guardian Consensus":
        return ["agent_guardian_council"];
      case "Privacy Assessment":
        return ["agent_privacy_revoker", "agent_guardian_council"];
      case "Risk Investigation":
        return ["agent_transaction_monitor", "agent_risk_assessment", "agent_guardian_council"];
      case "Full Audit":
        return ["agent_transaction_monitor", "agent_risk_assessment", "agent_guardian_council", "agent_privacy_revoker"];
      default:
        return ["agent_transaction_monitor"];
    }
  };

  const resetForm = () => {
    setWorkflowType("");
    setRequestId("");
    setAdditionalData("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
      case 'starting':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'starting': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (startTime: string, endTime?: string | null) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

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
                  <BreadcrumbPage>Workflow Engine</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="ml-auto px-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <><Wifi className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Workflow Engine</h2>
              <p className="text-muted-foreground">
                ADK multi-agent workflow orchestration
              </p>
            </div>
            <Button onClick={() => setShowTriggerDialog(true)} disabled={!isConnected}>
              <Plus className="h-4 w-4 mr-2" />
              Trigger Workflow
            </Button>
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

          {/* Active Workflows */}
          <div className="grid gap-4">
            {workflows.length === 0 && !loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Active Workflows</h3>
                    <p className="text-muted-foreground">Click "Trigger Workflow" to start a new compliance workflow</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{workflow.workflowType}</CardTitle>
                          <Badge className={getStatusColor(workflow.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(workflow.status)}
                              {workflow.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDuration(workflow.startTime, workflow.endTime)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {workflow.currentStep && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current Step: {workflow.currentStep}</span>
                            {workflow.progress !== null && workflow.progress !== undefined && (
                              <span>{workflow.progress}%</span>
                            )}
                          </div>
                          {workflow.progress !== null && workflow.progress !== undefined && (
                            <Progress value={workflow.progress} className="h-2" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Agents:</span>
                        <div className="flex gap-1 flex-wrap">
                          {workflow.agents.map(agent => (
                            <Badge key={agent} variant="secondary" className="text-xs">
                              {agent.replace('agent_', '').replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Request ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {workflow.inputData.requestId || workflow.id}
                        </code>
                      </div>

                      {workflow.status === 'running' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" disabled>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                          <Button size="sm" variant="outline" disabled>
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restart
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Workflow Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'running' || w.status === 'starting').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently executing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">Successfully finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.5m</div>
                <p className="text-xs text-muted-foreground">Per workflow</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trigger Workflow Dialog */}
        <Dialog open={showTriggerDialog} onOpenChange={setShowTriggerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trigger New Workflow</DialogTitle>
              <DialogDescription>
                Configure and launch a new ADK multi-agent workflow
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-type">Workflow Type</Label>
                <Select value={workflowType} onValueChange={setWorkflowType}>
                  <SelectTrigger id="workflow-type">
                    <SelectValue placeholder="Select workflow type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compliance Analysis">Compliance Analysis</SelectItem>
                    <SelectItem value="Guardian Consensus">Guardian Consensus</SelectItem>
                    <SelectItem value="Privacy Assessment">Privacy Assessment</SelectItem>
                    <SelectItem value="Risk Investigation">Risk Investigation</SelectItem>
                    <SelectItem value="Full Audit">Full Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-id">Request ID (Optional)</Label>
                <Input
                  id="request-id"
                  placeholder="e.g., REQ-2024-001"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-generate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-data">Additional Data (JSON)</Label>
                <Textarea
                  id="additional-data"
                  placeholder='{"priority": "high", "jurisdiction": "EU"}'
                  value={additionalData}
                  onChange={(e) => setAdditionalData(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Optional JSON data to pass to the workflow
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowTriggerDialog(false)}
                disabled={triggerLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTriggerWorkflow}
                disabled={triggerLoading || !workflowType}
              >
                {triggerLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Triggering...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Trigger Workflow
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}