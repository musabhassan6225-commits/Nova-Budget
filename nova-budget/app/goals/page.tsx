"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { BentoCard } from "@/components/BentoCard";
import { formatCurrency } from "@/lib/utils";
import { Target, Plane, Shield, Car } from "lucide-react";

const GOALS = [
  { id: "1", name: "Emergency Fund", icon: Shield, target: 10000, current: 3200, deadline: "2025-12-31", color: "#f59e0b" },
  { id: "2", name: "Vacation", icon: Plane, target: 3000, current: 1100, deadline: "2025-08-01", color: "#3b82f6" },
  { id: "3", name: "New Car", icon: Car, target: 25000, current: 8400, deadline: "2026-06-01", color: "#10b981" },
  { id: "4", name: "Investment Fund", icon: Target, target: 50000, current: 12000, deadline: "2027-01-01", color: "#8b5cf6" },
];

function daysRemaining(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function ProgressRing({ pct, color, size = 96 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
}

export default function GoalsPage() {
  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Savings Goals</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
          {GOALS.length} active goals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOALS.map((g, i) => {
          const pct = g.current / g.target;
          const days = daysRemaining(g.deadline);
          const done = pct >= 1;

          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
            >
              <BentoCard glowing={done}>
                <div className="flex items-start gap-4">
                  {/* Ring */}
                  <div className="relative shrink-0">
                    <ProgressRing pct={pct} color={g.color} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-bold" style={{ color: g.color }}>
                        {Math.round(pct * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <g.icon size={14} style={{ color: g.color }} />
                      <span className="text-sm font-semibold truncate">{g.name}</span>
                    </div>

                    <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                      {formatCurrency(g.current)}{" "}
                      <span style={{ color: "var(--border)" }}>/ {formatCurrency(g.target)}</span>
                    </p>

                    <div className="flex items-center gap-3">
                      <div
                        className="px-2.5 py-1 rounded-lg text-center"
                        style={{ background: done ? "var(--accent-subtle)" : "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
                      >
                        <p className="text-lg font-bold leading-none" style={{ color: done ? "var(--accent)" : "var(--foreground)" }}>
                          {done ? "✓" : days}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {done ? "Complete" : "days left"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          Still needed
                        </p>
                        <p className="text-sm font-semibold">
                          {done ? "—" : formatCurrency(g.target - g.current)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
}
