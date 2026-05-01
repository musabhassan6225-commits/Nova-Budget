"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { BentoCard } from "@/components/BentoCard";
import { formatCurrency } from "@/lib/utils";
import { SoundService } from "@/services/SoundService";

type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

const INITIAL: Transaction[] = [
  { id: "1", description: "Monthly Salary", category: "Income", amount: 5240, type: "income", date: "2025-06-01" },
  { id: "2", description: "Rent Payment", category: "Housing", amount: 1800, type: "expense", date: "2025-06-02" },
  { id: "3", description: "Whole Foods", category: "Food", amount: 127.4, type: "expense", date: "2025-06-04" },
  { id: "4", description: "Uber", category: "Transport", amount: 24.5, type: "expense", date: "2025-06-05" },
  { id: "5", description: "Netflix", category: "Utilities", amount: 15.99, type: "expense", date: "2025-06-06" },
  { id: "6", description: "Amazon", category: "Shopping", amount: 89.99, type: "expense", date: "2025-06-07" },
];

const CATEGORIES = ["Housing", "Food", "Transport", "Shopping", "Utilities", "Income", "Other"];

const row = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 },
  }),
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ description: "", category: "Food", amount: "", type: "expense" as const, date: "" });

  function addTransaction() {
    if (!form.amount || !form.description || !form.date) return;
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        description: form.description,
        category: form.category,
        amount: parseFloat(form.amount),
        type: form.type,
        date: form.date,
      },
      ...prev,
    ]);
    SoundService.crunch();
    setOpen(false);
    setForm({ description: "", category: "Food", amount: "", type: "expense", date: "" });
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Transactions</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {transactions.length} entries this month
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: "var(--accent)", color: "#000" }}
        >
          <Plus size={15} />
          Manual Add
        </motion.button>
      </div>

      <BentoCard className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Description", "Category", "Date", "Amount"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <motion.tr
                key={t.id}
                custom={i}
                variants={row}
                initial="hidden"
                animate="show"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                style={{ borderBottom: "1px solid var(--border)" }}
                className="transition-colors"
              >
                <td className="px-5 py-3.5 font-medium">{t.description}</td>
                <td className="px-5 py-3.5">
                  <span
                    className="px-2 py-0.5 rounded-md text-xs"
                    style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-5 py-3.5" style={{ color: "var(--muted)" }}>
                  {t.date}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="flex items-center gap-1 font-semibold"
                    style={{ color: t.type === "income" ? "#10b981" : "#f87171" }}
                  >
                    {t.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                    {formatCurrency(t.amount)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </BentoCard>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-md rounded-2xl p-6 space-y-4"
                style={{
                  background: "rgba(18,18,18,0.95)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Add Transaction</h2>
                  <button onClick={() => setOpen(false)} style={{ color: "var(--muted)" }}>
                    <X size={18} />
                  </button>
                </div>

                {[
                  { label: "Description", key: "description", type: "text", placeholder: "e.g. Grocery run" },
                  { label: "Amount", key: "amount", type: "number", placeholder: "0.00" },
                  { label: "Date", key: "date", type: "date", placeholder: "" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs" style={{ color: "var(--muted)" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="text-xs" style={{ color: "var(--muted)" }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  {(["expense", "income"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className="flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors"
                      style={{
                        background: form.type === t ? "var(--accent)" : "var(--surface)",
                        color: form.type === t ? "#000" : "var(--muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={addTransaction}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--accent)", color: "#000" }}
                >
                  Add Transaction
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
