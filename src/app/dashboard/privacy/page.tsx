"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from '@/lib/api-urls'
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Lock, Shield, Eye, EyeOff, Key, Users, AlertTriangle, CheckCircle, Wifi, WifiOff, RefreshCw, FileKey, UserCheck, Hash, XCircle } from "lucide-react";
import { toast } from "sonner";

interface PrivacyEvent {
  id: string;
  type: 'redaction' | 'disclosure' | 'alert' | 'encryption' | 'key_ceremony';
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error';
  metadata?: any;
}

interface SeDeStatus {
  framework: string;
  implementationStatus: Record<string, string>;
  cryptographicParameters: Record<string, string>;
  complianceFeatures: Record<string, boolean>;
}

export default function PrivacyPage() {
  const [privacySettings, setPrivacySettings] = useState({
    autoRedaction: true,
    minimalDisclosure: true,
    thresholdLevel: 3,
    encryptionEnabled: true,
    auditLogging: true,
    zkProofs: false
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sedeStatus, setSedeStatus] = useState<SeDeStatus | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [privacyEvents, setPrivacyEvents] = useState<PrivacyEvent[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [showKeyCeremonyDialog, setShowKeyCeremonyDialog] = useState(false);
  const [ceremonies, setCeremonies] = useState<any[]>([]);

  const fetchSeDeStatus = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')sede/framework/status");
      if (response.ok) {
        const data = await response.json();
        setSedeStatus(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch SeDe status:", error);
      setIsConnected(false);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')sede/user/statistics");
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch user statistics:", error);
    }
  };

  const fetchActiveRequests = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')voting/active-requests");
      if (response.ok) {
        const data = await response.json();
        setActiveRequests(data);
        
        // Transform some requests into privacy events
        const events: PrivacyEvent[] = data.slice(0, 5).map((req: any, index: number) => ({
          id: `event_${req.id}`,
          type: index % 2 === 0 ? 'disclosure' : 'redaction',
          description: req.complianceReason || req.description,
          time: new Date(req.createdAt).toLocaleTimeString(),
          status: req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning',
          metadata: req
        }));
        
        setPrivacyEvents(events);
      }
    } catch (error) {
      console.error("Failed to fetch active requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeDeStatus();
    fetchUserStatistics();
    fetchActiveRequests();
    
    const interval = setInterval(() => {
      fetchSeDeStatus();
      fetchActiveRequests();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleThresholdChange = (value: number[]) => {
    setPrivacySettings(prev => ({ ...prev, thresholdLevel: value[0] }));
    toast.info(`Consensus threshold updated to ${value[0]} of 5 guardians`);
  };

  const handleSettingToggle = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchSeDeStatus();
    fetchUserStatistics();
    fetchActiveRequests();
    toast.success("Privacy data refreshed");
  };

  const handleStartKeyCeremony = async () => {
    try {
      const response = await fetch("', getApiUrl('/api/v1/')sede/key-ceremony/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threshold: privacySettings.thresholdLevel,
          total_guardians: 5,
          ceremony_metadata: {
            initiated_by: "Current Guardian",
            purpose: "Quarterly key rotation"
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success("Key ceremony initiated successfully");
        setShowKeyCeremonyDialog(false);
      } else {
        toast.error("Failed to start key ceremony");
      }
    } catch (error) {
      toast.error("Failed to connect to backend");
    }
  };

  // Calculate privacy metrics
  const totalProtectedData = activeRequests.filter(r => r.status !== 'approved').length;
  const activeRedactions = activeRequests.filter(r => r.privacyImpactAssessment).length;

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
                  <BreadcrumbPage>Privacy Controls</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Privacy Controls</h2>
              <p className="text-muted-foreground">
                Selective disclosure and privacy management settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowKeyCeremonyDialog(true)}
              >
                <FileKey className="h-4 w-4 mr-2" />
                Key Ceremony
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

          {/* Privacy Status */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Privacy Level</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sedeStatus?.complianceFeatures?.privacy_preserving ? "High" : "Medium"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {sedeStatus?.framework || "SeDe framework active"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Redactions</CardTitle>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeRedactions}</div>
                <p className="text-xs text-muted-foreground">Protected data points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threshold</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{privacySettings.thresholdLevel}/5</div>
                <p className="text-xs text-muted-foreground">Guardian consensus required</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Encryption</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {sedeStatus?.cryptographicParameters?.encryption === "ElGamal" ? "Active" : "Configuring"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {sedeStatus?.cryptographicParameters?.encryption || "ElGamal"} encryption
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Configuration</CardTitle>
              <CardDescription>
                Configure selective disclosure and privacy protection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-redaction">Automatic Redaction</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically redact sensitive information in shared data
                  </p>
                </div>
                <Switch
                  id="auto-redaction"
                  checked={privacySettings.autoRedaction}
                  onCheckedChange={(checked) => 
                    handleSettingToggle('autoRedaction', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="minimal-disclosure">Minimal Disclosure</Label>
                  <p className="text-sm text-muted-foreground">
                    Share only the minimum required information
                  </p>
                </div>
                <Switch
                  id="minimal-disclosure"
                  checked={privacySettings.minimalDisclosure}
                  onCheckedChange={(checked) => 
                    handleSettingToggle('minimalDisclosure', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="zk-proofs">Zero-Knowledge Proofs</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable ZK proofs for compliance verification
                  </p>
                </div>
                <Switch
                  id="zk-proofs"
                  checked={privacySettings.zkProofs}
                  onCheckedChange={(checked) => 
                    handleSettingToggle('zkProofs', checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Guardian Consensus Threshold</Label>
                <p className="text-sm text-muted-foreground">
                  Number of guardians required for de-anonymization: {privacySettings.thresholdLevel}/5
                </p>
                <Slider
                  value={[privacySettings.thresholdLevel]}
                  onValueChange={handleThresholdChange}
                  min={2}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Privacy Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Privacy Events</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && privacyEvents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Loading privacy events...</div>
              ) : privacyEvents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No recent privacy events</div>
              ) : (
                <div className="space-y-3">
                  {privacyEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {event.type === "redaction" && <EyeOff className="h-4 w-4 text-blue-500" />}
                      {event.type === "disclosure" && <Eye className="h-4 w-4 text-green-500" />}
                      {event.type === "alert" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {event.type === "encryption" && <Lock className="h-4 w-4 text-purple-500" />}
                      <div>
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                    {event.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {event.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {event.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                  </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cryptographic Status */}
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Protection Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sedeStatus ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Encryption</span>
                    </div>
                    <Badge variant="default">
                      {sedeStatus.cryptographicParameters?.encryption || "ElGamal"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Signatures</span>
                    </div>
                    <Badge variant="default">
                      {sedeStatus.cryptographicParameters?.signature_scheme || "BLS"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Threshold Scheme</span>
                    </div>
                    <Badge variant="default">
                      {sedeStatus.cryptographicParameters?.threshold_scheme || `${privacySettings.thresholdLevel}-of-5`}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Commitment</span>
                    </div>
                    <Badge variant="default">
                      {sedeStatus.cryptographicParameters?.commitment_scheme || "SHA256"}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">Loading cryptographic status...</div>
              )}
            </CardContent>
          </Card>

          {/* SeDe Implementation Status */}
          {sedeStatus && (
            <Card>
              <CardHeader>
                <CardTitle>SeDe Framework Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Core Components</h4>
                    {Object.entries(sedeStatus.implementationStatus || {}).slice(0, 4).map(([component, status]) => (
                      <div key={component} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{component.replace(/_/g, ' ')}</span>
                        <Badge variant={status === 'implemented' ? 'default' : 'secondary'}>
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Compliance Features</h4>
                    {Object.entries(sedeStatus.complianceFeatures || {}).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{feature.replace(/_/g, ' ')}</span>
                        <Badge variant={enabled ? 'default' : 'secondary'}>
                          {enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Key Ceremony Dialog */}
        <Dialog open={showKeyCeremonyDialog} onOpenChange={setShowKeyCeremonyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Key Ceremony</DialogTitle>
              <DialogDescription>
                Initiate a threshold key distribution ceremony for guardian key management
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Threshold Configuration</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Current: {privacySettings.thresholdLevel} of 5 guardians required
                </p>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Threshold</span>
                    <span className="text-sm font-medium">{privacySettings.thresholdLevel}/5</span>
                  </div>
                  <Progress value={(privacySettings.thresholdLevel / 5) * 100} className="h-2" />
                </div>
              </div>

              <div>
                <Label>Ceremony Purpose</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Quarterly key rotation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Enhanced security compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Distributed key generation</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm">
                    This will require participation from at least {privacySettings.thresholdLevel} guardians
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowKeyCeremonyDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStartKeyCeremony}>
                <FileKey className="h-4 w-4 mr-2" />
                Start Ceremony
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}