"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { BentoCard } from "@/components/BentoCard";
import { useAccent } from "@/components/AccentProvider";
import { Sparkles, Bell, Moon, Shield } from "lucide-react";

const ACCENTS = [
  { key: "gold" as const, label: "Gold", color: "#f59e0b" },
  { key: "blue" as const, label: "Electric Blue", color: "#3b82f6" },
  { key: "emerald" as const, label: "Emerald", color: "#10b981" },
];

const AI_FREQUENCIES = ["Daily", "Weekly", "Monthly", "Off"];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ background: enabled ? "var(--accent)" : "var(--border)" }}
      animate={{ backgroundColor: enabled ? "var(--accent)" : "var(--border)" }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white"
        animate={{ left: enabled ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </motion.button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { accent, setAccent } = useAccent();
  const [aiFrequency, setAiFrequency] = useState("Weekly");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
          Customize your AuraFinance experience
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <BentoCard>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold">Appearance</span>
          </div>

          <SettingRow label="Accent Color" description="Changes glows, charts, and highlights throughout the app">
            <div className="flex gap-2">
              {ACCENTS.map(({ key, label, color }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAccent(key)}
                  title={label}
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: color,
                    outline: accent === key ? `2px solid ${color}` : "2px solid transparent",
                    outlineOffset: 2,
                    boxShadow: accent === key ? `0 0 10px ${color}66` : "none",
                  }}
                />
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Dark Mode" description="Obsidian Glass theme">
            <Toggle enabled={darkMode} onChange={setDarkMode} />
          </SettingRow>
        </BentoCard>

        {/* AI Settings */}
        <BentoCard>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold">AI Brain</span>
          </div>

          <SettingRow label="AI Advice Frequency" description="How often Claude generates your financial strategy">
            <div className="flex gap-1.5">
              {AI_FREQUENCIES.map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAiFrequency(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: aiFrequency === f ? "var(--accent)" : "var(--surface)",
                    color: aiFrequency === f ? "#000" : "var(--muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </SettingRow>
        </BentoCard>

        {/* Notifications */}
        <BentoCard>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={15} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold">Notifications</span>
          </div>

          <SettingRow label="Budget Alerts" description="Notify when spending exceeds 80% of a budget">
            <Toggle enabled={notifications} onChange={setNotifications} />
          </SettingRow>

          <SettingRow label="Goal Milestones" description="Celebrate when you hit savings checkpoints">
            <Toggle enabled={true} onChange={() => {}} />
          </SettingRow>
        </BentoCard>

        {/* Security */}
        <BentoCard>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={15} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold">Security</span>
          </div>

          <SettingRow label="Two-Factor Authentication" description="Add an extra layer of protection">
            <Toggle enabled={twoFactor} onChange={setTwoFactor} />
          </SettingRow>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              Sign Out
            </motion.button>
          </div>
        </BentoCard>
      </div>
    </PageTransition>
  );
}
