"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Workflow, 
  MessageSquare, 
  Brain, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Zap,
  GitBranch,
  Target,
  Shield,
  Eye,
  Database,
  Link2,
  FileCode,
  Server,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentMessage {
  id: string;
  agentName: string;
  agentType: string;
  phase: number;
  message: string;
  timestamp: string;
  messageType: "analysis" | "decision" | "communication" | "blockchain" | "error";
  metadata?: {
    confidence?: number;
    patterns?: string[];
    riskFactors?: string[];
    contractAddress?: string;
    transactionHash?: string;
  };
}

interface AgentStatus {
  name: string;
  status: "idle" | "processing" | "communicating" | "completed" | "error";
  lastActivity: string;
  processingTime?: number;
}

interface ExecutionPhase {
  phase: number;
  name: string;
  status: "pending" | "active" | "completed";
  agents: string[];
  startTime?: string;
  endTime?: string;
  duration?: number;
}

interface AgentExecutionViewerProps {
  evaluationId: string;
  transactionData: {
    id: string;
    amount: number;
    riskScore: number;
    type: string;
    jurisdiction: string;
  };
}

const AGENT_ICONS: Record<string, any> = {
  FirstOpinionAgent: Zap,
  SecondOpinionAgent: GitBranch,
  ThirdOpinionAgent: Target,
  FourthOpinionAgent: Eye,
  FifthOpinionAgent: Link2,
  SixthOpinionAgent: Shield,
  SeventhOpinionAgent: Database,
  EighthOpinionAgent: Brain,
  NinthOpinionAgent: Activity,
  TenthOpinionAgent: Workflow,
};

const PHASE_DETAILS: ExecutionPhase[] = [
  {
    phase: 1,
    name: "Blind Analysis",
    status: "pending",
    agents: ["FirstOpinionAgent", "SecondOpinionAgent", "ThirdOpinionAgent", "FourthOpinionAgent"],
  },
  {
    phase: 2,
    name: "Informed Cross-Analysis",
    status: "pending",
    agents: ["FifthOpinionAgent", "SixthOpinionAgent", "SeventhOpinionAgent"],
  },
  {
    phase: 3,
    name: "Quality Assurance",
    status: "pending",
    agents: ["EighthOpinionAgent", "NinthOpinionAgent"],
  },
  {
    phase: 4,
    name: "Final Synthesis",
    status: "pending",
    agents: ["TenthOpinionAgent"],
  },
];

