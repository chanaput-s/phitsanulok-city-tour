"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";

interface AnimatedSearchProps {
  placeholders: string[];
  exploreText: string;
}

export function AnimatedSearch({ placeholders, exploreText }: AnimatedSearchProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <div className="w-full relative max-w-2xl group mx-auto perspective-1000">
      <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors z-10">
        <MapPin className="h-5 w-5 md:h-6 md:w-6" />
      </div>
      
      <div className="relative flex items-center w-full">
        {/* The Animated Placeholder Overlay */}
        <div className="absolute left-[3.25rem] md:left-[4rem] top-0 bottom-0 flex items-center pointer-events-none overflow-hidden h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0, rotateX: -45 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: -20, opacity: 0, rotateX: 45 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-neutral-500 font-medium text-base md:text-lg absolute"
            >
              {placeholders[index]}
            </motion.div>
          </AnimatePresence>
        </div>

        <input 
          type="text" 
          className="w-full py-4 md:py-5 pl-12 md:pl-16 pr-24 md:pr-36 text-base md:text-lg rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-3xl shadow-xl outline-none focus:border-primary focus:bg-white/90 dark:focus:bg-neutral-900/90 transition-all text-foreground"
        />
      </div>

      <Link href="/explore">
        <button className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-primary text-primary-foreground px-4 md:px-8 rounded-full font-semibold shadow-[0_0_20px_rgba(var(--primary),0.4)] text-sm md:text-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
          <span className="hidden sm:inline">{exploreText}</span>
          <span className="sm:hidden">Go</span>
        </button>
      </Link>
    </div>
  );
}
