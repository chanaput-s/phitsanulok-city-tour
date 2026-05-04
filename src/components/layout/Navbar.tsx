"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { User, Map, Compass, Calendar, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
            <Map className="w-5 h-5" />
          </div> */}
          <span className="text-xl font-bold tracking-tight text-[#8686B8]">Phitsanulok City Guide</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[#8686B8] dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            {t("home")}
          </Link>
          <Link href="/explore" className="flex items-center gap-2 text-sm font-medium text-[#8686B8] dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors">
            <Compass className="w-4 h-4" />
            {t("explore")}
          </Link>
          <Link href="/events" className="flex items-center gap-2 text-sm font-medium text-[#8686B8] dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors">
            <Calendar className="w-4 h-4" />
            {t("events")}
          </Link>
          <Link href="/itinerary" className="flex items-center gap-2 text-sm font-medium text-[#8686B8] dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors">
            <Map className="w-4 h-4" />
            {t("itinerary")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
