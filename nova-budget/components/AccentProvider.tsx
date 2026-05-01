"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Accent = "gold" | "blue" | "emerald";

const AccentContext = createContext<{
  accent: Accent;
  setAccent: (a: Accent) => void;
}>({ accent: "gold", setAccent: () => {} });

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<Accent>("gold");

  function setAccent(a: Accent) {
    setAccentState(a);
    document.documentElement.setAttribute("data-accent", a === "gold" ? "" : a);
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent === "gold" ? "" : accent);
  }, [accent]);

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>;
}

export const useAccent = () => useContext(AccentContext);
