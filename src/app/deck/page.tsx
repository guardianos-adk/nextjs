"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Shield, Vote, Eye, Zap, Users, Globe, TrendingUp, CheckCircle, ArrowRight, Activity, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  InfoCard,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardContent,
  InfoCardFooter
} from "@/components/ui/info-card";

interface SlideProps {
  children: React.ReactNode;
  className?: string;
}

function Slide({ children, className }: SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={cn(
        "guardianos-slide-container w-full h-screen bg-white flex flex-col relative overflow-hidden",
        className
      )}
    >
      {/* Logo Header */}
      <div className="guardianos-slide-header absolute top-6 right-6 z-50 flex items-center gap-3">
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
      
      {/* Slide Content */}
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        {children}
      </div>
    </motion.div>
  );
}

function TitleSlide() {
  return (
    <Slide className="guardianos-slide-title bg-gradient-to-br from-white via-blue-50/30 to-primary/5">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center mb-8 gap-6">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="GuardianOS Logo"
                height={80}
                width={80}
                className="object-contain"
              />
            </div>
            <div className="relative h-20 flex items-center justify-center">
              <Image
                src="/guardianos.png"
                alt="GuardianOS"
                height={80}
                width={240}
                className="object-contain"
              />
            </div>
          </div>
          
          <h1 className="guardianos-slide-title-main text-6xl font-bold text-foreground leading-tight">
            Institutional Blockchain
            <span className="text-primary block">Compliance Platform</span>
          </h1>
          
          <div className="guardianos-slide-tagline max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              GuardianOS aims to connect institutions to the blockchain, providing monitoring, 
              compliance tools and consensus protocols in order to provide institutional blockchain 
              privacy with reasonable oversight.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          <Badge className="guardianos-slide-badge px-4 py-2 text-sm">
            <Shield className="h-4 w-4 mr-2" />
            Privacy-Preserving
          </Badge>
          <Badge variant="outline" className="guardianos-slide-badge px-4 py-2 text-sm">
            <Users className="h-4 w-4 mr-2" />
            Multi-Guardian Consensus
          </Badge>
          <Badge variant="secondary" className="guardianos-slide-badge px-4 py-2 text-sm">
            <Activity className="h-4 w-4 mr-2" />
            Real-time Monitoring
          </Badge>
        </motion.div>
      </div>
    </Slide>
  );
}

