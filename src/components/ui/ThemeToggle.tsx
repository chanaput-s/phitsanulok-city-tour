"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hidden p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
      aria-hidden="true"
      tabIndex={-1}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-[#1D1D2B]" />
      ) : (
        <Moon className="w-5 h-5 text-[#1D1D2B]" />
      )}
    </button>
  );
}
