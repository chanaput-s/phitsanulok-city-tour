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
      className="group flex items-center gap-1.5 p-2 rounded-full transition-colors font-medium text-sm"
    >
      <Globe className="w-4 h-4 text-[#1D1D2B] group-hover:text-[#F9EFEF]" />
      <span className="uppercase text-[#1D1D2B] group-hover:text-[#F9EFEF]">{locale}</span>
    </button>
  );
}
