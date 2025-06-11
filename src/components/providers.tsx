"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi-config";
import { ErrorBoundary } from "@/components/error-boundary";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry wallet connection errors
        if (error.message?.includes('indexedDB') || error.message?.includes('WalletConnect')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {mounted ? (
          <WagmiProvider config={config}>
            {children}
          </WagmiProvider>
        ) : (
          children
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
