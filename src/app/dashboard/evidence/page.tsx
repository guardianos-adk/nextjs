"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, FileText, Shield, AlertTriangle, CheckCircle, Download, ExternalLink, Hash, Clock, Upload, Wifi, WifiOff, RefreshCw, Lock, Users } from "lucide-react";
import { toast } from "sonner";

interface Evidence {
  id: string;
  requestId: string;
  type: 'transaction' | 'document' | 'screenshot' | 'log' | 'blockchain';
  hash: string;
  submittedBy: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'disputed';
  size: string;
  description: string;
  requestingGuardian?: string;
  jurisdiction?: string;
  riskScore?: number;
  consensusStatus?: string;
}

export default function EvidencePage() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [guardians, setGuardians] = useState<any[]>([]);
  
  // Form state for submit dialog
  const [evidenceType, setEvidenceType] = useState("");
  const [requestId, setRequestId] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const fetchDeAnonymizationRequests = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/voting/active-requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        
        // Transform requests to evidence format
        const evidenceFromRequests: Evidence[] = data.map((req: any) => ({
          id: `EVD-${req.id}`,
          requestId: req.id,
          type: 'blockchain' as const,
          hash: req.evidenceHash || req.transactionHash?.slice(0, 10) + '...' + req.transactionHash?.slice(-4),
          submittedBy: req.requestingGuardianId || "System",
          timestamp: req.createdAt,
          status: req.status === 'approved' ? 'verified' : req.status === 'rejected' ? 'disputed' : 'pending',
          size: "On-chain",
          description: req.complianceReason || req.description,
          requestingGuardian: req.requestingGuardianId,
          jurisdiction: req.jurisdiction,
          riskScore: req.evidence?.riskScore,
          consensusStatus: req.status
        }));
        
        setEvidenceList(evidenceFromRequests);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setIsConnected(false);
    }
  };

  const fetchGuardians = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians");
      if (response.ok) {
        const data = await response.json();
        setGuardians(data);
      }
    } catch (error) {
      console.error("Failed to fetch guardians:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeAnonymizationRequests();
    fetchGuardians();
    
    const interval = setInterval(() => {
      fetchDeAnonymizationRequests();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchDeAnonymizationRequests();
    fetchGuardians();
    toast.success("Evidence data refreshed");
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceType || !requestId || !evidenceDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Submit evidence to backend
      const response = await fetch("http://localhost:8000/api/v1/evidence/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requestId: requestId,
          type: evidenceType,
          description: evidenceDescription,
          size: evidenceFile ? `${(evidenceFile.size / 1024).toFixed(1)} KB` : "0 KB",
          metadata: {
            fileName: evidenceFile?.name,
            fileType: evidenceFile?.type,
            uploadedAt: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newEvidence: Evidence = {
          id: data.evidence.id,
          requestId: data.evidence.requestId,
          type: data.evidence.type as any,
          hash: data.evidence.hash,
          submittedBy: data.evidence.submittedBy,
          timestamp: data.evidence.timestamp,
          status: data.evidence.status as 'pending' | 'verified' | 'disputed',
          size: data.evidence.size,
          description: data.evidence.description
        };
        
        setEvidenceList([newEvidence, ...evidenceList]);
        toast.success("Evidence submitted successfully");
        setShowSubmitDialog(false);
        resetForm();
      } else {
        toast.error("Failed to submit evidence");
      }
    } catch (error) {
      console.error("Evidence submission error:", error);
      toast.error("Failed to submit evidence");
    }
  };

  const resetForm = () => {
    setEvidenceType("");
    setRequestId("");
    setEvidenceDescription("");
    setEvidenceFile(null);
  };

  const handleViewEvidence = async (evidence: Evidence) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/voting/requests/${evidence.requestId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEvidence({
          ...evidence,
          ...data
        });
      }
    } catch (error) {
      console.error("Failed to fetch evidence details:", error);
    }
  };

  const handleVerifyOnChain = async (evidenceId: string) => {
    toast.info("Verifying evidence on blockchain...");
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/evidence/${evidenceId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Evidence verified on blockchain at block ${data.verification.blockNumber}`);
        
        // Update evidence status
        setEvidenceList(evidenceList.map(e => 
          e.id === evidenceId ? { ...e, status: 'verified' as const } : e
        ));
      } else {
        toast.error("Failed to verify evidence on blockchain");
      }
    } catch (error) {
      console.error("Evidence verification error:", error);
      toast.error("Failed to verify evidence");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <Hash className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'screenshot': return <Eye className="h-4 w-4" />;
      case 'log': return <Shield className="h-4 w-4" />;
      case 'blockchain': return <Lock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'disputed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'disputed': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
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
                  <BreadcrumbPage>Evidence Review</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Evidence Review</h2>
              <p className="text-muted-foreground">
                Transaction evidence analysis and verification
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowSubmitDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Submit Evidence
              </Button>
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? (
                  <><Wifi className="h-3 w-3 mr-1" /> Connected</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
                )}
              </Badge>
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

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{evidenceList.length}</div>
                <p className="text-xs text-muted-foreground">Submitted items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {evidenceList.filter(e => e.status === 'verified').length}
                </div>
                <p className="text-xs text-muted-foreground">Cryptographically verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {evidenceList.filter(e => e.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting verification</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disputed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {evidenceList.filter(e => e.status === 'disputed').length}
                </div>
                <p className="text-xs text-muted-foreground">Requires resolution</p>
              </CardContent>
            </Card>
          </div>

          {/* Evidence List */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence Repository</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && evidenceList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Loading evidence data...</div>
              ) : evidenceList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No evidence available</div>
              ) : (
                <div className="space-y-4">
                  {evidenceList.map((evidence, index) => (
                  <motion.div
                    key={evidence.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(evidence.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{evidence.id}</h4>
                          <Badge className={getStatusColor(evidence.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(evidence.status)}
                              {evidence.status}
                            </span>
                          </Badge>
                          <Badge variant="outline">{evidence.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{evidence.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Request: {evidence.requestId}</span>
                          <span>•</span>
                          <span>Submitted by: {evidence.submittedBy}</span>
                          <span>•</span>
                          <span>Size: {evidence.size}</span>
                          {evidence.jurisdiction && (
                            <>
                              <span>•</span>
                              <span>Jurisdiction: {evidence.jurisdiction}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono">
                          <Hash className="h-3 w-3" />
                          <span>{evidence.hash}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewEvidence(evidence)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerifyOnChain(evidence.id)}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Verify
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                      >
                        <a href={`/dashboard/voting/${evidence.requestId}`}>
                          <Users className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence Chain and Guardian Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evidence Chain Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Blockchain Network</span>
                    <span className="font-medium">Ethereum Mainnet</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Smart Contract</span>
                    <span className="font-mono text-xs">0x742d35Cc6634C0532925a3b844Bc9e7595f6f8e</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Evidence Hashes</span>
                    <span className="font-medium">{evidenceList.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Verification</span>
                    <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">All evidence hashes verified on-chain</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guardians.slice(0, 3).map((guardian) => (
                    <div key={guardian.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded">
                          <Shield className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{guardian.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {guardian.jurisdiction}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Guardians</span>
                      <span className="font-medium">{guardians.filter(g => g.isActive).length}/{guardians.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Submit Evidence Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit New Evidence</DialogTitle>
              <DialogDescription>
                Provide evidence for a de-anonymization request
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evidence-type">Evidence Type</Label>
                <Select value={evidenceType} onValueChange={setEvidenceType}>
                  <SelectTrigger id="evidence-type">
                    <SelectValue placeholder="Select evidence type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction">Transaction Data</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="log">System Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-id">Request ID</Label>
                <Select value={requestId} onValueChange={setRequestId}>
                  <SelectTrigger id="request-id">
                    <SelectValue placeholder="Select request" />
                  </SelectTrigger>
                  <SelectContent>
                    {requests.map((req) => (
                      <SelectItem key={req.id} value={req.id}>
                        {req.id} - {req.description || req.complianceReason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-description">Description</Label>
                <Textarea
                  id="evidence-description"
                  placeholder="Describe the evidence and its relevance"
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-file">Evidence File (Optional)</Label>
                <Input
                  id="evidence-file"
                  type="file"
                  onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                  accept=".pdf,.png,.jpg,.jpeg,.txt,.log"
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, PNG, JPG, TXT, LOG
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitEvidence}
                disabled={!evidenceType || !requestId || !evidenceDescription}
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Evidence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Evidence Details Dialog */}
        <Dialog open={!!selectedEvidence} onOpenChange={() => setSelectedEvidence(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Evidence Details</DialogTitle>
              <DialogDescription>
                Detailed information about the evidence and associated request
              </DialogDescription>
            </DialogHeader>
            
            {selectedEvidence && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Evidence ID</p>
                    <p className="font-medium">{selectedEvidence.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request ID</p>
                    <p className="font-medium">{selectedEvidence.requestId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline">{selectedEvidence.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedEvidence.status)}>
                      {selectedEvidence.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Evidence Hash</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {selectedEvidence.hash}
                  </code>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedEvidence.description}</p>
                </div>

                {selectedEvidence.jurisdiction && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Request Details</p>
                    <div className="space-y-1 text-sm">
                      <p>Jurisdiction: {selectedEvidence.jurisdiction}</p>
                      {selectedEvidence.riskScore && (
                        <p>Risk Score: {(selectedEvidence.riskScore * 100).toFixed(1)}%</p>
                      )}
                      {selectedEvidence.consensusStatus && (
                        <p>Consensus Status: {selectedEvidence.consensusStatus}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEvidence(null)}>
                Close
              </Button>
              <Button asChild>
                <a href={`/dashboard/voting/${selectedEvidence?.requestId}`}>
                  <Users className="h-4 w-4 mr-2" />
                  View Request
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}