"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, AlertTriangle, CheckCircle, Clock, RefreshCw, Database, Shield, Globe, Wifi, WifiOff, Brain } from 'lucide-react'
import { toast } from "sonner"
import { TenthOpinionPanel } from "@/components/tenth-opinion/tenth-opinion-panel"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface ComplianceData {
  regulations: any[]
  sanctions: any[]
  updates: any[]
  statistics: any
}

interface SearchResult {
  query: string
  results: any[]
  count: number
  regulations?: any[]
  sanctions?: any[]
  updates?: any[]
  summary?: {
    total_results: number
  }
}

interface SyncStatus {
  lastSync: {
    regulations: string
    sanctions: string
    apis: string
  }
  syncInProgress: boolean
  nextScheduledSync: string
  statistics: {
    total_sanctions: number
    sanctions_sources: number
    last_24h_updates: number
  }
}

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [complianceData, setComplianceData] = useState<ComplianceData>({
    regulations: [],
    sanctions: [],
    updates: [],
    statistics: {}
  })
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isConnected, setIsConnected] = useState(false)

  // Load initial data and set up auto-refresh
  useEffect(() => {
    loadComplianceData()
    loadSyncStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadComplianceData()
      loadSyncStatus()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadComplianceData = async () => {
    try {
      setLoading(true)
      
      // Load recent regulations
      const regulationsResponse = await fetch('http://localhost:8000/api/v1/compliance/regulations/recent?days=7')
      const regulationsData = await regulationsResponse.json()
      
      // Load compliance updates
      const updatesResponse = await fetch('http://localhost:8000/api/v1/compliance/updates?days=30&limit=50')
      const updatesData = await updatesResponse.json()
      
      // Load sanctions statistics
      const statsResponse = await fetch('http://localhost:8000/api/v1/compliance/sanctions/statistics')
      const statsData = await statsResponse.json()
      
      setComplianceData({
        regulations: regulationsData.regulations || [],
        sanctions: [],
        updates: updatesData.updates || [],
        statistics: statsData
      })
      
      setIsConnected(true)
    } catch (error) {
      console.error('Error loading compliance data:', error)
      setIsConnected(false)
      toast.error("Failed to load compliance data")
    } finally {
      setLoading(false)
    }
  }

  const loadSyncStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/compliance/sync/status')
      const data = await response.json()
      setSyncStatus(data)
    } catch (error) {
      console.error('Error loading sync status:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/v1/compliance/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 20
        })
      })
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      setSearchResults(data)
      setActiveTab('search')
      
    } catch (error) {
      console.error('Search error:', error)
      toast.error("Failed to search compliance data")
    } finally {
      setLoading(false)
    }
  }

  const handleSanctionsCheck = async (entityName: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/compliance/sanctions/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: entityName,
          fuzzy: true
        })
      })
      
      const result = await response.json()
      
      if (result.is_sanctioned) {
        toast.error(`⚠️ Sanctions Match Found - Entity: ${entityName} - Risk Level: ${result.risk_level}`)
      } else {
        toast.success(`✅ No Sanctions Found - Entity: ${entityName} - Risk Level: ${result.risk_level}`)
      }
      
      return result
    } catch (error) {
      console.error('Sanctions check error:', error)
      toast.error("Failed to check sanctions")
    }
  }

  const triggerSync = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/compliance/sync/trigger', {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success("Compliance data synchronization initiated")
        loadSyncStatus()
      }
    } catch (error) {
      console.error('Sync trigger error:', error)
      toast.error("Failed to trigger sync")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{importance}</Badge>
    }
  }

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
                  <BreadcrumbPage>Compliance Intelligence</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Compliance Intelligence</h2>
              <p className="text-muted-foreground">
                Regulatory monitoring and sanctions screening system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={triggerSync} 
                variant="outline" 
                size="sm"
                disabled={syncStatus?.syncInProgress}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus?.syncInProgress ? 'animate-spin' : ''}`} />
                {syncStatus?.syncInProgress ? 'Syncing...' : 'Sync Data'}
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
                  <p>Backend services are not available. Showing cached compliance data.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Natural Language Search
          </CardTitle>
          <CardDescription>
            Search across regulations, sanctions, and compliance updates using natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., 'What are the latest EU AML regulations?' or 'Is Company X sanctioned?'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk Analysis</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sanctions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus?.statistics?.total_sanctions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  from {syncStatus?.statistics?.sanctions_sources || 0} sources
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus?.statistics?.last_24h_updates || 0}</div>
                <p className="text-xs text-muted-foreground">in last 24 hours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Regulations</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complianceData.regulations.length}</div>
                <p className="text-xs text-muted-foreground">recent regulations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {syncStatus?.syncInProgress ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Syncing
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Online
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {syncStatus?.nextScheduledSync ? 
                    `Next sync: ${formatDate(syncStatus.nextScheduledSync)}` : 
                    'Sync scheduled'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Compliance Updates</CardTitle>
              <CardDescription>Latest regulatory changes and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {complianceData.updates.slice(0, 10).map((update, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{update.title}</h4>
                          {getImportanceBadge(update.importance)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {update.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {update.jurisdiction && (
                            <Badge variant="outline" className="text-xs">
                              {update.jurisdiction}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Results Tab */}
        <TabsContent value="search" className="space-y-4">
          {searchResults ? (
            <Card>
              <CardHeader>
                <CardTitle>Search Results for "{searchResults.query}"</CardTitle>
                <CardDescription>
                  Found {searchResults.summary?.total_results || searchResults.count || 0} results across all compliance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Regulations Results */}
                  {searchResults.regulations && searchResults.regulations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Regulations ({searchResults.regulations.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.regulations.map((reg: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{reg.title}</h4>
                              <Badge variant="outline">{reg.jurisdiction}</Badge>
                              {reg.score && (
                                <Badge variant="secondary">
                                  {Math.round(reg.score * 100)}% match
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {reg.content || reg.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sanctions Results */}
                  {searchResults.sanctions && searchResults.sanctions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Sanctions ({searchResults.sanctions.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.sanctions.map((sanction: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg bg-red-50">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{sanction.name}</h4>
                              <Badge variant="destructive">{sanction.source}</Badge>
                              {sanction.score && (
                                <Badge variant="secondary">
                                  {Math.round(sanction.score * 100)}% match
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Programs: {sanction.programs?.join(', ') || 'N/A'}
                            </p>
                            {sanction.aliases && sanction.aliases.length > 0 && (
                              <p className="text-sm text-muted-foreground">
                                Also known as: {sanction.aliases.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Updates Results */}
                  {searchResults.updates && searchResults.updates.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Updates ({searchResults.updates.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.updates.map((update: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{update.title}</h4>
                              {getImportanceBadge(update.importance)}
                              {update.score && (
                                <Badge variant="secondary">
                                  {Math.round(update.score * 100)}% match
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {update.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No search results yet. Try searching above.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Regulations Tab */}
        <TabsContent value="regulations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Regulations</CardTitle>
              <CardDescription>Latest regulatory updates from all monitored jurisdictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {complianceData.regulations.map((regulation: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{regulation.title}</h3>
                        <Badge variant="outline">{regulation.jurisdiction}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                        {regulation.content || regulation.summary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Source: {regulation.source}</span>
                        <span>•</span>
                        <span>{formatDate(regulation.last_updated || regulation.scraped_date)}</span>
                        {regulation.tags && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {regulation.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sanctions Tab */}
        <TabsContent value="sanctions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sanctions Database</CardTitle>
              <CardDescription>Search and monitor sanctioned entities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick sanctions check */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Quick Sanctions Check</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter entity name to check..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSanctionsCheck((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Enter entity name to check..."]') as HTMLInputElement
                      if (input?.value) {
                        handleSanctionsCheck(input.value)
                      }
                    }}
                  >
                    Check
                  </Button>
                </div>
              </div>

              {/* Statistics */}
              {complianceData.statistics && Object.keys(complianceData.statistics).length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Sources</h3>
                    <div className="space-y-1">
                      {Object.entries(complianceData.statistics.sources || {}).map(([source, count]) => (
                        <div key={source} className="flex justify-between text-sm">
                          <span>{source}</span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Entity Types</h3>
                    <div className="space-y-1">
                      {Object.entries(complianceData.statistics.entity_types || {}).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span>{type || 'Unknown'}</span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Updates</CardTitle>
              <CardDescription>All compliance alerts and regulatory changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {complianceData.updates.map((update: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{update.title}</h3>
                          {getImportanceBadge(update.importance)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(update.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {update.description}
                      </p>
                      <div className="flex items-center gap-2">
                        {update.jurisdiction && (
                          <Badge variant="outline">{update.jurisdiction}</Badge>
                        )}
                        <Badge variant="secondary">{update.updateType}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Status Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization Status</CardTitle>
              <CardDescription>Monitor compliance data sync status and schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatus && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Regulations</h3>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {formatDate(syncStatus.lastSync.regulations)}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Sanctions</h3>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {formatDate(syncStatus.lastSync.sanctions)}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">API Sources</h3>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {formatDate(syncStatus.lastSync.apis)}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Sync Status</h3>
                      <Button onClick={triggerSync} disabled={syncStatus.syncInProgress}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
                        {syncStatus.syncInProgress ? 'Syncing...' : 'Trigger Sync'}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant={syncStatus.syncInProgress ? "secondary" : "outline"}>
                          {syncStatus.syncInProgress ? "In Progress" : "Idle"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Next scheduled sync:</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(syncStatus.nextScheduledSync)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* High Risk Analysis Tab */}
        <TabsContent value="high-risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                High-Risk Transaction Analysis
              </CardTitle>
              <CardDescription>
                Advanced compliance analysis for transactions exceeding €75,000 or with risk scores above 0.7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <div className="ml-2">
                  <AlertTitle>Tenth Opinion Protocol</AlertTitle>
                  <AlertDescription>
                    High-stakes transactions automatically trigger our 10-agent consensus system for comprehensive risk assessment and regulatory compliance verification.
                  </AlertDescription>
                </div>
              </Alert>

              {/* Example high-risk transaction for demonstration */}
              <div className="space-y-4">
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Sample High-Risk Transaction</CardTitle>
                    <CardDescription>Demonstration of Tenth Opinion evaluation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div>
                        <p className="text-sm font-medium">Transaction ID</p>
                        <p className="text-sm text-muted-foreground">tx_demo_12345</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm text-muted-foreground">€125,000</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Risk Score</p>
                        <p className="text-sm text-muted-foreground">0.82 (High)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm text-muted-foreground">Cross-border wire transfer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tenth Opinion Panel Integration */}
                <TenthOpinionPanel 
                  transactionData={{
                    id: "tx_demo_12345",
                    amount: 125000,
                    riskScore: 0.82,
                    type: "cross-border",
                    jurisdiction: "CYPRUS",
                    entities: [{ id: "entity_demo", sanctions_hit: false }]
                  }}
                  onDecision={(decision) => {
                    console.log("Tenth Opinion decision:", decision);
                    toast.success("Tenth Opinion evaluation completed");
                  }}
                />

                {/* Information Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Activation Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Transactions exceeding €75,000</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Risk score above 0.7</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Sanctions screening hits</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Manual escalation by guardian</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Protocol Phases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="font-medium text-purple-600">Phase 1:</span>
                          <span>Blind independent analysis (4 agents)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium text-purple-600">Phase 2:</span>
                          <span>Informed cross-analysis (3 agents)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium text-purple-600">Phase 3:</span>
                          <span>Quality assurance (2 agents)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium text-purple-600">Phase 4:</span>
                          <span>Final synthesis (1 agent)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}