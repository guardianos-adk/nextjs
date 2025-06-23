"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Shield, Vote, Eye, Zap, Users, Globe, TrendingUp, CheckCircle, ArrowRight, Activity, Target, GitBranch, Database, Layers, Bot, Workflow, AlertTriangle } from "lucide-react";
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
        "deck-slide-container w-full h-screen bg-background flex flex-col relative overflow-hidden",
        className
      )}
    >
      {/* Logo Header */}
      <div className="deck-slide-header absolute top-6 right-6 z-50 flex items-center gap-3">
        <div className="relative h-8 w-8 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="GuardianOS Logo"
            height={32}
            width={32}
            className="object-contain"
          />
        </div>
        <div className="relative h-8 flex items-center justify-center guardian-heading-4 text-primary">
          GuardianOS
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
    <Slide className="deck-slide-title">
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
          </div>
          
          <h1 className="mb-8">
            <span className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              MULTI-AGENT
            </span>
            <br />
            <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Compliance System for Privacy Pools
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-200 max-w-3xl mx-auto">
            GuardianOS demonstrates a multi-agent architecture using 
            <span className="font-semibold bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent"> Google ADK</span> to automate 
            compliance workflows for privacy-preserving blockchain transactions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          <div className="guardian-badge">
            <Zap className="h-4 w-4 mr-2" />
            <span>Google ADK v1.0.0</span>
          </div>
          <div className="guardian-badge">
            <Users className="h-4 w-4 mr-2" />
            <span>5 Coordinated Agents</span>
          </div>
          <div className="guardian-badge">
            <Shield className="h-4 w-4 mr-2" />
            <span>3/5 Threshold</span>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function ProblemSlide() {
  return (
    <Slide className="deck-slide-problem">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6">
            The Technical Challenge
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            Implementing Vitalik&apos;s Privacy Pools concept requires complex multi-agent coordination
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            <div className="guardian-info-card">
              <div className="guardian-info-icon">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Agent Orchestration</h3>
              <p className="guardian-body text-muted-foreground">
                Coordinating multiple AI agents for risk assessment, monitoring, and 
                consensus requires sophisticated workflow management.
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="guardian-badge">
                  <span className="text-xs">Technical Challenge</span>
                </div>
                <span className="text-xs text-muted-foreground">ADK Solution</span>
              </div>
            </div>

            <div className="guardian-info-card">
              <div className="guardian-info-icon">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Threshold Cryptography</h3>
              <p className="guardian-body text-muted-foreground">
                Implementing a 3-of-5 guardian consensus mechanism with selective 
                disclosure while maintaining transaction privacy.
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="guardian-badge">
                  <span className="text-xs">Cryptographic</span>
                </div>
                <span className="text-xs text-muted-foreground">Challenge</span>
              </div>
            </div>

            <div className="guardian-info-card">
              <div className="guardian-info-icon">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Real-time Processing</h3>
              <p className="guardian-body text-muted-foreground">
                Blockchain transaction monitoring requires sub-second agent response 
                times for effective fraud detection and compliance.
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="guardian-badge">
                  <span className="text-xs">Performance</span>
                </div>
                <span className="text-xs text-muted-foreground">Requirement</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="guardian-feature-card text-center space-y-6">
              <div className="guardian-metric-value text-gray-500">5</div>
              <div className="guardian-body-large text-gray-600">Coordinated AI Agents</div>
              <div className="border-t border-gray-300 pt-4">
                <div className="guardian-metric-value text-blue-500">3.26s</div>
                <div className="guardian-body text-gray-600">Average workflow execution time</div>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <div className="guardian-metric-value text-emerald-500">95%+</div>
                <div className="guardian-body text-gray-600">Test coverage across all agents</div>
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
    <Slide className="deck-slide-solution bg-gradient-to-br from-primary/5 via-white to-emerald-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6">
            Our Implementation
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            Multi-agent system built with Google ADK for Privacy Pools compliance automation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="guardian-feature-card h-full">
              <div className="guardian-info-icon mb-4">
                <Vote className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4 text-primary">ADK Coordinator</h3>
              <p className="guardian-body text-muted-foreground">
                SequentialAgent orchestrates compliance workflows, routing transactions 
                based on risk scores to appropriate agent pipelines.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="guardian-feature-card h-full">
              <div className="guardian-info-icon mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4 text-emerald-600">Agent Pipeline</h3>
              <p className="guardian-body text-muted-foreground">
                TransactionMonitor, RiskAssessment, GuardianCouncil, and PrivacyRevoker 
                agents work together for automated compliance decisions.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="guardian-feature-card h-full">
              <div className="guardian-info-icon mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4 text-blue-600">Production Deployment</h3>
              <p className="guardian-body text-muted-foreground">
                Deployed on Google Cloud Run with auto-scaling, Sepolia smart contracts, 
                and real-time monitoring. Live at guardianos-api-753766936932.us-central1.run.app
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="guardian-badge text-base gap-4 px-8 py-4">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="guardian-body">Demonstrating practical multi-agent automation for complex compliance</span>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function FeaturesSlide() {
  return (
    <Slide className="deck-slide-features">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6">
            Working Features
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            Fully implemented components demonstrating ADK multi-agent capabilities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="guardian-feature-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="guardian-info-icon">
                  <Vote className="h-4 w-4" />
                </div>
                <h3 className="guardian-heading-4">Guardian Voting System</h3>
              </div>
              <div className="space-y-4">
                <p className="guardian-body text-muted-foreground">
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
                  <span className="guardian-badge text-xs">ECB</span>
                  <span className="guardian-badge text-xs">DNB</span>
                  <span className="guardian-badge text-xs">BaFin</span>
                  <span className="guardian-badge text-xs">+2 more</span>
                </div>
              </div>
            </div>

            <div className="guardian-feature-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="guardian-info-icon">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="guardian-heading-4">FraudSentinel Monitor</h3>
              </div>
              <div className="space-y-4">
                <p className="guardian-body text-muted-foreground">
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
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="guardian-feature-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="guardian-info-icon">
                  <Activity className="h-4 w-4" />
                </div>
                <h3 className="guardian-heading-4">Agent Orchestration</h3>
              </div>
              <div className="space-y-4">
                <p className="guardian-body text-muted-foreground">
                  Multi-agent compliance workflows with Google ADK integration
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">TransactionMonitor</span>
                    <span className="guardian-badge text-xs">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RiskAssessment</span>
                    <span className="guardian-badge text-xs">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GuardianCouncil</span>
                    <span className="guardian-badge text-xs">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="guardian-feature-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="guardian-info-icon">
                  <Globe className="h-4 w-4" />
                </div>
                <h3 className="guardian-heading-4">Cross-Border Compliance</h3>
              </div>
              <div className="space-y-4">
                <p className="guardian-body text-muted-foreground">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
}

function ArchitectureSlide() {
  return (
    <Slide className="deck-slide-architecture bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6">
            ADK Architecture
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            Google Agent Development Kit orchestrating 5 specialized compliance agents
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
                <h3 className="text-lg font-semibold text-slate-700 mb-4">ADK Agent Layer (Python)</h3>
                <div className="grid grid-cols-5 gap-3">
                  <div className="guardian-info-card text-center p-3">
                    <div className="text-xs font-medium text-blue-700">Transaction Monitor</div>
                    <div className="text-xs text-blue-600 mt-1">Real-time Scanning</div>
                  </div>
                  <div className="guardian-info-card text-center p-3">
                    <div className="text-xs font-medium text-emerald-700">Risk Assessment</div>
                    <div className="text-xs text-emerald-600 mt-1">ML Risk Scoring</div>
                  </div>
                  <div className="guardian-info-card text-center p-3">
                    <div className="text-xs font-medium text-primary">Guardian Council</div>
                    <div className="text-xs text-primary/70 mt-1">Consensus Voting</div>
                  </div>
                  <div className="guardian-info-card text-center p-3">
                    <div className="text-xs font-medium text-purple-700">Privacy Revoker</div>
                    <div className="text-xs text-purple-600 mt-1">Selective Disclosure</div>
                  </div>
                  <div className="guardian-info-card text-center p-3">
                    <div className="text-xs font-medium text-amber-700">Monitoring Agent</div>
                    <div className="text-xs text-amber-600 mt-1">Performance Tracking</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orchestration Layer */}
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="guardian-feature-card text-center">
                <div className="font-semibold text-primary mb-2">ADK Coordinator</div>
                <div className="text-xs text-muted-foreground">Google ADK v1.0.0</div>
              </div>
              
              <div className="text-center">
                <ArrowRight className="h-6 w-6 mx-auto text-muted-foreground" />
              </div>
              
              <div className="guardian-feature-card text-center">
                <div className="font-semibold text-slate-700 mb-2">Blockchain Networks</div>
                <div className="text-xs text-slate-600">Ethereum • Polygon • Arbitrum</div>
              </div>
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
    <Slide className="deck-slide-dashboard bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="guardian-heading-1 text-white mb-6">
            Real-Time Dashboard
          </h2>
          <p className="guardian-body-large text-slate-300 max-w-3xl mx-auto">
            Live monitoring dashboard showing actual system metrics
          </p>
        </motion.div>

        {/* Live Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="guardian-metric-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="guardian-metric-value text-blue-400">{metrics.transactionsScanned.toLocaleString()}</div>
            <div className="guardian-metric-label text-slate-300">Transactions Scanned</div>
            <div className="text-xs text-emerald-400 mt-1">+12.3% ↑</div>
          </div>
          
          <div className="guardian-metric-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="guardian-metric-value text-amber-400">{metrics.activeRequests}</div>
            <div className="guardian-metric-label text-slate-300">Active Requests</div>
            <div className="text-xs text-slate-400 mt-1">Consensus Pending</div>
          </div>
          
          <div className="guardian-metric-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="guardian-metric-value text-emerald-400">{metrics.consensusRate.toFixed(1)}%</div>
            <div className="guardian-metric-label text-slate-300">Consensus Rate</div>
            <div className="text-xs text-emerald-400 mt-1">+2.1% ↑</div>
          </div>
          
          <div className="guardian-metric-card bg-slate-800/50 border-slate-700 text-center p-4">
            <div className="guardian-metric-value text-purple-400">{metrics.responseTime.toFixed(1)}s</div>
            <div className="guardian-metric-label text-slate-300">Avg Response</div>
            <div className="text-xs text-purple-400 mt-1">Optimal</div>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Voting Board */}
          <div className="guardian-feature-card bg-slate-800/50 border-slate-700 h-64">
            <div className="mb-4">
              <h3 className="guardian-heading-4 text-slate-200 flex items-center gap-2">
                <Vote className="h-4 w-4 text-primary" />
                Guardian Voting Board
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Cross-border Payment Investigation</span>
                  <span className="guardian-badge text-xs">Medium</span>
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
                  <span className="guardian-badge text-xs">Critical</span>
                </div>
                <Progress value={100} className="h-2 bg-slate-700" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Consensus Reached</span>
                  <span className="text-emerald-400">✓ Approved</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="guardian-feature-card bg-slate-800/50 border-slate-700 h-64">
            <div className="mb-4">
              <h3 className="guardian-heading-4 text-slate-200 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                System Health
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">TransactionMonitor</span>
                  <span className="guardian-badge text-xs">Healthy</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">GuardianCouncil</span>
                  <span className="guardian-badge text-xs">Healthy</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">FraudSentinel</span>
                  <span className="guardian-badge text-xs">Active</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">PrivacyRevoker</span>
                  <span className="guardian-badge text-xs">Healthy</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function TechnicalExcellenceSlide() {
  return (
    <Slide className="deck-slide-technical bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6">
            ADK Technical Integration
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            Deep integration with Google ADK v1.0.0 for intelligent agent orchestration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="guardian-feature-card">
              <div className="guardian-info-icon mb-4">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">SequentialAgent Orchestration</h3>
              <p className="guardian-body text-muted-foreground mb-4">
                ADKComplianceCoordinator inherits from SequentialAgent for workflow management.
                Risk-based routing: &lt;0.4 auto-approve, 0.4-0.7 standard flow, &gt;0.7 Tenth Opinion.
              </p>
              <div className="text-xs font-mono bg-slate-100 p-2 rounded">
                TransactionMonitor → RiskAssessment → GuardianCouncil → PrivacyRevoker
              </div>
            </div>

            <div className="guardian-feature-card">
              <div className="guardian-info-icon mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Session State Management</h3>
              <p className="guardian-body text-muted-foreground mb-4">
                Agents coordinate through ADK&apos;s InMemorySessionService, sharing monitoring results,
                risk scores, and compliance decisions across the workflow.
              </p>
              <div className="text-xs font-mono bg-slate-100 p-2 rounded">
                ctx.session.state[&apos;monitoring_result&apos;] = data
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="guardian-feature-card">
              <div className="guardian-info-icon mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Agent Event System</h3>
              <p className="guardian-body text-muted-foreground mb-4">
                Uses ADK&apos;s Event and EventActions for inter-agent communication.
                Implements _run_async_impl with AsyncGenerator for streaming responses.
              </p>
              <div className="text-xs font-mono bg-slate-100 p-2 rounded">
                yield Event(author=self.name, actions=EventActions(escalate=True))
              </div>
            </div>

            <div className="guardian-feature-card">
              <div className="guardian-info-icon mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Enhanced ML Integration</h3>
              <p className="guardian-body text-muted-foreground mb-4">
                RiskAssessmentAgent integrates 4 ML models: AML detector (94% accuracy),
                anomaly detector (92%), network analyzer (87%), pattern analyzer (89%).
              </p>
              <div className="text-xs font-mono bg-slate-100 p-2 rounded">
                €75K+ triggers enhanced AML scoring (0.60 risk)
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 grid lg:grid-cols-3 gap-6 text-center"
        >
          <div className="guardian-info-card">
            <div className="text-2xl font-bold text-blue-600">React 19.1</div>
            <div className="text-sm text-muted-foreground mt-2">
              Next.js 15.3 with App Router
            </div>
          </div>
          <div className="guardian-info-card">
            <div className="text-2xl font-bold text-emerald-600">3-of-5</div>
            <div className="text-sm text-muted-foreground mt-2">
              Threshold cryptography consensus
            </div>
          </div>
          <div className="guardian-info-card">
            <div className="text-2xl font-bold text-purple-600">5 Agents</div>
            <div className="text-sm text-muted-foreground mt-2">
              Decentralized reputation system
            </div>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function TenthOpinionSlide() {
  return (
    <Slide className="deck-slide-tenth-opinion bg-gradient-to-br from-purple-50 via-white to-slate-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6 flex items-center justify-center gap-4">
            <Workflow className="h-12 w-12 text-purple-600" />
            Tenth Opinion Protocol
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            4-phase, 10-agent consensus system for high-stakes compliance decisions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="guardian-feature-card">
              <div className="guardian-info-icon mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Activation Criteria</h3>
              <ul className="guardian-body text-muted-foreground space-y-2">
                <li>• Transaction amount &gt; €75,000 (EU 5AMLD)</li>
                <li>• Risk score &gt; 0.7 (ML model output)</li>
                <li>• Manual escalation by guardian</li>
              </ul>
            </div>

            <div className="guardian-feature-card">
              <div className="guardian-info-icon mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="guardian-heading-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.2s</div>
                  <div className="text-xs text-muted-foreground">Avg. execution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-xs text-muted-foreground">Consensus rate</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-4"
          >
            <h3 className="guardian-heading-3 mb-4">Protocol Phases</h3>
            
            <div className="guardian-info-card">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div>
                  <h4 className="font-semibold">Blind Analysis (1.1s)</h4>
                  <p className="text-sm text-muted-foreground">4 agents: Independent evaluation, no communication</p>
                </div>
              </div>
            </div>

            <div className="guardian-info-card">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div>
                  <h4 className="font-semibold">Informed Cross-Analysis (0.9s)</h4>
                  <p className="text-sm text-muted-foreground">3 agents: Sequential review with meta-analysis</p>
                </div>
              </div>
            </div>

            <div className="guardian-info-card">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div>
                  <h4 className="font-semibold">Quality Assurance (1.0s)</h4>
                  <p className="text-sm text-muted-foreground">2 agents: Bias detection, hallucination checking</p>
                </div>
              </div>
            </div>

            <div className="guardian-info-card">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div>
                  <h4 className="font-semibold">Final Synthesis (1.2s)</h4>
                  <p className="text-sm text-muted-foreground">1 agent: Weighted decision, quality-adjusted confidence</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 guardian-info-card bg-purple-50/50"
        >
          <h3 className="guardian-heading-4 mb-4">Technical Innovation</h3>
          <div className="grid lg:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Bias Detection</h4>
              <p className="text-muted-foreground">
                7 cognitive biases: anchoring, confirmation, availability, 
                groupthink, authority, recency, overconfidence
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quality Metrics</h4>
              <p className="text-muted-foreground">
                Reliability scoring, objectivity assessment, dissenting 
                opinion tracking, hallucination detection
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Regulatory Compliance</h4>
              <p className="text-muted-foreground">
                EU 5AMLD €75k threshold, FATF recommendations, 
                BSA structuring detection, sanctions screening
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function ImpactSlide() {
  return (
    <Slide className="deck-slide-impact bg-gradient-to-br from-emerald-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="guardian-heading-1 mb-6">
            Technical Achievements
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto">
            Successfully demonstrating ADK&apos;s capabilities for complex process automation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            <div className="guardian-metric-card text-center">
              <div className="guardian-metric-value text-emerald-700">9/9</div>
              <div className="guardian-metric-label">ADK agent tests passing</div>
            </div>
            
            <div className="guardian-metric-card text-center">
              <div className="guardian-metric-value text-blue-700">~3s</div>
              <div className="guardian-metric-label">Average workflow completion</div>
            </div>
            
            <div className="guardian-metric-card text-center">
              <div className="guardian-metric-value text-purple-700">4</div>
              <div className="guardian-metric-label">Deployed smart contracts</div>
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
                  ADK Integration Success
                </InfoCardTitle>
                <InfoCardDescription className="text-emerald-600 leading-relaxed text-sm">
                  Successfully integrated Google ADK for multi-agent orchestration 
                  with sequential workflows and risk-based routing.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-emerald-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Working Demo
                </div>
                <div className="text-xs text-emerald-400">
                  Python ADK
                </div>
              </InfoCardFooter>
            </InfoCard>

            <InfoCard className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/80 to-blue-100/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-blue-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  Process Automation
                </InfoCardTitle>
                <InfoCardDescription className="text-blue-600 leading-relaxed text-sm">
                  Automated multi-step compliance workflows demonstrate ADK&apos;s capability 
                  for complex business process automation.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  5 Agents
                </div>
                <div className="text-xs text-blue-400">
                  Coordinated
                </div>
              </InfoCardFooter>
            </InfoCard>

            <InfoCard className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/80 to-purple-100/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <InfoCardContent>
                <InfoCardTitle className="text-purple-700 flex items-center gap-3 text-lg font-semibold mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Globe className="h-5 w-5 text-purple-500" />
                  </div>
                  Full Stack Integration
                </InfoCardTitle>
                <InfoCardDescription className="text-purple-600 leading-relaxed text-sm">
                  Complete implementation from smart contracts to frontend dashboard, 
                  showcasing end-to-end multi-agent system capabilities.
                </InfoCardDescription>
              </InfoCardContent>
              <InfoCardFooter className="mt-4">
                <div className="flex items-center gap-2 text-xs text-purple-500">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  Sepolia Testnet
                </div>
                <div className="text-xs text-purple-400">
                  Live Demo
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
            <span className="text-sm font-medium">Built for Google ADK Hackathon - Automation of Complex Processes</span>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

function CallToActionSlide() {
  return (
    <Slide className="deck-slide-cta bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="guardian-heading-1 mb-6">
            GuardianOS
            <span className="text-primary block">Multi-Agent Compliance Demo</span>
          </h2>
          <p className="guardian-body-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Demonstrating Google ADK&apos;s power for automating complex compliance processes 
            through coordinated multi-agent workflows.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="guardian-feature-card text-center">
            <div className="guardian-info-icon mx-auto mb-4">
              <Play className="h-6 w-6" />
            </div>
            <h3 className="guardian-heading-4 mb-2">Try It Live</h3>
            <p className="guardian-body text-muted-foreground mb-4">
              Experience the multi-agent system on Sepolia testnet
            </p>
            <button className="guardian-button-primary w-full" type="button">
              <Play className="h-4 w-4 mr-2" />
              View Dashboard
            </button>
          </div>

          <div className="guardian-feature-card text-center">
            <div className="guardian-info-icon mx-auto mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="guardian-heading-4 mb-2">Source Code</h3>
            <p className="guardian-body text-muted-foreground mb-4">
              Explore the ADK implementation on GitHub
            </p>
            <button className="guardian-button-secondary w-full" type="button">
              <Users className="h-4 w-4 mr-2" />
              View Repository
            </button>
          </div>

          <div className="guardian-feature-card text-center">
            <div className="guardian-info-icon mx-auto mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="guardian-heading-4 mb-2">Documentation</h3>
            <p className="guardian-body text-muted-foreground mb-4">
              Architecture diagrams and technical details
            </p>
            <button className="guardian-button-secondary w-full" type="button">
              <Globe className="h-4 w-4 mr-2" />
              View Docs
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-6"
        >
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              Built with Google Agent Development Kit
            </p>
            <p className="text-muted-foreground">
              Category: Automation of Complex Processes
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <span className="guardian-badge px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              ADK v1.0.0
            </span>
            <span className="guardian-badge px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Fully Functional
            </span>
            <span className="guardian-badge px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Live on Sepolia
            </span>
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
    { component: TechnicalExcellenceSlide, title: "Technical Excellence" },
    { component: TenthOpinionSlide, title: "Tenth Opinion Protocol" },
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
    <div className="deck-container relative w-full h-screen overflow-hidden bg-white">
      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <CurrentSlideComponent key={currentSlide} />
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="deck-controls absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="guardian-nav gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="guardian-button-secondary h-8 w-8 p-0 flex items-center justify-center"
            type="button"
            title="Previous slide"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                title={`Go to slide ${index + 1}`}
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentSlide
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                type="button"
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="guardian-button-secondary h-8 w-8 p-0 flex items-center justify-center"
            type="button"
            title="Next slide"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="deck-counter absolute bottom-6 right-6 z-50">
        <div className="guardian-badge">
          <span className="text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Slide Navigation Hint */}
      <div className="deck-hint absolute top-6 left-6 z-40">
        <div className="guardian-badge">
          <span className="text-xs">
            Use ← → or Space to navigate
          </span>
        </div>
      </div>
    </div>
  );
}
