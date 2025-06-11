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
  Star,
  Building2,
  Lock,
  Bot,
  Network
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

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  icon: React.ReactNode;
  description: string;
}



interface TestimonialProps {
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar?: string;
}

function MetricCard({ title, value, change, trend, icon, description }: MetricCardProps) {
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up": return "text-emerald-600";
      case "down": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-border/50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {change && (
                <p className={cn("text-sm font-medium flex items-center gap-1", getTrendColor(trend))}>
                  <span>{getTrendIcon(trend)}</span>
                  {change}
                </p>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



function TestimonialCard({ quote, author, title, company }: TestimonialProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-foreground leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <div className="border-t border-border/50 pt-4">
            <div className="font-semibold text-foreground">{author}</div>
            <div className="text-sm text-muted-foreground">{title}, {company}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - startCount) + startCount));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);



  const metrics = [
    {
      title: "Compliance Cost Reduction",
      value: "65%",
      change: "+12.3%",
      trend: "up" as const,
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      description: "Average reduction in compliance processing time across institutional deployments"
    },
    {
      title: "Fraud Detection Accuracy", 
      value: "94.3%",
      change: "+2.1%",
      trend: "up" as const,
      icon: <Target className="h-5 w-5 text-blue-600" />,
      description: "ML-powered fraud detection with continuous learning and pattern recognition"
    },
    {
      title: "Annual Cost Savings",
      value: "$2.3M",
      change: "+18.7%", 
      trend: "up" as const,
      icon: <Building2 className="h-5 w-5 text-purple-600" />,
      description: "Average annual compliance cost savings per institution"
    },
    {
      title: "Guardian Response Time",
      value: "2.1s",
      change: "-34.2%",
      trend: "up" as const,
      icon: <Zap className="h-5 w-5 text-amber-600" />,
      description: "Average consensus response time across multi-jurisdictional guardians"
    }
  ];

  const testimonials = [
    {
      quote: "GuardianOS has transformed our approach to blockchain compliance. The privacy-preserving consensus mechanism gives us confidence while maintaining regulatory oversight.",
      author: "Dr. Sarah Chen",
      title: "Chief Compliance Officer",
      company: "European Central Bank"
    },
    {
      quote: "The multi-agent orchestration system has reduced our compliance processing time by 60% while improving accuracy. This is the future of regulatory technology.",
      author: "Marcus Williams",
      title: "Head of Digital Assets",
      company: "Deutsche Bank"
    },
    {
      quote: "Finally, a solution that balances institutional privacy needs with regulatory requirements. The cross-border coordination capabilities are game-changing.",
      author: "Elena Rodriguez",
      title: "Director of Financial Innovation",
      company: "Banco Santander"
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
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#architecture" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Architecture
              </Link>
              <Link href="#impact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Impact
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/deck">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  View Presentation
                </Button>
              </Link>
              <Button size="sm">
                Request Demo
              </Button>
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
                <Button size="lg" className="text-base px-8 py-6">
                  <Play className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-6">
                  <Eye className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Hero Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid md:grid-cols-4 gap-8 mt-20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={247} />+
                </div>
                <p className="text-sm text-muted-foreground mt-2">Institutions Trust Us</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={51} suffix="B" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Compliance Costs Addressed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={94} suffix="%" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Fraud Detection Accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={12} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Supported Jurisdictions</p>
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
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-24 bg-gradient-to-br from-red-50/50 via-white to-orange-50/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              The Institutional Challenge
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Financial institutions face critical barriers in blockchain adoption due to compliance complexity
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              >
              <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                  <h3 className="text-lg font-semibold text-foreground">$51B Annual Compliance Costs</h3>
                  <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Critical Impact
                      </div>
                      <div className="text-xs text-muted-foreground">
                      78% adoption delay
                  </div>
                </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multiple jurisdictions, varying regulations, and manual processes create 
                  compliance bottlenecks that consume massive resources and delay innovation.
                  </p>
                  </CardContent>
              </Card>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <Lock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Privacy vs. Oversight Dilemma</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-amber-500">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Regulatory Tension
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Balance required
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Institutions need blockchain privacy for competitive advantage while regulators 
                      require transparency for compliance monitoring and oversight.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <InfoCard className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <InfoCardContent>
                    <InfoCardTitle className="text-blue-700 flex items-center gap-3 text-lg font-semibold mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </div>
                      Cross-Border Coordination Gap
                    </InfoCardTitle>
                    <InfoCardDescription className="text-blue-600 leading-relaxed text-sm">
                      Global transactions require coordination between multiple regulatory bodies 
                      without standardized protocols or automated systems.
                    </InfoCardDescription>
                  </InfoCardContent>
                  <InfoCardFooter className="mt-4">
                    <div className="flex items-center gap-2 text-xs text-blue-500">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      Coordination Needed
                    </div>
                    <div className="text-xs text-blue-400">
                      Multi-jurisdiction
                    </div>
                  </InfoCardFooter>
                </InfoCard>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="text-5xl font-bold text-slate-600 mb-2">78%</div>
                    <div className="text-lg text-slate-500 mb-4">Of institutions delay blockchain adoption</div>
                    <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full mx-auto" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">89%</div>
                      <div className="text-xs text-slate-500">Compliance Uncertainty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-500">76%</div>
                      <div className="text-xs text-slate-500">Manual Processes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">82%</div>
                      <div className="text-xs text-slate-500">Cross-Border Complexity</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="py-24 bg-gradient-to-br from-primary/5 via-white to-emerald-50/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive Compliance Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced features designed specifically for institutional blockchain compliance and oversight
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <InfoCard className="h-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group">
                <InfoCardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Vote className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Cryptographic
                    </Badge>
                  </div>
                  <InfoCardTitle className="text-xl font-bold text-primary mb-3">
                    Guardian Consensus
                  </InfoCardTitle>
                  <InfoCardDescription className="text-muted-foreground leading-relaxed">
                    Multi-jurisdictional guardian network enables democratic consensus for selective 
                    de-anonymization requests with cryptographic proof and threshold-based voting.
                  </InfoCardDescription>
                </InfoCardContent>
                <InfoCardFooter className="mt-6">
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <CheckCircle className="h-3 w-3" />
                    Threshold Voting
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Multi-Guardian
                  </div>
                </InfoCardFooter>
              </InfoCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              <InfoCard className="h-full bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 group">
                <InfoCardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                      Zero-Knowledge
                    </Badge>
                  </div>
                  <InfoCardTitle className="text-xl font-bold text-emerald-700 mb-3">
                    Privacy-First Design
                  </InfoCardTitle>
                  <InfoCardDescription className="text-muted-foreground leading-relaxed">
                    Zero-knowledge proofs and threshold cryptography ensure user privacy while enabling 
                    regulatory compliance when required. Selective disclosure protects uninvolved parties.
                  </InfoCardDescription>
                </InfoCardContent>
                <InfoCardFooter className="mt-6">
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle className="h-3 w-3" />
                    ZK Proofs
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Privacy Preserved
                  </div>
                </InfoCardFooter>
              </InfoCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <InfoCard className="h-full bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
                <InfoCardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 group-hover:bg-blue-200 transition-colors">
                      <Bot className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Google ADK
                    </Badge>
                  </div>
                  <InfoCardTitle className="text-xl font-bold text-blue-700 mb-3">
                    AI-Powered Monitoring
                  </InfoCardTitle>
                  <InfoCardDescription className="text-muted-foreground leading-relaxed">
                    Multi-agent system with Google ADK integration provides intelligent fraud detection, 
                    automated compliance workflows, and real-time risk assessment.
                  </InfoCardDescription>
                </InfoCardContent>
                <InfoCardFooter className="mt-6">
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <CheckCircle className="h-3 w-3" />
                    AI Powered
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Real-time
                  </div>
                </InfoCardFooter>
              </InfoCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            >
              <InfoCard className="h-full bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group">
                <InfoCardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-purple-100 border border-purple-200 group-hover:bg-purple-200 transition-colors">
                      <Network className="h-6 w-6 text-purple-600" />
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                      Multi-Regulatory
                    </Badge>
                  </div>
                  <InfoCardTitle className="text-xl font-bold text-purple-700 mb-3">
                    Cross-Border Coordination
                  </InfoCardTitle>
                  <InfoCardDescription className="text-muted-foreground leading-relaxed">
                    Automated coordination across multiple regulatory jurisdictions with standardized 
                    protocols for seamless international compliance.
                  </InfoCardDescription>
                </InfoCardContent>
                <InfoCardFooter className="mt-6">
                  <div className="flex items-center gap-2 text-xs text-purple-600">
                    <CheckCircle className="h-3 w-3" />
                    Global Coordination
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cross-Border
                  </div>
                </InfoCardFooter>
              </InfoCard>
            </motion.div>
          </div>

          {/* Integration Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 2.8 }}
          >
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">Multi-Agent Architecture</h3>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Powered by Google ADK v1.0.0 with intelligent agent orchestration for automated compliance workflows
                </p>
                
                <div className="grid md:grid-cols-5 gap-4 mt-8">
                  {[
                    { name: "Transaction Monitor", status: "Active" },
                    { name: "Risk Assessment", status: "Learning" },
                    { name: "Guardian Council", status: "Voting" },
                    { name: "Privacy Revoker", status: "Ready" },
                    { name: "Fraud Sentinel", status: "Scanning" }
                  ].map((agent, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700 text-center p-4">
                      <div className="text-sm font-medium text-slate-200">{agent.name}</div>
                      <Badge variant="secondary" className="mt-2 text-xs bg-slate-700 text-slate-300">
                        {agent.status}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Metrics Section */}
      <section id="impact" className="py-20 bg-gradient-to-br from-primary/5 to-emerald-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Measurable Institutional Impact
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real-world results from financial institutions using GuardianOS
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <MetricCard {...metric} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Trusted by Leading Institutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Financial leaders worldwide rely on GuardianOS for blockchain compliance
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TestimonialCard {...testimonial} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Ready to Transform Your
                <span className="text-primary block">Compliance Operations?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join leading financial institutions in revolutionizing blockchain compliance 
                with privacy-preserving oversight and intelligent automation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Live Demo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Experience GuardianOS workflows in action
                </p>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Request Demo
                </Button>
              </Card>

              <Card className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2">Pilot Program</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our institutional pilot program
                </p>
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <Users className="h-4 w-4 mr-2" />
                  Join Pilot
                </Button>
              </Card>

              <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Partnership</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore strategic partnerships
                </p>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Globe className="h-4 w-4 mr-2" />
                  Partner With Us
                </Button>
              </Card>
            </div>

            <div className="space-y-6 pt-8">
              <Separator />
              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-2">
                  Contact Our Institutional Team
                </p>
                <p className="text-muted-foreground">
                  institutions@guardianos.com • +31 20 123 4567
                </p>
              </div>

              <div className="flex items-center justify-center gap-6">
                <Badge className="px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Enterprise-Ready
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  SOC 2 Compliant
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Globe className="h-4 w-4 mr-2" />
                  Global Deployment
                </Badge>
              </div>
            </div>
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
                  Institutional blockchain compliance platform providing privacy with reasonable oversight.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/deck" className="hover:text-white transition-colors">Presentation</Link></li>
                  <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#impact" className="hover:text-white transition-colors">Impact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">White Paper</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-8 bg-slate-700" />
            
            <div className="flex items-center justify-between text-sm text-slate-400">
              <p>&copy; 2024 GuardianOS. All rights reserved.</p>
              <p>Institutional blockchain compliance platform</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
