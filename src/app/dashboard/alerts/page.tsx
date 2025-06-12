"use client";

import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clock, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AlertsPage() {
  const alerts = [
    {
      id: "alert-001",
      title: "High-Risk Transaction Detected",
      description: "Transaction pattern matches known money laundering indicators",
      severity: "critical",
      status: "active",
      timestamp: "2024-06-11T10:30:00Z",
      source: "FraudSentinel",
      category: "fraud_detection"
    },
    {
      id: "alert-002", 
      title: "Unusual Cross-Border Activity",
      description: "Multiple rapid transfers between jurisdictions detected",
      severity: "high",
      status: "investigating",
      timestamp: "2024-06-11T09:45:00Z",
      source: "ComplianceEngine",
      category: "compliance"
    },
    {
      id: "alert-003",
      title: "Agent Performance Degradation",
      description: "Risk Assessment Agent showing reduced accuracy",
      severity: "medium",
      status: "acknowledged",
      timestamp: "2024-06-11T08:15:00Z",
      source: "SystemMonitor",
      category: "system"
    },
    {
      id: "alert-004",
      title: "Privacy Threshold Exceeded",
      description: "De-anonymization request volume above normal levels",
      severity: "low",
      status: "resolved",
      timestamp: "2024-06-11T07:30:00Z",
      source: "PrivacyGuard",
      category: "privacy"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500 bg-red-500/10 text-red-700";
      case "high": return "border-orange-500 bg-orange-500/10 text-orange-700";
      case "medium": return "border-yellow-500 bg-yellow-500/10 text-yellow-700";
      case "low": return "border-blue-500 bg-blue-500/10 text-blue-700";
      default: return "border-gray-500 bg-gray-500/10 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-red-600 bg-red-100";
      case "investigating": return "text-orange-600 bg-orange-100";
      case "acknowledged": return "text-yellow-600 bg-yellow-100";
      case "resolved": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low": return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Alert Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Alert Management</h2>
              <p className="text-muted-foreground">
                Security and performance alerts across all systems
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search alerts..." 
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">All</Badge>
                  <Badge variant="destructive">Critical (1)</Badge>
                  <Badge variant="secondary">High (1)</Badge>
                  <Badge variant="outline">Medium (1)</Badge>
                  <Badge variant="outline">Low (1)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Alert className={`border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{alert.title}</h4>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <AlertDescription className="text-xs">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                          <span>•</span>
                          <span>{alert.source}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.severity}
                      </Badge>
                      {alert.status === "active" && (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.severity === "critical").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.severity === "high").length}
                  </div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {alerts.filter(a => a.severity === "medium").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {alerts.filter(a => a.severity === "low").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 