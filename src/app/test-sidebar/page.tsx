"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function TestSidebarPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div>Test Content</div>
      </SidebarInset>
    </SidebarProvider>
  );
}