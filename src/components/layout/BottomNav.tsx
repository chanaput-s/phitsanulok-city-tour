"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Compass, Calendar, Map, Home } from "lucide-react";
import { usePathname } from "@/i18n/routing";

export function BottomNav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 z-50 px-6 py-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-primary scale-110' : 'text-neutral-500 hover:text-primary transition-all'}`}>
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-medium">{t("home")}</span>
        </Link>
        <Link href="/explore" className={`flex flex-col items-center gap-1 ${pathname.includes('explore') ? 'text-primary scale-110' : 'text-neutral-500 hover:text-primary transition-all'}`}>
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-medium">{t("explore")}</span>
        </Link>
        <Link href="/events" className={`flex flex-col items-center gap-1 ${pathname.includes('events') ? 'text-primary scale-110' : 'text-neutral-500 hover:text-primary transition-all'}`}>
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-medium">{t("events")}</span>
        </Link>
        <Link href="/itinerary" className={`flex flex-col items-center gap-1 ${pathname.includes('itinerary') ? 'text-primary scale-110' : 'text-neutral-500 hover:text-primary transition-all'}`}>
          <Map className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-medium">{t("itinerary")}</span>
        </Link>
      </div>
    </nav>
  );
}
