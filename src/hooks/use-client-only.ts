"use client";

import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to handle client-only values that may cause hydration errors
 * Returns undefined on server and the actual value on client
 */
export function useClientOnly<T>(getValue: () => T): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined);

  // Memoize the getValue function to prevent infinite re-renders
  const memoizedGetValue = useCallback(getValue, []);

  useEffect(() => {
    setValue(memoizedGetValue());
  }, [memoizedGetValue]);

  return value;
}

/**
 * Hook specifically for current time to prevent hydration mismatches
 * Fixed: Use a stable function reference to prevent infinite re-renders
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date());
    
    // Update time every second to keep it current
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - runs only once on mount

  return currentTime;
}

/**
 * Hook for getting a stable random seed per session
 * Fixed: Use a stable function reference
 */
export function useRandomSeed() {
  const [seed, setSeed] = useState<number | undefined>(undefined);

  useEffect(() => {
    setSeed(Math.random());
  }, []); // Empty dependency array - runs only once on mount

  return seed;
}
