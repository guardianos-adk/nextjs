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
import { Gavel, Users, CheckCircle, XCircle, Clock, TrendingUp, Shield, Eye, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface VotingRequest {
  id: string;
  requestId: string;
  status: string;
  urgency: string;
  requiredVotes: number;
  currentVotes: number;
  description: string;
  createdAt: string;
  deadline: string;
  jurisdiction: string;
}

interface GuardianStats {
  id: string;
  name: string;
  institution: string;
  votescast: number;
  responseTime: string;
  approvalRate: number;
  lastActivity: string;
}

interface ConsensusMetrics {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  averageTime: string;
  consensusRate: number;
}

export default function ConsensusPage() {
  const [votingHistory, setVotingHistory] = useState<VotingRequest[]>([]);
  const [guardianStats, setGuardianStats] = useState<GuardianStats[]>([]);
  const [metrics, setMetrics] = useState<ConsensusMetrics>({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0,
    averageTime: "0m",
    consensusRate: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVotingHistory = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')voting/history?pageSize=100");
      if (response.ok) {
        const data = await response.json();
        setVotingHistory(data.data || []);
        calculateMetrics(data.data || []);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch voting history:", error);
      setIsConnected(false);
    }
  };

  const fetchGuardianStats = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')guardians");
      if (response.ok) {
        const guardians = await response.json();
        
        // Transform guardian data to stats format
        const stats: GuardianStats[] = guardians.map((g: any) => ({
          id: g.id,
          name: g.name,
          institution: g.institutionName,
          votescast: g.performanceMetrics?.totalVotes || 0,
          responseTime: `${Math.floor((g.performanceMetrics?.averageResponseTime || 0) / 60)}m`,
          approvalRate: g.performanceMetrics?.consensusParticipation || 0,
          lastActivity: g.lastActivity
        }));
        
        setGuardianStats(stats);
      }
    } catch (error) {
      console.error("Failed to fetch guardian stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (requests: VotingRequest[]) => {
    const total = requests.length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const pending = requests.filter(r => r.status === 'pending' || r.status === 'voting').length;
    
    // Calculate average time for completed requests
    let totalTime = 0;
    let completedCount = 0;
    
    requests.forEach(req => {
      if (req.status === 'approved' || req.status === 'rejected') {
        const created = new Date(req.createdAt);
        const deadline = new Date(req.deadline);
        const duration = deadline.getTime() - created.getTime();
        totalTime += duration;
        completedCount++;
      }
    });
    
    const avgTimeMs = completedCount > 0 ? totalTime / completedCount : 0;
    const avgHours = Math.floor(avgTimeMs / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    setMetrics({
      totalRequests: total,
      approvedRequests: approved,
      rejectedRequests: rejected,
      pendingRequests: pending,
      averageTime: `${avgHours}h ${avgMinutes}m`,
      consensusRate: total > 0 ? (approved / (approved + rejected)) * 100 : 0
    });
  };

  useEffect(() => {
    fetchVotingHistory();
    fetchGuardianStats();
    
    const interval = setInterval(() => {
      fetchVotingHistory();
      fetchGuardianStats();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getApprovalColor = (rate: number) => {
    if (rate >= 85) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'voting':
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchVotingHistory();
    fetchGuardianStats();
    toast.success("Data refreshed");
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
                  <BreadcrumbPage>Consensus Tracking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="ml-auto px-4 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
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
              <h2 className="text-2xl font-bold tracking-tight">Consensus Tracking</h2>
              <p className="text-muted-foreground">
                Guardian voting patterns and consensus analytics
              </p>
            </div>
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

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                <p className="text-xs text-muted-foreground">All time consensus requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics.approvedRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalRequests > 0 
                    ? `${((metrics.approvedRequests / metrics.totalRequests) * 100).toFixed(1)}% approval rate`
                    : "No requests yet"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics.rejectedRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalRequests > 0 
                    ? `${((metrics.rejectedRequests / metrics.totalRequests) * 100).toFixed(1)}% rejection rate`
                    : "No requests yet"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageTime}</div>
                <p className="text-xs text-muted-foreground">Average consensus time</p>
              </CardContent>
            </Card>
          </div>

          {/* Consensus Rate */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Overall Consensus Rate</CardTitle>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {metrics.consensusRate.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={metrics.consensusRate} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Percentage of requests reaching required consensus threshold
              </p>
            </CardContent>
          </Card>

          {/* Guardian Participation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guardian Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading guardian statistics...</div>
              ) : (
                <div className="space-y-4">
                  {guardianStats.map((guardian, index) => (
                    <motion.div
                      key={guardian.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{guardian.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {guardian.institution} • {guardian.votescast} votes cast
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-muted-foreground">Response Time</p>
                          <p className="font-medium">{guardian.responseTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Participation Rate</p>
                          <p className={`font-medium ${getApprovalColor(guardian.approvalRate)}`}>
                            {guardian.approvalRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Voting History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Voting History</CardTitle>
            </CardHeader>
            <CardContent>
              {votingHistory.length === 0 && !loading ? (
                <div className="text-center py-8 text-muted-foreground">No voting history available</div>
              ) : (
                <div className="space-y-3">
                  {votingHistory.slice(0, 5).map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="font-medium text-sm">Request {request.id}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {request.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.currentVotes}/{request.requiredVotes} votes • {request.jurisdiction}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge variant={request.status === "approved" ? "default" : request.status === "rejected" ? "destructive" : "secondary"}>
                          {request.status}
                        </Badge>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`/dashboard/voting/${request.id}`}>
                            <Eye className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}