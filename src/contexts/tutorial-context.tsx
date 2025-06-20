"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TutorialContextType {
  isTutorialOpen: boolean;
  hasCompletedTutorial: boolean;
  startTutorial: () => void;
  closeTutorial: () => void;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  // Check if tutorial has been completed before
  useEffect(() => {
    const completed = localStorage.getItem("tutorial-completed") === "true";
    setHasCompletedTutorial(completed);
    
    // Auto-open on any dashboard page for first-time users
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
      // Auto-open tutorial for first-time users
      if (!completed) {
        const hasVisitedBefore = localStorage.getItem("has-visited-dashboard") === "true";
        if (!hasVisitedBefore && window.location.pathname === "/dashboard") {
          // Only auto-open on main dashboard page
          setTimeout(() => {
            setIsTutorialOpen(true);
          }, 1000);
        }
      }
      
      // Mark that user has visited dashboard
      localStorage.setItem("has-visited-dashboard", "true");
    }
  }, []);

  const startTutorial = () => {
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    localStorage.setItem("tutorial-completed", "true");
    setHasCompletedTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem("tutorial-completed");
    localStorage.removeItem("has-visited-dashboard");
    setHasCompletedTutorial(false);
  };

  return (
    <TutorialContext.Provider
      value={{
        isTutorialOpen,
        hasCompletedTutorial,
        startTutorial,
        closeTutorial,
        resetTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}