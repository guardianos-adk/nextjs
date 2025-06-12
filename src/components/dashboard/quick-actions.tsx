"use client";

import { motion } from "framer-motion";
import { useGuardian } from "@/hooks/use-guardian";
import { useCurrentTime } from "@/hooks/use-client-only";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus,
  Vote,
  AlertTriangle,
  Shield,
  FileText,
  Users,
  Settings,
  BarChart3,
  Clock,
  ChevronRight,
  Zap,
  Eye,
  Download,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "orange" | "red" | "purple" | "indigo";
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
  urgent?: boolean;
}

function QuickActionButton({ 
  icon, 
  title, 
  description, 
  color, 
  onClick, 
  disabled = false, 
  badge,
  urgent = false 
}: QuickActionProps) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 text-blue-600 hover:bg-blue-500/5",
    green: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/5",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 text-orange-600 hover:bg-orange-500/5",
    red: "from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40 text-red-600 hover:bg-red-500/5",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 text-purple-600 hover:bg-purple-500/5",
    indigo: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-600 hover:bg-indigo-500/5",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "h-24 p-4 flex flex-col items-start gap-3 bg-gradient-to-br border transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden w-full",
          disabled ? "opacity-50 cursor-not-allowed" : colorClasses[color],
          urgent && "animate-pulse ring-2 ring-red-500/20"
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between w-full">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300",
            colorClasses[color].split(' ')[0] + " " + colorClasses[color].split(' ')[1]
          )}>
            {icon}
          </div>
          
          {/* Badge */}
          {badge && (
            <Badge 
              variant={urgent ? "destructive" : "secondary"} 
              className="text-xs px-2 py-1 animate-bounce"
            >
              {badge}
            </Badge>
          )}
          
          {/* Urgent Indicator */}
          {urgent && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
        
        {/* Content */}
        <div className="relative text-left space-y-1 flex-1">
          <h4 className="font-semibold text-sm text-foreground leading-tight">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
      </Button>
    </motion.div>
  );
}

interface PendingTaskProps {
  id: string;
  type: 'vote' | 'review' | 'approval';
  title: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  jurisdiction?: string;
}

function PendingTaskItem({ id, type, title, deadline, priority, jurisdiction }: PendingTaskProps) {
  const currentTime = useCurrentTime();
  
  const priorityColors = {
    low: "text-slate-600 bg-slate-100",
    medium: "text-blue-600 bg-blue-100",
    high: "text-orange-600 bg-orange-100", 
    critical: "text-red-600 bg-red-100"
  };

  const typeIcons = {
    vote: <Vote className="h-3 w-3" />,
    review: <Eye className="h-3 w-3" />,
    approval: <Shield className="h-3 w-3" />
  };

  // Format deadline safely to avoid hydration errors
  const formatDeadline = (deadline: string) => {
    if (!currentTime) {
      // Return consistent placeholder during server render
      return { date: "Loading...", time: "..." };
    }
    
    const deadlineDate = new Date(deadline);
    // Use fixed format to ensure consistency
    const date = deadlineDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const time = deadlineDate.toISOString().split('T')[1].slice(0, 5); // HH:MM format
    
    return { date, time };
  };

  const { date, time } = formatDeadline(deadline);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
    >
      <div className={cn(
        "p-1.5 rounded-md text-white",
        type === 'vote' ? "bg-blue-500" : 
        type === 'review' ? "bg-orange-500" : "bg-green-500"
      )}>
        {typeIcons[type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-medium text-foreground truncate">
          {title}
        </h5>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5", priorityColors[priority])}>
            {priority.toUpperCase()}
          </Badge>
          {jurisdiction && (
            <span className="text-xs text-muted-foreground">
              {jurisdiction}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-xs text-muted-foreground">
          {date}
        </div>
        <div className="text-xs text-muted-foreground">
          {time}
        </div>
      </div>
    </motion.div>
  );
}

export function QuickActions() {
  const { guardian, systemStatus } = useGuardian();
  const currentTime = useCurrentTime();

  // Use fixed base time to prevent hydration issues
  const baseTime = new Date('2024-06-11T12:00:00Z');
  
  // Mock pending tasks with fixed deadlines
  const pendingTasks: PendingTaskProps[] = [
    {
      id: "task-1",
      type: "vote",
      title: "De-anonymization Request #DE-2024-001",
      deadline: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      jurisdiction: "ECB"
    },
    {
      id: "task-2", 
      type: "review",
      title: "Cross-border Investigation Evidence",
      deadline: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      jurisdiction: "FINMA"
    },
    {
      id: "task-3",
      type: "approval",
      title: "Privacy Impact Assessment Review",
      deadline: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      priority: "critical",
      jurisdiction: "DNB"
    }
  ];

  const pendingVotes = 3;
  const activeAlerts = 2;
  const pendingReviews = 5;

  const handleAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // In real implementation, this would navigate to appropriate pages or open modals
  };

  // Format current time safely
  const formatCurrentTime = () => {
    if (!currentTime) {
      return "Loading...";
    }
    return currentTime.toISOString().split('T')[1].slice(0, 8); // HH:MM:SS format
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-card/50 to-card border-border/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h3>
            <p className="text-sm text-muted-foreground">
              Common guardian tasks and shortcuts
            </p>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="p-6 pt-4 space-y-6">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton
            icon={<Plus className="h-4 w-4" />}
            title="New Request"
            description="Submit de-anonymization request"
            color="blue"
            onClick={() => handleAction('new-request')}
          />
          
          <QuickActionButton
            icon={<Vote className="h-4 w-4" />}
            title="Pending Votes"
            description="Review and cast votes"
            color="green"
            onClick={() => handleAction('pending-votes')}
            badge={pendingVotes}
            urgent={pendingVotes > 2}
          />
          
          <QuickActionButton
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Active Alerts"
            description="View system alerts"
            color="orange"
            onClick={() => handleAction('alerts')}
            badge={activeAlerts}
            urgent={activeAlerts > 0}
          />
          
          <QuickActionButton
            icon={<FileText className="h-4 w-4" />}
            title="Evidence Review"
            description="Review submitted evidence"
            color="purple"
            onClick={() => handleAction('evidence-review')}
            badge={pendingReviews}
          />
        </div>

        <Separator />

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAction('dashboard')}>
              <BarChart3 className="h-3 w-3" />
              Analytics
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAction('guardians')}>
              <Users className="h-3 w-3" />
              Guardians
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAction('reports')}>
              <Download className="h-3 w-3" />
              Reports
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAction('settings')}>
              <Settings className="h-3 w-3" />
              Settings
            </Button>
          </div>
        </div>

        <Separator />

        {/* Pending Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Tasks
            </h4>
            <Badge variant="secondary" className="text-xs">
              {pendingTasks.length}
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pendingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PendingTaskItem {...task} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bell className="h-3 w-3" />
            <span>Last updated: {formatCurrentTime()}</span>
          </div>
          
          {guardian && (
            <Badge variant="outline" className="text-xs">
              {guardian.jurisdiction}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
