"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Vote,
  Bot,
  Activity,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  Wallet,
  FileText,
  Gavel,
  Network,
  TrendingUp,
  Lock,
  Eye,
  Zap,
} from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { GuardianSwitcher } from "@/components/guardian-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGuardianAuth } from "@/hooks/use-guardian";

// Guardian navigation data
const navigationData = {
  main: [
    {
      title: "Dashboard Overview",
      url: "/dashboard",
      icon: BarChart3,
      description: "System overview and key metrics",
    },
  ],
  sections: [
    {
      title: "Compliance Operations",
      items: [
        {
          title: "Active Requests",
          url: "/dashboard/voting",
          icon: Vote,
          badge: "pending",
          description: "De-anonymization voting requests",
        },
        {
          title: "Consensus Tracking",
          url: "/dashboard/consensus",
          icon: Gavel,
          description: "Guardian consensus monitoring",
        },
        {
          title: "Evidence Review",
          url: "/dashboard/evidence",
          icon: Eye,
          description: "Transaction evidence analysis",
        },
        {
          title: "Privacy Controls",
          url: "/dashboard/privacy",
          icon: Lock,
          description: "Selective disclosure management",
        },
      ],
    },
    {
      title: "Agent Orchestration",
      items: [
        {
          title: "ADK Agents",
          url: "/dashboard/agents",
          icon: Bot,
          badge: "active",
          description: "Multi-agent system monitoring",
        },
        {
          title: "Workflow Engine",
          url: "/dashboard/workflows",
          icon: Network,
          description: "Compliance workflow execution",
        },
        {
          title: "Agent Performance",
          url: "/dashboard/performance",
          icon: TrendingUp,
          description: "Reputation and performance metrics",
        },
      ],
    },
    {
      title: "FraudSentinel",
      items: [
        {
          title: "Real-time Monitoring",
          url: "/dashboard/sentinel",
          icon: Activity,
          description: "Live system monitoring dashboard",
        },
        {
          title: "Alert Management",
          url: "/dashboard/alerts",
          icon: AlertTriangle,
          badge: "urgent",
          description: "Security and performance alerts",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: BarChart3,
          description: "Compliance analytics and reports",
        },
      ],
    },
    {
      title: "Guardian Network",
      items: [
        {
          title: "Guardian Directory",
          url: "/dashboard/guardians",
          icon: Users,
          description: "Guardian network overview",
        },
        {
          title: "Jurisdiction Mapping",
          url: "/dashboard/jurisdictions",
          icon: Shield,
          description: "Regulatory jurisdiction management",
        },
        {
          title: "Blockchain Explorer",
          url: "/dashboard/blockchain",
          icon: Wallet,
          description: "Multi-chain transaction explorer",
        },
      ],
    },
    {
      title: "Documentation",
      items: [
        {
          title: "Compliance Reports",
          url: "/dashboard/reports",
          icon: FileText,
          description: "Audit trails and compliance reports",
        },
        {
          title: "API Documentation",
          url: "/dashboard/api-docs",
          icon: Zap,
          description: "Developer API reference",
        },
        {
          title: "System Settings",
          url: "/dashboard/settings",
          icon: Settings,
          description: "Guardian profile and preferences",
        },
      ],
    },
  ],
};

function getBadgeVariant(badge: string) {
  switch (badge) {
    case "pending":
      return "secondary";
    case "active":
      return "default";
    case "urgent":
      return "destructive";
    default:
      return "outline";
  }
}

function getBadgeCount(badge: string) {
  // In a real app, these would come from your state/API
  switch (badge) {
    case "pending":
      return "3";
    case "active":
      return "7";
    case "urgent":
      return "2";
    default:
      return null;
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { guardian } = useGuardianAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <GuardianSwitcher guardian={guardian} />
        <SearchForm />
      </SidebarHeader>
      
      <SidebarContent className="gap-0">
        {/* Main Dashboard Link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.main.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} size="lg">
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <div className="flex flex-col gap-0.5 leading-none">
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation Sections */}
        {navigationData.sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  const badgeCount = item.badge ? getBadgeCount(item.badge) : null;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {badgeCount && (
                            <Badge 
                              variant={getBadgeVariant(item.badge!)} 
                              className="h-5 min-w-5 text-xs px-1.5"
                            >
                              {badgeCount}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground/70">
          <Shield className="h-3 w-3" />
          <span>GuardianOS v1.0.0</span>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
