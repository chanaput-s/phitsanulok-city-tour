"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "th" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
    >
      <Globe className="w-4 h-4 text-foreground" />
      <span className="uppercase text-foreground">{locale}</span>
    </button>
  );
}
