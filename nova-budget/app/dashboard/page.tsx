"use client";

import { motion } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShoppingCart, Utensils, Car, Zap, Home, TrendingUp } from "lucide-react";

const SPENDING = [
  { category: "Housing", icon: Home, amount: 1800, budget: 2000, color: "#f59e0b" },
  { category: "Food", icon: Utensils, amount: 420, budget: 500, color: "#3b82f6" },
  { category: "Transport", icon: Car, amount: 180, budget: 250, color: "#10b981" },
  { category: "Shopping", icon: ShoppingCart, amount: 310, budget: 300, color: "#ef4444" },
  { category: "Utilities", icon: Zap, amount: 95, budget: 150, color: "#8b5cf6" },
];

const TREND = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 2900 },
  { month: "Mar", amount: 3400 },
  { month: "Apr", amount: 3100 },
  { month: "May", amount: 2750 },
  { month: "Jun", amount: 3050 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

export default function DashboardPage() {
  const totalSpent = SPENDING.reduce((s, c) => s + c.amount, 0);
  const totalBudget = SPENDING.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-semibold">Good morning 👋</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              Here's your financial overview for June 2025
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Monthly Budget Used
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {formatPercent((totalSpent / totalBudget) * 100)}
            </p>
          </div>
        </motion.div>

        {/* AI Insight — full width */}
        <motion.div variants={item}>
          <AIInsightCard />
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {/* Spending Trend — spans 2 cols */}
          <BentoCard className="col-span-2 row-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Spending Trend</span>
              <TrendingUp size={15} style={{ color: "var(--accent)" }} />
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={TREND}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(v: number) => [formatCurrency(v), "Spent"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </BentoCard>

          {/* Budget Donut */}
          <BentoCard className="col-span-1">
            <p className="text-sm font-medium mb-2">Budget Split</p>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={SPENDING} dataKey="amount" cx="50%" cy="50%" innerRadius={28} outerRadius={42} strokeWidth={0}>
                  {SPENDING.map((s) => (
                    <Cell key={s.category} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </BentoCard>

          {/* Net Balance */}
          <BentoCard className="col-span-1 flex flex-col justify-between">
            <p className="text-sm font-medium">Net Balance</p>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {formatCurrency(5240 - totalSpent)}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                of {formatCurrency(5240)} income
              </p>
            </div>
          </BentoCard>

          {/* Category Cards */}
          {SPENDING.map((cat) => {
            const pct = (cat.amount / cat.budget) * 100;
            const over = pct > 100;
            return (
              <BentoCard key={cat.category} className="col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <cat.icon size={15} style={{ color: cat.color }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: over ? "#ef4444" : "var(--muted)" }}
                  >
                    {formatPercent(pct)}
                  </span>
                </div>
                <p className="text-xs font-medium">{cat.category}</p>
                <p className="text-sm font-semibold mt-0.5">{formatCurrency(cat.amount)}</p>
                <div
                  className="mt-2 h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--border)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: over ? "#ef4444" : cat.color }}
                  />
                </div>
              </BentoCard>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
