"use client";

import { useEffect, useState } from "react";

type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "humor-admin-theme";

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const setDark = () => {
    root.classList.add("dark");
    root.classList.remove("light");
  };
  const setLight = () => {
    root.classList.add("light");
    root.classList.remove("dark");
  };

  if (choice === "dark") setDark();
  else if (choice === "light") setLight();
  else {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) setLight();
    else setDark();
  }
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
    const next =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
    // Sync React state with ThemeScript + localStorage after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read; avoids SSR mismatch
    setChoice(next);
    applyTheme(next);
  }, []);

  useEffect(() => {
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  function pick(next: ThemeChoice) {
    setChoice(next);
    applyTheme(next);
    if (next === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
      {(
        [
          ["light", "Light"],
          ["dark", "Dark"],
          ["system", "System"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => pick(value)}
          className={
            choice === value
              ? "rounded-lg bg-cyan-500/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300"
              : "rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-zinc-300"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
