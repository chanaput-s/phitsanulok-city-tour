"use client";

import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sections = [
  { id: "hero", label: "Welcome" },
  { id: "services", label: "Local Services" },
  { id: "explore", label: "Explore" },
];

export function DotNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Enable CSS Scroll Snapping for latching effect
    document.documentElement.style.scrollSnapType = 'y mandatory';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update active section if it is intersecting
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        root: null,
        // Trigger when the element reaches the center of screen
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      document.documentElement.style.scrollSnapType = '';
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className="group relative flex items-center justify-center p-2"
          aria-label={`Navigate to ${label}`}
        >
          {/* Tooltip */}
          <span className="absolute right-8 px-3 py-1 bg-neutral-900/90 dark:bg-neutral-100/90 backdrop-blur-sm text-white dark:text-black text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            {label}
          </span>
          {/* Dot */}
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 shadow-sm",
              activeSection === id
                ? "bg-primary scale-[1.5]"
                : "bg-white/40 dark:bg-neutral-600 hover:bg-white dark:hover:bg-neutral-400 backdrop-blur-sm border border-black/10 dark:border-white/10"
            )}
          />
        </a>
      ))}
    </div>
  );
}
