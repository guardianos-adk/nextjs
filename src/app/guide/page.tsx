"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
  HelpCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickStartStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  code?: string;
  note?: string;
}

interface UseCaseExample {
  title: string;
  scenario: string;
  solution: string;
  benefits: string[];
  icon: React.ReactNode;
}

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "technical" | "compliance";
}

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userType, setUserType] = useState<"institution" | "regulator" | "developer">("institution");

  const quickStartSteps: QuickStartStep[] = [
    {
      title: "Access the Platform",
      description: "Navigate to the GuardianOS dashboard to start exploring the platform's capabilities.",
      icon: <Rocket className="h-5 w-5 text-blue-600" />,
      code: "https://guardianos.app/dashboard",
      note: "No blockchain wallet required for demo exploration"
    },
    {
      title: "Connect Your Institution",
      description: "For production use, connect your institutional wallet to interact with smart contracts.",
      icon: <Building className="h-5 w-5 text-emerald-600" />,
      code: "Click 'Connect Wallet' → Select institutional wallet → Approve connection",
      note: "Supports MetaMask, WalletConnect, and institutional custody solutions"
    },
    {
      title: "Join Privacy Pool",
      description: "Deposit funds into the privacy-preserving pool to start transacting privately.",
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      code: "Navigate to 'Privacy Pools' → Enter amount → Confirm deposit",
      note: "Minimum deposit: 1 ETH for optimal privacy set"
    },
    {
      title: "Monitor Compliance",
      description: "View real-time compliance status and AI agent activity on your dashboard.",
      icon: <Eye className="h-5 w-5 text-amber-600" />,
      note: "All compliance actions are recorded on-chain for audit trails"
    }
  ];

  const useCases: UseCaseExample[] = [
    {
      title: "Cross-Border Payments",
      scenario: "A European bank needs to send €10M to a US institution while complying with both ECB and Fed regulations.",
      solution: "GuardianOS automatically coordinates between ECB and Fed guardian nodes, ensuring both jurisdictions' requirements are met without exposing transaction details to competitors.",
      benefits: [
        "Automated multi-jurisdiction compliance",
        "Transaction privacy maintained",
        "2-hour settlement vs 2-3 days traditional"
      ],
      icon: <Globe className="h-6 w-6 text-blue-600" />
    },
    {
      title: "High-Risk Transaction Monitoring",
      scenario: "A transaction exhibits patterns similar to known money laundering schemes.",
      solution: "AI agents detect the suspicious pattern in 450ms, automatically triggering guardian review. If 3 of 5 guardians approve investigation, only relevant details are disclosed to authorities.",
      benefits: [
        "94% fraud detection accuracy",
        "Selective disclosure protects innocent parties",
        "Real-time automated monitoring"
      ],
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    {
      title: "Regulatory Reporting",
      scenario: "Quarterly compliance reports required by multiple regulatory bodies.",
      solution: "Smart contracts automatically aggregate anonymized compliance data, generating reports that satisfy regulatory requirements without revealing individual transaction details.",
      benefits: [
        "Automated report generation",
        "Privacy-preserving aggregation",
        "Cryptographic proof of accuracy"
      ],
      icon: <FileText className="h-6 w-6 text-emerald-600" />
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: "What is GuardianOS and how does it work?",
      answer: "GuardianOS is a privacy-preserving blockchain compliance platform that allows financial institutions to use blockchain technology while maintaining regulatory compliance. It uses 'Privacy Pools' where transactions remain private unless suspicious activity triggers a review by a decentralized network of compliance guardians.",
      category: "general"
    },
    {
      question: "How does the guardian consensus mechanism work?",
      answer: "The guardian network consists of 5 compliance officers from different jurisdictions (ECB, DNB, BaFin, FINMA, FCA). When a high-risk transaction is detected, at least 3 of 5 guardians must vote to approve any de-anonymization request. Each guardian holds a cryptographic key share, preventing any single entity from accessing private data.",
      category: "technical"
    },
    {
      question: "What are Privacy Pools?",
      answer: "Privacy Pools are smart contracts where multiple institutions deposit funds. When withdrawing, users generate zero-knowledge proofs that their funds are not connected to illicit activities. This provides privacy for legitimate users while allowing compliance when legally required.",
      category: "technical"
    },
    {
      question: "How does GuardianOS ensure regulatory compliance?",
      answer: "GuardianOS uses AI agents to monitor all transactions in real-time, checking against sanctions lists and detecting suspicious patterns. High-risk transactions trigger guardian review, and approved de-anonymization requests reveal only necessary information to regulators, maintaining privacy for uninvolved parties.",
      category: "compliance"
    },
    {
      question: "What blockchains does GuardianOS support?",
      answer: "Currently, GuardianOS is deployed on Ethereum Sepolia testnet with plans for mainnet deployment. The architecture is designed to be blockchain-agnostic and can be adapted to other EVM-compatible chains.",
      category: "technical"
    },
    {
      question: "How much does GuardianOS cost to use?",
      answer: "Costs include: 1) Gas fees for blockchain transactions (approximately $10-50 per transaction), 2) Platform fees (0.1% of transaction volume), and 3) Guardian network fees (flat fee per compliance review). Institutional packages with volume discounts are available.",
      category: "general"
    },
    {
      question: "Is GuardianOS suitable for small institutions?",
      answer: "Yes, GuardianOS is designed to be accessible to institutions of all sizes. Small institutions benefit from shared compliance infrastructure and reduced operational costs compared to building their own blockchain compliance systems.",
      category: "general"
    },
    {
      question: "How long does the compliance review process take?",
      answer: "Low-risk transactions are processed automatically in under 2 seconds. High-risk transactions requiring guardian consensus typically complete within 2.1 seconds for voting, plus any additional time for manual review if required (usually under 1 hour).",
      category: "compliance"
    },
    {
      question: "What happens if a transaction is flagged?",
      answer: "Flagged transactions trigger an automatic review process: 1) AI agents compile evidence, 2) Guardian council is notified, 3) Guardians vote on whether to reveal transaction details, 4) If approved, only necessary information is disclosed to relevant authorities.",
      category: "compliance"
    },
    {
      question: "Can GuardianOS integrate with existing systems?",
      answer: "Yes, GuardianOS provides REST APIs and WebSocket connections for integration with existing banking systems. We also offer SDKs in Python, JavaScript, and Java for custom integrations.",
      category: "technical"
    }
  ];

  const getContentForUserType = () => {
    switch (userType) {
      case "institution":
        return {
          title: "For Financial Institutions",
          subtitle: "Enable blockchain adoption with built-in compliance",
          benefits: [
            "Reduce compliance costs by 65%",
            "Access DeFi markets safely",
            "Maintain competitive privacy",
            "Automated regulatory reporting"
          ]
        };
      case "regulator":
        return {
          title: "For Regulatory Bodies",
          subtitle: "Maintain oversight without compromising innovation",
          benefits: [
            "Real-time transaction monitoring",
            "Cryptographic proof of compliance",
            "Selective disclosure capabilities",
            "Cross-border coordination"
          ]
        };
      case "developer":
        return {
          title: "For Developers",
          subtitle: "Build compliant blockchain applications",
          benefits: [
            "Open-source smart contracts",
            "Comprehensive API documentation",
            "SDK support for major languages",
            "Active developer community"
          ]
        };
    }
  };

  const userContent = getContentForUserType();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="GuardianOS" height={32} width={32} />
                <span className="font-semibold text-lg">GuardianOS Guide</span>
              </Link>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/">
                <Button variant="ghost" size="sm">Home</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Try Demo
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Comprehensive Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to GuardianOS
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your complete guide to privacy-preserving blockchain compliance
            </p>
            
            {/* User Type Selector */}
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={userType === "institution" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("institution")}
              >
                <Building className="h-4 w-4 mr-2" />
                Institution
              </Button>
              <Button
                variant={userType === "regulator" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("regulator")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Regulator
              </Button>
              <Button
                variant={userType === "developer" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("developer")}
              >
                <Code2 className="h-4 w-4 mr-2" />
                Developer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User-Specific Content */}
      <section className="py-8 container mx-auto px-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{userContent.title}</h2>
                <p className="text-muted-foreground">{userContent.subtitle}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {userContent.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Tabs */}
      <section className="py-12 container mx-auto px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="usecases">Use Cases</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  Understanding GuardianOS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">The Problem We Solve</h3>
                  <p className="text-muted-foreground mb-4">
                    Financial institutions want to use blockchain technology for its efficiency and transparency benefits, 
                    but face two critical challenges:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4">
                        <Lock className="h-5 w-5 text-red-600 mb-2" />
                        <h4 className="font-medium mb-1">Privacy Paradox</h4>
                        <p className="text-sm text-muted-foreground">
                          Blockchain's transparency exposes sensitive financial data and trading strategies
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50 border-amber-200">
                      <CardContent className="p-4">
                        <Shield className="h-5 w-5 text-amber-600 mb-2" />
                        <h4 className="font-medium mb-1">Regulatory Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          Regulators need transaction visibility for AML/KYC without compromising user privacy
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Our Solution: Privacy Pools + Guardian Consensus</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">1</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Privacy-Preserving Deposits</h4>
                        <p className="text-sm text-muted-foreground">
                          Institutions deposit funds into smart contract pools where transactions are private by default, 
                          using zero-knowledge proofs to maintain anonymity.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">2</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">AI-Powered Monitoring</h4>
                        <p className="text-sm text-muted-foreground">
                          Google ADK-powered agents continuously monitor all transactions for suspicious patterns, 
                          using advanced risk scoring algorithms without revealing transaction details.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">3</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Guardian Consensus for Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          When suspicious activity is detected, a network of 5 independent guardians from different 
                          jurisdictions vote on whether to reveal transaction details. 3 of 5 must approve.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">4</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Selective Disclosure</h4>
                        <p className="text-sm text-muted-foreground">
                          Only the specific transaction under investigation is revealed to authorities. 
                          All other users maintain complete privacy, protecting innocent parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Innovation: Threshold Cryptography</h3>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-sm">
                          GuardianOS uses advanced cryptographic techniques to ensure no single entity can access private data:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">3 of 5</div>
                            <p className="text-xs text-muted-foreground">Threshold Required</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">BLS</div>
                            <p className="text-xs text-muted-foreground">Signature Scheme</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">ZK-SNARKs</div>
                            <p className="text-xs text-muted-foreground">Privacy Proofs</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  Getting Started with GuardianOS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quickStartSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {step.code && (
                          <Card className="bg-slate-50 border-slate-200">
                            <CardContent className="p-3">
                              <code className="text-xs">{step.code}</code>
                            </CardContent>
                          </Card>
                        )}
                        {step.note && (
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                            <p className="text-xs text-muted-foreground">{step.note}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-4">
                      <Terminal className="h-8 w-8 mx-auto text-blue-600" />
                      <h4 className="font-semibold">API Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        RESTful APIs for seamless integration with existing systems
                      </p>
                      <Button variant="outline" size="sm">
                        View API Docs
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-4">
                      <Code2 className="h-8 w-8 mx-auto text-purple-600" />
                      <h4 className="font-semibold">SDK Libraries</h4>
                      <p className="text-sm text-muted-foreground">
                        Native SDKs for Python, JavaScript, and Java
                      </p>
                      <Button variant="outline" size="sm">
                        Download SDK
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-4">
                      <GitBranch className="h-8 w-8 mx-auto text-emerald-600" />
                      <h4 className="font-semibold">Smart Contracts</h4>
                      <p className="text-sm text-muted-foreground">
                        Direct interaction with deployed contracts
                      </p>
                      <Button variant="outline" size="sm">
                        View Contracts
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Privacy Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Eye className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Zero-Knowledge Proofs</h4>
                        <p className="text-xs text-muted-foreground">
                          Prove compliance without revealing transaction details
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Selective Disclosure</h4>
                        <p className="text-xs text-muted-foreground">
                          Reveal only what's legally required, protecting other users
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Privacy Pools</h4>
                        <p className="text-xs text-muted-foreground">
                          Mix funds with other institutions for maximum privacy
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    AI & Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Zap className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Real-Time Monitoring</h4>
                        <p className="text-xs text-muted-foreground">
                          Continuous transaction monitoring using Google ADK agents
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Risk Scoring</h4>
                        <p className="text-xs text-muted-foreground">
                          Advanced risk assessment using multiple detection factors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Network className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Multi-Agent System</h4>
                        <p className="text-xs text-muted-foreground">
                          Specialized agents for different compliance aspects
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Compliance Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Multi-Jurisdiction Support</h4>
                        <p className="text-xs text-muted-foreground">
                          Compliant with ECB, DNB, BaFin, FINMA, and FCA
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Automated Reporting</h4>
                        <p className="text-xs text-muted-foreground">
                          Generate compliant reports without manual work
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Audit Trail</h4>
                        <p className="text-xs text-muted-foreground">
                          Immutable on-chain record of all compliance actions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-amber-600" />
                    Technical Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Database className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Smart Contract Architecture</h4>
                        <p className="text-xs text-muted-foreground">
                          Modular contracts for flexibility and upgradability
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GitBranch className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Open Source</h4>
                        <p className="text-xs text-muted-foreground">
                          Auditable code with active developer community
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Terminal className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">API-First Design</h4>
                        <p className="text-xs text-muted-foreground">
                          RESTful APIs and WebSocket for real-time updates
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="usecases" className="space-y-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          {useCase.icon}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                          <Card className="bg-slate-50 border-slate-200">
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Scenario:</span> {useCase.scenario}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        <div>
                          <p className="text-sm mb-3">
                            <span className="font-medium">Solution:</span> {useCase.solution}
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Key Benefits:</p>
                            {useCase.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                                <p className="text-sm text-muted-foreground">{benefit}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const element = document.getElementById('faq-general');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                General Questions
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const element = document.getElementById('faq-technical');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Code2 className="h-4 w-4 mr-2" />
                Technical Questions
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const element = document.getElementById('faq-compliance');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Compliance Questions
              </Button>
            </div>

            <div className="space-y-8">
              <div id="faq-general">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  General Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .filter(faq => faq.category === "general")
                    .map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>

              <div id="faq-technical">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Technical Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .filter(faq => faq.category === "technical")
                    .map((faq, index) => (
                      <AccordionItem key={index} value={`technical-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>

              <div id="faq-compliance">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .filter(faq => faq.category === "compliance")
                    .map((faq, index) => (
                      <AccordionItem key={index} value={`compliance-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Ready to Start?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Whether you're a financial institution, regulator, or developer, 
                  GuardianOS provides the tools you need for compliant blockchain adoption.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Try Demo
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Download Whitepaper
                  </Button>
                </div>
                <div className="pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Need help? Contact our team at{" "}
                    <a href="mailto:support@guardianos.io" className="text-primary hover:underline">
                      support@guardianos.io
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}