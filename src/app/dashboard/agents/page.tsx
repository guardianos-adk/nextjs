"use client";

import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Activity, Zap, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      id: "agent-risk-assessment",
      name: "Risk Assessment Agent",
      status: "active",
      workload: 75,
      lastActivity: "2 minutes ago",
      tasksCompleted: 1247,
      successRate: 98.5
    },
    {
      id: "agent-compliance-check",
      name: "Compliance Verification Agent",
      status: "active",
      workload: 45,
      lastActivity: "1 minute ago",
      tasksCompleted: 892,
      successRate: 99.2
    },
    {
      id: "agent-fraud-detection",
      name: "Fraud Detection Agent",
      status: "active",
      workload: 89,
      lastActivity: "30 seconds ago",
      tasksCompleted: 2156,
      successRate: 97.8
    },
    {
      id: "agent-privacy-guardian",
      name: "Privacy Guardian Agent",
      status: "idle",
      workload: 12,
      lastActivity: "5 minutes ago",
      tasksCompleted: 567,
      successRate: 99.8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "idle": return "text-yellow-600 bg-yellow-100";
      case "error": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload > 80) return "text-red-500";
    if (workload > 60) return "text-orange-500";
    return "text-green-500";
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
                  <BreadcrumbPage>ADK Agents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
            <Button>
              <Bot className="h-4 w-4 mr-2" />
              Deploy New Agent
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent, index) => (
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
                          {agent.lastActivity}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Workload</span>
                          <span className={getWorkloadColor(agent.workload)}>
                            {agent.workload}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              agent.workload > 80 ? "bg-red-500" :
                              agent.workload > 60 ? "bg-orange-500" : "bg-green-500"
                            }`}
                            style={{ width: `${agent.workload}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{agent.tasksCompleted}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-blue-500" />
                          <span>{agent.successRate}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                    {agents.filter(a => a.status === "active").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {agents.reduce((sum, a) => sum + a.tasksCompleted, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(agents.reduce((sum, a) => sum + a.workload, 0) / agents.length)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Workload</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 