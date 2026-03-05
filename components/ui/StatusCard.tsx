"use client";

import { motion } from "framer-motion";

export default function StatusCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-16 text-center bg-white border shadow-sm border-slate-200 rounded-2xl"
    >
      <h2 className="mb-2 text-lg font-semibold text-slate-800">{title}</h2>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
    </motion.div>
  );
}
