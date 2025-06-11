"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to handle client-only values that may cause hydration errors
 * Returns undefined on server and the actual value on client
 */
export function useClientOnly<T>(getValue: () => T): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    setValue(getValue());
  }, [getValue]);

  return value;
}

/**
 * Hook specifically for current time to prevent hydration mismatches
 */
export function useCurrentTime() {
  return useClientOnly(() => new Date());
}

/**
 * Hook for getting a stable random seed per session
 */
export function useRandomSeed() {
  return useClientOnly(() => Math.random());
}
