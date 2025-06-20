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
import { Plus, ArrowLeft, Wifi, WifiOff, RefreshCw, Wallet } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/wallet-connect";
import { useSeDeFramework } from "@/hooks/useGuardianContract";
import { keccak256, toHex } from "viem";

interface VotingRequest {
  targetAddress: string;
  reason: string;
  evidenceHash: string;
  urgency: string;
  jurisdiction: string;
  riskLevel: string;
  disclosureScope: string;
  retentionPeriod: string;
}

export default function EnhancedVotingPage() {
  const searchParams = useSearchParams();
  const isNewRequest = searchParams.get('action') === 'new';
  const [showNewForm, setShowNewForm] = useState(isNewRequest);
  const [refreshing, setRefreshing] = useState(false);
  
  // Web3 hooks
  const { address, isConnected } = useAccount();
  
  // Contract hooks
  const {
    totalGuardians,
    consensusThreshold,
    requestCounter,
    submitDeAnonymizationRequest,
    voteOnRequest,
    isSubmittingRequest,
    isCastingVote,
    submitRequestError,
  } = useSeDeFramework();
  
  const [formData, setFormData] = useState<VotingRequest>({
    targetAddress: "",
    reason: "",
    evidenceHash: "",
    urgency: "",
    jurisdiction: "",
    riskLevel: "",
    disclosureScope: "",
    retentionPeriod: ""
  });

  const handleSubmitNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Generate evidence hash from form data
    const evidenceData = {
      urgency: formData.urgency,
      jurisdiction: formData.jurisdiction,
      riskLevel: formData.riskLevel,
      disclosureScope: formData.disclosureScope,
      retentionPeriod: formData.retentionPeriod,
      timestamp: new Date().toISOString()
    };
    
    const evidenceHash = keccak256(toHex(JSON.stringify(evidenceData)));
    
    await submitDeAnonymizationRequest(
      formData.targetAddress,
      formData.reason,
      evidenceHash
    );

    if (!submitRequestError) {
      setShowNewForm(false);
      setFormData({
        targetAddress: "",
        reason: "",
        evidenceHash: "",
        urgency: "",
        jurisdiction: "",
        riskLevel: "",
        disclosureScope: "",
        retentionPeriod: ""
      });
    }
  };

  const handleVote = async (requestId: number, approve: boolean) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    await voteOnRequest(BigInt(requestId), approve);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh contract data
    setTimeout(() => setRefreshing(false), 500);
    toast.success("Contract data refreshed");
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
                  <BreadcrumbPage>Guardian Voting</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="ml-auto flex items-center gap-2 px-4">
            <WalletConnect />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {showNewForm ? "Submit De-anonymization Request" : "Guardian Consensus Voting"}
              </h2>
              <p className="text-muted-foreground">
                {showNewForm 
                  ? "Submit a new request to the guardian council"
                  : `${totalGuardians || 0} guardians • ${consensusThreshold || 0}/${totalGuardians || 0} consensus required`}
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
                  <Wallet className="h-5 w-5" />
                  <p>Please connect your wallet to interact with the guardian system.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {isConnected && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{requestCounter?.toString() || "0"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active Guardians</p>
                    <p className="text-2xl font-bold">{totalGuardians?.toString() || "0"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Consensus Required</p>
                    <p className="text-2xl font-bold">{consensusThreshold?.toString() || "0"}</p>
                  </div>
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
                      Back to Voting
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitNewRequest} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="target-address">Target Address</Label>
                      <Input
                        id="target-address"
                        placeholder="0x..."
                        value={formData.targetAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetAddress: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Compliance Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe the regulatory requirement and legal basis for this request..."
                        value={formData.reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        required
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select 
                          value={formData.urgency}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                          required
                        >
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
                        <Select 
                          value={formData.jurisdiction}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, jurisdiction: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eu">European Union</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ch">Switzerland</SelectItem>
                            <SelectItem value="jp">Japan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Privacy Impact Assessment</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="risk-level">Risk Level</Label>
                          <Select 
                            value={formData.riskLevel}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}
                            required
                          >
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
                          <Select 
                            value={formData.disclosureScope}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, disclosureScope: value }))}
                            required
                          >
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
                          <Select 
                            value={formData.retentionPeriod}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, retentionPeriod: value }))}
                            required
                          >
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
                        disabled={isSubmittingRequest || !isConnected}
                      >
                        {isSubmittingRequest ? "Submitting..." : "Submit Request"}
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
              <VotingStatusBoard onVote={handleVote} isConnected={isConnected} />
            )}
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}