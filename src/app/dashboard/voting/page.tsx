"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VotingStatusBoard } from "@/components/dashboard/voting-status";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface VotingRequest {
  transactionHash: string;
  blockchain: string;
  urgency: string;
  jurisdiction: string;
  reason: string;
  evidenceHash: string;
  riskLevel: string;
  disclosureScope: string;
  retentionPeriod: string;
}

export default function VotingPage() {
  const searchParams = useSearchParams();
  const isNewRequest = searchParams.get('action') === 'new';
  const [showNewForm, setShowNewForm] = useState(isNewRequest);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [formData, setFormData] = useState<VotingRequest>({
    transactionHash: "",
    blockchain: "",
    urgency: "",
    jurisdiction: "",
    reason: "",
    evidenceHash: "",
    riskLevel: "",
    disclosureScope: "",
    retentionPeriod: ""
  });

  const checkBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/voting/active-requests");
      setIsConnected(response.ok);
    } catch (error) {
      console.error("Failed to check backend connection:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Backend not connected. Please ensure the backend services are running.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/voting/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          requestType: "de-anonymization",
          submittedBy: "current-guardian", // This would come from auth context
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success("De-anonymization request submitted for guardian review");
        setShowNewForm(false);
        setFormData({
          transactionHash: "",
          blockchain: "",
          urgency: "",
          jurisdiction: "",
          reason: "",
          evidenceHash: "",
          riskLevel: "",
          disclosureScope: "",
          retentionPeriod: ""
        });
      } else {
        toast.error("Failed to submit request");
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast.error("Failed to connect to backend");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkBackendConnection();
    setTimeout(() => setRefreshing(false), 500);
    toast.success("Voting data refreshed");
  };

  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
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
                  <BreadcrumbPage>Active Requests</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
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
              <h2 className="text-2xl font-bold tracking-tight">
                {showNewForm ? "New De-anonymization Request" : "Active Voting Requests"}
              </h2>
              <p className="text-muted-foreground">
                {showNewForm 
                  ? "Submit a new request for guardian consensus"
                  : "De-anonymization requests requiring guardian consensus"}
              </p>
            </div>
            {!showNewForm && (
              <Button 
                onClick={() => setShowNewForm(true)}
                disabled={!isConnected}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            )}
          </div>

          {!isConnected && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <WifiOff className="h-5 w-5" />
                  <p>Backend services are not available. Voting features may be limited.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {showNewForm ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Request De-anonymization</CardTitle>
                    <Button variant="outline" onClick={() => setShowNewForm(false)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Requests
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitNewRequest} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="transaction-hash">Transaction Hash</Label>
                        <Input
                          id="transaction-hash"
                          placeholder="0x..."
                          value={formData.transactionHash}
                          onChange={(e) => setFormData(prev => ({ ...prev, transactionHash: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blockchain">Blockchain Network</Label>
                        <Select 
                          value={formData.blockchain}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, blockchain: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="bsc">BSC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jurisdiction">Requesting Jurisdiction</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecb">ECB (European Central Bank)</SelectItem>
                            <SelectItem value="dnb">DNB (De Nederlandsche Bank)</SelectItem>
                            <SelectItem value="bafin">BAFIN (Germany)</SelectItem>
                            <SelectItem value="finma">FINMA (Switzerland)</SelectItem>
                            <SelectItem value="fca">FCA (United Kingdom)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Compliance Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe the regulatory requirement and legal basis for this request..."
                        required
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evidence">Evidence Hash</Label>
                      <Input
                        id="evidence"
                        placeholder="Hash of supporting evidence documents"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Privacy Impact Assessment</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="risk-level">Risk Level</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Risk level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="disclosure-scope">Disclosure Scope</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Scope" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="full">Full</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="retention">Retention Period</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={submitting || !isConnected}
                      >
                        {submitting ? "Submitting..." : "Submit Request"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowNewForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <VotingStatusBoard />
            )}
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 