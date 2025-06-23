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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, ExternalLink, Terminal, Book, Key, Server, Shield, Wifi, WifiOff, RefreshCw, Play, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response?: string;
}

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testResponse, setTestResponse] = useState<string>("");
  const [testLoading, setTestLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [testParams, setTestParams] = useState<Record<string, string>>({});
  
  const endpoints: Record<string, APIEndpoint[]> = {
    agents: [
      {
        method: 'GET',
        path: '/api/v1/adk/agents/status',
        description: 'Get status of all ADK agents',
        auth: true,
        response: '[\n  {\n    "id": "agent_001",\n    "name": "Compliance Monitor",\n    "status": "active",\n    "lastPing": "2024-06-11T10:00:00Z"\n  }\n]'
      },
      {
        method: 'POST',
        path: '/api/v1/adk/agents/deploy',
        description: 'Deploy a new ADK agent',
        auth: true,
        params: [
          { name: 'name', type: 'string', required: true, description: 'Agent name' },
          { name: 'type', type: 'string', required: true, description: 'Agent type' },
          { name: 'config', type: 'object', required: false, description: 'Agent configuration' }
        ]
      }
    ],
    workflows: [
      {
        method: 'GET',
        path: '/api/v1/adk/workflows/active',
        description: 'Get all active workflows',
        auth: true
      },
      {
        method: 'POST',
        path: '/api/v1/adk/workflows/trigger',
        description: 'Trigger a new workflow',
        auth: true,
        params: [
          { name: 'workflowType', type: 'string', required: true, description: 'Type of workflow' },
          { name: 'requestId', type: 'string', required: true, description: 'Request identifier' }
        ]
      }
    ],
    fraud: [
      {
        method: 'GET',
        path: '/api/v1/fraud/alerts',
        description: 'Get fraud detection alerts',
        auth: true,
        params: [
          { name: 'limit', type: 'number', required: false, description: 'Maximum number of alerts' },
          { name: 'severity', type: 'string', required: false, description: 'Filter by severity' }
        ]
      },
      {
        method: 'POST',
        path: '/api/v1/fraud/analyze',
        description: 'Analyze transaction for fraud',
        auth: true,
        params: [
          { name: 'transactionId', type: 'string', required: true, description: 'Transaction ID' },
          { name: 'data', type: 'object', required: true, description: 'Transaction data' }
        ]
      }
    ],
    privacy: [
      {
        method: 'POST',
        path: '/api/v1/privacy/request',
        description: 'Request selective de-anonymization',
        auth: true,
        params: [
          { name: 'transactionHash', type: 'string', required: true, description: 'Transaction hash' },
          { name: 'reason', type: 'string', required: true, description: 'Reason for request' },
          { name: 'evidence', type: 'array', required: true, description: 'Supporting evidence' }
        ]
      },
      {
        method: 'GET',
        path: '/api/v1/privacy/threshold',
        description: 'Get current threshold settings',
        auth: true
      }
    ]
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100';
      case 'POST': return 'text-blue-600 bg-blue-100';
      case 'PUT': return 'text-yellow-600 bg-yellow-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const fetchApiDocs = async () => {
    try {
      // Try to fetch OpenAPI spec from main API
      const response = await fetch("http://localhost:8000/api/openapi.json");
      if (response.ok) {
        const spec = await response.json();
        setOpenApiSpec(spec);
        
        // Transform OpenAPI spec to our endpoint format
        const transformedEndpoints = transformOpenApiSpec(spec);
        // Note: Currently using hardcoded endpoints, but spec is available for future use
        setIsConnected(true);
      } else {
        // Try FastAPI docs endpoint
        const docsResponse = await fetch("http://localhost:8000/api/docs");
        if (docsResponse.ok) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      }
      
      // Also check fraud monitoring API
      const fraudResponse = await fetch("http://localhost:8001/openapi.json");
      if (fraudResponse.ok) {
        const fraudSpec = await fraudResponse.json();
        // Merge fraud endpoints
        const fraudEndpoints = transformOpenApiSpec(fraudSpec);
        // Note: Currently using hardcoded endpoints, but fraud spec is available for future use
      }
    } catch (error) {
      console.error("Failed to fetch API docs:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const transformOpenApiSpec = (spec: any): Record<string, APIEndpoint[]> | null => {
    if (!spec || !spec.paths) return null;
    
    const transformed: Record<string, APIEndpoint[]> = {
      agents: [],
      workflows: [],
      fraud: [],
      privacy: [],
      compliance: []
    };
    
    Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, details]: [string, any]) => {
        if (method === 'parameters') return;
        
        const endpoint: APIEndpoint = {
          method: method.toUpperCase() as any,
          path,
          description: details.summary || details.description || '',
          auth: details.security ? true : false,
          params: details.parameters?.map((param: any) => ({
            name: param.name,
            type: param.schema?.type || 'string',
            required: param.required || false,
            description: param.description || ''
          }))
        };
        
        // Categorize endpoint
        if (path.includes('/agents') || path.includes('/adk/agents')) {
          transformed.agents.push(endpoint);
        } else if (path.includes('/workflows') || path.includes('/adk/workflows')) {
          transformed.workflows.push(endpoint);
        } else if (path.includes('/fraud') || path.includes('/monitoring')) {
          transformed.fraud.push(endpoint);
        } else if (path.includes('/privacy') || path.includes('/sede') || path.includes('/voting')) {
          transformed.privacy.push(endpoint);
        } else if (path.includes('/compliance') || path.includes('/guardians') || path.includes('/reports')) {
          transformed.compliance.push(endpoint);
        }
      });
    });
    
    return transformed;
  };

  useEffect(() => {
    fetchApiDocs();
    
    const interval = setInterval(fetchApiDocs, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchApiDocs();
    toast.success("API documentation refreshed");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const testEndpoint = async () => {
    if (!selectedEndpoint) return;
    
    setTestLoading(true);
    setTestResponse("");
    
    try {
      // Build URL with path parameters
      let url = `http://localhost:8000${selectedEndpoint.path}`;
      const pathParams = selectedEndpoint.params?.filter(p => selectedEndpoint.path.includes(`{${p.name}}`)) || [];
      
      pathParams.forEach(param => {
        url = url.replace(`{${param.name}}`, testParams[param.name] || '');
      });
      
      // Build query parameters for GET requests
      const queryParams = selectedEndpoint.params?.filter(p => !selectedEndpoint.path.includes(`{${p.name}}`)) || [];
      if (selectedEndpoint.method === 'GET' && queryParams.length > 0) {
        const query = new URLSearchParams();
        queryParams.forEach(param => {
          if (testParams[param.name]) {
            query.append(param.name, testParams[param.name]);
          }
        });
        if (query.toString()) {
          url += `?${query.toString()}`;
        }
      }
      
      // Build request options
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
        }
      };
      
      // Add body for POST/PUT requests
      if (['POST', 'PUT'].includes(selectedEndpoint.method)) {
        const bodyParams = queryParams.reduce((acc, param) => {
          if (testParams[param.name]) {
            acc[param.name] = param.type === 'number' ? Number(testParams[param.name]) : testParams[param.name];
          }
          return acc;
        }, {} as any);
        
        if (Object.keys(bodyParams).length > 0) {
          options.body = JSON.stringify(bodyParams);
        }
      }
      
      const response = await fetch(url, options);
      const data = await response.json();
      
      setTestResponse(JSON.stringify(data, null, 2));
      
      if (response.ok) {
        toast.success("API request successful");
      } else {
        toast.error(`API request failed: ${response.status}`);
      }
    } catch (error) {
      setTestResponse(`Error: ${error}`);
      toast.error("Failed to execute API request");
    } finally {
      setTestLoading(false);
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
                  <BreadcrumbPage>API Documentation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">API Documentation</h2>
              <p className="text-muted-foreground">
                GuardianOS REST API reference and integration guide
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => window.open('http://localhost:8000/api/docs', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Interactive Docs
              </Button>
              <Button onClick={() => setShowTestDialog(true)}>
                <Terminal className="h-4 w-4 mr-2" />
                API Tester
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
                  <p>Backend services are not available. Ensure the backend is running on ports 8000 and 8001.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Info Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Main API</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="text-sm">http://localhost:8000</code>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard('http://localhost:8000')}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud API</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="text-sm">http://localhost:8001</code>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard('http://localhost:8001')}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Authentication</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <code className="text-sm">Bearer Token</code>
                <p className="text-xs text-muted-foreground mt-1">Required for protected endpoints</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Version</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <code className="text-sm">{openApiSpec?.info?.version || 'v1'}</code>
                <p className="text-xs text-muted-foreground mt-1">{openApiSpec?.info?.title || 'GuardianOS API'}</p>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints */}
          <Tabs defaultValue="agents" className="flex-1">
            <TabsList>
              <TabsTrigger value="agents">Agents API</TabsTrigger>
              <TabsTrigger value="workflows">Workflows API</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Detection API</TabsTrigger>
              <TabsTrigger value="privacy">Privacy API</TabsTrigger>
              <TabsTrigger value="compliance">Compliance API</TabsTrigger>
            </TabsList>

            {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categoryEndpoints.map((endpoint, index) => (
                          <motion.button
                            key={`${endpoint.method}-${endpoint.path}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className="w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={getMethodColor(endpoint.method)}>
                                  {endpoint.method}
                                </Badge>
                                <code className="text-sm">{endpoint.path}</code>
                              </div>
                              {endpoint.auth && (
                                <Shield className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {endpoint.description}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedEndpoint && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Endpoint Details</CardTitle>
                        <CardDescription>
                          {selectedEndpoint.method} {selectedEndpoint.path}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedEndpoint.description}
                          </p>
                        </div>

                        {selectedEndpoint.params && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Parameters</h4>
                            <div className="space-y-2">
                              {selectedEndpoint.params.map(param => (
                                <div key={param.name} className="p-2 rounded bg-muted/50">
                                  <div className="flex items-center justify-between">
                                    <code className="text-sm">{param.name}</code>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {param.type}
                                      </Badge>
                                      {param.required && (
                                        <Badge variant="destructive" className="text-xs">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {param.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedEndpoint.response && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Example Response</h4>
                            <div className="relative">
                              <pre className="p-3 rounded bg-muted text-sm overflow-x-auto">
                                <code>{selectedEndpoint.response}</code>
                              </pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={() => copyToClipboard(selectedEndpoint.response || '')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <Button 
                            className="w-full"
                            onClick={() => {
                              setTestParams({});
                              setTestResponse("");
                              setShowTestDialog(true);
                            }}
                          >
                            <Terminal className="h-4 w-4 mr-2" />
                            Try in API Tester
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">1. Authentication</h4>
                <div className="p-3 rounded bg-muted">
                  <code className="text-sm">
                    curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:8000/api/v1/adk/agents/status
                  </code>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">2. Example Request</h4>
                <div className="p-3 rounded bg-muted">
                  <code className="text-sm">
                    POST /api/v1/adk/workflows/trigger<br />
                    {JSON.stringify({ workflowType: "compliance_check", requestId: "REQ-2024-001" }, null, 2)}
                  </code>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">3. WebSocket Connection</h4>
                <div className="p-3 rounded bg-muted">
                  <code className="text-sm">
                    ws://localhost:8000/socket.io/
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full Documentation
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-3 w-3 mr-1" />
                  Postman Collection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Statistics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Main API (Port 8000)</span>
                    <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fraud API (Port 8001)</span>
                    <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebSocket</span>
                    <Badge variant="secondary">ws://localhost:8000/socket.io/</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Endpoints</span>
                    <span className="text-sm font-medium">
                      {Object.values(endpoints).reduce((acc, arr) => acc + arr.length, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('http://localhost:8000/api/docs', '_blank')}
                  >
                    <Book className="h-4 w-4 mr-2" />
                    FastAPI Interactive Docs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('http://localhost:8000/api/redoc', '_blank')}
                  >
                    <Book className="h-4 w-4 mr-2" />
                    ReDoc Documentation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      const postmanCollection = generatePostmanCollection();
                      const blob = new Blob([JSON.stringify(postmanCollection, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'GuardianOS_API.postman_collection.json';
                      a.click();
                      toast.success("Postman collection downloaded");
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Download Postman Collection
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => copyToClipboard('pip install guardianos-sdk')}
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    Python SDK: pip install guardianos-sdk
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* API Test Dialog */}
        <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>API Endpoint Tester</DialogTitle>
              <DialogDescription>
                Test {selectedEndpoint?.method} {selectedEndpoint?.path}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              {selectedEndpoint?.params && selectedEndpoint.params.length > 0 && (
                <div className="space-y-2">
                  <Label>Parameters</Label>
                  {selectedEndpoint.params.map(param => (
                    <div key={param.name} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={param.name} className="text-sm">
                          {param.name}
                        </Label>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{param.type}</Badge>
                      </div>
                      <Input
                        id={param.name}
                        placeholder={param.description}
                        value={testParams[param.name] || ''}
                        onChange={(e) => setTestParams(prev => ({
                          ...prev,
                          [param.name]: e.target.value
                        }))}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {testResponse && (
                <div className="space-y-2">
                  <Label>Response</Label>
                  <div className="relative">
                    <Textarea
                      value={testResponse}
                      readOnly
                      className="font-mono text-sm min-h-[200px]"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(testResponse)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTestDialog(false)}>
                Close
              </Button>
              <Button onClick={testEndpoint} disabled={testLoading || !selectedEndpoint}>
                {testLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Test Endpoint
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}

function generatePostmanCollection() {
  return {
    info: {
      name: "GuardianOS API",
      description: "Multi-agent regulatory compliance system API",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      {
        name: "Agents",
        item: [
          {
            name: "Get Agent Status",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{api_key}}"
                }
              ],
              url: {
                raw: "http://localhost:8000/api/v1/adk/agents/status",
                protocol: "http",
                host: ["localhost"],
                port: "8000",
                path: ["api", "v1", "adk", "agents", "status"]
              }
            }
          }
        ]
      },
      {
        name: "Fraud Monitoring",
        item: [
          {
            name: "Get Fraud Alerts",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{api_key}}"
                }
              ],
              url: {
                raw: "http://localhost:8001/api/v1/fraud/alerts?limit=10",
                protocol: "http",
                host: ["localhost"],
                port: "8001",
                path: ["api", "v1", "fraud", "alerts"],
                query: [
                  {
                    key: "limit",
                    value: "10"
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    variable: [
      {
        key: "api_key",
        value: "YOUR_API_KEY_HERE",
        type: "string"
      }
    ]
  };
}