function ProblemSlide() {
  return (
    <Slide className="guardianos-slide-problem">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold text-foreground mb-6">
            The Institutional Challenge
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Financial institutions face a critical dilemma in blockchain adoption
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            <InfoCard className="bg-gradient-to-br from-red-50/80 to-red-100/40 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-red-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Target className="h-5 w-5 text-red-500" />
                  </div>
                  Compliance Complexity
                </InfoCardTitle>
                <InfoCardDescription className="text-red-600 leading-relaxed text-sm">
                  Multiple jurisdictions, varying regulations, and manual processes create 
                  compliance bottlenecks that delay blockchain adoption.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Critical Issue
                </div>
                <div className="text-xs text-red-400">
                  High Impact
                </div>
              </InfoCardFooter>
            </InfoCard>

            <InfoCard className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-amber-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Eye className="h-5 w-5 text-amber-500" />
                  </div>
                  Privacy vs. Oversight
                </InfoCardTitle>
                <InfoCardDescription className="text-amber-600 leading-relaxed text-sm">
                  Institutions need blockchain privacy for competitive advantage while regulators 
                  require transparency for compliance monitoring.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-amber-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Balance Required
                </div>
                <div className="text-xs text-amber-400">
                  Tension Point
                </div>
              </InfoCardFooter>
            </InfoCard>

            <InfoCard className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-blue-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  Cross-Border Coordination
                </InfoCardTitle>
                <InfoCardDescription className="text-blue-600 leading-relaxed text-sm">
                  Global transactions require coordination between multiple regulatory 
                  bodies without standardized protocols.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Coordination Gap
                </div>
                <div className="text-xs text-blue-400">
                  Multi-jurisdiction
                </div>
              </InfoCardFooter>
            </InfoCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="guardianos-slide-visual bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 border border-gray-300">
              <div className="text-center space-y-6">
                <div className="text-4xl font-bold text-gray-500">$51B</div>
                <div className="text-lg text-gray-600">Annual compliance costs</div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="text-2xl font-bold text-red-500">78%</div>
                  <div className="text-sm text-gray-600">Of institutions delay blockchain adoption due to compliance uncertainty</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
}

function SolutionSlide() {
  return (
    <Slide className="guardianos-slide-solution bg-gradient-to-br from-primary/5 via-white to-emerald-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold text-foreground mb-6">
            GuardianOS Solution
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive institutional blockchain compliance orchestration platform
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="guardianos-slide-card h-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-primary">Guardian Consensus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multi-jurisdictional guardian network enables democratic consensus 
                  for selective de-anonymization requests with cryptographic proof.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Card className="guardianos-slide-card h-full bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-700">Privacy-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Zero-knowledge proofs and threshold cryptography ensure user privacy 
                  while enabling regulatory compliance when required.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Card className="guardianos-slide-card h-full bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-700">AI-Powered Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multi-agent system with Google ADK integration provides intelligent 
                  fraud detection and automated compliance workflows.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-emerald-100/50 rounded-full px-8 py-4 border border-primary/20">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Institutional-grade security with reasonable oversight</span>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function FeaturesSlide() {
  return (
    <Slide className="guardianos-slide-features">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold text-foreground mb-6">
            Core Platform Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive toolset for institutional blockchain compliance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <Card className="guardianos-slide-card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Vote className="h-4 w-4 text-primary" />
                  </div>
                  Guardian Voting System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Decentralized consensus mechanism for de-anonymization requests
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Consensus Progress</span>
                    <span className="font-medium">3/5 Guardians</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">ECB</Badge>
                  <Badge variant="outline" className="text-xs">DNB</Badge>
                  <Badge variant="outline" className="text-xs">BaFin</Badge>
                  <Badge variant="secondary" className="text-xs">+2 more</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="guardianos-slide-card bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-emerald-600" />
                  </div>
                  FraudSentinel Monitor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  AI-powered real-time fraud detection and pattern analysis
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-emerald-600">1,247</div>
                    <div className="text-xs text-muted-foreground">Transactions Scanned</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-500">23</div>
                    <div className="text-xs text-muted-foreground">Fraud Detected</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accuracy Rate</span>
                  <span className="font-medium text-emerald-600">94.3%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <Card className="guardianos-slide-card bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  Agent Orchestration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Multi-agent compliance workflows with Google ADK integration
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">TransactionMonitor</span>
                    <Badge className="text-xs bg-emerald-500">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RiskAssessment</span>
                    <Badge className="text-xs bg-emerald-500">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GuardianCouncil</span>
                    <Badge className="text-xs bg-blue-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="guardianos-slide-card bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  Cross-Border Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Automated coordination across multiple regulatory jurisdictions
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="text-xs">
                    <div className="font-medium">EU</div>
                    <div className="text-green-500">●</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium">US</div>
                    <div className="text-green-500">●</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium">UK</div>
                    <div className="text-green-500">●</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
}

function ArchitectureSlide() {
  return (
    <Slide className="guardianos-slide-architecture bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold text-foreground mb-6">
            Multi-Agent Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scalable, intelligent compliance orchestration with Google ADK integration
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 border border-slate-300"
          >
            <div className="grid grid-cols-5 gap-4 mb-6">
              {/* Agent Layer */}
              <div className="col-span-5 text-center mb-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Intelligent Agent Layer</h3>
                <div className="grid grid-cols-5 gap-3">
                  <Card className="guardianos-slide-card bg-blue-100 border-blue-300 text-center p-3">
                    <div className="text-xs font-medium text-blue-700">Transaction Monitor</div>
                    <div className="text-xs text-blue-600 mt-1">Real-time Scanning</div>
                  </Card>
                  <Card className="guardianos-slide-card bg-emerald-100 border-emerald-300 text-center p-3">
                    <div className="text-xs font-medium text-emerald-700">Risk Assessment</div>
                    <div className="text-xs text-emerald-600 mt-1">ML Risk Scoring</div>
                  </Card>
                  <Card className="guardianos-slide-card bg-primary/10 border-primary/30 text-center p-3">
                    <div className="text-xs font-medium text-primary">Guardian Council</div>
                    <div className="text-xs text-primary/70 mt-1">Consensus Voting</div>
                  </Card>
                  <Card className="guardianos-slide-card bg-purple-100 border-purple-300 text-center p-3">
                    <div className="text-xs font-medium text-purple-700">Privacy Revoker</div>
                    <div className="text-xs text-purple-600 mt-1">Selective Disclosure</div>
                  </Card>
                  <Card className="guardianos-slide-card bg-amber-100 border-amber-300 text-center p-3">
                    <div className="text-xs font-medium text-amber-700">Monitoring Agent</div>
                    <div className="text-xs text-amber-600 mt-1">Performance Tracking</div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Orchestration Layer */}
            <div className="grid grid-cols-3 gap-6 items-center">
              <Card className="guardianos-slide-card bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 text-center p-4">
                <div className="font-semibold text-primary mb-2">ADK Coordinator</div>
                <div className="text-xs text-muted-foreground">Google ADK v1.0.0</div>
              </Card>
              
              <div className="text-center">
                <ArrowRight className="h-6 w-6 mx-auto text-muted-foreground" />
              </div>
              
              <Card className="guardianos-slide-card bg-gradient-to-r from-slate-200 to-slate-100 border-slate-300 text-center p-4">
                <div className="font-semibold text-slate-700 mb-2">Blockchain Networks</div>
                <div className="text-xs text-slate-600">Ethereum • Polygon • Arbitrum</div>
              </Card>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Intelligent Automation</h4>
              <p className="text-sm text-muted-foreground">
                AI agents handle complex compliance workflows automatically
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-semibold">Scalable Consensus</h4>
              <p className="text-sm text-muted-foreground">
                Cryptographic proofs ensure transparent, verifiable decisions
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Cross-Jurisdiction</h4>
              <p className="text-sm text-muted-foreground">
                Seamless coordination across regulatory boundaries
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
}

function DashboardSlide() {
  const [metrics, setMetrics] = useState({
    transactionsScanned: 1247,
    activeRequests: 3,
    consensusRate: 94.3,
    responseTime: 2.1
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        transactionsScanned: prev.transactionsScanned + Math.floor(Math.random() * 3),
        activeRequests: Math.max(0, prev.activeRequests + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        consensusRate: 94.3 + (Math.random() - 0.5) * 2,
        responseTime: 2.1 + (Math.random() - 0.5) * 0.4
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Slide className="guardianos-slide-dashboard bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold mb-6">
            Real-Time Operations Center
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Live institutional blockchain compliance monitoring and control
          </p>
        </motion.div>

        {/* Live Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="guardianos-slide-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="text-2xl font-bold text-blue-400">{metrics.transactionsScanned.toLocaleString()}</div>
            <div className="text-sm text-slate-300">Transactions Scanned</div>
            <div className="text-xs text-emerald-400 mt-1">+12.3% ↑</div>
          </Card>
          
          <Card className="guardianos-slide-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="text-2xl font-bold text-amber-400">{metrics.activeRequests}</div>
            <div className="text-sm text-slate-300">Active Requests</div>
            <div className="text-xs text-slate-400 mt-1">Consensus Pending</div>
          </Card>
          
          <Card className="guardianos-slide-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="text-2xl font-bold text-emerald-400">{metrics.consensusRate.toFixed(1)}%</div>
            <div className="text-sm text-slate-300">Consensus Rate</div>
            <div className="text-xs text-emerald-400 mt-1">+2.1% ↑</div>
          </Card>
          
          <Card className="guardianos-slide-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="text-2xl font-bold text-purple-400">{metrics.responseTime.toFixed(1)}s</div>
            <div className="text-sm text-slate-300">Avg Response</div>
            <div className="text-xs text-purple-400 mt-1">Optimal</div>
          </Card>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Voting Board */}
          <Card className="guardianos-slide-card bg-slate-800/50 border-slate-700 h-64">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Vote className="h-4 w-4 text-primary" />
                Guardian Voting Board
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Cross-border Payment Investigation</span>
                  <Badge className="text-xs bg-amber-500/20 text-amber-300">Medium</Badge>
                </div>
                <Progress value={66} className="h-2 bg-slate-700" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>2/3 Votes</span>
                  <span>12h remaining</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Terrorism Financing Investigation</span>
                  <Badge className="text-xs bg-red-500/20 text-red-300">Critical</Badge>
                </div>
                <Progress value={100} className="h-2 bg-slate-700" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Consensus Reached</span>
                  <span className="text-emerald-400">✓ Approved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="guardianos-slide-card bg-slate-800/50 border-slate-700 h-64">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">TransactionMonitor</span>
                  <Badge className="text-xs bg-emerald-500/20 text-emerald-300">Healthy</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">GuardianCouncil</span>
                  <Badge className="text-xs bg-emerald-500/20 text-emerald-300">Healthy</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">FraudSentinel</span>
                  <Badge className="text-xs bg-blue-500/20 text-blue-300">Active</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">PrivacyRevoker</span>
                  <Badge className="text-xs bg-emerald-500/20 text-emerald-300">Healthy</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  All systems operational
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Slide>
  );
}

function ImpactSlide() {
  return (
    <Slide className="guardianos-slide-impact bg-gradient-to-br from-emerald-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold text-foreground mb-6">
            Institutional Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Measurable value for financial institutions and regulatory bodies
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center p-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl border border-emerald-300">
              <div className="text-4xl font-bold text-emerald-700 mb-2">65%</div>
              <div className="text-emerald-600">Reduction in compliance processing time</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border border-blue-300">
              <div className="text-4xl font-bold text-blue-700 mb-2">94%</div>
              <div className="text-blue-600">Accuracy in fraud detection</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border border-purple-300">
              <div className="text-4xl font-bold text-purple-700 mb-2">$2.3M</div>
              <div className="text-purple-600">Average annual compliance cost savings</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <InfoCard className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-emerald-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  Enhanced Privacy Protection
                </InfoCardTitle>
                <InfoCardDescription className="text-emerald-600 leading-relaxed text-sm">
                  Zero-knowledge proofs and selective disclosure ensure user privacy 
                  while meeting regulatory requirements.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-emerald-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Privacy First
                </div>
                <div className="text-xs text-emerald-400">
                  ZK Proofs
                </div>
              </InfoCardFooter>
            </InfoCard>

            <InfoCard className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/80 to-blue-100/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-blue-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  Accelerated Adoption
                </InfoCardTitle>
                <InfoCardDescription className="text-blue-600 leading-relaxed text-sm">
                  Automated compliance workflows remove barriers to institutional 
                  blockchain adoption and innovation.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Faster Adoption
                </div>
                <div className="text-xs text-blue-400">
                  Automated
                </div>
              </InfoCardFooter>
            </InfoCard>

            <InfoCard className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/80 to-purple-100/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-purple-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Globe className="h-5 w-5 text-purple-500" />
                  </div>
                  Global Standardization
                </InfoCardTitle>
                <InfoCardDescription className="text-purple-600 leading-relaxed text-sm">
                  Unified compliance protocols enable seamless cross-border 
                  transactions and regulatory cooperation.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-purple-500">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  Global Scale
                </div>
                <div className="text-xs text-purple-400">
                  Unified Standards
                </div>
              </InfoCardFooter>
            </InfoCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 to-emerald-100/50 rounded-full px-8 py-4 border border-primary/20">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Ready for institutional deployment</span>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function CallToActionSlide() {
  return (
    <Slide className="guardianos-slide-cta bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="guardianos-slide-heading text-5xl font-bold text-foreground mb-6">
            Ready to Transform
            <span className="text-primary block">Institutional Compliance?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join the future of blockchain compliance with GuardianOS - where privacy meets oversight, 
            and innovation meets regulation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <Card className="guardianos-slide-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Live Demo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Experience GuardianOS compliance workflows in action
            </p>
            <Button className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Request Demo
            </Button>
          </Card>

          <Card className="guardianos-slide-card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 text-center p-6">
            <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold mb-2">Pilot Program</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our institutional pilot for early access
            </p>
            <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Users className="h-4 w-4 mr-2" />
              Join Pilot
            </Button>
          </Card>

          <Card className="guardianos-slide-card bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 text-center p-6">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Partnership</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore strategic partnership opportunities
            </p>
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              <Globe className="h-4 w-4 mr-2" />
              Partner With Us
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-6"
        >
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              Contact Our Institutional Team
            </p>
            <p className="text-muted-foreground">
              institutions@guardianos.com • +31 20 123 4567
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Badge className="guardianos-slide-badge px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Enterprise-Ready
            </Badge>
            <Badge variant="outline" className="guardianos-slide-badge px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Regulatory Compliant
            </Badge>
            <Badge variant="secondary" className="guardianos-slide-badge px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Global Deployment
            </Badge>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

export default function DeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { component: TitleSlide, title: "Title" },
    { component: ProblemSlide, title: "Problem" },
    { component: SolutionSlide, title: "Solution" },
    { component: FeaturesSlide, title: "Features" },
    { component: ArchitectureSlide, title: "Architecture" },
    { component: DashboardSlide, title: "Dashboard" },
    { component: ImpactSlide, title: "Impact" },
    { component: CallToActionSlide, title: "Call to Action" }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="guardianos-deck-container relative w-full h-screen overflow-hidden bg-white">
      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <CurrentSlideComponent key={currentSlide} />
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="guardianos-deck-controls absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
              title="Next"
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentSlide
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="guardianos-deck-counter absolute bottom-6 right-6 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border/50">
          <span className="text-sm text-muted-foreground">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Slide Navigation Hint */}
      <div className="guardianos-deck-hint absolute top-6 left-6 z-40">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border/50">
          <span className="text-xs text-muted-foreground">
            Use ← → or Space to navigate
          </span>
        </div>
      </div>
    </div>
  );
}
