"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Key, Globe, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { TutorialSettings } from "@/components/tutorial-settings";

interface GuardianSettings {
  guardianId: string;
  jurisdiction: string;
  organization: string;
  contactEmail: string;
  description: string;
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  emailAlerts: boolean;
  votingReminders: boolean;
  systemUpdates: boolean;
  performanceReports: boolean;
  timeZone: string;
  language: string;
  currency: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GuardianSettings>({
    guardianId: "GRD-EU-001",
    jurisdiction: "eu",
    organization: "European Central Bank",
    contactEmail: "guardian@ecb.europa.eu",
    description: "Primary guardian for EU regulatory compliance and cross-border transaction monitoring.",
    twoFactorEnabled: true,
    sessionTimeout: "30",
    emailAlerts: true,
    votingReminders: true,
    systemUpdates: false,
    performanceReports: true,
    timeZone: "europe/brussels",
    language: "en",
    currency: "eur"
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to connect to backend");
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians/settings/reset", {
        method: "POST"
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
        toast.success("Settings reset to defaults");
      } else {
        toast.error("Failed to reset settings");
      }
    } catch (error) {
      console.error("Failed to reset settings:", error);
      toast.error("Failed to connect to backend");
    }
  };

  const regenerateApiKey = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/guardians/api-key/regenerate", {
        method: "POST"
      });
      
      if (response.ok) {
        toast.success("API key regenerated successfully");
      } else {
        toast.error("Failed to regenerate API key");
      }
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      toast.error("Failed to connect to backend");
    }
  };

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchSettings();
    toast.success("Settings refreshed");
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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Guardian Settings</h2>
              <p className="text-muted-foreground">
                Manage your guardian profile and system preferences
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
                  <p>Backend services are not available. Changes will not be saved.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guardian Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guardian-id">Guardian ID</Label>
                      <Input id="guardian-id" value={settings.guardianId} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Select 
                        value={settings.jurisdiction} 
                        onValueChange={(value) => setSettings(prev => ({ ...prev, jurisdiction: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eu">European Union</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ch">Switzerland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input 
                      id="organization" 
                      value={settings.organization}
                      onChange={(e) => setSettings(prev => ({ ...prev, organization: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      value={settings.contactEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Brief description of your role and responsibilities..."
                      value={settings.description}
                      onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all guardian operations
                      </p>
                    </div>
                    <Switch 
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="api-key" 
                        type="password" 
                        value="grd_sk_live_••••••••••••••••••••••••••••••••"
                        disabled 
                      />
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification & System Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Critical system alerts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Voting Reminders</Label>
                      <p className="text-xs text-muted-foreground">
                        Pending vote notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Maintenance notifications
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Performance Reports</Label>
                      <p className="text-xs text-muted-foreground">
                        Weekly summaries
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Regional Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="europe/brussels">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe/brussels">Europe/Brussels</SelectItem>
                        <SelectItem value="europe/london">Europe/London</SelectItem>
                        <SelectItem value="america/new_york">America/New_York</SelectItem>
                        <SelectItem value="asia/tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Currency Display</Label>
                    <Select defaultValue="eur">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="chf">CHF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tutorial Settings */}
              <TutorialSettings />

              <div className="flex flex-col gap-2">
                <Button>
                  Save Changes
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 