export function AgentExecutionViewer({ evaluationId, transactionData }: AgentExecutionViewerProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [phases, setPhases] = useState<ExecutionPhase[]>(PHASE_DETAILS);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [blockchainInteractions, setBlockchainInteractions] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize agent statuses
  useEffect(() => {
    const initialStatuses: Record<string, AgentStatus> = {};
    PHASE_DETAILS.forEach(phase => {
      phase.agents.forEach(agent => {
        initialStatuses[agent] = {
          name: agent,
          status: "idle",
          lastActivity: new Date().toISOString(),
        };
      });
    });
    setAgentStatuses(initialStatuses);
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/tenth-opinion/${evaluationId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to Tenth Opinion execution stream");
      // Send initial evaluation request
      ws.send(JSON.stringify({
        type: "START_EVALUATION",
        evaluationId,
        transactionData,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [evaluationId]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "AGENT_MESSAGE":
        const newMessage: AgentMessage = {
          id: Date.now().toString(),
          agentName: data.agentName,
          agentType: data.agentType,
          phase: data.phase,
          message: data.message,
          timestamp: data.timestamp,
          messageType: data.messageType || "analysis",
          metadata: data.metadata,
        };
        setMessages(prev => [...prev, newMessage]);
        
        // Update agent status
        setAgentStatuses(prev => ({
          ...prev,
          [data.agentName]: {
            ...prev[data.agentName],
            status: "processing",
            lastActivity: data.timestamp,
          },
        }));
        break;

      case "PHASE_UPDATE":
        setPhases(prev => prev.map(phase => 
          phase.phase === data.phaseNumber 
            ? { ...phase, status: data.status, startTime: data.startTime, endTime: data.endTime }
            : phase
        ));
        if (data.status === "active") {
          setCurrentPhase(data.phaseNumber);
        }
        break;

      case "AGENT_STATUS":
        setAgentStatuses(prev => ({
          ...prev,
          [data.agentName]: {
            name: data.agentName,
            status: data.status,
            lastActivity: data.timestamp,
            processingTime: data.processingTime,
          },
        }));
        break;

      case "BLOCKCHAIN_INTERACTION":
        setBlockchainInteractions(prev => [...prev, {
          id: Date.now().toString(),
          type: data.interactionType,
          contractAddress: data.contractAddress,
          transactionHash: data.transactionHash,
          timestamp: data.timestamp,
          agentName: data.agentName,
          result: data.result,
        }]);
        break;

      case "EXECUTION_PROGRESS":
        setExecutionProgress(data.progress);
        break;
    }

    // Auto-scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMessageIcon = (messageType: string) => {
    switch (messageType) {
      case "analysis": return <Brain className="h-4 w-4" />;
      case "decision": return <Target className="h-4 w-4" />;
      case "communication": return <MessageSquare className="h-4 w-4" />;
      case "blockchain": return <FileCode className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      case "thinking": return <Lightbulb className="h-4 w-4" />;
      case "discovery": return <Eye className="h-4 w-4" />;
      case "pattern": return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMessageColor = (messageType: string) => {
    switch (messageType) {
      case "analysis": return "text-blue-600";
      case "decision": return "text-green-600";
      case "communication": return "text-purple-600";
      case "blockchain": return "text-yellow-600";
      case "error": return "text-red-600";
      case "thinking": return "text-indigo-600";
      case "discovery": return "text-orange-600";
      case "pattern": return "text-pink-600";
      default: return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle": return "text-gray-500";
      case "processing": return "text-blue-600";
      case "communicating": return "text-purple-600";
      case "completed": return "text-green-600";
      case "error": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Execution Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-purple-600" />
            Multi-Agent Execution Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{executionProgress}%</span>
            </div>
            <Progress value={executionProgress} className="h-2" />
            
            {/* Phase Progress */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all",
                    phase.status === "completed" && "border-green-500 bg-green-50",
                    phase.status === "active" && "border-purple-500 bg-purple-50 shadow-lg",
                    phase.status === "pending" && "border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Phase {phase.phase}</span>
                    {phase.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {phase.status === "active" && <Clock className="h-4 w-4 text-purple-600 animate-pulse" />}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{phase.name}</h4>
                  <p className="text-xs text-muted-foreground">{phase.agents.length} agents</p>
                  
                  {phase.duration && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Duration: {(phase.duration / 1000).toFixed(2)}s
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Execution View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Agent Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {Object.values(agentStatuses).map((agent) => {
                  const Icon = AGENT_ICONS[agent.name] || Activity;
                  return (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        agent.status === "processing" && "border-purple-500 bg-purple-50",
                        agent.status === "completed" && "border-green-500 bg-green-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          agent.status === "processing" && "bg-purple-100",
                          agent.status === "completed" && "bg-green-100",
                          agent.status === "idle" && "bg-gray-100"
                        )}>
                          <Icon className={cn("h-4 w-4", getStatusColor(agent.status))} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{agent.name.replace("Agent", "")}</p>
                          <p className="text-xs text-muted-foreground capitalize">{agent.status}</p>
                        </div>
                        {agent.status === "processing" && (
                          <div className="animate-pulse">
                            <div className="h-2 w-2 bg-purple-600 rounded-full" />
                          </div>
                        )}
                      </div>
                      {agent.processingTime && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Processing: {(agent.processingTime / 1000).toFixed(2)}s
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Agent Communication Stream */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Agent Communication Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="messages" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              </TabsList>
              
              <TabsContent value="messages">
                <ScrollArea className="h-[550px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((msg, index) => {
                        const Icon = AGENT_ICONS[msg.agentName] || Activity;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex gap-3"
                          >
                            <div className={cn(
                              "p-2 rounded-lg h-fit",
                              msg.phase === 1 && "bg-blue-100",
                              msg.phase === 2 && "bg-purple-100",
                              msg.phase === 3 && "bg-green-100",
                              msg.phase === 4 && "bg-orange-100"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {msg.agentName.replace("Agent", "")}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Phase {msg.phase}
                                </Badge>
                                <div className={cn("flex items-center gap-1", getMessageColor(msg.messageType))}>
                                  {getMessageIcon(msg.messageType)}
                                  <span className="text-xs capitalize">{msg.messageType}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              
                              {msg.metadata && (
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs space-y-1">
                                  {msg.metadata.confidence && (
                                    <p>Confidence: {(msg.metadata.confidence * 100).toFixed(1)}%</p>
                                  )}
                                  {msg.metadata.patterns && (
                                    <p>Patterns: {msg.metadata.patterns.join(", ")}</p>
                                  )}
                                  {msg.metadata.riskFactors && (
                                    <p>Risk Factors: {msg.metadata.riskFactors.join(", ")}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="blockchain">
                <ScrollArea className="h-[550px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {blockchainInteractions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No blockchain interactions yet...
                      </p>
                    ) : (
                      blockchainInteractions.map((interaction) => (
                        <motion.div
                          key={interaction.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-lg border space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">{interaction.type}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(interaction.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <p className="font-mono">Contract: {interaction.contractAddress}</p>
                            {interaction.transactionHash && (
                              <p className="font-mono">Tx: {interaction.transactionHash}</p>
                            )}
                            <p>Agent: {interaction.agentName}</p>
                            {interaction.result && (
                              <p className="text-green-600">Result: {interaction.result}</p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}