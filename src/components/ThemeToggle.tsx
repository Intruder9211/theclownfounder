"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("clownfounder_theme") as "dark" | "light";
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = prefersLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("clownfounder_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  if (!mounted) {
    return <div style={{ width: "64px", height: "32px", borderRadius: "9999px", backgroundColor: "#18181b", border: "1px solid #27272a" }} />;
  }

  const isLight = theme === "light";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }} className={className}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle Dark and Light Mode"
        title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        style={{
          position: "relative",
          width: "64px",
          height: "32px",
          borderRadius: "9999px",
          padding: "3px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          border: isLight ? "1px solid #cbd5e1" : "1px solid #27272a",
          backgroundColor: isLight ? "#e2e8f0" : "#121215",
          boxShadow: isLight ? "inset 0 2px 4px rgba(0,0,0,0.06)" : "inset 0 2px 4px rgba(0,0,0,0.5)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Background Icons (Moon left, Sun right) */}
        <div style={{ position: "absolute", inset: 0, padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "none" }}>
          <Moon size={12} style={{ color: isLight ? "#94a3b8" : "#818cf8", opacity: isLight ? 0.4 : 1, transition: "opacity 0.3s" }} />
          <Sun size={12} style={{ color: isLight ? "#f59e0b" : "#64748b", opacity: isLight ? 1 : 0.4, transition: "opacity 0.3s" }} />
        </div>

        {/* Sliding Thumb Knob (Animates left to right) */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isLight ? "#f59e0b" : "#4f46e5",
            color: "#ffffff",
            boxShadow: isLight ? "0 2px 8px rgba(245, 158, 11, 0.4)" : "0 2px 8px rgba(79, 70, 229, 0.5)",
            transform: isLight ? "translateX(32px)" : "translateX(0px)",
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s"
          }}
        >
          {isLight ? <Sun size={13} /> : <Moon size={13} />}
        </div>
      </button>

      {showLabel && (
        <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 600, color: isLight ? "#334155" : "#a1a1aa" }}>
          {isLight ? "LIGHT" : "DARK"}
        </span>
      )}
    </div>
  );
}
