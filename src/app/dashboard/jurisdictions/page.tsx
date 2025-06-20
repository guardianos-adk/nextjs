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
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, MapPin, Building, Scale, FileText, Users, TrendingUp, AlertCircle, Wifi, WifiOff, RefreshCw, Plus, Shield, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Jurisdiction {
  id: string;
  name: string;
  code: string;
  region: string;
  regulatoryBody: string;
  complianceLevel: number;
  activeRequests: number;
  totalTransactions: number;
  regulations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
  guardians: string[];
  recentUpdates: number;
  sanctionsCount?: number;
}

export default function JurisdictionsPage() {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardians, setGuardians] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [complianceUpdates, setComplianceUpdates] = useState<any[]>([]);
  const [sanctionsStats, setSanctionsStats] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);
  
  // Form state for add dialog
  const [newJurisdictionName, setNewJurisdictionName] = useState("");
  const [newJurisdictionCode, setNewJurisdictionCode] = useState("");
  const [newJurisdictionRegion, setNewJurisdictionRegion] = useState("");
  const [newRegulatoryBody, setNewRegulatoryBody] = useState("");

  const fetchGuardians = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians");
      if (response.ok) {
        const data = await response.json();
        setGuardians(data);
      }
    } catch (error) {
      console.error("Failed to fetch guardians:", error);
    }
  };

  const fetchActiveRequests = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/voting/active-requests");
      if (response.ok) {
        const data = await response.json();
        setActiveRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch active requests:", error);
    }
  };

  const fetchComplianceUpdates = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/compliance/updates?days=30");
      if (response.ok) {
        const data = await response.json();
        setComplianceUpdates(data.updates || []);
      }
    } catch (error) {
      console.error("Failed to fetch compliance updates:", error);
    }
  };

  const fetchSanctionsStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/compliance/sanctions/statistics");
      if (response.ok) {
        const data = await response.json();
        setSanctionsStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch sanctions stats:", error);
    }
  };

  const fetchJurisdictions = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/jurisdictions");
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to match frontend structure
        const transformedJurisdictions: Jurisdiction[] = data.jurisdictions.map((jur: any) => ({
          id: `jur_${jur.code}`,
          name: jur.name,
          code: jur.code,
          region: jur.region,
          regulatoryBody: `${jur.name} Financial Authority`,
          complianceLevel: jur.complianceLevel,
          activeRequests: activeRequests.filter(req => req.jurisdiction === jur.code).length,
          totalTransactions: jur.totalTransactions,
          regulations: jur.regulations,
          riskLevel: jur.complianceLevel > 96 ? 'low' : jur.complianceLevel > 93 ? 'medium' : 'high' as 'low' | 'medium' | 'high',
          lastUpdated: new Date().toISOString(),
          guardians: guardians.filter(g => 
            Array.isArray(g.jurisdiction) ? g.jurisdiction.includes(jur.code) : g.jurisdiction === jur.code
          ).map(g => g.name),
          recentUpdates: complianceUpdates.filter(u => u.jurisdiction === jur.code).length,
          sanctionsCount: sanctionsStats?.by_jurisdiction?.[jur.code] || 0
        }));
        
        setJurisdictions(transformedJurisdictions);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch jurisdictions:", error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchGuardians(),
        fetchActiveRequests(),
        fetchComplianceUpdates(),
        fetchSanctionsStats()
      ]);
      await fetchJurisdictions(); // Fetch jurisdictions after other data is loaded
      setLoading(false);
    };

    fetchAllData();
    
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (guardians.length > 0) {
      fetchJurisdictions();
    }
  }, [guardians, activeRequests, complianceUpdates, sanctionsStats]);


  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchGuardians(),
      fetchActiveRequests(),
      fetchComplianceUpdates(),
      fetchSanctionsStats()
    ]);
    await fetchJurisdictions();
    toast.success("Jurisdiction data refreshed");
    setLoading(false);
  };

  const handleAddJurisdiction = async () => {
    if (!newJurisdictionName || !newJurisdictionCode || !newJurisdictionRegion || !newRegulatoryBody) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // In a real implementation, this would add the jurisdiction
      toast.success(`Jurisdiction ${newJurisdictionName} added successfully`);
      setShowAddDialog(false);
      resetAddForm();
    } catch (error) {
      toast.error("Failed to add jurisdiction");
    }
  };

  const resetAddForm = () => {
    setNewJurisdictionName("");
    setNewJurisdictionCode("");
    setNewJurisdictionRegion("");
    setNewRegulatoryBody("");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceColor = (level: number) => {
    if (level >= 95) return 'text-green-600';
    if (level >= 85) return 'text-yellow-600';
    return 'text-red-600';
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
                  <BreadcrumbPage>Jurisdiction Mapping</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Jurisdiction Mapping</h2>
              <p className="text-muted-foreground">
                Global regulatory landscape and compliance tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Jurisdiction
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

          {/* Global Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jurisdictions</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jurisdictions.length}</div>
                <p className="text-xs text-muted-foreground">Monitored regions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(jurisdictions.reduce((acc, j) => acc + j.complianceLevel, 0) / jurisdictions.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Regulatory adherence</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jurisdictions.reduce((acc, j) => acc + j.activeRequests, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Pending reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(jurisdictions.reduce((acc, j) => acc + j.totalTransactions, 0) / 1000).toFixed(1)}K
                </div>
                <p className="text-xs text-muted-foreground">Transactions monitored</p>
              </CardContent>
            </Card>
          </div>

          {/* Jurisdiction Details */}
          {loading && jurisdictions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">Loading jurisdiction data...</div>
              </CardContent>
            </Card>
          ) : jurisdictions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">No jurisdictions found</div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jurisdictions.map((jurisdiction, index) => (
                <motion.div
                  key={jurisdiction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                        onClick={() => setSelectedJurisdiction(jurisdiction)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {jurisdiction.name} ({jurisdiction.code})
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {jurisdiction.regulatoryBody}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(jurisdiction.riskLevel)}>
                            {jurisdiction.riskLevel} risk
                          </Badge>
                          <Badge variant="outline">
                            {jurisdiction.region}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Compliance Level</p>
                          <p className={`text-lg font-semibold ${getComplianceColor(jurisdiction.complianceLevel)}`}>
                            {jurisdiction.complianceLevel.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Requests</p>
                          <p className="text-lg font-semibold">{jurisdiction.activeRequests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transactions</p>
                          <p className="text-lg font-semibold">{jurisdiction.totalTransactions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Guardians</p>
                          <p className="text-lg font-semibold">{jurisdiction.guardians.length}</p>
                        </div>
                        {jurisdiction.sanctionsCount !== undefined && (
                          <div>
                            <p className="text-sm text-muted-foreground">Sanctions</p>
                            <p className="text-lg font-semibold">{jurisdiction.sanctionsCount}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Compliance Progress</span>
                          <span>{jurisdiction.complianceLevel.toFixed(1)}%</span>
                        </div>
                        <Progress value={jurisdiction.complianceLevel} className="h-2" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Active Regulations</p>
                        <div className="flex gap-2 flex-wrap">
                          {jurisdiction.regulations.map(reg => (
                            <Badge key={reg} variant="secondary" className="text-xs">
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(jurisdiction.lastUpdated).toLocaleTimeString()}
                          </span>
                          {jurisdiction.recentUpdates > 0 && (
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {jurisdiction.recentUpdates} updates
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJurisdiction(jurisdiction);
                          }}>
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Compliance Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Regulatory Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Cross-Jurisdictional Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Transaction Reporting Threshold</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">EU: €10,000</span>
                    <span className="text-muted-foreground">CH: CHF 10,000</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">KYC Requirements</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">Standard across all jurisdictions</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Data Retention Period</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">EU: 5-10 years</span>
                    <span className="text-muted-foreground">CH: 10 years</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Add Jurisdiction Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Jurisdiction</DialogTitle>
              <DialogDescription>
                Register a new jurisdiction for compliance monitoring
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jurisdiction-name">Jurisdiction Name</Label>
                <Input
                  id="jurisdiction-name"
                  placeholder="United States"
                  value={newJurisdictionName}
                  onChange={(e) => setNewJurisdictionName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction-code">Code (ISO)</Label>
                <Input
                  id="jurisdiction-code"
                  placeholder="US"
                  maxLength={2}
                  value={newJurisdictionCode}
                  onChange={(e) => setNewJurisdictionCode(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction-region">Region</Label>
                <Select value={newJurisdictionRegion} onValueChange={setNewJurisdictionRegion}>
                  <SelectTrigger id="jurisdiction-region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Americas">Americas</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia-Pacific">Asia-Pacific</SelectItem>
                    <SelectItem value="Middle East">Middle East</SelectItem>
                    <SelectItem value="Africa">Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regulatory-body">Regulatory Body</Label>
                <Input
                  id="regulatory-body"
                  placeholder="Federal Reserve"
                  value={newRegulatoryBody}
                  onChange={(e) => setNewRegulatoryBody(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  resetAddForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddJurisdiction}>
                <Plus className="h-4 w-4 mr-2" />
                Add Jurisdiction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Jurisdiction Details Dialog */}
        <Dialog open={!!selectedJurisdiction} onOpenChange={() => setSelectedJurisdiction(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Jurisdiction Details</DialogTitle>
              <DialogDescription>
                Comprehensive regulatory information for {selectedJurisdiction?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedJurisdiction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jurisdiction</p>
                    <p className="font-medium">{selectedJurisdiction.name} ({selectedJurisdiction.code})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{selectedJurisdiction.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Regulatory Body</p>
                    <p className="font-medium">{selectedJurisdiction.regulatoryBody}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <Badge className={getRiskColor(selectedJurisdiction.riskLevel)}>
                      {selectedJurisdiction.riskLevel}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Compliance Metrics</p>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Compliance Level</p>
                      <p className="text-lg font-semibold">{selectedJurisdiction.complianceLevel.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Requests</p>
                      <p className="text-lg font-semibold">{selectedJurisdiction.activeRequests}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Transactions</p>
                      <p className="text-lg font-semibold">{selectedJurisdiction.totalTransactions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Recent Updates</p>
                      <p className="text-lg font-semibold">{selectedJurisdiction.recentUpdates}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Active Regulations</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedJurisdiction.regulations.map(reg => (
                      <Badge key={reg} variant="secondary">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assigned Guardians</p>
                  <div className="space-y-2">
                    {selectedJurisdiction.guardians.map(guardian => (
                      <div key={guardian} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{guardian}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedJurisdiction.sanctionsCount !== undefined && (
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        {selectedJurisdiction.sanctionsCount} sanctioned entities in this jurisdiction
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedJurisdiction(null)}>
                Close
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}