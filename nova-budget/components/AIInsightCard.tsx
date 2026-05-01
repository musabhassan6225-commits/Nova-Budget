"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BentoCard } from "./BentoCard";
import type { AIInsight } from "@/lib/ai-agent";

export function AIInsightCard() {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/ai-insight")
      .then((r) => r.json())
      .then((data) => {
        setInsight(data);
        setLoading(false);
      })
      .catch(() => { setLoading(false); setError(true); });
  }, []);

  return (
    <BentoCard glowing className="col-span-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} style={{ color: "var(--accent)" }} />
        <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          AI Monthly Strategy
        </span>
        <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>
          Powered by Claude 3.5 Sonnet
        </span>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {["80%", "65%", "50%"].map((w, i) => (
              <motion.div
                key={w}
                className="h-3 rounded-full"
                style={{ width: w, background: "var(--border)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
            <p className="text-xs pt-1" style={{ color: "var(--muted)" }}>
              Analyzing your financial aura...
            </p>
          </motion.div>
        ) : insight ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {insight.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className="flex gap-2 rounded-xl p-3"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-400">Top Risk</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {insight.topRisk}
                  </p>
                </div>
              </div>

              <div
                className="flex gap-2 rounded-xl p-3"
                style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-glow)" }}
              >
                <TrendingUp size={16} style={{ color: "var(--accent)" }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                    Opportunity
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {insight.topOpportunity}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              {(insight?.actionItems?.length ?? 0) === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Analyzing your financial aura...
                </p>
              ) : null}
              {insight?.actionItems?.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} style={{ color: "var(--accent)" }} className="mt-0.5 shrink-0" />
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Savings Rate:
              </span>
              <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                {insight.savingsRate}
              </span>
            </div>
          </motion.div>
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {error ? "Unable to load AI insights. Check your API key." : "Analyzing your financial aura..."}
          </p>
        )}
      </AnimatePresence>
    </BentoCard>
  );
}
