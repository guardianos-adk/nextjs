"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Shield, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Guardian } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GuardianSwitcherProps {
  guardian?: Guardian;
}

export function GuardianSwitcher({ guardian }: GuardianSwitcherProps) {
  const { isMobile } = useSidebar();

  if (!guardian) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Shield className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">GuardianOS</span>
              <span className="truncate text-xs text-muted-foreground">
                No Guardian Connected
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const jurisdictionColors = {
    ECB: "bg-blue-500",
    DNB: "bg-orange-500", 
    BaFin: "bg-red-500",
    FINMA: "bg-green-500",
    FCA: "bg-purple-500",
    SEC: "bg-indigo-500",
    CFTC: "bg-yellow-500",
    FinCEN: "bg-pink-500",
    AUSTRAC: "bg-teal-500",
    JFSA: "bg-cyan-500",
  };

  const jurisdictionColor = jurisdictionColors[guardian.jurisdiction as keyof typeof jurisdictionColors] || "bg-gray-500";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className={cn(
                "flex aspect-square size-8 items-center justify-center rounded-lg text-white",
                jurisdictionColor
              )}>
                <Shield className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {guardian.institutionName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {guardian.jurisdiction} • Score: {guardian.reputationScore.toFixed(1)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className={cn(
                  "flex aspect-square size-8 items-center justify-center rounded-lg text-white",
                  jurisdictionColor
                )}>
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {guardian.institutionName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {guardian.jurisdiction}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-2">
              <User className="size-4" />
              Guardian Profile
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-2 text-xs text-muted-foreground">
              <div className="grid w-full">
                <div className="flex justify-between">
                  <span>LEI Code:</span>
                  <span className="font-mono">{guardian.leiCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Power:</span>
                  <span>{guardian.votingPower}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={cn(
                    "font-medium",
                    guardian.isActive ? "text-green-600" : "text-red-600"
                  )}>
                    {guardian.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
