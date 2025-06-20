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
  Building,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClassName = scrolled 
    ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 guardian-nav shadow-lg backdrop-blur-xl" 
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent";

  return (
    <div>
      {/* Navigation */}
      <nav className={navClassName}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="GuardianOS Logo" width={40} height={40} />
              <span className="guardian-heading-4">GuardianOS</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#problem" className="guardian-nav-item">Problem</a>
              <a href="#solution" className="guardian-nav-item">Solution</a>
              <a href="#features" className="guardian-nav-item">Features</a>
              <a href="#architecture" className="guardian-nav-item">Architecture</a>
              <a href="#resources" className="guardian-nav-item">Resources</a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/guide">
                <button className="guardian-button-secondary group flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                  Guide
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="guardian-button-primary group flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="guardian-hero min-h-screen flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div 
              className="guardian-badge mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-4 w-4 mr-2" />
              <span className="guardian-emphasis">Enterprise Ready</span> • <span className="guardian-emphasis">Regulatory Compliant</span>
            </motion.div>
            
            <h1 className="mb-8">
              <span className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">INSTITUTIONAL</span>
              <br />
              <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Blockchain Compliance Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed mb-12 text-slate-700 dark:text-slate-200 max-w-3xl mx-auto">
              Connect institutions to blockchain networks with 
              <span className="font-semibold bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent"> built-in monitoring</span>, 
              <span className="font-semibold bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent"> compliance tools</span>, and 
              <span className="font-semibold bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent"> consensus protocols</span> for 
              privacy-preserving regulatory oversight.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/dashboard">
                <button className="guardian-button-primary text-lg px-8 py-4 group flex items-center">
                  <LayoutDashboard className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Dashboard
                </button>
              </Link>
              <Link href="/guide">
                <button className="guardian-button-secondary text-lg px-8 py-4 group flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12" />
                  Guide
                </button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div 
                className="guardian-metric-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="guardian-metric-value">3/5</div>
                <div className="guardian-metric-label">Guardian Consensus</div>
              </motion.div>
              <motion.div 
                className="guardian-metric-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="guardian-metric-value">ADK</div>
                <div className="guardian-metric-label">Google AI Agents</div>
              </motion.div>
              <motion.div 
                className="guardian-metric-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="guardian-metric-value">ZK</div>
                <div className="guardian-metric-label">Privacy Proofs</div>
              </motion.div>
              <motion.div 
                className="guardian-metric-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="guardian-metric-value">5</div>
                <div className="guardian-metric-label">Jurisdictions</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="guardian-badge mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                The Challenge
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">€1.5 Trillion</span>
                <span className="text-slate-900 dark:text-slate-100"> in Unbanked Crypto</span>
              </h2>
              <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
                Traditional institutions face an <span className="guardian-emphasis">impossible choice</span>: 
                embrace blockchain's efficiency but risk compliance violations, or miss the 
                <span className="guardian-emphasis"> greatest financial innovation</span> of our time.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="guardian-info-card">
                <div className="guardian-info-icon">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Privacy vs Compliance</h3>
                <p className="guardian-body text-muted-foreground">
                  Current blockchain solutions offer <span className="guardian-emphasis">complete transparency</span> or 
                  <span className="guardian-emphasis"> complete privacy</span> - neither works for regulated institutions 
                  that need selective disclosure.
                </p>
                <div className="space-y-2 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>GDPR conflicts with transparency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Regulatory oversight needed</span>
                  </div>
                </div>
              </div>

              <div className="guardian-info-card">
                <div className="guardian-info-icon">
                  <Coins className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Cost & Complexity</h3>
                <p className="guardian-body text-muted-foreground">
                  Building compliant blockchain systems requires <span className="guardian-emphasis">massive investment</span> in 
                  technology and compliance infrastructure.
                </p>
                <div className="space-y-2 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>$51B annual compliance costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>18-24 month implementation</span>
                  </div>
                </div>
              </div>

              <div className="guardian-info-card">
                <div className="guardian-info-icon">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Fragmented Regulations</h3>
                <p className="guardian-body text-muted-foreground">
                  Every jurisdiction has <span className="guardian-emphasis">different requirements</span>, making 
                  <span className="guardian-emphasis"> cross-border transactions</span> a compliance nightmare.
                </p>
                <div className="space-y-2 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>5+ regulatory frameworks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Conflicting requirements</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="guardian-badge mb-4">
                <Lightbulb className="h-4 w-4 mr-2" />
                Our Approach
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Privacy Pools</span>
                <span className="text-slate-900 dark:text-slate-100"> with</span>
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"> Guardian Networks</span>
              </h2>
              <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
                Based on <span className="guardian-emphasis">Vitalik Buterin's Privacy Pools concept</span>, 
                we enable selective de-anonymization through <span className="guardian-emphasis">multi-party consensus</span>, 
                protecting privacy while ensuring compliance.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <motion.div 
                  className="guardian-feature-card"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="guardian-info-icon"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-sm font-bold">1</span>
                      </motion.div>
                    </div>
                    <div>
                      <h4 className="guardian-heading-4 mb-2">Privacy-Preserving Deposits</h4>
                      <p className="guardian-body text-muted-foreground">
                        Users deposit funds into <span className="guardian-emphasis">zero-knowledge pools</span>, 
                        maintaining complete privacy from public view.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="guardian-feature-card"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="guardian-info-icon"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-sm font-bold">2</span>
                      </motion.div>
                    </div>
                    <div>
                      <h4 className="guardian-heading-4 mb-2">AI Risk Detection</h4>
                      <p className="guardian-body text-muted-foreground">
                        <span className="guardian-emphasis">Google ADK agents</span> continuously monitor 
                        for suspicious patterns without accessing private data.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="guardian-feature-card"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="guardian-info-icon"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-sm font-bold">3</span>
                      </motion.div>
                    </div>
                    <div>
                      <h4 className="guardian-heading-4 mb-2">Guardian Consensus</h4>
                      <p className="guardian-body text-muted-foreground">
                        When investigation is needed, <span className="guardian-emphasis">3-of-5 guardians</span> 
                        must agree to decrypt specific transaction details.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-64 h-64 rounded-full border-2 border-dashed border-slate-300" />
                      <div className="absolute w-48 h-48 rounded-full border-2 border-dashed border-slate-300" />
                      <div className="absolute w-32 h-32 rounded-full border-2 border-dashed border-slate-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-center">
                        <div className="guardian-info-icon">
                          <Users className="h-6 w-6" />
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-8">
                        <TooltipProvider>
                          {["ECB", "DNB", "BaFin", "FINMA", "FCA"].map((guardian, index) => (
                            <Tooltip key={guardian}>
                              <TooltipTrigger>
                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold">
                                  {guardian.slice(0, 2)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="guardian-tooltip">
                                <p>{guardian} Guardian Node</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <p className="guardian-body font-medium mb-2">3-of-5 Threshold Consensus</p>
                  <p className="text-sm text-muted-foreground">
                    Each guardian holds a <span className="guardian-emphasis">cryptographic key share</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="guardian-badge mb-4">
                <Zap className="h-4 w-4 mr-2" />
                Platform Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="text-slate-900 dark:text-slate-100">Enterprise-Grade</span>
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent"> Compliance Infrastructure</span>
              </h2>
              <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
                Everything institutions need to <span className="guardian-emphasis">embrace blockchain</span> while 
                maintaining <span className="guardian-emphasis">regulatory compliance</span> and 
                <span className="guardian-emphasis"> operational efficiency</span>.
              </p>
            </div>

            <div className="guardian-feature-grid">
              <div className="guardian-feature-card">
                <div className="guardian-info-icon">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Privacy Pools</h3>
                <p className="guardian-body text-muted-foreground mb-4">
                  <span className="guardian-emphasis">Zero-knowledge proofs</span> enable private transactions while maintaining 
                  the ability for <span className="guardian-emphasis">selective disclosure</span> when legally required.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-sm text-primary hover:underline">Learn more →</button>
                    </TooltipTrigger>
                    <TooltipContent className="guardian-tooltip max-w-xs">
                      <p>Using Groth16 SNARKs for efficient on-chain verification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="guardian-feature-card">
                <div className="guardian-info-icon">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">AI Risk Detection</h3>
                <p className="guardian-body text-muted-foreground mb-4">
                  <span className="guardian-emphasis">Google ADK agents</span> monitor transactions in real-time, 
                  detecting <span className="guardian-emphasis">suspicious patterns</span> without accessing private data.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-sm text-primary hover:underline">Learn more →</button>
                    </TooltipTrigger>
                    <TooltipContent className="guardian-tooltip max-w-xs">
                      <p>Multi-agent system with specialized detection algorithms</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="guardian-feature-card">
                <div className="guardian-info-icon">
                  <Vote className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Guardian Consensus</h3>
                <p className="guardian-body text-muted-foreground mb-4">
                  <span className="guardian-emphasis">Threshold cryptography</span> ensures no single entity can 
                  compromise privacy. <span className="guardian-emphasis">3-of-5 guardians</span> must approve disclosures.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-sm text-primary hover:underline">Learn more →</button>
                    </TooltipTrigger>
                    <TooltipContent className="guardian-tooltip max-w-xs">
                      <p>BLS signatures enable efficient threshold verification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="guardian-feature-card">
                <div className="guardian-info-icon">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Multi-Jurisdiction</h3>
                <p className="guardian-body text-muted-foreground mb-4">
                  Support for <span className="guardian-emphasis">ECB, DNB, BaFin, FINMA, and FCA</span> regulations 
                  with <span className="guardian-emphasis">automated reporting</span> for each jurisdiction.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-sm text-primary hover:underline">Learn more →</button>
                    </TooltipTrigger>
                    <TooltipContent className="guardian-tooltip max-w-xs">
                      <p>Configurable compliance rules per jurisdiction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="guardian-feature-card">
                <div className="guardian-info-icon">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Selective Disclosure</h3>
                <p className="guardian-body text-muted-foreground mb-4">
                  <span className="guardian-emphasis">Field-level privacy controls</span> ensure only necessary 
                  information is revealed, protecting <span className="guardian-emphasis">uninvolved parties</span>.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-sm text-primary hover:underline">Learn more →</button>
                    </TooltipTrigger>
                    <TooltipContent className="guardian-tooltip max-w-xs">
                      <p>Attribute-based encryption for granular access control</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="guardian-feature-card">
                <div className="guardian-info-icon">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="guardian-heading-4">Immutable Audit Trail</h3>
                <p className="guardian-body text-muted-foreground mb-4">
                  Every compliance action is <span className="guardian-emphasis">recorded on-chain</span>, providing 
                  <span className="guardian-emphasis">transparent accountability</span> for regulators.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-sm text-primary hover:underline">Learn more →</button>
                    </TooltipTrigger>
                    <TooltipContent className="guardian-tooltip max-w-xs">
                      <p>IPFS integration for large document storage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="guardian-badge mb-4">
                <Layers className="h-4 w-4 mr-2" />
                Technical Architecture
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="text-slate-900 dark:text-slate-100">Built for</span>
                <span className="bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent"> Scale & Security</span>
              </h2>
              <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
                Three-layer architecture combining <span className="guardian-emphasis">smart contracts</span>, 
                <span className="guardian-emphasis"> AI agents</span>, and 
                <span className="guardian-emphasis"> guardian networks</span> for maximum security and efficiency.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  name: "Smart Contract Layer",
                  description: "On-chain privacy pools, voting mechanisms, and immutable audit trails",
                  icon: <Code2 className="h-6 w-6 text-blue-600" />,
                  components: ["SeDeFramework", "PrivacyPool", "FraudSentinel", "EIP-7702 Delegate"]
                },
                {
                  name: "AI Agent Layer",
                  description: "Google ADK-powered agents for risk detection and compliance monitoring",
                  icon: <Bot className="h-6 w-6 text-purple-600" />,
                  components: ["Risk Assessment", "Transaction Monitor", "Pattern Detection", "Compliance Engine"]
                },
                {
                  name: "Guardian Network",
                  description: "Distributed consensus network with representatives from major jurisdictions",
                  icon: <Users className="h-6 w-6 text-emerald-600" />,
                  components: ["ECB Node", "DNB Node", "BaFin Node", "FINMA Node", "FCA Node"]
                }
              ].map((layer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="guardian-card">
                    <div className="flex flex-col lg:flex-row">
                      <div className="p-6 lg:w-1/3 bg-gradient-to-br from-primary/5 to-primary/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="guardian-info-icon">
                            {layer.icon}
                          </div>
                          <h3 className="guardian-heading-4">{layer.name}</h3>
                        </div>
                        <p className="guardian-body text-muted-foreground">{layer.description}</p>
                      </div>
                      <div className="p-6 lg:w-2/3">
                        <div className="flex flex-wrap gap-2">
                          {layer.components.map((component, i) => (
                            <span key={i} className="guardian-badge">
                              {component}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
              <div className="guardian-card bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white">
                <div className="p-8 text-center">
                  <h3 className="guardian-heading-3 mb-6">System Capabilities</h3>
                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-1">3/5</div>
                      <p className="text-sm text-slate-300">Guardian Threshold</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">ADK</div>
                      <p className="text-sm text-slate-300">Google AI Agents</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-1">ZK</div>
                      <p className="text-sm text-slate-300">Privacy Proofs</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-400 mb-1">5</div>
                      <p className="text-sm text-slate-300">Jurisdictions</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="guardian-badge mb-4">
                <FileText className="h-4 w-4 mr-2" />
                Learn More
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="text-slate-900 dark:text-slate-100">Research &</span>
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent"> Resources</span>
              </h2>
              <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
                Deep dive into the <span className="guardian-emphasis">technology and concepts</span> behind GuardianOS
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {[
                {
                  type: "Research Paper",
                  title: "Privacy Pools: Smart Contracts for Private Compliance",
                  description: "Vitalik Buterin's foundational paper on privacy-preserving blockchain compliance",
                  link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364",
                  icon: <BookOpen className="h-6 w-6" />
                },
                {
                  type: "Documentation",
                  title: "Platform Guide",
                  description: "Comprehensive guide to using GuardianOS for institutions and regulators",
                  link: "/guide",
                  icon: <FileText className="h-6 w-6" />
                },
                {
                  type: "Technical Specs",
                  title: "Smart Contract Documentation",
                  description: "Detailed documentation of our deployed smart contracts and APIs",
                  link: "/contracts.md",
                  icon: <Code2 className="h-6 w-6" />
                }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={resource.link} target={resource.link.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer">
                    <div className="guardian-card-interactive h-full">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <span className="guardian-badge">{resource.type}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <div className="guardian-info-icon">
                          {resource.icon}
                        </div>
                        
                        <div>
                          <h3 className="guardian-heading-4 mb-2">{resource.title}</h3>
                          <p className="guardian-body text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-slate-900 dark:text-slate-100">Ready to bring</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> blockchain compliance</span>
                <span className="text-slate-900 dark:text-slate-100"> to your institution?</span>
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <button className="guardian-button-primary text-lg px-8 py-4 group flex items-center">
                    <LayoutDashboard className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                    Dashboard
                  </button>
                </Link>
                <Link href="/guide">
                  <button className="guardian-button-secondary text-lg px-8 py-4 group flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12" />
                    Guide
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image src="/logo.png" alt="GuardianOS Logo" width={32} height={32} />
              <span className="guardian-heading-4">GuardianOS</span>
            </div>
            
            <p className="guardian-body text-muted-foreground text-center md:text-right">
              © 2024 GuardianOS. Building the future of <span className="guardian-emphasis">institutional blockchain compliance</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}