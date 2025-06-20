"use client";

import { TutorialOverlay } from "@/components/tutorial-overlay";
import { useTutorial } from "@/hooks/use-tutorial";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isTutorialOpen, closeTutorial } = useTutorial();

  return (
    <>
      {children}
      {/* Tutorial Overlay available on all dashboard pages */}
      <TutorialOverlay isOpen={isTutorialOpen} onClose={closeTutorial} />
    </>
  );
}