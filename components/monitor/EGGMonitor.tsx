"use client";

import { motion } from "framer-motion";

export default function ECGMonitor() {
  return (
    <div className="p-3 bg-black rounded-xl">

      <svg width="100%" height="60">

        <motion.path
          d="M0 30 L20 30 L30 10 L40 50 L50 30 L70 30 L80 15 L90 45 L100 30 L120 30 L130 10 L140 50 L150 30 L170 30"
          stroke="#00ff9f"
          strokeWidth="2"
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

      </svg>

    </div>
  );
}