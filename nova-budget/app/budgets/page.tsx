"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { BentoCard } from "@/components/BentoCard";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { SoundService } from "@/services/SoundService";
import {
  Home, Utensils, Car, ShoppingCart, Zap, Wifi,
  Wand2, Plus, X, Sparkles, Dumbbell, Music, Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Budget = {
  id: string;
  category: string;
  icon: LucideIcon;
  spent: number;
  limit: number;
  color: string;
};

const INITIAL_BUDGETS: Budget[] = [
  { id: "1", category: "Housing",   icon: Home,         spent: 1800, limit: 2000, color: "#f59e0b" },
  { id: "2", category: "Food",      icon: Utensils,     spent: 420,  limit: 500,  color: "#3b82f6" },
  { id: "3", category: "Transport", icon: Car,          spent: 180,  limit: 250,  color: "#10b981" },
  { id: "4", category: "Shopping",  icon: ShoppingCart, spent: 310,  limit: 300,  color: "#ef4444" },
  { id: "5", category: "Utilities", icon: Zap,          spent: 95,   limit: 150,  color: "#8b5cf6" },
  { id: "6", category: "Internet",  icon: Wifi,         spent: 60,   limit: 80,   color: "#06b6d4" },
];

const ICON_OPTIONS: { icon: LucideIcon; label: string }[] = [
  { icon: Home, label: "Home" },
  { icon: Utensils, label: "Food" },
  { icon: Car, label: "Car" },
  { icon: ShoppingCart, label: "Shop" },
  { icon: Zap, label: "Zap" },
  { icon: Wifi, label: "Wifi" },
  { icon: Dumbbell, label: "Gym" },
  { icon: Music, label: "Music" },
  { icon: Gamepad2, label: "Games" },
];

const COLOR_OPTIONS = [
  "#f59e0b", "#3b82f6", "#10b981", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f43f5e", "#84cc16",
];

type AIHint = { from: string; to: string; amount: number; reason: string };

// ─── Budget Card ────────────────────────────────────────────────────────────

function BudgetCard({
  budget,
  index,
  onLimitChange,
}: {
  budget: Budget;
  index: number;
  onLimitChange: (id: string, limit: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pct = (budget.spent / budget.limit) * 100;
  const near = pct >= 80 && pct < 100;
  const over = pct >= 100;
  const barColor = over ? "#ef4444" : near ? "#f97316" : budget.color;
  const glowColor = over ? "rgba(239,68,68,0.35)" : near ? "rgba(249,115,22,0.3)" : "transparent";

  const pulseVariants = {
    idle: { boxShadow: `0 0 18px ${glowColor}`, borderColor: barColor },
    pulse: {
      boxShadow: [`0 0 18px ${glowColor}`, `0 0 32px ${glowColor}`, `0 0 18px ${glowColor}`],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    SoundService.click();
    onLimitChange(budget.id, Number(e.target.value));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        variants={over || near ? pulseVariants : undefined}
        animate={over || near ? "pulse" : undefined}
        className="glass-card rounded-2xl p-5 overflow-hidden relative"
        style={over || near ? { borderColor: barColor } : undefined}
        whileHover={{ scale: 1.015, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${barColor}18` }}>
              <budget.icon size={15} style={{ color: barColor }} />
            </div>
            <span className="text-sm font-medium">{budget.category}</span>
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{
              background: over ? "rgba(239,68,68,0.12)" : near ? "rgba(249,115,22,0.12)" : "var(--accent-subtle)",
              color: over ? "#ef4444" : near ? "#f97316" : "var(--accent)",
            }}
          >
            {over ? "Over limit" : near ? "Near limit" : formatPercent(pct)}
          </span>
        </div>

        {/* Amounts */}
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--muted)" }}>
          <span>{formatCurrency(budget.spent)} spent</span>
          <motion.span key={budget.limit} animate={{ color: ["var(--accent)", "var(--muted)"] }} transition={{ duration: 0.6 }}>
            {formatCurrency(budget.limit)} limit
          </motion.span>
        </div>

        {/* Kinetic progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: index * 0.07 }}
            className="h-full rounded-full"
            style={{ background: barColor, boxShadow: over || near ? `0 0 8px ${glowColor}` : "none" }}
          />
        </div>

        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          {over ? `${formatCurrency(budget.spent - budget.limit)} over budget` : `${formatCurrency(budget.limit - budget.spent)} remaining`}
        </p>

        {/* Hover slider */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="overflow-hidden"
            >
              <div className="pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted)" }}>
                  <span>Adjust limit</span>
                  <span style={{ color: "var(--accent)" }}>{formatCurrency(budget.limit)}</span>
                </div>
                <input
                  type="range"
                  min={Math.round(budget.spent * 0.5)}
                  max={Math.round(budget.spent * 2.5) + 500}
                  step={50}
                  value={budget.limit}
                  onChange={handleSlider}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${barColor} ${Math.min(pct, 100)}%, var(--border) ${Math.min(pct, 100)}%)`,
                    accentColor: barColor,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Add Category Modal ──────────────────────────────────────────────────────

function AddCategoryModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (b: Budget) => void;
}) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("500");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  function submit() {
    if (!name || !limit) return;
    onAdd({
      id: Date.now().toString(),
      category: name,
      icon: ICON_OPTIONS[selectedIcon].icon,
      spent: 0,
      limit: parseFloat(limit),
      color: COLOR_OPTIONS[selectedColor],
    });
    SoundService.pop();
    onClose();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(14,14,14,0.96)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">New Budget Category</h2>
            <button onClick={onClose} style={{ color: "var(--muted)" }}><X size={18} /></button>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs" style={{ color: "var(--muted)" }}>Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gym & Fitness"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {/* Monthly Limit */}
          <div className="space-y-1.5">
            <label className="text-xs" style={{ color: "var(--muted)" }}>Monthly Limit ($)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <label className="text-xs" style={{ color: "var(--muted)" }}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(({ icon: Icon, label }, i) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedIcon(i)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: selectedIcon === i ? "var(--accent-subtle)" : "var(--surface)",
                    border: `1px solid ${selectedIcon === i ? "var(--accent)" : "var(--border)"}`,
                    color: selectedIcon === i ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <Icon size={15} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <label className="text-xs" style={{ color: "var(--muted)" }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((color, i) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(i)}
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: color,
                    outline: selectedColor === i ? `2px solid ${color}` : "2px solid transparent",
                    outlineOffset: 2,
                    boxShadow: selectedColor === i ? `0 0 10px ${color}88` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: `${COLOR_OPTIONS[selectedColor]}10`, border: `1px solid ${COLOR_OPTIONS[selectedColor]}30` }}
          >
            {(() => { const Icon = ICON_OPTIONS[selectedIcon].icon; return <Icon size={16} style={{ color: COLOR_OPTIONS[selectedColor] }} />; })()}
            <span className="text-sm font-medium">{name || "Category Name"}</span>
            <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>
              {formatCurrency(parseFloat(limit) || 0)} / mo
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={submit}
            className="w-full py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            Create Category
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// ─── AI Reallocation Panel ───────────────────────────────────────────────────

function AIReallocationPanel({ hints, onClose }: { hints: AIHint[]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl p-5 mb-4"
      style={{
        background: "var(--accent-subtle)",
        border: "1px solid var(--accent-glow)",
        boxShadow: "0 0 24px var(--accent-glow)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>AI Reallocation Suggestions</span>
        </div>
        <button onClick={onClose} style={{ color: "var(--muted)" }}><X size={15} /></button>
      </div>
      <div className="space-y-2.5">
        {hints.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 text-xs"
            style={{ color: "var(--muted)" }}
          >
            <span
              className="mt-0.5 px-1.5 py-0.5 rounded font-semibold shrink-0"
              style={{ background: "var(--accent)", color: "#000" }}
            >
              {formatCurrency(h.amount)}
            </span>
            <span>
              Move from <span className="text-white font-medium">{h.from}</span> →{" "}
              <span className="text-white font-medium">{h.to}</span>. {h.reason}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiHints, setAiHints] = useState<AIHint[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const overCount = budgets.filter((b) => b.spent > b.limit).length;

  const handleLimitChange = useCallback((id: string, limit: number) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, limit } : b)));
  }, []);

  async function runAIReallocation() {
    setAiLoading(true);
    setAiHints(null);
    SoundService.pop();
    try {
      const res = await fetch("/api/ai-reallocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgets: budgets.map((b) => ({ category: b.category, spent: b.spent, limit: b.limit })) }),
      });
      const data = await res.json();
      setAiHints(data.hints ?? []);
    } catch {
      // Fallback: generate client-side hints
      const over = budgets.filter((b) => b.spent > b.limit);
      const under = budgets.filter((b) => b.limit - b.spent > 100);
      const hints: AIHint[] = over.slice(0, 2).map((o, i) => {
        const src = under[i % under.length];
        const amount = Math.min(o.spent - o.limit, src ? src.limit - src.spent : 0);
        return {
          from: src?.category ?? "Savings",
          to: o.category,
          amount: Math.round(amount / 50) * 50,
          reason: `${o.category} is ${formatCurrency(o.spent - o.limit)} over. ${src?.category ?? "Savings"} has headroom.`,
        };
      });
      setAiHints(hints.length ? hints : [{ from: "—", to: "—", amount: 0, reason: "All budgets are within limits. Great job!" }]);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Budgets</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {formatCurrency(totalSpent)} of {formatCurrency(totalLimit)} used
            {overCount > 0 && <span className="ml-2 text-red-400">· {overCount} over limit</span>}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runAIReallocation}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-glow)",
            color: "var(--accent)",
            opacity: aiLoading ? 0.6 : 1,
          }}
        >
          <motion.div
            animate={aiLoading ? { rotate: 360 } : { rotate: 0 }}
            transition={aiLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <Wand2 size={15} />
          </motion.div>
          {aiLoading ? "Analyzing..." : "AI Reallocation"}
        </motion.button>
      </div>

      {/* AI Panel */}
      <AnimatePresence>
        {aiHints && <AIReallocationPanel hints={aiHints} onClose={() => setAiHints(null)} />}
      </AnimatePresence>

      {/* Overall health */}
      <BentoCard className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">Overall Budget Health</span>
          <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            {formatPercent((totalSpent / totalLimit) * 100)}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalSpent / totalLimit) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent-glow)" }}
          />
        </div>
      </BentoCard>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {budgets.map((b, i) => (
          <BudgetCard key={b.id} budget={b} index={i} onLimitChange={handleLimitChange} />
        ))}

        {/* Add Category card */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: budgets.length * 0.07, type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] cursor-pointer group"
          style={{ border: "1px dashed var(--border)" }}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-glow)" }}
          >
            <Plus size={16} style={{ color: "var(--accent)" }} />
          </motion.div>
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Add Category
          </span>
        </motion.button>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            onAdd={(b) => setBudgets((prev) => [...prev, b])}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
