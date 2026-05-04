"use client";

import { motion } from "framer-motion";
import { ArrowRight, Map } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function HeroSectionNew() {
  const t = useTranslations("Home");

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1800')",
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1D1D2B]/60 via-[#1D1D2B]/50 to-[#1D1D2B]/80" />

      {/* Subtle colour tint layer */}
      <div className="absolute inset-0 bg-[#AEADF0]/10 mix-blend-screen pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#AEADF0]/20 border border-[#AEADF0]/40 backdrop-blur-md text-[#F9EFEF] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
        >
          <Map className="w-3.5 h-3.5" />
          {t("eyebrow")}
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-black text-[#F9EFEF] leading-[1.05] tracking-tight mb-6 drop-shadow-xl"
        >
          {t("hero_headline_discover")}
          <br />
          <span className="text-[#AEADF0]">Mueang</span>
          <br />
          {t("hero_headline_place")}
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-[#F9EFEF]/80 mb-10 max-w-2xl leading-relaxed font-medium"
        >
          {t("hero_sub")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/itinerary">
            <button className="group flex items-center gap-2 bg-[#FCD091] hover:bg-[#FCD091]/90 text-[#1D1D2B] font-bold px-8 py-4 rounded-full text-base shadow-2xl hover:shadow-[#FCD091]/30 hover:scale-105 active:scale-95 transition-all duration-300">
              {t("hero_plan_btn")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F9EFEF] to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-[#F9EFEF]/40 rounded-full flex items-start justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-[#F9EFEF]/70 rounded-full"
          />
        </div>
        <span className="text-[#F9EFEF]/40 text-[10px] font-bold uppercase tracking-widest">{t("scroll")}</span>
      </motion.div>
    </section>
  );
}
