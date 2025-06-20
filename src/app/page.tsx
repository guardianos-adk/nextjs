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
            <div className="guardian-badge mb-8">
              <Shield className="h-4 w-4 mr-2" />
              <span className="guardian-emphasis">Enterprise Ready</span> • <span className="guardian-emphasis">Regulatory Compliant</span>
            </div>
            
            <h1 className="guardian-heading-1 mb-6">
              <span className="guardian-emphasis-primary">Institutional Blockchain</span>
              <br />
              Compliance Platform
            </h1>
            
            <p className="guardian-body-large mb-12 text-muted-foreground max-w-3xl mx-auto">
              GuardianOS aims to connect <span className="guardian-emphasis">institutions to the blockchain</span>, 
              providing <span className="guardian-emphasis">monitoring</span>, <span className="guardian-emphasis">compliance tools</span> 
              and <span className="guardian-emphasis">consensus protocols</span> in order to provide 
              institutional blockchain privacy with reasonable oversight.
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
              <div className="guardian-metric-card">
                <div className="guardian-metric-value">3/5</div>
                <div className="guardian-metric-label">Guardian Consensus</div>
              </div>
              <div className="guardian-metric-card">
                <div className="guardian-metric-value">ADK</div>
                <div className="guardian-metric-label">Google AI Agents</div>
              </div>
              <div className="guardian-metric-card">
                <div className="guardian-metric-value">ZK</div>
                <div className="guardian-metric-label">Privacy Proofs</div>
              </div>
              <div className="guardian-metric-card">
                <div className="guardian-metric-value">5</div>
                <div className="guardian-metric-label">Jurisdictions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple placeholder for the rest */}
      <div className="py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">More Content Coming Soon</h2>
        <p className="text-gray-600">The rest of the page content will be added next.</p>
      </div>
    </div>
  );
}