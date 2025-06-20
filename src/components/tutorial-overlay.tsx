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
    title: "Welcome to GuardianOS Dashboard!",
    content: "This tutorial will guide you through the main features of the compliance orchestration platform. Let's explore how to monitor and manage blockchain compliance.",
    target: "body",
    position: "top",
  },
  {
    id: "sidebar",
    title: "Navigation Sidebar",
    content: "Use the sidebar to navigate between different sections. You can collapse it for more screen space.",
    target: "[data-testid='sidebar-trigger']",
    position: "right",
    action: "Click to toggle sidebar",
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
  {
    id: "quick-actions",
    title: "Quick Actions",
    content: "Access frequently used features quickly. Create reports, view analytics, or trigger compliance checks from here.",
    target: "[data-testid='quick-actions']",
    position: "bottom",
    highlight: true,
  },
  {
    id: "voting-board",
    title: "Voting Status Board",
    content: "This is where guardian voting requests appear. Drag and drop cards to vote, or click for details. Active requests require your attention!",
    target: ".lg\\:col-span-2 > div:first-child",
    position: "top",
    action: "Try dragging a voting card",
    highlight: true,
  },
  {
    id: "metrics",
    title: "Real-time Metrics",
    content: "Monitor live transaction volumes, risk scores, and compliance rates. The charts update automatically as new data arrives.",
    target: ".lg\\:col-span-2 > div:nth-child(2)",
    position: "top",
    highlight: true,
  },
  {
    id: "fraud-monitor",
    title: "FraudSentinel Monitor",
    content: "AI-powered fraud detection alerts appear here. Each alert shows risk level, confidence score, and recommended actions.",
    target: ".lg\\:col-span-2 > div:nth-child(3)",
    position: "top",
    highlight: true,
  },
  {
    id: "system-health",
    title: "System Health",
    content: "Check the health of all system components: smart contracts, AI agents, and guardian nodes. Green means healthy!",
    target: ".space-y-6 > div:first-child",
    position: "left",
    highlight: true,
  },
  {
    id: "activity-feed",
    title: "Activity Feed",
    content: "See real-time activities from guardians and agents. This helps you stay informed about what's happening in the network.",
    target: ".space-y-6 > div:nth-child(2)",
    position: "left",
    highlight: true,
  },
  {
    id: "explore",
    title: "Ready to Explore!",
    content: "You now know the basics! Try navigating to other pages like Guardian Council or Agent Performance to see more features. The tutorial can be restarted anytime from the help menu.",
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
    const tooltipHeight = 200;

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

    // Keep tooltip within viewport
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));

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