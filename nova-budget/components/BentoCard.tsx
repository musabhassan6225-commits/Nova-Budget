"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export function BentoCard({ children, className, glowing, onClick, style }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={style}
      className={cn(
        "glass-card rounded-2xl p-5 cursor-default overflow-hidden relative",
        glowing && "accent-glow accent-border",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
