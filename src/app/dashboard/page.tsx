"use client";

import { motion } from "framer-motion";
import { useDashboardWebSocket } from "@/hooks/use-websocket";
import { VotingStatusBoard } from "@/components/dashboard/voting-status";
import { SystemHealthWidget } from "@/components/dashboard/system-health";
import { FraudSentinelMonitor } from "@/components/dashboard/fraud-sentinel";
import { GuardianActivityFeed } from "@/components/dashboard/activity-feed";
import { RealTimeMetrics } from "@/components/dashboard/realtime-metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WifiOff, AlertTriangle, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { 
    isConnected, 
    voting, 
    sentinel, 
    agents 
  } = useDashboardWebSocket();

  // Check if any connection has issues
  const hasConnectionIssues = [voting.connectionStatus, sentinel.connectionStatus, agents.connectionStatus]
    .some(status => status === 'failed' || status === 'error' || status === 'disconnected');

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'connecting':
        return <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />;
      case 'error':
      case 'failed':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return <WifiOff className="h-3 w-3 text-gray-500" />;
    }
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
                  <BreadcrumbLink href="/">
                    Guardian Operations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Connection Status */}
          <div className="ml-auto flex items-center gap-4 px-4">
            {/* Individual service status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {getConnectionStatusIcon(voting.connectionStatus)}
                <span className="text-xs text-muted-foreground">Voting</span>
              </div>
              <div className="flex items-center gap-1">
                {getConnectionStatusIcon(sentinel.connectionStatus)}
                <span className="text-xs text-muted-foreground">Sentinel</span>
              </div>
              <div className="flex items-center gap-1">
                {getConnectionStatusIcon(agents.connectionStatus)}
                <span className="text-xs text-muted-foreground">Agents</span>
              </div>
            </div>
            
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Online" : "Offline"}
            </Badge>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Guardian Operations Center</h2>
              <p className="text-muted-foreground">
                Multi-agent regulatory compliance orchestration dashboard
              </p>
            </div>
          </div>

          {/* Global Connection Alert */}
          {hasConnectionIssues && (
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some services are experiencing connection issues. Real-time features may be limited.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Voting Status Board */}
              <VotingStatusBoard />
              
              {/* Real-time Metrics */}
              <RealTimeMetrics />
              
              {/* FraudSentinel Monitor */}
              <FraudSentinelMonitor />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* System Health */}
              <SystemHealthWidget />
              
              {/* Activity Feed */}
              <GuardianActivityFeed />
            </div>
          </div>

          {/* Offline Mode Notice */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 max-w-sm"
            >
              <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Limited Connectivity</div>
                  <div className="text-xs mt-1">
                    Displaying available data. Some features may be limited.
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
