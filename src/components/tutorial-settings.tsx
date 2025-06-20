"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, RotateCcw } from "lucide-react";
import { useTutorial } from "@/hooks/use-tutorial";
import { toast } from "sonner";

export function TutorialSettings() {
  const { hasCompletedTutorial, startTutorial, resetTutorial } = useTutorial();

  const handleResetTutorial = () => {
    resetTutorial();
    toast.success("Tutorial has been reset. It will start automatically on your next dashboard visit.");
  };

  const handleStartTutorial = () => {
    startTutorial();
    toast.info("Tutorial started! You can close it anytime with the X button.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Tutorial & Help
        </CardTitle>
        <CardDescription>
          Manage the interactive tutorial for the Guardian Operations Center
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Tutorial Status</p>
            <p className="text-sm text-muted-foreground">
              {hasCompletedTutorial ? "Completed" : "Not completed"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTutorial}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Start Tutorial
            </Button>
            {hasCompletedTutorial && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTutorial}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            The tutorial provides an interactive walkthrough of the dashboard's main features:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Navigation and sidebar controls</li>
            <li>Connection status monitoring</li>
            <li>Voting board and guardian actions</li>
            <li>Real-time metrics and analytics</li>
            <li>Fraud detection alerts</li>
            <li>System health monitoring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}