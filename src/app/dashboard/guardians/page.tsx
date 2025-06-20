"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Globe, CheckCircle, Clock, AlertTriangle, Mail, Building, Wifi, WifiOff, RefreshCw, UserPlus, Hash, Award } from "lucide-react";
import { toast } from "sonner";

interface Guardian {
  id: string;
  name: string;
  institutionName: string;
  jurisdiction: string | string[];
  leiCode: string;
  walletAddress: string;
  publicKey: string;
  reputationScore: number;
  isActive: boolean;
  roles: string[];
  lastActivity: string;
  certificateStatus: string;
  votingPower: number;
  performanceMetrics: {
    totalVotes: number;
    consensusParticipation: number;
    averageResponseTime: number;
    accuracy: number;
  };
}

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  
  // Form state for invite dialog
  const [inviteName, setInviteName] = useState("");
  const [inviteInstitution, setInviteInstitution] = useState("");
  const [inviteJurisdiction, setInviteJurisdiction] = useState("");
  const [inviteLEI, setInviteLEI] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const fetchGuardians = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians");
      if (response.ok) {
        const data = await response.json();
        setGuardians(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch guardians:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
    
    const interval = setInterval(fetchGuardians, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchGuardians();
    toast.success("Guardian data refreshed");
  };

  const handleInviteGuardian = async () => {
    if (!inviteName || !inviteInstitution || !inviteJurisdiction || !inviteLEI) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // In a real implementation, this would send an invitation
      toast.success(`Invitation sent to ${inviteName}`);
      setShowInviteDialog(false);
      resetInviteForm();
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const resetInviteForm = () => {
    setInviteName("");
    setInviteInstitution("");
    setInviteJurisdiction("");
    setInviteLEI("");
    setInviteEmail("");
  };

  const getJurisdictionString = (jurisdiction: string | string[]): string => {
    return Array.isArray(jurisdiction) ? jurisdiction.join(", ") : jurisdiction;
  };

  const getGuardianStatus = (guardian: Guardian): 'active' | 'inactive' | 'pending' => {
    if (!guardian.isActive) return 'inactive';
    if (guardian.certificateStatus !== 'verified') return 'pending';
    return 'active';
  };

  const getStatusColor = (guardian: Guardian) => {
    const status = getGuardianStatus(guardian);
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const calculateAverageParticipation = () => {
    const activeGuardians = guardians.filter(g => getGuardianStatus(g) === 'active');
    if (activeGuardians.length === 0) return 0;
    
    const totalParticipation = activeGuardians.reduce((acc, g) => 
      acc + (g.performanceMetrics?.consensusParticipation || 0), 0
    );
    
    return totalParticipation / activeGuardians.length;
  };

  const getTotalDecisions = () => {
    return guardians.reduce((acc, g) => 
      acc + (g.performanceMetrics?.totalVotes || 0), 0
    );
  };

  const getUniqueJurisdictions = () => {
    const jurisdictions = new Set<string>();
    guardians.forEach(g => {
      if (Array.isArray(g.jurisdiction)) {
        g.jurisdiction.forEach(j => jurisdictions.add(j));
      } else {
        jurisdictions.add(g.jurisdiction);
      }
    });
    return jurisdictions.size;
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
                  <BreadcrumbPage>Guardian Directory</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Guardian Directory</h2>
              <p className="text-muted-foreground">
                Multi-jurisdictional regulatory council members
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Guardian
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

          {/* Guardian Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Guardians</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guardians.length}</div>
                <p className="text-xs text-muted-foreground">Active council members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jurisdictions</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUniqueJurisdictions()}
                </div>
                <p className="text-xs text-muted-foreground">Represented regions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Participation</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateAverageParticipation().toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Voting engagement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getTotalDecisions()}
                </div>
                <p className="text-xs text-muted-foreground">Collective votes cast</p>
              </CardContent>
            </Card>
          </div>

          {/* Guardian List */}
          {loading && guardians.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">Loading guardian data...</div>
              </CardContent>
            </Card>
          ) : guardians.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">No guardians registered</div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {guardians.map((guardian, index) => {
                const status = getGuardianStatus(guardian);
                return (
                  <motion.div
                    key={guardian.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                          onClick={() => setSelectedGuardian(guardian)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                              <AvatarFallback>{getInitials(guardian.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{guardian.name}</CardTitle>
                              <CardDescription>{guardian.institutionName}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(guardian)}>
                            {status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Jurisdiction</p>
                            <p className="font-medium flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {getJurisdictionString(guardian.jurisdiction)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Voting Power</p>
                            <p className="font-medium">{guardian.votingPower}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Decisions Made</p>
                            <p className="font-medium">{guardian.performanceMetrics?.totalVotes || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reputation</p>
                            <p className="font-medium flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {guardian.reputationScore.toFixed(1)}
                            </p>
                          </div>
                        </div>

                        {status === 'active' && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Participation Rate</span>
                              <span>{guardian.performanceMetrics?.consensusParticipation.toFixed(1)}%</span>
                            </div>
                            <Progress value={guardian.performanceMetrics?.consensusParticipation || 0} className="h-2" />
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Roles</p>
                          <div className="flex gap-2 flex-wrap">
                            {guardian.roles.map(role => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Hash className="h-3 w-3" />
                            <span className="font-mono">{guardian.leiCode}</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGuardian(guardian);
                          }}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Council Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Guardian Council Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Consensus Threshold</p>
                    <p className="text-sm text-muted-foreground">
                      Minimum 3 out of 5 guardians must approve for de-anonymization
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">
                      Guardians must respond within 24 hours for urgent requests
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Conflict of Interest</p>
                    <p className="text-sm text-muted-foreground">
                      Guardians must recuse themselves from cases involving their jurisdiction
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Institutional Representation</p>
                    <p className="text-sm text-muted-foreground">
                      Each guardian represents their respective regulatory institution
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Invite Guardian Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Guardian</DialogTitle>
              <DialogDescription>
                Invite a regulatory institution to join the Guardian Council
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-name">Representative Name</Label>
                <Input
                  id="invite-name"
                  placeholder="Dr. John Smith"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-institution">Institution</Label>
                <Input
                  id="invite-institution"
                  placeholder="Bank of England"
                  value={inviteInstitution}
                  onChange={(e) => setInviteInstitution(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-jurisdiction">Jurisdiction</Label>
                <Select value={inviteJurisdiction} onValueChange={setInviteJurisdiction}>
                  <SelectTrigger id="invite-jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">European Union</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CH">Switzerland</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="SG">Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-lei">LEI Code</Label>
                <Input
                  id="invite-lei"
                  placeholder="BANKGB2LXXX"
                  value={inviteLEI}
                  onChange={(e) => setInviteLEI(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="j.smith@boe.gov.uk"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteDialog(false);
                  resetInviteForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleInviteGuardian}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Guardian Details Dialog */}
        <Dialog open={!!selectedGuardian} onOpenChange={() => setSelectedGuardian(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Guardian Profile</DialogTitle>
              <DialogDescription>
                Detailed information about the guardian council member
              </DialogDescription>
            </DialogHeader>
            
            {selectedGuardian && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                    <AvatarFallback>{getInitials(selectedGuardian.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedGuardian.name}</h3>
                    <p className="text-muted-foreground">{selectedGuardian.institutionName}</p>
                    <Badge className={getStatusColor(selectedGuardian)}>
                      {getGuardianStatus(selectedGuardian)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jurisdiction</p>
                    <p className="font-medium">{getJurisdictionString(selectedGuardian.jurisdiction)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LEI Code</p>
                    <p className="font-medium font-mono">{selectedGuardian.leiCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reputation Score</p>
                    <p className="font-medium">{selectedGuardian.reputationScore.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Voting Power</p>
                    <p className="font-medium">{selectedGuardian.votingPower}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Performance Metrics</p>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Votes</p>
                      <p className="text-lg font-semibold">{selectedGuardian.performanceMetrics.totalVotes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Participation Rate</p>
                      <p className="text-lg font-semibold">{selectedGuardian.performanceMetrics.consensusParticipation.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Response Time</p>
                      <p className="text-lg font-semibold">{selectedGuardian.performanceMetrics.averageResponseTime}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-lg font-semibold">{selectedGuardian.performanceMetrics.accuracy.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Cryptographic Details</p>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Wallet Address</p>
                      <p className="font-mono text-xs break-all">{selectedGuardian.walletAddress}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Public Key</p>
                      <p className="font-mono text-xs break-all">{selectedGuardian.publicKey}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Activity</p>
                  <p className="text-sm">Last Active: {new Date(selectedGuardian.lastActivity).toLocaleString()}</p>
                  <p className="text-sm">Certificate Status: {selectedGuardian.certificateStatus}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedGuardian(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}