"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Info, MousePointer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the target element
  position?: "top" | "bottom" | "left" | "right";
  action?: string; // Optional action description
  highlight?: boolean; // Whether to highlight the target element
  route?: string; // Optional route to navigate to
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to GuardianOS!",
    content: "This tutorial will guide you through the entire compliance orchestration platform. We'll explore the dashboard and then walk through each section in the sidebar.",
    target: "body",
    position: "top",
  },
  {
    id: "sidebar",
    title: "Navigation Sidebar",
    content: "The sidebar is your main navigation tool. It's organized into sections: Compliance Operations, Agent Orchestration, Analytics & Reports, and Documentation. You can collapse it for more space.",
    target: "[data-testid='sidebar-trigger']",
    position: "right",
    action: "Click to toggle sidebar",
    highlight: true,
  },
  
  // Dashboard Overview
  {
    id: "dashboard-overview",
    title: "Dashboard Overview",
    content: "This is your command center. Here you can see all critical information at a glance: voting requests, system health, real-time metrics, and fraud alerts.",
    target: "a[href='/dashboard']",
    position: "right",
    highlight: true,
  },
  {
    id: "connection-status",
    title: "Connection Status",
    content: "Monitor the connection status of all services: Voting, Sentinel, and Agents. Green means connected, yellow means connecting, and red indicates issues.",
    target: ".ml-auto.flex.items-center.gap-4",
    position: "bottom",
    highlight: true,
  },
  
  // Compliance Operations Section
  {
    id: "compliance-section",
    title: "Compliance Operations Section",
    content: "This section contains all compliance-related features. Let's explore each one to understand their purpose.",
    target: "a[href='/dashboard/compliance']",
    position: "right",
    highlight: true,
  },
  {
    id: "compliance-intelligence",
    title: "Compliance Intelligence",
    content: "AI-powered compliance data search and monitoring. Use this to search through regulations, analyze compliance requirements, and monitor regulatory changes across jurisdictions.",
    target: "a[href='/dashboard/compliance']",
    position: "right",
    highlight: true,
    action: "Search regulations and compliance data",
  },
  {
    id: "active-requests",
    title: "Active Voting Requests",
    content: "View and manage all de-anonymization voting requests. You can vote on requests, view evidence, and track consensus progress. Critical requests appear at the top.",
    target: "a[href='/dashboard/voting']",
    position: "right",
    highlight: true,
    action: "Cast votes on pending requests",
  },
  {
    id: "consensus-tracking",
    title: "Consensus Tracking",
    content: "Monitor the guardian consensus process in real-time. See how votes are distributed, track voting patterns, and ensure the 3-of-5 threshold is met for decisions.",
    target: "a[href='/dashboard/consensus']",
    position: "right",
    highlight: true,
  },
  {
    id: "evidence-review",
    title: "Evidence Review",
    content: "Analyze transaction evidence submitted for de-anonymization requests. Review supporting documents, blockchain data, and risk assessments before making voting decisions.",
    target: "a[href='/dashboard/evidence']",
    position: "right",
    highlight: true,
  },
  {
    id: "privacy-controls",
    title: "Privacy Controls",
    content: "Manage selective disclosure settings. Control what information is revealed during de-anonymization, ensuring only necessary data is exposed while protecting uninvolved parties.",
    target: "a[href='/dashboard/privacy']",
    position: "right",
    highlight: true,
  },
  
  // Agent Orchestration Section
  {
    id: "agent-section",
    title: "Agent Orchestration Section",
    content: "This section manages the AI agents powered by Google ADK. These agents work together to monitor, assess, and respond to compliance needs.",
    target: "a[href='/dashboard/agents']",
    position: "right",
    highlight: true,
  },
  {
    id: "adk-agents",
    title: "ADK Agents",
    content: "Monitor all AI agents: Transaction Monitor, Risk Assessment, Guardian Council, and Privacy Revoker. Check their status, performance metrics, and recent actions.",
    target: "a[href='/dashboard/agents']",
    position: "right",
    highlight: true,
    action: "View agent performance metrics",
  },
  {
    id: "agent-performance",
    title: "Agent Performance",
    content: "Detailed performance analytics for each agent. Track success rates, processing times, and accuracy. Identify bottlenecks and optimize agent configurations.",
    target: "a[href='/dashboard/performance']",
    position: "right",
    highlight: true,
  },
  {
    id: "active-alerts",
    title: "Active Alerts",
    content: "Real-time alerts from all system components. High-risk transactions, system issues, and compliance violations appear here. Set up custom alert rules and notifications.",
    target: "a[href='/dashboard/alerts']",
    position: "right",
    highlight: true,
  },
  {
    id: "workflows",
    title: "Compliance Workflows",
    content: "Manage automated compliance workflows. Define triggers, actions, and escalation paths. Monitor workflow execution and optimize for efficiency.",
    target: "a[href='/dashboard/workflows']",
    position: "right",
    highlight: true,
  },
  
  // Analytics & Reports Section
  {
    id: "analytics-section",
    title: "Analytics & Reports Section",
    content: "Data visualization and reporting tools. Generate insights from transaction data, compliance metrics, and system performance.",
    target: "a[href='/dashboard/analytics']",
    position: "right",
    highlight: true,
  },
  {
    id: "guardian-council",
    title: "Guardian Council",
    content: "View all guardian members, their jurisdictions, and voting history. Track guardian reputation scores and participation rates. Manage guardian onboarding and permissions.",
    target: "a[href='/dashboard/guardians']",
    position: "right",
    highlight: true,
  },
  {
    id: "fraud-sentinel",
    title: "FraudSentinel Dashboard",
    content: "Dedicated fraud monitoring dashboard. View ML model predictions, pattern analysis, and risk heat maps. Configure fraud detection rules and thresholds.",
    target: "a[href='/dashboard/sentinel']",
    position: "right",
    highlight: true,
  },
  {
    id: "analytics-dashboard",
    title: "System Analytics",
    content: "Comprehensive analytics for the entire system. Transaction volumes, compliance rates, guardian performance, and cross-jurisdictional insights.",
    target: "a[href='/dashboard/analytics']",
    position: "right",
    highlight: true,
  },
  {
    id: "jurisdiction-mapping",
    title: "Jurisdiction Mapping",
    content: "Manage regulatory requirements for each jurisdiction (ECB, DNB, BaFin, FINMA, FCA). Map compliance rules, reporting requirements, and thresholds.",
    target: "a[href='/dashboard/jurisdictions']",
    position: "right",
    highlight: true,
  },
  {
    id: "blockchain-explorer",
    title: "Blockchain Explorer",
    content: "Multi-chain transaction explorer integrated with the platform. Track deposits, withdrawals, and privacy pool interactions across supported blockchains.",
    target: "a[href='/dashboard/blockchain']",
    position: "right",
    highlight: true,
  },
  
  // Documentation Section
  {
    id: "documentation-section",
    title: "Documentation Section",
    content: "Reports, API documentation, and system settings. Everything you need to integrate with external systems and configure the platform.",
    target: "a[href='/dashboard/reports']",
    position: "right",
    highlight: true,
  },
  {
    id: "compliance-reports",
    title: "Compliance Reports",
    content: "Generate and download compliance reports. Audit trails, regulatory submissions, and periodic summaries. Schedule automated report generation.",
    target: "a[href='/dashboard/reports']",
    position: "right",
    highlight: true,
  },
  {
    id: "api-documentation",
    title: "API Documentation",
    content: "Complete API reference for developers. REST endpoints, WebSocket events, and SDK documentation. Test API calls directly from the interface.",
    target: "a[href='/dashboard/api-docs']",
    position: "right",
    highlight: true,
  },
  {
    id: "system-settings",
    title: "System Settings",
    content: "Configure your guardian profile, notification preferences, and system parameters. Manage API keys, two-factor authentication, and timezone settings.",
    target: "a[href='/dashboard/settings']",
    position: "top", // Changed to top to avoid overlap with sidebar footer
    highlight: true,
  },
  
  // Completion
  {
    id: "complete",
    title: "Tutorial Complete! 🎉",
    content: "You've explored all sections of GuardianOS! Remember, you can restart this tutorial anytime from the sidebar. Now go ahead and start managing blockchain compliance with confidence!",
    target: "body",
    position: "top",
  },
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentTutorialStep = tutorialSteps[currentStep];

  // Update target element position
  useEffect(() => {
    if (!isOpen || !currentTutorialStep) return;

    const updateTargetPosition = () => {
      const targetElement = document.querySelector(currentTutorialStep.target);
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    // Initial position
    updateTargetPosition();

    // Update on scroll or resize
    window.addEventListener("scroll", updateTargetPosition, true);
    window.addEventListener("resize", updateTargetPosition);

    // Update periodically in case of dynamic content
    const interval = setInterval(updateTargetPosition, 500);

    return () => {
      window.removeEventListener("scroll", updateTargetPosition, true);
      window.removeEventListener("resize", updateTargetPosition);
      clearInterval(interval);
    };
  }, [isOpen, currentStep, currentTutorialStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Save tutorial completion to localStorage
    localStorage.setItem("tutorial-completed", "true");
    onClose();
    setCurrentStep(0);
  };

  const handleSkip = () => {
    handleClose();
  };

  // Navigate to route if specified
  useEffect(() => {
    if (currentTutorialStep?.route) {
      router.push(currentTutorialStep.route);
    }
  }, [currentStep, currentTutorialStep, router]);

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetRect || !currentTutorialStep) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }

    const position = currentTutorialStep.position || "bottom";
    const margin = 16;
    const tooltipWidth = 400;
    const tooltipHeight = 250; // Increased for better spacing

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = targetRect.top - tooltipHeight - margin;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = targetRect.bottom + margin;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - margin;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.right + margin;
        break;
    }

    // Keep tooltip within viewport with better bounds checking
    const viewportPadding = 80; // Extra padding to ensure buttons are accessible
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - viewportPadding));
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
    
    // Special handling for items near the bottom of the sidebar
    if (targetRect.bottom > window.innerHeight - 300) {
      // Place tooltip above the item instead
      top = Math.max(margin, targetRect.top - tooltipHeight - margin);
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]">
        {/* Light overlay with spotlight */}
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20"
          onClick={handleSkip}
        >
          {/* Spotlight effect for highlighted elements */}
          {currentTutorialStep?.highlight && targetRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute pointer-events-none"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                boxShadow: `
                  0 0 0 9999px rgba(0, 0, 0, 0.2),
                  inset 0 0 20px rgba(59, 130, 246, 0.5)
                `,
                borderRadius: "8px",
              }}
            />
          )}
        </motion.div>

        {/* Tutorial tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute w-[400px]"
          style={getTooltipPosition()}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="relative p-6 shadow-2xl border-2 border-primary/30 bg-slate-900 dark:bg-slate-950">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Step indicator */}
            <div className="flex items-center gap-1 mb-4">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-blue-400"
                      : index < currentStep
                      ? "bg-blue-400/60"
                      : "bg-slate-600"
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    {currentStep === 0 ? (
                      <Sparkles className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {currentTutorialStep.title}
                  </h3>
                  <p className="text-base text-slate-200 leading-relaxed">
                    {currentTutorialStep.content}
                  </p>
                  {currentTutorialStep.action && (
                    <div className="mt-3 flex items-center gap-2 text-base text-blue-400">
                      <MousePointer className="h-4 w-4" />
                      <span className="font-medium">{currentTutorialStep.action}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="text-slate-300 border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                Skip tutorial
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="text-slate-300 border-slate-600 hover:bg-slate-800 hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    "Finish"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}