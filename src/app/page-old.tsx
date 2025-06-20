"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Shield, 
  Vote, 
  Eye, 
  Zap, 
  Users, 
  Globe, 
  TrendingUp, 
  CheckCircle, 
  Target,
  Play,
  ChevronDown,
  AlertTriangle,
  Lock,
  Bot,
  Network,
  BookOpen,
  FileText,
  Lightbulb,
  ArrowRight,
  Info,
  Database,
  Layers,
  GitBranch,
  Terminal,
  Code2,
  Coins,
  Scale,
  Building
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  InfoCard,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardContent,
  InfoCardFooter
} from "@/components/ui/info-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  technical?: string;
  benefit?: string;
  category: "blockchain" | "compliance" | "technical";
}

function FeatureCard({ title, description, icon, technical, benefit, category }: FeatureCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "blockchain": return "from-blue-50 to-blue-100/50 border-blue-200";
      case "compliance": return "from-emerald-50 to-emerald-100/50 border-emerald-200";
      case "technical": return "from-purple-50 to-purple-100/50 border-purple-200";
      default: return "from-slate-50 to-slate-100/50 border-slate-200";
    }
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300", `bg-gradient-to-br ${getCategoryColor(category)}`)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-white/80 shadow-sm">
              {icon}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{technical}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          
          {benefit && (
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Key Benefit:</span> {benefit}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Guardian Consensus Network",
      description: "Multiple independent compliance officers form a decentralized network to review and approve sensitive operations through cryptographic voting.",
      icon: <Vote className="h-5 w-5 text-blue-600" />,
      technical: "Uses threshold cryptography (3-of-5) with BLS signatures for efficient aggregation and on-chain verification.",
      benefit: "Removes single points of failure while maintaining regulatory oversight",
      category: "blockchain" as const
    },
    {
      title: "Selective Disclosure",
      description: "Reveal transaction details only to authorized parties when regulatory requirements demand it, keeping other users' privacy intact.",
      icon: <Eye className="h-5 w-5 text-emerald-600" />,
      technical: "Implements zero-knowledge proofs with merkle trees to prove compliance without revealing unnecessary data.",
      benefit: "Balances privacy needs with regulatory transparency",
      category: "compliance" as const
    },
    {
      title: "AI-Powered Risk Detection",
      description: "Machine learning agents continuously monitor blockchain activity for suspicious patterns and automatically flag high-risk transactions.",
      icon: <Bot className="h-5 w-5 text-purple-600" />,
      technical: "Google ADK orchestrates multiple specialized agents using vector embeddings for pattern matching.",
      benefit: "Advanced pattern matching with configurable risk thresholds",
      category: "technical" as const
    },
    {
      title: "Smart Contract Integration",
      description: "On-chain contracts enforce compliance rules automatically, creating an immutable audit trail of all regulatory actions.",
      icon: <Code2 className="h-5 w-5 text-blue-600" />,
      technical: "Solidity contracts deployed on Ethereum/Sepolia using EIP-7702 for enhanced account abstraction.",
      benefit: "Automated compliance without manual intervention",
      category: "blockchain" as const
    },
    {
      title: "Cross-Border Coordination",
      description: "Standardized protocols enable different jurisdictions to coordinate compliance actions without sharing sensitive data.",
      icon: <Globe className="h-5 w-5 text-emerald-600" />,
      technical: "Jurisdictional rules encoded in smart contracts with guardian expertise mapping.",
      benefit: "Seamless international transaction compliance",
      category: "compliance" as const
    },
    {
      title: "Real-Time Monitoring Dashboard",
      description: "Comprehensive interface showing all compliance activities, agent status, and risk metrics with live updates.",
      icon: <Terminal className="h-5 w-5 text-purple-600" />,
      technical: "WebSocket connections provide sub-second updates from blockchain and AI agents.",
      benefit: "Complete visibility into compliance operations",
      category: "technical" as const
    }
  ];

  const architectureLayers = [
    {
      name: "Smart Contract Layer",
      description: "Ethereum-based contracts handle voting, privacy pools, and fraud detection",
      components: ["SeDeFramework", "PrivacyPool", "FraudSentinel", "EIP7702Delegate"],
      icon: <Layers className="h-5 w-5 text-blue-600" />
    },
    {
      name: "AI Agent Layer", 
      description: "Intelligent agents monitor, assess risk, and coordinate compliance actions",
      components: ["Transaction Monitor", "Risk Assessment", "Guardian Council", "Privacy Revoker"],
      icon: <Bot className="h-5 w-5 text-purple-600" />
    },
    {
      name: "Guardian Network",
      description: "Decentralized compliance officers across jurisdictions",
      components: ["ECB", "DNB", "BaFin", "FINMA", "FCA"],
      icon: <Users className="h-5 w-5 text-emerald-600" />
    }
  ];

  const resources = [
    {
      title: "Privacy Pools: Smart Contracts for Privacy",
      author: "Vitalik Buterin et al.",
      type: "Research Paper",
      link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364",
      description: "Original research on privacy-preserving smart contract pools"
    },
    {
      title: "Project SPARC Framework",
      author: "European Central Bank",
      type: "Policy Document", 
      link: "#",
      description: "Regulatory framework for privacy-preserving compliance"
    },
    {
      title: "Threshold Cryptography Explained",
      author: "Cryptography Research",
      type: "Technical Guide",
      link: "#",
      description: "Understanding multi-party computation for compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="GuardianOS Logo"
                  height={32}
                  width={32}
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 flex items-center justify-center">
                <Image
                  src="/guardianos.png"
                  alt="GuardianOS"
                  height={32}
                  width={120}
                  className="object-contain"
                />
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#problem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Problem
              </Link>
              <Link href="#solution" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Solution
              </Link>
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#architecture" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Architecture
              </Link>
              <Link href="#resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="/guide" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Guide
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/guide">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Platform Guide
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-white via-blue-50/30 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Badge className="px-3 py-1 text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Enterprise Ready
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Regulatory Compliant
                  </Badge>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                  Institutional Blockchain
                  <span className="text-primary block">Compliance Platform</span>
                </h1>
                
                <div className="max-w-4xl mx-auto">
                  <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                    GuardianOS aims to connect institutions to the blockchain, providing monitoring, 
                    compliance tools and consensus protocols in order to provide institutional blockchain 
                    privacy with reasonable oversight.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 pt-8">
                <Link href="/guide">
                  <Button size="lg" className="text-base px-8 py-6">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Read Platform Guide
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="text-base px-8 py-6">
                    <Eye className="h-5 w-5 mr-2" />
                    Explore Demo
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Logo Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-20"
            >
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground">Built with cutting-edge technology</p>
              </div>
              <div className="flex items-center justify-center gap-12 flex-wrap">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                    <Database className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Ethereum</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Google ADK</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Zero-Knowledge</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-2 flex items-center justify-center">
                    <GitBranch className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Multi-Agent</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mt-16"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 bg-gradient-to-br from-red-50/50 via-white to-orange-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                The Challenge
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Institutions Can't Use Blockchain
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Traditional blockchain's transparency conflicts with institutional privacy needs and regulatory requirements
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-red-100 border border-red-200">
                      <Scale className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Regulatory Uncertainty
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Each jurisdiction has different rules for blockchain usage, KYC/AML requirements, and privacy regulations.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">No unified compliance framework</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">Manual compliance processes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">High risk of violations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-amber-100 border border-amber-200">
                      <Lock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Privacy Paradox
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Blockchain's transparency exposes sensitive financial data while regulations demand both privacy and oversight.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Competitive data exposed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Client privacy at risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Regulatory oversight needed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-blue-100 border border-blue-200">
                      <Coins className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Cost & Complexity
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Building compliant blockchain systems requires massive investment in technology and compliance infrastructure.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">$51B annual compliance costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">18-24 month implementation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Specialized expertise needed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1" variant="outline">
                <Lightbulb className="h-4 w-4 mr-2" />
                The Solution
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Privacy Pools with Guardian Consensus
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Combining Vitalik Buterin's Privacy Pools concept with decentralized guardian networks for compliant blockchain usage
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">How It Works</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">1</span>
                      <span>Institutions deposit funds into privacy-preserving smart contract pools</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">2</span>
                      <span>AI agents monitor all transactions for suspicious patterns in real-time</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">3</span>
                      <span>High-risk transactions trigger guardian council review (3-of-5 consensus)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">4</span>
                      <span>Approved requests reveal only necessary information to regulators</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">5</span>
                      <span>All other transactions remain private and compliant</span>
                    </li>
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                    <CardContent className="p-4">
                      <Shield className="h-5 w-5 text-emerald-600 mb-2" />
                      <h4 className="font-medium text-sm mb-1">Privacy Preserved</h4>
                      <p className="text-xs text-muted-foreground">
                        Zero-knowledge proofs ensure transaction privacy
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="p-4">
                      <CheckCircle className="h-5 w-5 text-blue-600 mb-2" />
                      <h4 className="font-medium text-sm mb-1">Regulatory Compliant</h4>
                      <p className="text-xs text-muted-foreground">
                        Selective disclosure when legally required
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="relative">
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <h3 className="text-xl font-bold text-foreground">Guardian Network Architecture</h3>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-300" />
                        </div>
                        
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-center">
                            <div className="p-3 bg-primary rounded-full">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex justify-center gap-8">
                            <TooltipProvider>
                              {["ECB", "DNB", "BaFin", "FINMA", "FCA"].map((guardian, index) => (
                                <Tooltip key={guardian}>
                                  <TooltipTrigger>
                                    <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center text-xs font-medium">
                                      {guardian.slice(0, 2)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{guardian} Guardian Node</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-2">3-of-5 Threshold Consensus</p>
                        <p className="text-xs">Each guardian holds a cryptographic key share</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1" variant="secondary">
                <Target className="h-4 w-4 mr-2" />
                Platform Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Everything You Need for Compliant Blockchain
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive features designed for both blockchain experts and traditional finance professionals
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1" variant="outline">
                <Layers className="h-4 w-4 mr-2" />
                Technical Architecture
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How GuardianOS Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Three-layer architecture combining blockchain, AI agents, and guardian networks
              </p>
            </div>

            <div className="space-y-8">
              {architectureLayers.map((layer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        <div className="p-6 lg:w-1/3 bg-gradient-to-br from-primary/5 to-primary/10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-white shadow-sm">
                              {layer.icon}
                            </div>
                            <h3 className="text-lg font-semibold">{layer.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{layer.description}</p>
                        </div>
                        <div className="p-6 lg:w-2/3">
                          <div className="flex flex-wrap gap-2">
                            {layer.components.map((component, i) => (
                              <Badge key={i} variant="secondary" className="px-3 py-1">
                                {component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold">System Capabilities</h3>
                    <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-400">3/5</div>
                        <p className="text-sm text-slate-300 mt-1">Guardian Threshold</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">ADK</div>
                        <p className="text-sm text-slate-300 mt-1">Google AI Agents</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">ZK</div>
                        <p className="text-sm text-slate-300 mt-1">Privacy Proofs</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">5</div>
                        <p className="text-sm text-slate-300 mt-1">Jurisdictions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1" variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                Learn More
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Research & Resources
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Deep dive into the technology and concepts behind GuardianOS
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{resource.type}</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{resource.author}</p>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            Read More →
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Ready to Get Started?</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our comprehensive platform guide walks you through every aspect of GuardianOS,
                    from basic concepts to advanced integration strategies.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Link href="/guide">
                      <Button size="lg">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Read Platform Guide
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" size="lg">
                        <Play className="h-5 w-5 mr-2" />
                        Try Live Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="GuardianOS Logo"
                    height={24}
                    width={24}
                    className="object-contain brightness-0 invert"
                  />
                  <Image
                    src="/guardianos.png"
                    alt="GuardianOS"
                    height={24}
                    width={90}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Building the future of compliant institutional blockchain adoption.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/guide" className="hover:text-white transition-colors">Platform Guide</Link></li>
                  <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>
                    <a href="mailto:contact@guardianos.io" className="hover:text-white transition-colors">
                      contact@guardianos.io
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Schedule Demo
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-8 bg-slate-700" />
            
            <div className="flex items-center justify-between text-sm text-slate-400">
              <p>&copy; 2024 GuardianOS. All rights reserved.</p>
              <p>Privacy-preserving blockchain compliance</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}