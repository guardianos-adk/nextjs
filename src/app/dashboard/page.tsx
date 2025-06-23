"use client";

import { motion } from "framer-motion";
import { useDashboardWebSocket } from "@/hooks/use-websocket";
import { VotingStatusBoard } from "@/components/dashboard/voting-status";
import { SystemHealthWidget } from "@/components/dashboard/system-health";
import { FraudSentinelMonitor } from "@/components/dashboard/fraud-sentinel";
import { GuardianActivityFeed } from "@/components/dashboard/activity-feed";
import { RealTimeMetrics } from "@/components/dashboard/realtime-metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TenthOpinionWidget } from "@/components/dashboard/tenth-opinion-widget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WifiOff, AlertTriangle, CheckCircle, Minus, HelpCircle } from "lucide-react";
import { useTutorial } from "@/hooks/use-tutorial";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { 
    isConnected, 
    connectionStatus,
    voting, 
    sentinel, 
    agents 
  } = useDashboardWebSocket();

  const { startTutorial } = useTutorial();

  // Check if any connection has issues (excluding disabled state)
  const hasConnectionIssues = [voting.connectionStatus, sentinel.connectionStatus, agents.connectionStatus]
    .some(status => status === 'failed' || status === 'error');

  // Check if all connections are disabled (fallback mode)
  const isInFallbackMode = [voting.connectionStatus, sentinel.connectionStatus, agents.connectionStatus]
    .every(status => status === 'disabled');

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'connecting':
        return <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />;
      case 'disabled':
        return <Minus className="h-3 w-3 text-gray-400" />;
      case 'error':
      case 'failed':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return <WifiOff className="h-3 w-3 text-gray-500" />;
    }
  };

  const getConnectionStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Online';
      case 'connecting':
        return 'Connecting';
      case 'disabled':
        return 'Offline Mode';
      case 'error':
      case 'failed':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const getOverallBadgeVariant = () => {
    if (isConnected) return "default";
    if (isInFallbackMode) return "secondary";
    return "destructive";
  };

  const getOverallStatusText = () => {
    if (isConnected) return "Online";
    if (isInFallbackMode) return "Offline Mode";
    return "Connection Issues";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" data-testid="sidebar-trigger" />
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
            
            <Badge variant={getOverallBadgeVariant()} className="text-xs">
              {getOverallStatusText()}
            </Badge>
            
            {/* Help Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={startTutorial}
              className="h-8 w-8"
              title="Start tutorial"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
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

          {/* Connection Status Alerts */}
          {isInFallbackMode && (
            <Alert variant="default">
              <Minus className="h-4 w-4" />
              <AlertDescription>
                Running in offline mode. Backend services are not available. Displaying cached data where possible.
              </AlertDescription>
            </Alert>
          )}

          {hasConnectionIssues && !isInFallbackMode && (
            <Alert variant="destructive">
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
              {/* Tenth Opinion Protocol - Prominent placement */}
              <TenthOpinionWidget />
              
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

          {/* Status Notice */}
          {(!isConnected && !isInFallbackMode) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 max-w-sm"
            >
              <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Connection Issues</div>
                  <div className="text-xs mt-1">
                    Some services are unavailable. Retrying connection...
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