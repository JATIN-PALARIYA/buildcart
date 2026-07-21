"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import React, { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg border border-border/50 bg-secondary/50 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary border border-border/30 hover:border-border/80 transition-all duration-200 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring/40"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-[18px] w-[18px] transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
