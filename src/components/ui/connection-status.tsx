"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RefreshCw,
  CheckCircle,
  Clock
} from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' | 'failed';
  retryCount: number;
  maxRetriesReached: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ConnectionStatus({
  isConnected,
  connectionStatus,
  retryCount,
  maxRetriesReached,
  onRetry,
  className = ""
}: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'Connected',
          variant: 'default' as const,
          showAlert: false
        };
      case 'connecting':
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />,
          text: 'Connecting...',
          variant: 'secondary' as const,
          showAlert: false
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4 text-gray-500" />,
          text: 'Disconnected',
          variant: 'outline' as const,
          showAlert: !maxRetriesReached
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          text: 'Connection Error',
          variant: 'secondary' as const,
          showAlert: true
        };
      case 'failed':
        return {
          icon: <WifiOff className="h-4 w-4 text-red-500" />,
          text: 'Connection Failed',
          variant: 'destructive' as const,
          showAlert: true
        };
      default:
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Unknown',
          variant: 'outline' as const,
          showAlert: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={className}>
      {/* Status Badge */}
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        {config.icon}
        {config.text}
        {retryCount > 0 && !isConnected && (
          <span className="ml-1">({retryCount}/3)</span>
        )}
      </Badge>

      {/* Alert for connection issues */}
      {config.showAlert && (
        <Alert className="mt-2" variant={connectionStatus === 'failed' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              {connectionStatus === 'failed' 
                ? 'Server connection failed. Please check your connection.' 
                : 'Connection to server lost. Retrying...'}
              {retryCount > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Retry attempt {retryCount} of 3
                </div>
              )}
            </div>
            {maxRetriesReached && onRetry && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onRetry}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface ConnectionIndicatorProps {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' | 'failed';
}

export function ConnectionIndicator({ isConnected, connectionStatus }: ConnectionIndicatorProps) {
  const getIndicatorColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-blue-500 animate-pulse';
      case 'error':
        return 'bg-amber-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
      <span className="capitalize">{connectionStatus}</span>
    </div>
  );
} 