"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Import dashboard components
import { DashboardOverviewCards } from "@/components/dashboard/overview-cards";
import { GuardianActivityFeed } from "@/components/dashboard/activity-feed";
import { SystemHealthWidget } from "@/components/dashboard/system-health";
import { VotingStatusBoard } from "@/components/dashboard/voting-status";
import { AgentOrchestrationPanel } from "@/components/dashboard/agent-orchestration";
import { FraudSentinelMonitor } from "@/components/dashboard/fraud-sentinel";
import { RealTimeMetrics } from "@/components/dashboard/realtime-metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  GuardianOS
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background to-muted/20">
          {/* Overview Cards */}
          <DashboardOverviewCards />
          
          {/* Main Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column - Primary Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* System Health & Real-time Metrics */}
              <div className="grid gap-4 md:grid-cols-2">
                <SystemHealthWidget />
                <RealTimeMetrics />
              </div>
              
              {/* Voting Status Board */}
              <VotingStatusBoard />
              
              {/* Agent Orchestration Panel */}
              <AgentOrchestrationPanel />
              
              {/* FraudSentinel Monitor */}
              <FraudSentinelMonitor />
            </div>
            
            {/* Right Column - Secondary Content */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Activity Feed */}
              <GuardianActivityFeed />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
