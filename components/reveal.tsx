"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={reduce ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .55, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
