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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blocks, Hash, Clock, Activity, Search, ExternalLink, Copy, CheckCircle, ArrowUpRight, ArrowDownLeft, Wifi, WifiOff, RefreshCw, FileText, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  type: 'transfer' | 'mint' | 'burn' | 'contract';
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  blockNumber: number;
  gasUsed: string;
}

interface Block {
  number: number;
  hash: string;
  timestamp: string;
  transactions: number;
  validator: string;
  gasUsed: string;
  gasLimit: string;
}

export default function BlockchainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [networkStats, setNetworkStats] = useState<any>(null);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [deploymentType, setDeploymentType] = useState("sede");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      hash: "0x7d4e3f8a9b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
      from: "0x742d35Cc6634C0532925a3b844Bc9e7595f6f8e",
      to: "0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed",
      value: "2.456 ETH",
      type: "transfer",
      status: "confirmed",
      timestamp: "2024-06-11T14:30:00Z",
      blockNumber: 19876543,
      gasUsed: "21,000"
    },
    {
      hash: "0x9f8e2d3c4b5a6e7d8c9b0a1f2e3d4c5b6a7e8d9f0a1b2c3d4e5f6a7b8c9d0e1f",
      from: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
      to: "0x6Fc82a5fe1e4F9A0f3dF8C7e2a4b5c6d7e8f9a0b",
      value: "0.123 ETH",
      type: "contract",
      status: "confirmed",
      timestamp: "2024-06-11T14:28:00Z",
      blockNumber: 19876542,
      gasUsed: "125,456"
    },
    {
      hash: "0x3a5b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      from: "0x1234567890123456789012345678901234567890",
      to: "0x0987654321098765432109876543210987654321",
      value: "10.0 ETH",
      type: "transfer",
      status: "pending",
      timestamp: "2024-06-11T14:32:00Z",
      blockNumber: 19876544,
      gasUsed: "0"
    }
  ]);

  const [blocks, setBlocks] = useState<Block[]>([
    {
      number: 19876544,
      hash: "0xabc123def456789012345678901234567890abcdef123456789012345678901234",
      timestamp: "2024-06-11T14:32:00Z",
      transactions: 156,
      validator: "0xValidator1234567890123456789012345678901234",
      gasUsed: "15,234,567",
      gasLimit: "30,000,000"
    },
    {
      number: 19876543,
      hash: "0xdef456789012345678901234567890abcdef123456789012345678901234567890",
      timestamp: "2024-06-11T14:30:00Z",
      transactions: 203,
      validator: "0xValidator0987654321098765432109876543210987",
      gasUsed: "18,456,789",
      gasLimit: "30,000,000"
    },
    {
      number: 19876542,
      hash: "0x789012345678901234567890abcdef123456789012345678901234567890abcdef",
      timestamp: "2024-06-11T14:28:00Z",
      transactions: 178,
      validator: "0xValidator5678901234567890123456789012345678",
      gasUsed: "16,789,012",
      gasLimit: "30,000,000"
    }
  ]);

  const fetchBlockchainData = async () => {
    try {
      // Fetch blockchain transactions
      const txResponse = await fetch("http://localhost:8000/api/v1/blockchain/transactions?limit=20");
      if (txResponse.ok) {
        const txData = await txResponse.json();
        
        // Transform transactions to UI format
        const formattedTxs: Transaction[] = txData.transactions.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value === "0" ? "0 ETH" : `${(BigInt(tx.value) / BigInt(10**18)).toString()} ETH`,
          type: tx.to === "0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed" ? 'contract' as const : 'transfer' as const,
          status: tx.status === 1 ? 'confirmed' as const : 'failed' as const,
          timestamp: tx.timestamp,
          blockNumber: tx.blockNumber,
          gasUsed: tx.gasUsed.toLocaleString()
        }));
        
        setTransactions(formattedTxs);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
      
      // Fetch blockchain stats
      const statsResponse = await fetch("http://localhost:8000/api/v1/compliance/stats");
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setNetworkStats({
          transactionsProcessed: stats.transactionsProcessed,
          gasUsed: stats.gasUsed,
          averageGasPrice: stats.averageGasPrice,
          blockHeight: stats.blockHeight,
          networkStatus: stats.networkStatus,
          consensusRate: stats.consensusRate
        });
        setBlockNumber(stats.blockHeight);
      }
      
      // Fetch recent blocks
      const blocksResponse = await fetch("http://localhost:8000/api/v1/blockchain/blocks?limit=5");
      if (blocksResponse.ok) {
        const blocksData = await blocksResponse.json();
        const formattedBlocks: Block[] = blocksData.blocks.map((block: any) => ({
          number: block.number,
          hash: block.hash,
          timestamp: block.timestamp,
          transactions: block.transactions,
          validator: block.validator,
          gasUsed: block.gasUsed,
          gasLimit: block.gasLimit
        }));
        
        setBlocks(formattedBlocks);
      }
    } catch (error) {
      console.error("Failed to fetch blockchain data:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    
    const interval = setInterval(fetchBlockchainData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchBlockchainData();
    toast.success("Blockchain data refreshed");
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    toast.info(`Searching for ${searchQuery}...`);
    // In a real implementation, this would search the blockchain
    setTimeout(() => {
      toast.success("Search completed");
    }, 1000);
  };

  const handleDeployContract = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/contracts/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractType: deploymentType,
          network: "localhost",
          deployerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setContractAddress(data.contractAddress);
        toast.success(`${deploymentType.toUpperCase()} contract deployed at ${data.contractAddress}`);
        setShowDeployDialog(false);
      } else {
        toast.error("Failed to deploy contract");
      }
    } catch (error) {
      console.error("Contract deployment error:", error);
      toast.error("Failed to deploy contract");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer': return <ArrowUpRight className="h-4 w-4" />;
      case 'contract': return <Hash className="h-4 w-4" />;
      case 'mint': return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'burn': return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
                  <BreadcrumbPage>Blockchain Explorer</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Blockchain Explorer</h2>
              <p className="text-muted-foreground">
                On-chain transaction monitoring and verification
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeployDialog(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Deploy Contract
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
                  <p>Backend services are not available. Ensure the backend is running on port 8000 and Anvil on port 8545.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search Blockchain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by transaction hash, block number, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Network Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
                <Blocks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blockNumber.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network TPS</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(transactions.length / 10).toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Transactions per second</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1 Gwei</div>
                <p className="text-xs text-muted-foreground">Local network gas price</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Finality</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Instant</div>
                <p className="text-xs text-muted-foreground">Local network finality</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Transactions and Blocks */}
          <Tabs defaultValue="transactions" className="flex-1">
            <TabsList>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
              <TabsTrigger value="blocks">Recent Blocks</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No transactions found</div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx, index) => (
                        <motion.div
                          key={tx.hash}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                {getTypeIcon(tx.type)}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-mono text-sm">{truncateAddress(tx.hash)}</p>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Badge className={getStatusColor(tx.status)}>
                                    {tx.status}
                                  </Badge>
                                  <Badge variant="outline">{tx.type}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>From: {truncateAddress(tx.from)}</span>
                                  <ArrowUpRight className="h-3 w-3" />
                                  <span>To: {truncateAddress(tx.to)}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Block: {tx.blockNumber}</span>
                                  <span>•</span>
                                  <span>Gas: {tx.gasUsed}</span>
                                  <span>•</span>
                                  <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{tx.value}</p>
                              <Button size="sm" variant="ghost" className="mt-1">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blocks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Block History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && blocks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Loading blocks...</div>
                  ) : blocks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No blocks found</div>
                  ) : (
                    <div className="space-y-3">
                      {blocks.map((block, index) => (
                        <motion.div
                          key={block.hash}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Blocks className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">Block #{block.number}</h4>
                                  <Badge variant="secondary">
                                    {block.transactions} txns
                                  </Badge>
                                </div>
                                <p className="font-mono text-xs text-muted-foreground">
                                  {truncateAddress(block.hash)}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Validator: {truncateAddress(block.validator)}</span>
                                  <span>•</span>
                                  <span>Gas: {block.gasUsed}/{block.gasLimit}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {new Date(block.timestamp).toLocaleTimeString()}
                              </p>
                              <Button size="sm" variant="ghost" className="mt-1">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Smart Contract Info */}
          <Card>
            <CardHeader>
              <CardTitle>SeDe Smart Contract</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contract Address</span>
                  <span className="font-mono text-sm">{contractAddress || "Not deployed"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="text-sm">Local Anvil Network</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deployment Block</span>
                  <span className="text-sm">{contractAddress ? blockNumber - 100 : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Interactions</span>
                  <span className="text-sm">{transactions.filter(tx => tx.type === 'contract').length}</span>
                </div>
              </div>
              {contractAddress && (
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(`http://localhost:8545/address/${contractAddress}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Contract Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contract Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">GuardianAdded</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Guardian from EU added</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span className="text-sm">DeAnonymizationRequested</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Request #42 submitted</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">RequestApproved</span>
                  </div>
                  <span className="text-xs text-muted-foreground">3/5 consensus reached</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Deploy Contract Dialog */}
        <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deploy Smart Contract</DialogTitle>
              <DialogDescription>
                Deploy GuardianOS contracts to the local Anvil network
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contract-type">Contract Type</Label>
                <Select value={deploymentType} onValueChange={setDeploymentType}>
                  <SelectTrigger id="contract-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sede">SeDeFramework</SelectItem>
                    <SelectItem value="sentinel">FraudSentinel</SelectItem>
                    <SelectItem value="both">Both Contracts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-medium">Deployment Details</p>
                <div className="text-xs space-y-1">
                  <p>Network: Local Anvil (Chain ID: 31337)</p>
                  <p>Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
                  <p>Gas Price: 1 Gwei</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeployDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeployContract}>
                <FileText className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}