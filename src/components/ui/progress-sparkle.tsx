"use client";

import { motion } from "framer-motion";

export function ProgressSparkle({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={show ? { scale: [0, 1.2, 1], opacity: [0, 1, 0] } : {}}
      transition={{ duration: 0.6, repeat: 0 }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="h-4 w-4 rounded-full bg-amber-400 blur-sm" />
    </motion.div>
  );
}