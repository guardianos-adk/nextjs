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

  return (
    <div>
      {/* Navigation */}
      <nav className={scrolled ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 guardian-nav shadow-lg backdrop-blur-xl" : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent"}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="GuardianOS Logo" width={40} height={40} />
              <span className="guardian-heading-4">GuardianOS</span>