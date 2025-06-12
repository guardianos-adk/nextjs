"use client";

import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Activity, Download, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "Total Transactions Processed",
      value: "1,247,892",
      change: "+12.5%",
      trend: "up" as const,
      period: "Last 30 days"
    },
    {
      title: "Fraud Detection Rate",
      value: "98.7%",
      change: "+2.1%", 
      trend: "up" as const,
      period: "Current month"
    },
    {
      title: "False Positive Rate",
      value: "1.3%",
      change: "-0.8%",
      trend: "down" as const,
      period: "Current month"
    },
    {
      title: "Average Response Time",
      value: "2.4s",
      change: "-15.2%",
      trend: "down" as const,
      period: "Last 7 days"
    }
  ];

  const complianceMetrics = [
    {
      jurisdiction: "European Union",
      requests: 156,
      approved: 142,
      pending: 14,
      compliance: 91.0
    },
    {
      jurisdiction: "United States",
      requests: 89,
      approved: 81,
      pending: 8,
      compliance: 91.0
    },
    {
      jurisdiction: "United Kingdom",
      requests: 67,
      approved: 63,
      pending: 4,
      compliance: 94.0
    },
    {
      jurisdiction: "Switzerland",
      requests: 34,
      approved: 32,
      pending: 2,
      compliance: 94.1
    }
  ];

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600";
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
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Compliance Analytics</h2>
              <p className="text-muted-foreground">
                Performance metrics and compliance reporting dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getTrendIcon(metric.trend)}
                      <span className={getTrendColor(metric.trend)}>
                        {metric.change}
                      </span>
                      <span>from {metric.period}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Compliance by Jurisdiction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Compliance by Jurisdiction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceMetrics.map((jurisdiction, index) => (
                  <motion.div
                    key={jurisdiction.jurisdiction}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{jurisdiction.jurisdiction}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{jurisdiction.requests} total requests</span>
                        <span>•</span>
                        <span>{jurisdiction.approved} approved</span>
                        <span>•</span>
                        <span>{jurisdiction.pending} pending</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {jurisdiction.compliance}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Compliance Rate
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts Placeholder */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chart visualization would be implemented here</p>
                    <p className="text-xs">Using Chart.js or similar library</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Real-time accuracy metrics</p>
                    <p className="text-xs">Performance over time visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Monthly Compliance Report", date: "June 2024", size: "2.4 MB" },
                  { name: "Fraud Detection Analysis", date: "May 2024", size: "1.8 MB" },
                  { name: "Guardian Performance Review", date: "May 2024", size: "3.1 MB" },
                  { name: "Cross-Border Activity Summary", date: "April 2024", size: "1.2 MB" }
                ].map((report, index) => (
                  <motion.div
                    key={report.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 