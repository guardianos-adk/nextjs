"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Rocket,
  AlertTriangle,
  Shield,
  Users,
  Building,
  Code2,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Info,
  Play,
  Download,
  ExternalLink,
  Terminal,
  FileText,
  Coins,
  Lock,
  Eye,
  Bot,
  Network,
  Database,
  GitBranch,
  Zap,
  Globe,
  TrendingUp,
  HelpCircle,
  Sparkles,
  Clock,
  CreditCard,
  Wallet,
  BarChart3,
  ChevronRight,
  Timer,
  DollarSign,
  XCircle,
  CheckCircle2,
  Banknote,
  CircleDollarSign,
  ShieldCheck,
  AlertCircle,
  LightbulbIcon,
  Briefcase,
  GraduationCap,
  HandshakeIcon,
  LayoutDashboard,
  ArrowDown
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Floating animation component
function FloatingIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Progress indicator component
function ProgressIndicator({ steps, currentStep }: { steps: number; currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: steps }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i < currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [userType, setUserType] = useState<"institution" | "regulator" | "developer">("institution");
  const [showConfetti, setShowConfetti] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const journeySteps = [
    {
      title: "Current State",
      subtitle: "Traditional settlement systems",
      description: "Current international transfers take 2-3 days with high fees and manual compliance checks.",
      icon: <Briefcase className="h-6 w-6" />,
      color: "from-red-500 to-red-400",
      metrics: {
        current: "2-3 days settlement",
        potential: "Same-day possible",
        savings: "Reduced operational costs"
      }
    },
    {
      title: "Implementation",
      subtitle: "Privacy pool integration",
      description: "Deploy GuardianOS to enable privacy-preserving transactions with built-in compliance checks.",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-orange-500 to-amber-400",
      features: [
        "Zero-knowledge proofs",
        "AI transaction monitoring",
        "5-jurisdiction support"
      ]
    },
    {
      title: "Operations",
      subtitle: "Production deployment",
      description: "Process blockchain transactions with automated compliance reporting and selective disclosure when required.",
      icon: <Rocket className="h-6 w-6" />,
      color: "from-emerald-500 to-teal-600",
      benefits: [
        "Faster settlements",
        "Automated compliance",
        "Audit trail generation"
      ]
    }
  ];

  const realWorldScenarios = [
    {
      title: "The €75 Million Wire Transfer",
      timeframe: "Monday, 9:47 AM",
      problem: "Your Frankfurt office needs to send €75M to New York. Traditional SWIFT will take 2-3 days and cost €15,000 in fees.",
      solution: "GuardianOS processes the transfer through privacy pools with automated compliance checks. Transaction details remain private unless flagged by risk thresholds.",
      outcome: {
        time: "Same day settlement",
        cost: "Lower transaction fees",
        compliance: "Automated reporting"
      },
      icon: <CircleDollarSign className="h-8 w-8" />,
      emotion: "relief"
    },
    {
      title: "The Suspicious Pattern Alert",
      timeframe: "Wednesday, 2:15 PM",
      problem: "A transaction shows patterns similar to known laundering schemes. You need to investigate without alerting innocent parties.",
      solution: "AI agents flag the transaction for review. If 3 of 5 guardians approve, specific transaction details are disclosed to authorities while maintaining privacy for other users.",
      outcome: {
        detection: "Real-time monitoring",
        privacy: "Selective disclosure",
        accuracy: "AI-powered detection"
      },
      icon: <AlertTriangle className="h-8 w-8" />,
      emotion: "confidence"
    },
    {
      title: "The Quarterly Compliance Report",
      timeframe: "Month-end, Every Quarter",
      problem: "Five different regulators want reports. Your compliance team spends 2 weeks preparing documentation.",
      solution: "Smart contracts maintain immutable audit trails. Compliance data is automatically aggregated and formatted for each jurisdiction's requirements.",
      outcome: {
        time: "Automated generation",
        accuracy: "On-chain verification",
        staff: "Reduced manual work"
      },
      icon: <FileText className="h-8 w-8" />,
      emotion: "productivity"
    }
  ];

  const commonMisconceptions = [
    {
      myth: "Blockchain means everything is public",
      reality: "Zero-knowledge proofs let you prove compliance without revealing details",
      explanation: "Think of it like proving you're over 21 without showing your exact birthdate. We use similar cryptographic techniques to prove your transactions are legitimate without exposing amounts, parties, or purposes.",
      icon: <Eye className="h-6 w-6" />
    },
    {
      myth: "We need to understand crypto to use this",
      reality: "GuardianOS works like your current systems, just faster",
      explanation: "Your teams use familiar interfaces and workflows. The blockchain complexity happens behind the scenes - like how you use the internet without understanding TCP/IP.",
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      myth: "Regulators will never accept blockchain",
      reality: "ECB, BaFin, and others are already exploring blockchain",
      explanation: "Regulators want better oversight, not less. GuardianOS gives them real-time monitoring and cryptographic proof of compliance - actually improving their capabilities.",
      icon: <ShieldCheck className="h-6 w-6" />
    }
  ];

  const implementationPhases = [
    {
      phase: "Discovery & Planning",
      duration: "2 weeks",
      activities: [
        "Compliance requirement mapping",
        "Technical architecture review",
        "Regulatory stakeholder alignment",
        "Risk assessment workshop"
      ],
      deliverables: ["Implementation roadmap", "Compliance matrix", "Technical specification"],
      team: "Your compliance + IT leads work with our solution architects"
    },
    {
      phase: "Pilot Integration",
      duration: "4 weeks",
      activities: [
        "Test environment setup",
        "API integration with 1 system",
        "Staff training sessions",
        "Small transaction testing"
      ],
      deliverables: ["Working pilot", "Trained team", "Performance benchmarks"],
      team: "5-10 of your staff get hands-on experience"
    },
    {
      phase: "Production Rollout",
      duration: "6 weeks",
      activities: [
        "Full system integration",
        "Guardian network onboarding",
        "Compliance verification",
        "Go-live support"
      ],
      deliverables: ["Production system", "Compliance certification", "Operational playbooks"],
      team: "Full team enablement with 24/7 support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ width: `${readProgress}%` }}
        initial={{ width: 0 }}
        transition={{ ease: "linear" }}
      />

      {/* Header */}
      <header className="sticky top-1 z-40 mx-4 mt-4 mb-8">
        <motion.div
          className="guardian-nav rounded-2xl shadow-lg backdrop-blur-xl border-3 border-primary/20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 group">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image src="/logo.png" alt="GuardianOS" height={40} width={40} />
                  </motion.div>
                  <span className="guardian-heading-4 group-hover:text-primary transition-colors">
                    GuardianOS Guide
                  </span>
                </Link>
              </div>
              <nav className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="group">
                    Home
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="guardian-button-primary group">
                    <LayoutDashboard className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                    Experience Demo
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Hero Section with User Type Selection */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-emerald-500/5" />
        <div className="container mx-auto px-6 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="mb-8">
              <span className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">TRANSFORM</span>
              <br />
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                From Blockchain-Curious to Blockchain-Confident
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground mb-12 max-w-3xl mx-auto font-light">
              GuardianOS enables institutions to access blockchain markets while maintaining 
              regulatory compliance through selective disclosure and AI-powered monitoring.
            </p>

            {/* Interactive User Type Selection */}
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-4">I am a...</p>
              <div className="inline-flex flex-wrap justify-center gap-3">
                {[
                  { type: "institution", icon: Building, label: "Financial Institution", color: "blue" },
                  { type: "regulator", icon: Shield, label: "Regulatory Body", color: "emerald" },
                  { type: "developer", icon: Code2, label: "Developer/Integrator", color: "purple" }
                ].map((option) => (
                  <motion.button
                    key={option.type}
                    onClick={() => setUserType(option.type as any)}
                    className={cn(
                      "relative px-6 py-4 rounded-xl transition-all duration-300",
                      "border-3 backdrop-blur-sm",
                      userType === option.type
                        ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-950/20`
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {userType === option.type && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5"
                        layoutId="userTypeBackground"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative flex items-center gap-3">
                      <option.icon className={cn(
                        "h-5 w-5 transition-colors",
                        userType === option.type ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "font-medium transition-colors",
                        userType === option.type ? "text-primary" : "text-foreground"
                      )}>
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Personalized Welcome Message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={userType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="guardian-card max-w-3xl mx-auto"
              >
                <div className="p-8 text-left">
                  {userType === "institution" && (
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">Financial Institution</h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        GuardianOS provides blockchain transaction capabilities with built-in compliance tools. 
                        The platform handles privacy preservation while enabling selective disclosure when required by regulations.
                      </p>
                      <div className="flex items-center gap-6 pt-4">
                        <div className="text-center">
                          <div className="text-4xl font-black text-primary">65%</div>
                          <p className="text-base font-medium text-muted-foreground">Cost Reduction</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="text-4xl font-black text-emerald-600">2hrs</div>
                          <p className="text-base font-medium text-muted-foreground">vs 3 Days Settlement</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="text-4xl font-black text-purple-600">24/7</div>
                          <p className="text-base font-medium text-muted-foreground">Market Access</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {userType === "regulator" && (
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">Regulatory Body</h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        GuardianOS provides transaction oversight through a 3-of-5 guardian consensus mechanism. 
                        Access transaction details only when specific risk thresholds are met, with full audit trails.
                      </p>
                      <div className="flex items-center gap-6 pt-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">450ms</div>
                          <p className="text-sm text-muted-foreground">Detection Time</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600">94%</div>
                          <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">5</div>
                          <p className="text-sm text-muted-foreground">Jurisdictions</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {userType === "developer" && (
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">Developer</h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        Access our smart contracts on Sepolia testnet and REST APIs. 
                        Build on our privacy pool infrastructure with threshold cryptography and AI monitoring capabilities.
                      </p>
                      <div className="flex items-center gap-6 pt-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">4</div>
                          <p className="text-sm text-muted-foreground">Smart Contracts</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600">3</div>
                          <p className="text-sm text-muted-foreground">SDK Languages</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">REST</div>
                          <p className="text-sm text-muted-foreground">+ WebSocket APIs</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Enhanced Tabs */}
      <section className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full mb-8 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="welcome" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-200 rounded-xl font-medium">
              <Info className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="journey" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-200 rounded-xl font-medium">
              <Rocket className="h-4 w-4 mr-2" />
              Journey
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-200 rounded-xl font-medium">
              <Lightbulb className="h-4 w-4 mr-2" />
              Real Scenarios
            </TabsTrigger>
            <TabsTrigger value="howto" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-200 rounded-xl font-medium">
              <GraduationCap className="h-4 w-4 mr-2" />
              How-To
            </TabsTrigger>
            <TabsTrigger value="implementation" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-200 rounded-xl font-medium">
              <BarChart3 className="h-4 w-4 mr-2" />
              Implement
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-200 rounded-xl font-medium">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="welcome" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-5xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Platform Overview
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                GuardianOS combines privacy pools, AI monitoring, and threshold cryptography 
                to enable compliant blockchain transactions for institutions.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Technical Architecture",
                  icon: <AlertCircle className="h-8 w-8" />,
                  color: "from-red-500 to-orange-600",
                  points: [
                    "Zero-knowledge privacy pools",
                    "3-of-5 guardian consensus",
                    "Google ADK AI agents",
                    "Sepolia testnet deployment"
                  ]
                },
                {
                  title: "Compliance Features",
                  icon: <TrendingUp className="h-8 w-8" />,
                  color: "from-emerald-500 to-teal-600",
                  points: [
                    "AML transaction monitoring",
                    "Multi-jurisdiction support",
                    "Selective disclosure protocol",
                    "Immutable audit trails"
                  ]
                },
                {
                  title: "Integration Points",
                  icon: <ShieldCheck className="h-8 w-8" />,
                  color: "from-blue-500 to-purple-600",
                  points: [
                    "REST API endpoints",
                    "Smart contract interfaces",
                    "WebSocket real-time updates",
                    "MongoDB vector search"
                  ]
                }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.3 + index * 0.15,
                    duration: 0.5,
                    ease: [0.215, 0.610, 0.355, 1.000]
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
                    <CardContent className="p-8">
                      <motion.div 
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                          "bg-gradient-to-br text-white shadow-lg",
                          section.color
                        )}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                      >
                        {section.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-6">{section.title}</h3>
                      <div className="space-y-4">
                        {section.points.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (index * 0.15) + (i * 0.1) }}
                            className="flex items-start gap-3"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 + (index * 0.15) + (i * 0.1), type: "spring" }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            </motion.div>
                            <span className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{point}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

          </TabsContent>

          {/* Journey Tab */}
          <TabsContent value="journey" className="space-y-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Implementation Journey
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Three phases to blockchain-enabled operations
              </motion.p>
            </motion.div>

            <div className="space-y-8">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.6,
                    ease: [0.215, 0.610, 0.355, 1.000]
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-xl">
                      <div className="flex flex-col md:flex-row">
                        <div className={cn(
                          "md:w-2/5 p-10 text-white bg-gradient-to-br flex items-center justify-center relative overflow-hidden",
                          step.color
                        )}>
                          {/* Animated Background Pattern */}
                          <motion.div 
                            className="absolute inset-0 opacity-10"
                            animate={{ 
                              backgroundPosition: ["0% 0%", "100% 100%"],
                            }}
                            transition={{ 
                              duration: 20,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            style={{
                              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
                              backgroundSize: "200% 200%"
                            }}
                          />
                          
                          <div className="text-center relative z-10">
                            <motion.div 
                              className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl"
                              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              {step.icon}
                            </motion.div>
                            <h3 className="text-3xl font-black mb-2">{step.title}</h3>
                            <p className="text-lg opacity-90 font-medium">{step.subtitle}</p>
                          </div>
                        </div>
                        <div className="md:w-3/5 p-10">
                          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8">{step.description}</p>
                        
                        {step.metrics && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <XCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
                              <div className="text-sm font-medium">Current</div>
                              <div className="text-xs text-muted-foreground">{step.metrics.current}</div>
                            </div>
                            <div className="text-center p-4 bg-primary/10 rounded-lg">
                              <ArrowRight className="h-5 w-5 text-primary mx-auto mb-2" />
                              <div className="text-sm font-medium">Future</div>
                              <div className="text-xs text-primary">{step.metrics.potential}</div>
                            </div>
                            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                              <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                              <div className="text-sm font-medium">Result</div>
                              <div className="text-xs text-emerald-600">{step.metrics.savings}</div>
                            </div>
                          </div>
                        )}
                        
                        {(step.features || step.benefits) && (
                          <div className="mt-6 space-y-2">
                            {(step.features || step.benefits)?.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                  <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Timeline Visualization */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Your 12-Week Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-emerald-500" />
                  {[
                    { week: "Week 1-2", title: "Discovery", desc: "Understanding your needs" },
                    { week: "Week 3-6", title: "Pilot", desc: "Testing with small transactions" },
                    { week: "Week 7-10", title: "Integration", desc: "Connecting your systems" },
                    { week: "Week 11-12", title: "Launch", desc: "Go live with full support" }
                  ].map((phase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center gap-6 mb-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-primary flex items-center justify-center z-10">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{phase.week}</div>
                        <div className="font-semibold">{phase.title}</div>
                        <div className="text-sm text-muted-foreground">{phase.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-5xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Real-World Scenarios
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                How GuardianOS handles common institutional transactions
              </motion.p>
            </motion.div>

            <div className="grid gap-8">
              {realWorldScenarios.map((scenario, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.6,
                    ease: [0.215, 0.610, 0.355, 1.000]
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <div className="bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-8 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <motion.div 
                              className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                                scenario.emotion === "relief" && "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
                                scenario.emotion === "confidence" && "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white",
                                scenario.emotion === "productivity" && "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                              )}
                              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              {scenario.icon}
                            </motion.div>
                            <div>
                              <h3 className="text-2xl font-bold">{scenario.title}</h3>
                              <p className="text-base text-muted-foreground mt-1">{scenario.timeframe}</p>
                            </div>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.15 }}
                          >
                            <Badge variant="secondary" className="px-4 py-2 text-sm">
                              <Timer className="h-4 w-4 mr-2" />
                              Case Study
                            </Badge>
                          </motion.div>
                        </div>
                      </div>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* The Problem */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">The Challenge</h4>
                        <p className="text-sm text-muted-foreground">{scenario.problem}</p>
                      </div>
                    </div>

                    {/* The Solution */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                          <Lightbulb className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">How GuardianOS Solves It</h4>
                        <p className="text-sm text-muted-foreground">{scenario.solution}</p>
                      </div>
                    </div>

                    {/* The Outcome */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6">
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        The Result
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {Object.entries(scenario.outcome).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold text-primary">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              </motion.div>
            ))}
            </div>

            {/* Comparison Table */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Traditional vs GuardianOS: Side-by-Side</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Aspect</th>
                        <th className="text-center py-3 px-4">Traditional Banking</th>
                        <th className="text-center py-3 px-4">With GuardianOS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          aspect: "Settlement Time",
                          traditional: "2-3 business days",
                          guardian: "2 hours or less"
                        },
                        {
                          aspect: "Transaction Cost",
                          traditional: "€10,000 - €50,000",
                          guardian: "€1,000 - €5,000"
                        },
                        {
                          aspect: "Compliance Reporting",
                          traditional: "2 weeks manual work",
                          guardian: "30 minutes automated"
                        },
                        {
                          aspect: "Privacy Protection",
                          traditional: "Limited, all visible",
                          guardian: "Full privacy default"
                        },
                        {
                          aspect: "Fraud Detection",
                          traditional: "Hours to days",
                          guardian: "450ms real-time"
                        }
                      ].map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b"
                        >
                          <td className="py-3 px-4 font-medium">{row.aspect}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-red-600">{row.traditional}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-emerald-600 font-medium">{row.guardian}</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* How-To Tab */}
          <TabsContent value="howto" className="space-y-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Technical Overview
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Understanding the core concepts and implementation details
              </motion.p>
            </motion.div>

            {/* Common Misconceptions */}
            <div className="mb-16">
              <motion.h3 
                className="text-3xl font-bold mb-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Common Misconceptions
              </motion.h3>
              <div className="grid md:grid-cols-3 gap-8">
                {commonMisconceptions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: 0.4 + index * 0.1,
                      duration: 0.5,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <span className="font-medium text-red-600">Myth</span>
                        </div>
                        <p className="text-sm mb-4 line-through opacity-60">{item.myth}</p>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="font-medium text-emerald-600">Reality</span>
                        </div>
                        <p className="text-sm font-medium mb-4">{item.reality}</p>
                        
                        <div className="pt-4 border-t">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Info className="h-4 w-4" />
                                <span>Learn more</span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-sm">{item.explanation}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Key Concepts Explained */}
            <Card>
              <CardHeader>
                <CardTitle>Key Concepts Explained Simply</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="privacy-pools">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span>What are Privacy Pools?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">
                          Imagine a swimming pool where everyone jumps in wearing identical swimsuits. 
                          Once in the pool, you can't tell who is who - that's privacy.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                          <h5 className="font-medium mb-2">In Banking Terms:</h5>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Multiple institutions deposit funds together</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Transactions mix together for privacy</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Your competitors can't see your moves</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Regulators can still investigate if needed</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="guardian-network">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        <span>How does the Guardian Network work?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">
                          Think of it like a board of directors for compliance decisions. No single person 
                          can make unilateral decisions about revealing private information.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                          <h5 className="font-medium mb-2">The 5 Guardians:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                            {["ECB", "DNB", "BaFin", "FINMA", "FCA"].map((guardian) => (
                              <div key={guardian} className="text-center p-3 bg-white dark:bg-slate-700 rounded-lg">
                                <div className="font-mono text-sm font-bold text-primary">{guardian}</div>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm font-medium mb-2">3 of 5 must agree to reveal any information</p>
                          <p className="text-xs text-muted-foreground">
                            This prevents any single jurisdiction from having too much power while ensuring 
                            legitimate investigations can proceed.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ai-monitoring">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-purple-600" />
                        <span>What do the AI agents actually do?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">
                          Think of them as your 24/7 compliance team that never sleeps, never takes breaks, 
                          and can analyze thousands of transactions per second.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                            <Zap className="h-5 w-5 text-amber-600 mb-2" />
                            <h5 className="font-medium mb-1">Pattern Detection</h5>
                            <p className="text-xs text-muted-foreground">
                              Spots unusual behavior in milliseconds
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                            <Database className="h-5 w-5 text-blue-600 mb-2" />
                            <h5 className="font-medium mb-1">Sanctions Checking</h5>
                            <p className="text-xs text-muted-foreground">
                              Real-time verification against global lists
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                            <TrendingUp className="h-5 w-5 text-emerald-600 mb-2" />
                            <h5 className="font-medium mb-1">Risk Scoring</h5>
                            <p className="text-xs text-muted-foreground">
                              Assigns risk levels to every transaction
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Step-by-Step Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Your First Transaction: Step by Step</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Log into GuardianOS Dashboard",
                      description: "Use your institutional credentials - no crypto wallet needed",
                      time: "30 seconds",
                      icon: <LayoutDashboard className="h-5 w-5" />
                    },
                    {
                      step: 2,
                      title: "Enter Transaction Details",
                      description: "Amount, recipient, purpose - just like your current system",
                      time: "1 minute",
                      icon: <CreditCard className="h-5 w-5" />
                    },
                    {
                      step: 3,
                      title: "AI Agents Check Compliance",
                      description: "Automatic sanctions screening and risk assessment",
                      time: "450ms",
                      icon: <Bot className="h-5 w-5" />
                    },
                    {
                      step: 4,
                      title: "Transaction Executes",
                      description: "Funds move through privacy pool to recipient",
                      time: "2 minutes",
                      icon: <Zap className="h-5 w-5" />
                    },
                    {
                      step: 5,
                      title: "Confirmation & Reporting",
                      description: "Receive confirmation with audit trail for records",
                      time: "Instant",
                      icon: <CheckCircle2 className="h-5 w-5" />
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">Step {item.step}: {item.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            <Timer className="h-3 w-3 mr-1" />
                            {item.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm">
                      <span className="font-medium">Total time:</span> Under 5 minutes for a fully compliant 
                      cross-border transaction that would traditionally take 2-3 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-5xl font-black mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Implementation Roadmap
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Structured deployment process with clear milestones
              </motion.p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-orange-200 to-amber-200 dark:from-amber-800 dark:via-orange-800 dark:to-amber-800 hidden md:block" />
              
              <div className="space-y-8">
                {implementationPhases.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.15,
                      duration: 0.6,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }}
                    className="relative"
                  >
                    {/* Timeline Node */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
                      className="absolute left-4 top-8 w-8 h-8 bg-white dark:bg-slate-900 border-4 border-amber-500 rounded-full hidden md:flex items-center justify-center z-10"
                    >
                      <span className="text-xs font-bold">{index + 1}</span>
                    </motion.div>
                    
                    <div className="ml-0 md:ml-16">
                      <Card className="overflow-hidden border-2 border-transparent hover:border-amber-500/30 transition-all duration-300 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 border-b border-amber-200 dark:border-amber-800">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-bold flex items-center gap-3">
                                <motion.div 
                                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-lg md:hidden"
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {index + 1}
                                </motion.div>
                                {phase.phase}
                              </h3>
                              <p className="text-lg font-medium text-amber-700 dark:text-amber-300 mt-1">
                                {phase.duration}
                              </p>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + index * 0.15 }}
                            >
                              <Badge className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                                <Users className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">{phase.team}</span>
                              </Badge>
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <CardContent className="p-8">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Activities */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.15 }}
                            >
                              <h4 className="text-lg font-semibold mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <BarChart3 className="h-5 w-5 text-blue-600" />
                                </div>
                                Activities
                              </h4>
                              <ul className="space-y-3">
                                {phase.activities.map((activity, i) => (
                                  <motion.li 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.15 + i * 0.05 }}
                                    className="flex items-start gap-3 group"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    </div>
                                    <span className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{activity}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                            
                            {/* Deliverables */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.15 }}
                            >
                              <h4 className="text-lg font-semibold mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-emerald-600" />
                                </div>
                                Deliverables
                              </h4>
                              <ul className="space-y-3">
                                {phase.deliverables.map((deliverable, i) => (
                                  <motion.li 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.15 + i * 0.05 }}
                                    className="flex items-start gap-3 group"
                                  >
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: 360 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <CheckCircle className="h-6 w-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    </motion.div>
                                    <span className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{deliverable}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ROI Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16"
            >
              <Card className="overflow-hidden border-2 border-transparent hover:border-blue-500/20 transition-all duration-300 shadow-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                    <motion.div
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <DollarSign className="h-7 w-7" />
                    </motion.div>
                    ROI Calculator
                  </CardTitle>
                  <p className="text-center text-blue-100 mt-2">Compare your current costs with GuardianOS</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Current Costs */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h4 className="text-lg font-semibold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        Your Current Costs
                      </h4>
                      <div className="space-y-4">
                        <motion.div 
                          className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-base text-slate-600 dark:text-slate-300">Average transaction fee</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">€15,000</span>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-base text-slate-600 dark:text-slate-300">Settlement time</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">3 days</span>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-base text-slate-600 dark:text-slate-300">Compliance staff</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">15 FTEs</span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    {/* With GuardianOS */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h4 className="text-lg font-semibold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        With GuardianOS
                      </h4>
                      <div className="space-y-4">
                        <motion.div 
                          className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-base text-emerald-700 dark:text-emerald-300">Average transaction fee</span>
                            <div className="flex items-center gap-2">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                              >
                                <ArrowDown className="h-4 w-4 text-emerald-600" />
                              </motion.div>
                              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">€1,500</span>
                            </div>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-base text-emerald-700 dark:text-emerald-300">Settlement time</span>
                            <div className="flex items-center gap-2">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.1, type: "spring" }}
                              >
                                <Zap className="h-4 w-4 text-emerald-600" />
                              </motion.div>
                              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">2 hours</span>
                            </div>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-base text-emerald-700 dark:text-emerald-300">Compliance staff</span>
                            <div className="flex items-center gap-2">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.2, type: "spring" }}
                              >
                                <Users className="h-4 w-4 text-emerald-600" />
                              </motion.div>
                              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">5 FTEs</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Disclaimer */}
                  <motion.div 
                    className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <p className="text-base text-blue-700 dark:text-blue-300 text-center leading-relaxed">
                      <Info className="h-5 w-5 inline-block mr-2 mb-1" />
                      Actual savings depend on transaction volume and current infrastructure. 
                      Contact us for a detailed cost analysis based on your specific requirements.
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-5xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Common questions about implementation and operations
              </motion.p>
            </motion.div>

            {/* FAQ Categories */}
            <motion.div 
              className="grid md:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { icon: HelpCircle, label: "Getting Started", count: 8, color: "from-blue-500 to-indigo-600" },
                { icon: Shield, label: "Compliance", count: 12, color: "from-emerald-500 to-teal-600" },
                { icon: Code2, label: "Technical", count: 10, color: "from-purple-500 to-pink-600" },
                { icon: DollarSign, label: "Pricing", count: 6, color: "from-amber-500 to-orange-600" }
              ].map((category, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                    "bg-gradient-to-br",
                    category.color
                  )} />
                  <category.icon className="h-10 w-10 text-primary mb-3 relative z-10" />
                  <h4 className="font-semibold text-lg mb-1 relative z-10">{category.label}</h4>
                  <p className="text-sm text-muted-foreground relative z-10">{category.count} questions</p>
                </motion.button>
              ))}
            </motion.div>

            {/* Sample FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Most Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="cost">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-amber-600" />
                        <span>What's the real cost of implementation?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm">Implementation costs vary by institution size, but here's a typical breakdown:</p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-medium mb-2">One-Time Setup</h5>
                            <div className="text-2xl font-bold text-primary mb-1">€50k-€200k</div>
                            <p className="text-xs text-muted-foreground">Integration & training</p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-medium mb-2">Monthly Platform</h5>
                            <div className="text-2xl font-bold text-primary mb-1">€10k-€50k</div>
                            <p className="text-xs text-muted-foreground">Based on volume</p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-medium mb-2">Transaction Fees</h5>
                            <div className="text-2xl font-bold text-primary mb-1">0.1%</div>
                            <p className="text-xs text-muted-foreground">Of transaction value</p>
                          </div>
                        </div>
                        <Alert className="border-slate-200 bg-slate-50 dark:bg-slate-900/20">
                          <Info className="h-4 w-4 text-slate-600" />
                          <AlertDescription>
                            ROI timelines vary based on transaction volume, current infrastructure, and implementation scope.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="security">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <span>How secure is this really?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm">GuardianOS uses multiple layers of security:</p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h5 className="font-medium">Standard Encryption</h5>
                              <p className="text-sm text-muted-foreground">
                                AES-256 encryption for data at rest and TLS 1.3 for data in transit
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h5 className="font-medium">Threshold Cryptography</h5>
                              <p className="text-sm text-muted-foreground">
                                No single point of failure - requires 3/5 guardians to act
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Eye className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h5 className="font-medium">Zero-Knowledge Proofs</h5>
                              <p className="text-sm text-muted-foreground">
                                Prove compliance without revealing sensitive data
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="integration">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Terminal className="h-5 w-5 text-purple-600" />
                        <span>Will this work with our existing systems?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm">Yes! GuardianOS is designed to integrate seamlessly:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-medium mb-2">What We Support</h5>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                Core banking systems (Temenos, Finastra)
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                SWIFT messaging
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                Existing compliance tools
                              </li>
                            </ul>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-medium mb-2">Integration Methods</h5>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                REST APIs
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                WebSocket for real-time
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                SDKs (Python, Java, JS)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section with Emotional Appeal */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-emerald-500/10" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="guardian-card border-3 border-primary/20">
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <HandshakeIcon className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Start Your Implementation
                </h2>
                <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                  Connect with our team to discuss your specific requirements and deployment timeline.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link href="/dashboard">
                    <Button size="lg" className="guardian-button-primary group">
                      <LayoutDashboard className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                      Try the Demo
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="group">
                    <Download className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                    Download Executive Summary
                  </Button>
                </div>
                
                <div className="pt-8 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    For technical documentation and integration support:
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    <a href="/api/docs" className="text-primary hover:underline text-sm">
                      API Documentation
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <a href="/contracts" className="text-primary hover:underline text-sm">
                      Smart Contracts
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

    </div>
  );
}